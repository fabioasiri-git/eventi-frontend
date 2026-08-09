import os
import time
import psycopg2
from psycopg2.extras import execute_values
import requests
from dotenv import load_dotenv
import unicodedata
import re

def normalize_text(text):
    if not text:
        return ""
    text = text.lower()
    text = "".join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

class SpotifyAPI:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token = None
        self.token_expires_at = 0

    def get_token(self):
        # If token is still valid, return it
        if self.token and time.time() < self.token_expires_at:
            return self.token
            
        print("Fetching new Spotify access token...")
        url = "https://accounts.spotify.com/api/token"
        data = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try:
            r = requests.post(url, data=data, headers=headers, timeout=10)
            if r.status_code == 200:
                resp = r.json()
                self.token = resp.get("access_token")
                # Set expiration time (default 1 hour, subtract 60s safety buffer)
                expires_in = resp.get("expires_in", 3600)
                self.token_expires_at = time.time() + expires_in - 60
                return self.token
            else:
                print(f"Error getting Spotify token: {r.status_code} - {r.text}")
                return None
        except Exception as e:
            print("Exception during Spotify token request:", e)
            return None

    def search_track(self, artist, title):
        token = self.get_token()
        if not token:
            return None
            
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        # Clean artist name (remove featurings)
        cleaned_artist = self.clean_artist_for_search(artist)
        
        # We try 3 levels of search query to maximize matching rate
        queries = [
            f"track:{title} artist:{artist}",                  # 1. Strict match
            f"track:{title} artist:{cleaned_artist}",          # 2. Cleaned artist match
            f"{artist} {title}"                                # 3. General text query
        ]
        
        # Deduplicate queries list while maintaining order
        seen = set()
        unique_queries = []
        for q in queries:
            if q not in seen:
                seen.add(q)
                unique_queries.append(q)
                
        url = "https://api.spotify.com/v1/search"
        
        for q in unique_queries:
            params = {"q": q, "type": "track", "limit": 1}
            try:
                r = requests.get(url, headers=headers, params=params, timeout=10)
                
                # Handle rate limiting (HTTP 429)
                if r.status_code == 429:
                    retry_after = int(r.headers.get("Retry-After", 3))
                    print(f"  Rate limited by Spotify. Sleeping for {retry_after}s...")
                    time.sleep(retry_after)
                    # Retry once
                    r = requests.get(url, headers=headers, params=params, timeout=10)
                    
                # Handle expired token (HTTP 401)
                if r.status_code == 401:
                    print("  Token expired during request, forcing refresh...")
                    self.token = None # Force token refresh
                    token = self.get_token()
                    headers["Authorization"] = f"Bearer {token}"
                    r = requests.get(url, headers=headers, params=params, timeout=10)
                    
                if r.status_code == 200:
                    data = r.json()
                    items = data.get("tracks", {}).get("items", [])
                    if items:
                        return items[0]
            except Exception as e:
                print(f"  Exception searching with query '{q}': {e}")
                time.sleep(0.5)
                
        return None

    def clean_artist_for_search(self, artist):
        artist_clean = artist.lower()
        for pattern in [" feat.", " feat ", " ft.", " ft ", " featuring ", " & ", " and ", " con "]:
            if pattern in artist_clean:
                artist_clean = artist_clean.split(pattern)[0]
        return artist_clean.strip().title()

def clean_name(name):
    if not name:
        return ""
    cleaned = name.strip()
    if (cleaned.startswith('"') and cleaned.endswith('"')) or (cleaned.startswith("'") and cleaned.endswith("'")):
        cleaned = cleaned[1:-1].strip()
    return cleaned

def main():
    dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
    load_dotenv(dotenv_path=dotenv_path)
    
    # DB Configuration
    host = os.getenv("SUPABASE_DB_HOST")
    port = os.getenv("SUPABASE_DB_PORT", 6543)
    dbname = os.getenv("SUPABASE_DB_NAME")
    user = os.getenv("SUPABASE_DB_USER")
    password = os.getenv("SUPABASE_DB_PASSWORD")
    
    # Spotify Configuration
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("Spotify Client ID or Client Secret not configured in .env.")
        print("Skipping Spotify enrichment. Fill in .env details when available.")
        return
        
    spotify = SpotifyAPI(client_id, client_secret)
    # Force initial token test
    token = spotify.get_token()
    if not token:
        print("Failed to authenticate with Spotify API. Skipping enrichment to prevent blocking.")
        return
        
    print("Successfully authenticated with Spotify API.")
    
    # Connect to DB to find missing tracks
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=dbname,
            user=user,
            password=password,
            sslmode="require"
        )
        cursor = conn.cursor()
        
        # Get missing tracks: prioritize competitor tracks played on-air, then fill with internal catalog, up to 150 per run
        cursor.execute("""
            SELECT DISTINCT normalized_artist, normalized_title, artist, title
            FROM (
                SELECT s.normalized_artist, s.normalized_title, s.artist, s.title, 1 as priority
                FROM storici_passaggi s
                WHERE (s.normalized_artist, s.normalized_title) NOT IN (
                    SELECT normalized_artist, normalized_title FROM spotify_popolarita
                )
                UNION
                SELECT c.normalized_artist, c.normalized_title, c.artist, c.title, 2 as priority
                FROM catalogo_toscana c
                WHERE (c.normalized_artist, c.normalized_title) NOT IN (
                    SELECT normalized_artist, normalized_title FROM spotify_popolarita
                )
            ) combined
            ORDER BY priority ASC
            LIMIT 150;
        """)
        missing_tracks = cursor.fetchall()
        print(f"Found {len(missing_tracks)} tracks missing from Spotify popularity cache (competitors + catalog).")
        
        if not missing_tracks:
            print("No missing tracks. Spotify popularity cache is up to date!")
            cursor.close()
            conn.close()
            return
            
        db_records = []
        count = 0
        
        for norm_art, norm_tit, art, tit in missing_tracks:
            count += 1
            print(f"[{count}/{len(missing_tracks)}] Querying Spotify for: {art} - {tit}...")
            
            # Use self-healing search method
            track_info = spotify.search_track(art, tit)
            
            if track_info:
                popularity = track_info.get("popularity", 0)
                spotify_id = track_info.get("id")
                print(f"  -> Found! Pop: {popularity} | ID: {spotify_id}")
                db_records.append((
                    art,
                    tit,
                    norm_art,
                    norm_tit,
                    popularity,
                    spotify_id
                ))
            else:
                print("  -> Not found on Spotify. Saving with Pop = 0.")
                db_records.append((
                    art,
                    tit,
                    norm_art,
                    norm_tit,
                    0,
                    "NOT_FOUND"
                ))
                
            # Write to database in batches of 50 to prevent losses and locks
            if len(db_records) >= 50:
                print(f"Writing batch of {len(db_records)} records to Supabase...")
                query = """
                    INSERT INTO spotify_popolarita (
                        artist, title, normalized_artist, normalized_title, popularity, spotify_id
                    ) VALUES %s
                    ON CONFLICT (normalized_artist, normalized_title) DO UPDATE SET
                        popularity = EXCLUDED.popularity,
                        spotify_id = EXCLUDED.spotify_id,
                        updated_at = NOW();
                """
                try:
                    execute_values(cursor, query, db_records)
                    conn.commit()
                    db_records = []
                except Exception as batch_err:
                    print("  Batch write failed, rolling back transaction:", batch_err)
                    conn.rollback()
                    # Try writing individually as fallback
                    print("  Attempting to save records individually...")
                    for rec in db_records:
                        try:
                            cursor.execute("""
                                INSERT INTO spotify_popolarita (artist, title, normalized_artist, normalized_title, popularity, spotify_id)
                                VALUES (%s, %s, %s, %s, %s, %s)
                                ON CONFLICT (normalized_artist, normalized_title) DO UPDATE SET
                                    popularity = EXCLUDED.popularity,
                                    spotify_id = EXCLUDED.spotify_id,
                                    updated_at = NOW();
                            """, rec)
                            conn.commit()
                        except Exception as ind_err:
                            print(f"    Failed to save single record {rec[0]} - {rec[1]}: {ind_err}")
                            conn.rollback()
                    db_records = []
                
            # Small sleep to respect API limits
            time.sleep(0.15)
            
        # Write remaining records
        if db_records:
            print(f"Writing final batch of {len(db_records)} records to Supabase...")
            query = """
                INSERT INTO spotify_popolarita (
                    artist, title, normalized_artist, normalized_title, popularity, spotify_id
                ) VALUES %s
                ON CONFLICT (normalized_artist, normalized_title) DO UPDATE SET
                    popularity = EXCLUDED.popularity,
                    spotify_id = EXCLUDED.spotify_id,
                    updated_at = NOW();
            """
            try:
                execute_values(cursor, query, db_records)
                conn.commit()
            except Exception as final_err:
                print("  Final batch write failed, rolling back:", final_err)
                conn.rollback()
                for rec in db_records:
                    try:
                        cursor.execute("""
                            INSERT INTO spotify_popolarita (artist, title, normalized_artist, normalized_title, popularity, spotify_id)
                            VALUES (%s, %s, %s, %s, %s, %s)
                            ON CONFLICT (normalized_artist, normalized_title) DO UPDATE SET
                                popularity = EXCLUDED.popularity,
                                spotify_id = EXCLUDED.spotify_id,
                                updated_at = NOW();
                        """, rec)
                        conn.commit()
                    except Exception as ind_err:
                        print(f"    Failed to save single record: {ind_err}")
                        conn.rollback()
            
        print("Spotify popularity cache successfully updated!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print("Database error:", e)

if __name__ == "__main__":
    main()
