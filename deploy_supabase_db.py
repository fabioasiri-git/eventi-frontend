import os
import sys

# Imposta codifica stdout per Windows
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
    
    host = env_vars.get("SUPABASE_DB_HOST", "aws-0-eu-west-1.pooler.supabase.com")
    port = int(env_vars.get("SUPABASE_DB_PORT", "6543"))
    dbname = env_vars.get("SUPABASE_DB_NAME", "postgres")
    user = env_vars.get("SUPABASE_DB_USER", "postgres.dunogeleekgqztkrlxsz")
    password = env_vars.get("SUPABASE_DB_PASSWORD", "82PR0wuwHCtbCVdl")
    
    sql_file = os.path.join(os.path.dirname(__file__), "lead_engine_setup.sql")
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_script = f.read()
        
    print(f"Connessione al Database Supabase Cloud ({host}:{port})...")
    print(f"Utente: {user}")
    print(f"Schema Dedicato: rt_lead_engine")
    
    try:
        import psycopg2
        conn = psycopg2.connect(
            host=host,
            port=port,
            dbname=dbname,
            user=user,
            password=password,
            connect_timeout=10
        )
        cursor = conn.cursor()
        cursor.execute(sql_script)
        conn.commit()
        cursor.close()
        conn.close()
        print("SUCCESS: Esecuzione riuscita su Supabase Cloud!")
        print("Schema 'rt_lead_engine' e tabella 'rt_lead_engine_pool' creati con successo!")
    except Exception as e:
        print(f"Nota connessione diretta: {e}")
        print("Script SQL isolato in: e:\\Lead Engine RT\\lead_engine_setup.sql")
        print("Eseguibile dall'SQL Editor di Supabase per attivare lo schema dedicato 'rt_lead_engine'.")

if __name__ == "__main__":
    main()
