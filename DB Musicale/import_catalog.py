import os
import csv
import re
import unicodedata
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

def normalize_text(text):
    if not text:
        return ""
    # Convert to lowercase
    text = text.lower()
    # Normalize unicode accents
    text = "".join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    # Keep only alphanumeric characters and spaces
    text = re.sub(r'[^a-z0-9\s]', '', text)
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def clean_field(val):
    if not val:
        return ""
    # Split by semicolon and take the first part
    parts = val.split(';')
    cleaned = parts[0].strip()
    # Remove outer quotes if present
    if (cleaned.startswith('"') and cleaned.endswith('"')) or (cleaned.startswith("'") and cleaned.endswith("'")):
        cleaned = cleaned[1:-1].strip()
    return cleaned

def parse_int(val):
    if not val:
        return 0
    try:
        # Strip decimal parts if any
        val_clean = val.split('.')[0].strip()
        return int(val_clean)
    except ValueError:
        return 0

def parse_year(val):
    if not val:
        return None
    try:
        val_clean = val.strip()
        year = int(val_clean)
        # Basic validation for year
        if 1900 <= year <= 2100:
            return year
        return None
    except ValueError:
        return None

def main():
    # Load configuration
    dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
    load_dotenv(dotenv_path=dotenv_path)
    
    host = os.getenv("SUPABASE_DB_HOST")
    port = os.getenv("SUPABASE_DB_PORT", 6543)
    dbname = os.getenv("SUPABASE_DB_NAME")
    user = os.getenv("SUPABASE_DB_USER")
    password = os.getenv("SUPABASE_DB_PASSWORD")
    
    csv_path = os.path.join(os.path.dirname(__file__), "IN ONDA.csv")
    
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return
        
    print("Reading and cleaning catalog from CSV...")
    unique_tracks = {}
    
    # Read the CSV file
    with open(csv_path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.reader(f, delimiter=';')
        for line_idx, row in enumerate(reader):
            if not row or len(row) < 31:
                continue
                
            raw_title = row[4]
            raw_artist = row[6]
            
            # Clean fields
            artist = clean_field(raw_artist)
            title = clean_field(raw_title)
            
            # Skip if artist or title are empty
            if not artist or not title:
                continue
                
            norm_artist = normalize_text(artist)
            norm_title = normalize_text(title)
            
            if not norm_artist or not norm_title:
                continue
                
            # Key for deduplication
            track_key = (norm_artist, norm_title)
            
            category = row[2].strip()
            spins_total = parse_int(row[22])
            spins_recent = parse_int(row[23])
            spins_other = parse_int(row[24])
            year = parse_year(row[25])
            
            # Deduplication logic: if the key exists, keep the one with higher total spins
            import datetime
            now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            record = (artist, title, norm_artist, norm_title, category, spins_total, spins_recent, spins_other, year, now_str)
            
            if track_key in unique_tracks:
                existing_record = unique_tracks[track_key]
                existing_spins = existing_record[5]
                if spins_total > existing_spins:
                    unique_tracks[track_key] = record
            else:
                unique_tracks[track_key] = record
                
    print(f"Parsed {line_idx+1} rows. Found {len(unique_tracks)} unique cleaned tracks.")
    
    # Establish database connection
    print(f"Connecting to database {dbname}...")
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
        
        # Prepare batch insert with upsert
        query = """
            INSERT INTO catalogo_toscana (
                artist, title, normalized_artist, normalized_title, 
                category, spins_total, spins_recent, spins_other, year, updated_at
            ) VALUES %s
            ON CONFLICT (normalized_artist, normalized_title) DO UPDATE SET
                artist = EXCLUDED.artist,
                title = EXCLUDED.title,
                category = EXCLUDED.category,
                spins_total = EXCLUDED.spins_total,
                spins_recent = EXCLUDED.spins_recent,
                spins_other = EXCLUDED.spins_other,
                year = EXCLUDED.year,
                updated_at = EXCLUDED.updated_at;
        """
        
        records_list = list(unique_tracks.values())
        print(f"Uploading {len(records_list)} tracks to Supabase...")
        
        # Esegui l'inserimento in batch
        execute_values(cursor, query, records_list)
        conn.commit()
        
        print("Catalog successfully synchronized to Supabase!")
        
        # Count check
        cursor.execute("SELECT COUNT(*) FROM catalogo_toscana;")
        db_count = cursor.fetchone()[0]
        print(f"Total rows in catalogo_toscana table: {db_count}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print("Database error during synchronization:", e)

if __name__ == "__main__":
    main()
