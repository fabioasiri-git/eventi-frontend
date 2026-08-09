import os
import datetime
import json
import psycopg2
import requests
from dotenv import load_dotenv
from zoneinfo import ZoneInfo

def get_last_completed_week():
    """
    Returns (start_dt, end_dt) for the last completed Monday-to-Sunday week,
    localized to Europe/Rome.
    """
    rome_tz = ZoneInfo("Europe/Rome")
    now = datetime.datetime.now(rome_tz)
    
    # Calculate days since last Monday
    # now.weekday() returns 0 for Monday, ..., 6 for Sunday
    # If today is Monday, we want the week that just ended yesterday.
    # Otherwise, we want the previous week.
    days_to_subtract = now.weekday() + 7
    
    last_monday = now - datetime.timedelta(days=days_to_subtract)
    start_dt = last_monday.replace(hour=0, minute=0, second=0, microsecond=0)
    
    last_sunday = start_dt + datetime.timedelta(days=6)
    end_dt = last_sunday.replace(hour=23, minute=59, second=59, microsecond=999999)
    
    return start_dt, end_dt

def call_gemini_api(api_key, model, system_instruction, prompt_text):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "contents": [{
            "parts": [{
                "text": f"{system_instruction}\n\nUser Input Data:\n{prompt_text}"
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=45)
        if r.status_code == 200:
            res_json = r.json()
            # Extract text content
            candidates = res_json.get("candidates", [])
            if candidates:
                text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                return text
            else:
                print("Error: No candidates returned in Gemini API response.")
                print(r.text)
        else:
            print(f"Gemini API returned status code {r.status_code}: {r.text}")
    except Exception as e:
        print("Exception calling Gemini API:", e)
    return None

def call_openai_api(api_key, model, system_instruction, prompt_text):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": model,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": system_instruction
            },
            {
                "role": "user",
                "content": prompt_text
            }
        ]
    }
    
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=45)
        if r.status_code == 200:
            res_json = r.json()
            text = res_json.get("choices", [{}])[0].get("message", {}).get("content", "")
            return text
        else:
            print(f"OpenAI API returned status code {r.status_code}: {r.text}")
    except Exception as e:
        print("Exception calling OpenAI API:", e)
    return None

def main():
    dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
    load_dotenv(dotenv_path=dotenv_path)
    
    host = os.getenv("SUPABASE_DB_HOST")
    port = os.getenv("SUPABASE_DB_PORT", 6543)
    dbname = os.getenv("SUPABASE_DB_NAME")
    user = os.getenv("SUPABASE_DB_USER")
    password = os.getenv("SUPABASE_DB_PASSWORD")
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    # Timeframe calculation
    start_dt, end_dt = get_last_completed_week()
    print(f"Generating weekly report for timeframe:")
    print(f"  Start: {start_dt}")
    print(f"  End:   {end_dt}")
    
    # Establish DB Connection
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
        
        # 1. Fetch all spins grouped by station and track
        cursor.execute("""
            SELECT station, artist, title, normalized_artist, normalized_title, COUNT(*) as spins
            FROM storici_passaggi
            WHERE played_at >= %s AND played_at <= %s
            GROUP BY station, artist, title, normalized_artist, normalized_title;
        """, (start_dt, end_dt))
        
        spins_rows = cursor.fetchall()
        print(f"Fetched {len(spins_rows)} raw spins records for the week.")
        
        if not spins_rows:
            print("No competitor spins found in database for the specified week.")
            print("Make sure scrape_competitors.py has been run for dates in this range.")
            cursor.close()
            conn.close()
            return
            
        # 2. Fetch entire catalog from catalogo_toscana to do in-memory matches
        cursor.execute("""
            SELECT normalized_artist, normalized_title, category, spins_total, spins_recent, spins_other
            FROM catalogo_toscana;
        """)
        catalog_rows = cursor.fetchall()
        catalog_dict = {}
        for row in catalog_rows:
            norm_art, norm_tit, cat, s_tot, s_rec, s_oth = row
            catalog_dict[(norm_art, norm_tit)] = {
                "category": cat,
                "spins_total": s_tot,
                "spins_recent": s_rec,
                "spins_other": s_oth
            }
            
        # 3. Fetch Spotify popularity cache
        cursor.execute("""
            SELECT normalized_artist, normalized_title, popularity, spotify_id
            FROM spotify_popolarita;
        """)
        spotify_rows = cursor.fetchall()
        spotify_dict = {}
        for row in spotify_rows:
            norm_art, norm_tit, pop, sp_id = row
            spotify_dict[(norm_art, norm_tit)] = {
                "popularity": pop,
                "spotify_id": sp_id
            }
            
        # 4. Process and aggregate spins by track
        tracks_data = {}
        for row in spins_rows:
            station, artist, title, norm_art, norm_tit, spins = row
            track_key = (norm_art, norm_tit)
            
            if track_key not in tracks_data:
                # Resolve catalog info
                in_catalog = track_key in catalog_dict
                cat_info = catalog_dict.get(track_key, {})
                
                # Resolve spotify info
                sp_info = spotify_dict.get(track_key, {})
                
                tracks_data[track_key] = {
                    "artist": artist,
                    "title": title,
                    "rds_relax_spins": 0,
                    "rmc_spins": 0,
                    "ds_soft_spins": 0,
                    "spotify_popularity": sp_info.get("popularity", 0),
                    "in_catalog": in_catalog,
                    "catalog_category": cat_info.get("category"),
                    "catalog_total_spins": cat_info.get("spins_total", 0),
                    "catalog_recent_spins": cat_info.get("spins_recent", 0)
                }
                
            # Accumulate spins
            t_data = tracks_data[track_key]
            if station == "RDS Relax":
                t_data["rds_relax_spins"] += spins
            elif station == "Radio Monte Carlo":
                t_data["rmc_spins"] += spins
            elif station == "Dimensione Suono Soft":
                t_data["ds_soft_spins"] += spins
                
        cursor.close()
        conn.close()
        
    except Exception as e:
        print("Database query failed:", e)
        return
        
    # Convert aggregated data to list
    final_tracks_list = list(tracks_data.values())
    print(f"Aggregated data into {len(final_tracks_list)} unique tracks played on competitors.")
    
    # 5. Call LLM Engine to generate report
    if not gemini_key and not openai_key:
        print("\nAPI key not set in .env. Saving aggregated data directly as raw JSON.")
        print("Fill in GEMINI_API_KEY or OPENAI_API_KEY in .env to get the strategic analysis.")
        
        # Save raw analysis
        os.makedirs("reports", exist_ok=True)
        report_filename = f"reports/raw_tracks_{start_dt.strftime('%Y-%m-%d')}.json"
        with open(report_filename, "w", encoding="utf-8") as f:
            json.dump(final_tracks_list, f, indent=2, ensure_ascii=False)
        print(f"Raw tracks data saved to {report_filename}")
        return
        
    system_instruction = """
You are "AC Music Intelligence", an expert music programmer and AI strategist configured with the strict editorial rules of the "Adult Contemporary" (AC) radio format.
Your task is to analyze a list of tracks played on competitor stations during the past week, cross-reference them with our internal catalog, and generate a strategic report in JSON format.

Editorial target: Adult Contemporary (AC)
- Audience: Adults 25-54.
- Core: Melodic, elegant, polished pop/rock hits, soft tracks, classic ballads from 70s, 80s, 90s, 2000s, and elegant current soft hits.
- Excluded: Heavy metal, hard rock, rap, trap, extreme dance, techno, or highly aggressive youth-oriented genres.
- RDS Relax is our main editorial benchmark (Soft/Relaxed AC).
- Dimensione Suono Soft and Radio Monte Carlo (RMC) are elegant radar stations.

You must categorize tracks into the following 4 quadrants:
1. "grandi_assenti": Songs played frequently on RDS Relax (spins >= 2) and with a strong Spotify popularity (>= 40), but NOT in our catalog (in_catalog=false). These are prioritary gap additions.
2. "da_incrementare": Songs already in our catalog (in_catalog=true) but in low-rotation categories (like CLN, CLS, OLD) or with low total plays, which are played frequently on RDS Relax (benchmark). They should be promoted to higher rotations.
3. "da_far_uscire": Songs in our catalog in high-rotation categories (category = 'HIT' or 'REC', or high play count) which are ABSENT or very rarely played on RDS Relax (benchmark) AND have declining or low Spotify popularity (< 40). These are dead weight.
4. "radar": Recommendations because they are played concurrently on the other elegant radar stations (RMC and DS Soft) with good popularity, showing an elegant alignment, regardless of catalog presence.

Input data includes a JSON list of tracks. Each track has spins on RDS Relax, RMC, DS Soft, Spotify popularity, in_catalog flag, current catalog category, and total plays.

You must output ONLY a valid JSON object matching the following structure:
{
  "timeframe": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "summary": {
    "total_competitor_tracks_analyzed": 120,
    "grandi_assenti_count": 5,
    "da_incrementare_count": 5,
    "da_far_uscire_count": 5,
    "radar_count": 5
  },
  "grandi_assenti": [
    {
      "artist": "Artist Name",
      "title": "Song Title",
      "rds_relax_spins": 12,
      "spotify_popularity": 78,
      "reason": "Clear gap: Top spin on benchmark and high Spotify popularity."
    }
  ],
  "da_incrementare": [
    {
      "artist": "Artist Name",
      "title": "Song Title",
      "current_category": "CLS",
      "rds_relax_spins": 10,
      "spotify_popularity": 62,
      "reason": "Currently in low category but benchmark plays it as a recurrent hit."
    }
  ],
  "da_far_uscire": [
    {
      "artist": "Artist Name",
      "title": "Song Title",
      "current_category": "HIT",
      "spotify_popularity": 32,
      "reason": "Not played on benchmark anymore and popularity is declining."
    }
  ],
  "radar": [
    {
      "artist": "Artist Name",
      "title": "Song Title",
      "rmc_spins": 8,
      "ds_soft_spins": 6,
      "spotify_popularity": 55,
      "reason": "Recommended: High alignment on radar elegant AC stations."
    }
  ]
}

Strictly output raw JSON only. Do not wrap in markdown tags like ```json.
"""
    
    prompt_text = json.dumps({
        "timeframe": {
            "start": start_dt.strftime("%Y-%m-%d"),
            "end": end_dt.strftime("%Y-%m-%d")
        },
        "tracks": final_tracks_list
    }, ensure_ascii=False)
    
    print("\nCalling LLM Engine to compile the report...")
    llm_response = None
    
    if gemini_key:
        print("Using Gemini API (gemini-2.5-flash)...")
        llm_response = call_gemini_api(gemini_key, "gemini-2.5-flash", system_instruction, prompt_text)
    elif openai_key:
        print("Using OpenAI API (gpt-4o)...")
        llm_response = call_openai_api(openai_key, "gpt-4o", system_instruction, prompt_text)
        
    if not llm_response:
        print("Failed to get response from LLM API.")
        return
        
    # Clean response if the model wrapped it in markdown code block
    clean_json_str = llm_response.strip()
    if clean_json_str.startswith("```"):
        # Remove first line
        lines = clean_json_str.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines[-1].startswith("```"):
            lines = lines[:-1]
        clean_json_str = "\n".join(lines).strip()
        
    try:
        report_data = json.loads(clean_json_str)
        print("Successfully compiled and parsed JSON report!")
        
        # Save to reports directory
        os.makedirs("reports", exist_ok=True)
        report_date_str = start_dt.strftime("%Y-%m-%d")
        report_filename = f"reports/strategic_report_{report_date_str}.json"
        latest_filename = "reports/latest_strategic_report.json"
        
        with open(report_filename, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
            
        with open(latest_filename, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
            
        print(f"\nReport successfully saved to: {report_filename} and {latest_filename}")
        print("\n--- REPORT SUMMARY ---")
        summary = report_data.get("summary", {})
        print(f"Total Competitor Tracks Analyzed: {summary.get('total_competitor_tracks_analyzed')}")
        print(f"🟢 Grandi Assenti:   {len(report_data.get('grandi_assenti', []))}")
        print(f"🟡 Da Incrementare:  {len(report_data.get('da_incrementare', []))}")
        print(f"🔴 Da Far Uscire:    {len(report_data.get('da_far_uscire', []))}")
        print(f"🕵️ Il Radar:         {len(report_data.get('radar', []))}")
        
    except json.JSONDecodeError as e:
        print("Failed to parse LLM response as JSON. Raw response content:")
        print(llm_response[:1500])
        print("Error details:", e)

if __name__ == "__main__":
    main()
