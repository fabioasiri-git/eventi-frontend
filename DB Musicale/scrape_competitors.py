import os
import re
import argparse
import datetime
import psycopg2
from psycopg2.extras import execute_values
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import unicodedata
from zoneinfo import ZoneInfo

def normalize_text(text):
    if not text:
        return ""
    text = text.lower()
    text = "".join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def clean_name(name):
    if not name:
        return ""
    # Remove outer quotes if present
    cleaned = name.strip()
    if (cleaned.startswith('"') and cleaned.endswith('"')) or (cleaned.startswith("'") and cleaned.endswith("'")):
        cleaned = cleaned[1:-1].strip()
    return cleaned

def scrape_station_date(station_slug, target_date, session):
    """
    Scrapes the playlist of a specific station for a target date.
    Returns a list of dicts: [{'played_at': datetime, 'artist': str, 'title': str}]
    """
    date_str = target_date.strftime("%Y-%m-%d")
    url = f"https://myradioonline.it/{station_slug}/playlist"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": f"https://myradioonline.it/{station_slug}",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
        "X-Requested-With": "XMLHttpRequest"
    }
    
    tracks = []
    page = 1
    rome_tz = ZoneInfo("Europe/Rome")
    
    # Establish session by loading the main station page if not already done
    try:
        session.get(f"https://myradioonline.it/{station_slug}", headers=headers, timeout=10)
    except Exception as e:
        print(f"Warning: Failed to load home page for {station_slug}: {e}")
        
    while True:
        data = {
            "ajax": "1",
            "name": "",
            "from": date_str,
            "to": date_str,
            "actPage": str(page)
        }
        
        print(f"  Fetching {station_slug} playlist for {date_str} - Page {page}...")
        try:
            r = session.post(url, headers=headers, data=data, timeout=15)
            if r.status_code != 200:
                print(f"  Error: Status code {r.status_code} for page {page}")
                break
                
            res_json = r.json()
            html = res_json.get("html", "")
            if not html or html.strip() == "":
                print("  No more tracks returned (empty HTML).")
                break
                
            # Parse HTML
            soup = BeautifulSoup(html, 'lxml')
            rows = soup.find_all('div', class_='yt-row')
            if not rows:
                # Try finding in all divs with itemprop="track"
                rows = soup.find_all('div', itemprop='track')
                
            if not rows:
                print("  No track rows found in HTML.")
                break
                
            page_tracks = 0
            for row in rows:
                # Extract played time
                time_span = row.find('span', class_='txt2')
                if not time_span:
                    # try txt2 mcolumn
                    time_span = row.find('span', class_=lambda c: c and 'txt2' in c and 'mcolumn' in c)
                
                # Let's find by class or data-toggle
                if not time_span:
                    spans = row.find_all('span')
                    for s in spans:
                        if s.get('aria-label') == "Data della trasmissione":
                            time_span = s
                            break
                            
                if not time_span:
                    continue
                    
                raw_time = time_span.text.replace("LIVE -", "").strip()
                # Time format is "DD.MM HH:MM"
                if not re.match(r'^\d{2}\.\d{2}\s+\d{2}:\d{2}$', raw_time):
                    continue
                    
                # Extract artist and title
                artist_span = row.find('span', itemprop='byArtist')
                title_span = row.find('span', itemprop='name')
                
                if not artist_span or not title_span:
                    continue
                    
                artist = clean_name(artist_span.text)
                title = clean_name(title_span.text)
                
                if not artist or not title:
                    continue
                    
                # Parse datetime
                day_str, month_str = raw_time.split(' ')[0].split('.')
                hour_str, min_str = raw_time.split(' ')[1].split(':')
                
                track_month = int(month_str)
                year = target_date.year
                
                # Handle year transition boundary cases
                if track_month == 12 and target_date.month == 1:
                    year = target_date.year - 1
                elif track_month == 1 and target_date.month == 12:
                    year = target_date.year + 1
                    
                naive_dt = datetime.datetime(year, track_month, int(day_str), int(hour_str), int(min_str))
                played_at = naive_dt.replace(tzinfo=rome_tz)
                
                # Add track
                tracks.append({
                    'played_at': played_at,
                    'artist': artist,
                    'title': title
                })
                page_tracks += 1
                
            print(f"  Parsed {page_tracks} tracks from page {page}.")
            if page_tracks == 0:
                break
                
            # Increment page
            page += 1
            
        except Exception as e:
            print(f"  Error fetching page {page}: {e}")
            break
            
    # Deduplicate tracks parsed in this run
    unique_run_tracks = {}
    for t in tracks:
        # Key on played_at
        unique_run_tracks[t['played_at']] = t
        
    return list(unique_run_tracks.values())

def main():
    # Load configuration
    dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
    load_dotenv(dotenv_path=dotenv_path)
    
    host = os.getenv("SUPABASE_DB_HOST")
    port = os.getenv("SUPABASE_DB_PORT", 6543)
    dbname = os.getenv("SUPABASE_DB_NAME")
    user = os.getenv("SUPABASE_DB_USER")
    password = os.getenv("SUPABASE_DB_PASSWORD")
    
    parser = argparse.ArgumentParser(description="Scrape competitor playlists from MyRadioOnline.it")
    parser.add_argument("--date", type=str, help="Target date to scrape (YYYY-MM-DD). Defaults to yesterday.")
    parser.add_argument("--stations", type=str, help="Comma-separated station slugs. Defaults to .env or standard list.")
    args = parser.parse_args()
    
    # Parse target date
    if args.date:
        try:
            target_date = datetime.datetime.strptime(args.date, "%Y-%m-%d").date()
        except ValueError:
            print("Error: Invalid date format. Use YYYY-MM-DD.")
            return
    else:
        # Default to yesterday
        target_date = (datetime.datetime.now() - datetime.timedelta(days=1)).date()
        
    # Parse stations
    station_slugs = []
    if args.stations:
        station_slugs = [s.strip() for s in args.stations.split(',')]
    else:
        # Default stations (benchmark + radar)
        station_slugs = ["rds-relax", "dimensione-suono-soft", "radio-monte-carlo"]
        
    print(f"Target date: {target_date}")
    print(f"Stations to scrape: {station_slugs}")
    
    session = requests.Session()
    all_scraped_tracks = {} # station -> list of tracks
    
    for station in station_slugs:
        print(f"\n--- Scraping Station: {station} ---")
        tracks = scrape_station_date(station, target_date, session)
        print(f"Completed {station}. Total tracks found: {len(tracks)}")
        all_scraped_tracks[station] = tracks
        
    # Database connection
    print(f"\nConnecting to database {dbname} to save results...")
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
        
        # Mapping standard names for database storage
        station_names = {
            "rds-relax": "RDS Relax",
            "dimensione-suono-soft": "Dimensione Suono Soft",
            "radio-monte-carlo": "Radio Monte Carlo"
        }
        
        db_records = []
        for station_slug, tracks in all_scraped_tracks.items():
            station_name = station_names.get(station_slug, station_slug)
            for t in tracks:
                norm_artist = normalize_text(t['artist'])
                norm_title = normalize_text(t['title'])
                # Record: (station, played_at, artist, title, normalized_artist, normalized_title)
                db_records.append((
                    station_name,
                    t['played_at'],
                    t['artist'],
                    t['title'],
                    norm_artist,
                    norm_title
                ))
                
        if db_records:
            print(f"Inserting/Synchronizing {len(db_records)} play records into Supabase...")
            query = """
                INSERT INTO storici_passaggi (
                    station, played_at, artist, title, normalized_artist, normalized_title
                ) VALUES %s
                ON CONFLICT (station, played_at) DO NOTHING;
            """
            execute_values(cursor, query, db_records)
            conn.commit()
            print("Successfully saved play records to database!")
        else:
            print("No records found to insert.")
            
        cursor.close()
        conn.close()
        
    except Exception as e:
        print("Database connection or query failed:", e)

if __name__ == "__main__":
    main()
