import json
import time
import re
import urllib.request
import psycopg2
from datetime import datetime, timezone
import unicodedata
import sys

sys.stdout.reconfigure(encoding='utf-8')

DB_URL = "postgresql://postgres.akznjrosxfedacydovku:80GenDan9000$%25@aws-1-eu-central-1.pooler.supabase.com:6543/postgres"

def norm_str(s):
    if not s:
        return ""
    s = unicodedata.normalize('NFD', s)
    s = "".join([c for c in s if not unicodedata.combining(c)]).lower()
    s = re.sub(r'[\(\[\{]?(?:feat\.?|ft\.?|featuring|with)\b[^\)\]\}]*[\)\]\}]?', '', s)
    s = re.sub(r'\b(?:feat\.?|ft\.?|featuring|with)\b.*$', '', s)
    s = re.sub(r'[^a-z0-9\s]', '', s)
    return ' '.join(s.split())

last_tracks = {}

def insert_spin(conn, station, artist, title):
    norm_a = norm_str(artist)
    norm_t = norm_str(title)
    if not norm_a or not norm_t:
        return False
    
    last_key = (norm_a, norm_t)
    if last_tracks.get(station) == last_key:
        return False
    
    cur = conn.cursor()
    cur.execute("""
        SELECT id FROM storici_passaggi 
        WHERE station = %s AND normalized_artist = %s AND normalized_title = %s 
          AND played_at >= NOW() - INTERVAL '6 minutes'
        LIMIT 1;
    """, (station, norm_a, norm_t))
    if cur.fetchone():
        last_tracks[station] = last_key
        cur.close()
        return False
    
    now = datetime.now(timezone.utc)
    cur.execute("""
        INSERT INTO storici_passaggi (station, played_at, artist, title, normalized_artist, normalized_title)
        VALUES (%s, %s, %s, %s, %s, %s);
    """, (station, now, artist, title, norm_a, norm_t))
    conn.commit()
    cur.close()
    last_tracks[station] = last_key
    print(f"[{now.strftime('%H:%M:%S')}] + INSERTED {station}: {artist} - {title}")
    return True

# =====================================================================
# CANALE 1: DANCE (RADIO FIRENZE 95.4 FM)
# Benchmark di riferimento: Discoradio (Stella Polare) & m2o
# =====================================================================

def poll_discoradio(conn):
    url = "https://icstream.rds.radio/disco"
    req = urllib.request.Request(url, headers={"Icy-MetaData": "1", "User-Agent": "VLC/3.0.18"})
    try:
        with urllib.request.urlopen(req, timeout=4) as res:
            metaint = int(res.headers.get('icy-metaint', 0))
            if metaint > 0:
                res.read(metaint)
                meta_len = ord(res.read(1)) * 16
                if meta_len > 0:
                    meta = res.read(meta_len).decode('utf-8', errors='ignore')
                    if "StreamTitle=" in meta and "Song*" in meta:
                        content = meta.split("StreamTitle='")[1].split("';")[0]
                        parts = content.split("*")
                        if len(parts) >= 3 and parts[0] == "Song":
                            title = parts[1].strip()
                            artist = parts[2].strip()
                            insert_spin(conn, "Discoradio", artist, title)
    except Exception as e:
        pass

def poll_m2o(conn):
    url = "https://www.m2o.it/api/pub/v2/all/gdwc-audio-player/onair?format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=4) as res:
            data = json.loads(res.read().decode('utf-8'))
            title_raw = data.get("title", "").strip()
            if title_raw and not any(ign in title_raw.lower() for ign in ["reklama", "pubblicit", "jingle", "sigla", "promo"]):
                if " - " in title_raw:
                    pts = title_raw.split(" - ", 1)
                    insert_spin(conn, "m2o", pts[0].strip(), pts[1].strip())
                else:
                    insert_spin(conn, "m2o", "m2o", title_raw)
    except Exception as e:
        pass

# =====================================================================
# CANALE 2: ADULT CONTEMPORARY (RADIO TOSCANA)
# Benchmark di riferimento: RDS Relax, Dimensione Suono Soft (& RMC)
# =====================================================================

def poll_radiotoscana(conn):
    url = "https://sr14.inmystream.it/AudioPlayer/radiotoscana/playerInfo"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=4) as res:
            data = json.loads(res.read().decode('utf-8'))
            np = data.get("nowplaying", "").strip()
            if " - " in np:
                pts = np.split(" - ", 1)
                insert_spin(conn, "Radio Toscana", pts[0].strip(), pts[1].strip())
    except Exception as e:
        pass

def poll_rds_relax(conn):
    url = "https://icstream.rds.radio/rdsrelax"
    req = urllib.request.Request(url, headers={"Icy-MetaData": "1", "User-Agent": "VLC/3.0.18"})
    try:
        with urllib.request.urlopen(req, timeout=4) as res:
            metaint = int(res.headers.get('icy-metaint', 0))
            if metaint > 0:
                res.read(metaint)
                meta_len = ord(res.read(1)) * 16
                if meta_len > 0:
                    meta = res.read(meta_len).decode('utf-8', errors='ignore')
                    if "StreamTitle=" in meta and "Song*" in meta:
                        content = meta.split("StreamTitle='")[1].split("';")[0]
                        parts = content.split("*")
                        if len(parts) >= 3 and parts[0] == "Song":
                            title = parts[1].strip()
                            artist = parts[2].strip()
                            insert_spin(conn, "RDS Relax", artist, title)
    except Exception as e:
        pass

def poll_dimensione_suono_soft(conn):
    url = "https://icstream.rds.radio/dssc"
    req = urllib.request.Request(url, headers={"Icy-MetaData": "1", "User-Agent": "VLC/3.0.18"})
    try:
        with urllib.request.urlopen(req, timeout=4) as res:
            metaint = int(res.headers.get('icy-metaint', 0))
            if metaint > 0:
                res.read(metaint)
                meta_len = ord(res.read(1)) * 16
                if meta_len > 0:
                    meta = res.read(meta_len).decode('utf-8', errors='ignore')
                    if "StreamTitle=" in meta and "Song*" in meta:
                        content = meta.split("StreamTitle='")[1].split("';")[0]
                        parts = content.split("*")
                        if len(parts) >= 3 and parts[0] == "Song":
                            title = parts[1].strip()
                            artist = parts[2].strip()
                            insert_spin(conn, "Dimensione Suono Soft", artist, title)
    except Exception as e:
        pass

def run_collector(daemon=False):
    print("=================================================================")
    print("📡 STREAM INTELLIGENCE COLLECTOR (MONITORAGGIO 24 ORE)")
    print("=================================================================")
    print("Canale 1 (Dance):")
    print(" • Discoradio -> Stream Icecast ICY (icstream.rds.radio/disco)")
    print(" • m2o        -> REST API On-Air GEDI (m2o.it)")
    print("Canale 2 (AC):")
    print(" • Radio Toscana         -> API MediaCP (sr14.inmystream.it)")
    print(" • RDS Relax             -> Stream Icecast ICY (icstream.rds.radio/rdsrelax)")
    print(" • Dimensione Suono Soft -> Stream Icecast ICY (icstream.rds.radio/dssc)")
    print("=================================================================")
    
    while True:
        conn = None
        try:
            conn = psycopg2.connect(DB_URL)
            poll_discoradio(conn)
            poll_m2o(conn)
            poll_radiotoscana(conn)
            poll_rds_relax(conn)
            poll_dimensione_suono_soft(conn)
        except Exception as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Errore ciclo collector: {e}")
        finally:
            if conn:
                try:
                    conn.close()
                except:
                    pass
        
        if not daemon:
            print("Ciclo singolo completato.")
            break
            
        time.sleep(35)

if __name__ == "__main__":
    import sys
    is_daemon = "--daemon" in sys.argv or "-d" in sys.argv
    run_collector(daemon=is_daemon)

