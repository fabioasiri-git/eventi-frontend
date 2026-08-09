import os
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
    print("⚡ VERIFICA RAPIDA ENDPOINT & TELEGRAM OOH SCOUTER DB:\n")
    
    env_path = os.path.join(os.path.dirname(__file__), "DB Musicale", ".env")
    env_vars = parse_env_file(env_path)
    
    try:
        conn = psycopg2.connect(
            host=env_vars.get("SUPABASE_DB_HOST", "aws-0-eu-west-1.pooler.supabase.com"),
            port=int(env_vars.get("SUPABASE_DB_PORT", "6543")),
            dbname=env_vars.get("SUPABASE_DB_NAME", "postgres"),
            user=env_vars.get("SUPABASE_DB_USER", "postgres.dunogeleekgqztkrlxsz"),
            password=env_vars.get("SUPABASE_DB_PASSWORD", "82PR0wuwHCtbCVdl"),
            connect_timeout=10
        )
        cursor = conn.cursor()
        
        # Inserimento Lead Telegram Test
        insert_query = """
        INSERT INTO rt_lead_engine.rt_lead_engine_pool 
        (nome_azienda_evento, settore, comune, provincia, area_target, fase_commerciale, valore_preventivo, valore_contratto, probabilita_chiusura)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """
        
        cursor.execute(insert_query, (
            "Telegram OOH Scouter Lead Test",
            "Ristorazione / Eventi",
            "Firenze",
            "FI",
            "AREA 1",
            "SCOPERTO",
            0.0,
            0.0,
            50
        ))
        
        new_id = cursor.fetchone()[0]
        conn.commit()
        
        print(f"✅ CONNESIONE SUPABASE CLOUD OK!")
        print(f"✅ TABELLA 'rt_lead_engine.rt_lead_engine_pool' PRONTA AD ACCOGLIERE I LEAD DA TELEGRAM!")
        print(f"📌 Nuovo ID Registrato per test Scouter: #{new_id}")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ ERRORE CONNESSIONE: {e}")

if __name__ == "__main__":
    main()
