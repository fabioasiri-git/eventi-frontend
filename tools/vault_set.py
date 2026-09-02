#!/usr/bin/env python3
"""
tools/vault_set.py
------------------
Salva o aggiorna una chiave nella Cassaforte Cloud Supabase ("rt_lead_engine"."system_vault").
Uso: python tools/vault_set.py NOME_CHIAVE VALORE [PROJECT_SCOPE] [DESCRIZIONE]
Scope di default: GLOBAL (condiviso tra tutti i progetti: Lead Engine, GD, Elisir, Music Intel).
"""

import sys
import psycopg2

def main():
    if len(sys.argv) < 3:
        print("Uso: python tools/vault_set.py NOME_CHIAVE VALORE [PROJECT_SCOPE] [DESCRIZIONE]")
        print("Esempio: python tools/vault_set.py VERCEL_TOKEN secret_123 GLOBAL 'Token Vercel Deploy'")
        sys.exit(1)
        
    key_name = sys.argv[1].upper().strip()
    key_value = sys.argv[2].strip()
    project_scope = sys.argv[3].upper().strip() if len(sys.argv) > 3 else "GLOBAL"
    description = sys.argv[4].strip() if len(sys.argv) > 4 else f"Chiave {key_name} salvata nel Cloud Vault ({project_scope})"
    
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres.dunogeleekgqztkrlxsz',
        password='82PR0wuwHCtbCVdl',
        host='aws-0-eu-west-1.pooler.supabase.com',
        port=6543
    )
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO "rt_lead_engine"."system_vault" (key_name, project_scope, key_value, description, updated_at)
        VALUES (%s, %s, %s, %s, NOW())
        ON CONFLICT (key_name, project_scope) DO UPDATE 
        SET key_value = EXCLUDED.key_value, description = EXCLUDED.description, updated_at = NOW();
    """, (key_name, project_scope, key_value, description))
    conn.commit()
    
    print(f"[OK] Chiave {key_name} ({project_scope}) salvata con successo nel Cloud Vault Supabase!")
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
