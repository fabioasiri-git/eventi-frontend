import psycopg2

conn = psycopg2.connect(
    dbname='postgres',
    user='postgres.dunogeleekgqztkrlxsz',
    password='82PR0wuwHCtbCVdl',
    host='aws-0-eu-west-1.pooler.supabase.com',
    port=6543
)
cur = conn.cursor()

# Aggiorniamo lo schema per aggiungere project_scope se non presente
cur.execute("""
    ALTER TABLE "rt_lead_engine"."system_vault" 
    ADD COLUMN IF NOT EXISTS project_scope VARCHAR(50) NOT NULL DEFAULT 'GLOBAL';
""")
conn.commit()

# Aggiorniamo la Primary Key per essere (key_name, project_scope)
cur.execute("""
    DO $$
    BEGIN
        ALTER TABLE "rt_lead_engine"."system_vault" DROP CONSTRAINT IF EXISTS system_vault_pkey;
        ALTER TABLE "rt_lead_engine"."system_vault" ADD PRIMARY KEY (key_name, project_scope);
    EXCEPTION
        WHEN others THEN NULL;
    END $$;
""")
conn.commit()

# Inseriamo o aggiorniamo i valori GLOBAL e per progetto
cur.execute("""
    INSERT INTO "rt_lead_engine"."system_vault" (key_name, project_scope, key_value, description, updated_at)
    VALUES 
        ('SUPABASE_URL', 'GLOBAL', 'https://dunogeleekgqztkrlxsz.supabase.co', 'URL Ufficiale Supabase Shared Cloud', NOW()),
        ('SUPABASE_ANON_KEY', 'GLOBAL', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bm9nZWxlZWtncXp0a3JseHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTE2OTEsImV4cCI6MjA3MDA2NzY5MX0.b_-Jc1Q2914-9988_0', 'Supabase Anon Key', NOW()),
        ('COMMERCIAL_EMAIL', 'LEAD_ENGINE', 'commerciale@radiotoscana.it', 'Email Ufficiale Commerciale Fabio Asiri', NOW()),
        ('RADAR_IMAP_SERVER', 'LEAD_ENGINE', 'imaps.radiotoscana.it', 'Server IMAP Casella Radar Redazione', NOW())
    ON CONFLICT (key_name, project_scope) DO UPDATE 
    SET key_value = EXCLUDED.key_value, updated_at = NOW();
""")
conn.commit()

cur.execute('SELECT key_name, project_scope, description FROM "rt_lead_engine"."system_vault";')
rows = cur.fetchall()
print("[OK] SCHEMA UNIVERSAL CLOUD VAULT AGGIORNATO CON SUCCESSO SU SUPABASE!")
for r in rows:
    print(f"  [KEY] {r[0]} (Scope: {r[1]}): {r[2]}")

cur.close()
conn.close()
