import sys
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect(
    host="aws-0-eu-west-1.pooler.supabase.com",
    port=6543,
    dbname="postgres",
    user="postgres.dunogeleekgqztkrlxsz",
    password="82PR0wuwHCtbCVdl",
    sslmode="require"
)
conn.autocommit = True
cur = conn.cursor()

# Aggiungi colonna settore
print("Aggiungo colonna 'settore' alla tabella leads...")
try:
    cur.execute("ALTER TABLE leads ADD COLUMN IF NOT EXISTS settore TEXT;")
    print("OK - colonna 'settore' aggiunta (o gia' esistente)")
except Exception as e:
    print(f"Errore: {e}")

# Verifica struttura attuale
print("\nStruttura attuale della tabella leads:")
cur.execute("""
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'leads' 
    ORDER BY ordinal_position;
""")
rows = cur.fetchall()
for r in rows:
    print(f"  {r[0]:30s} {r[1]:20s} nullable={r[2]}")

cur.close()
conn.close()
print("\nFatto!")
