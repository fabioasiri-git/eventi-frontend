import psycopg2

conn = psycopg2.connect(
    dbname='postgres',
    user='postgres.dunogeleekgqztkrlxsz',
    password='82PR0wuwHCtbCVdl',
    host='aws-0-eu-west-1.pooler.supabase.com',
    port=6543
)
cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS "rt_lead_engine"."system_vault" (
        key_name VARCHAR(100) PRIMARY KEY,
        key_value TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
""")
conn.commit()

# Inseriamo i valori di sistema noti
cur.execute("""
    INSERT INTO "rt_lead_engine"."system_vault" (key_name, key_value, description, updated_at)
    VALUES 
        ('SUPABASE_URL', 'https://dunogeleekgqztkrlxsz.supabase.co', 'URL Ufficiale Supabase Lead Engine', NOW()),
        ('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bm9nZWxlZWtncXp0a3JseHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTE2OTEsImV4cCI6MjA3MDA2NzY5MX0.b_-Jc1Q2914-9988_0', 'Supabase Anon Key', NOW()),
        ('COMMERCIAL_EMAIL', 'commerciale@radiotoscana.it', 'Email Ufficiale Commerciale Fabio Asiri', NOW()),
        ('RADAR_IMAP_SERVER', 'imaps.radiotoscana.it', 'Server IMAP Casella Radar Redazione', NOW())
    ON CONFLICT (key_name) DO UPDATE 
    SET key_value = EXCLUDED.key_value, updated_at = NOW();
""")
conn.commit()

cur.execute('SELECT key_name, description FROM "rt_lead_engine"."system_vault";')
rows = cur.fetchall()
print("[OK] TABELLA CLOUD SYSTEM_VAULT CREATA CON SUCCESSO SU SUPABASE!")
for r in rows:
    print(f"  [KEY] {r[0]}: {r[1]}")

cur.close()
conn.close()
