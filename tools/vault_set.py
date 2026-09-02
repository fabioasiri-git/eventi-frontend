#!/usr/bin/env python3
"""
tools/vault_set.py
------------------
Salva o aggiorna una chiave nella Cassaforte Cloud Supabase ("rt_lead_engine"."system_vault").
Uso: python tools/vault_set.py NOME_CHIAVE VALORE [DESCRIZIONE]
"""

import sys
import psycopg2

def main():
    if len(sys.argv) < 3:
        print("Uso: python tools/vault_set.py NOME_CHIAVE VALORE [DESCRIZIONE]")
        sys.exit(1)
        
    key_name = sys.argv[1].upper().strip()
    key_value = sys.argv[2].strip()
    description = sys.argv[3].strip() if len(sys.argv) > 3 else f"Chiave {key_name} salvata nel Cloud Vault"
    
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres.dunogeleekgqztkrlxsz',
        password='82PR0wuwHCtbCVdl',
        host='aws-0-eu-west-1.pooler.supabase.com',
        port=6543
    )
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO "rt_lead_engine"."system_vault" (key_name, key_value, description, updated_at)
        VALUES (%s, %s, %s, NOW())
        ON CONFLICT (key_name) DO UPDATE 
        SET key_value = EXCLUDED.key_value, description = EXCLUDED.description, updated_at = NOW();
    """, (key_name, key_value, description))
    conn.commit()
    
    print(f"[OK] Chiave {key_name} salvata con successo nel Cloud Vault Supabase!")
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
