import psycopg2

try:
    conn = psycopg2.connect(
        host='aws-0-eu-west-1.pooler.supabase.com',
        port=6543,
        dbname='postgres',
        user='postgres.dunogeleekgqztkrlxsz',
        password='82PR0wuwHCtbCVdl',
        connect_timeout=10
    )
    cursor = conn.cursor()
    
    cursor.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog');")
    tables = cursor.fetchall()
    print("Tabelle trovate in Supabase:")
    for t in tables:
        print("  ", t)

    # Check public.rt_lead_engine_pool or rt_lead_engine schema
    for t_schema, t_name in tables:
        if "lead" in t_name.lower() or "pool" in t_name.lower():
            full_table = f'"{t_schema}"."{t_name}"'
            cursor.execute(f"SELECT COUNT(*) FROM {full_table};")
            c = cursor.fetchone()[0]
            print(f"Tabella {full_table} contiene {c} righe.")
            
            # Wiping old test rows
            cursor.execute(f"TRUNCATE TABLE {full_table} RESTART IDENTITY CASCADE;")
            conn.commit()
            print(f"PULIZIA COMPLETATA PER {full_table}!")

    conn.close()
except Exception as e:
    print("Errore Supabase Postgres:", e)
