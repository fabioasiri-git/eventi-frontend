import os
import json
import sys
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

def parse_env_file(env_path):
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env_vars[k.strip()] = v.strip()
    return env_vars

def main():
    env_path = os.path.join(os.path.dirname(__file__), "DB Musicale", ".env")
    env_vars = parse_env_file(env_path)
    
    conn = psycopg2.connect(
        host=env_vars.get("SUPABASE_DB_HOST", "aws-0-eu-west-1.pooler.supabase.com"),
        port=int(env_vars.get("SUPABASE_DB_PORT", "6543")),
        dbname=env_vars.get("SUPABASE_DB_NAME", "postgres"),
        user=env_vars.get("SUPABASE_DB_USER", "postgres.dunogeleekgqztkrlxsz"),
        password=env_vars.get("SUPABASE_DB_PASSWORD", "82PR0wuwHCtbCVdl"),
        connect_timeout=10
    )
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT nome_azienda_evento, comune, provincia, area_target, fase_commerciale, valore_preventivo, valore_contratto
        FROM rt_lead_engine.rt_lead_engine_pool
        ORDER BY id DESC;
    """)
    
    rows = cursor.fetchall()
    print(f"📊 TOTALE RECORD IN SUPABASE CLOUD (rt_lead_engine_pool): {len(rows)}\n")
    for r in rows:
        print(f"  • {r[0]} ({r[1]}, {r[2]}) ➔ {r[4]} | Valore: €{max(r[5], r[6])}")
        
    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()
