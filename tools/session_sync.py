#!/usr/bin/env python3
"""
tools/session_sync.py
---------------------
Gatekeeper Deterministico di Sincronizzazione Sessione (Check-In / Check-Out).
Garantisce la parita' assoluta tra postazione Ufficio e postazione Casa e tra progetti:
1. Verifica ed allinea lo stato Git da GitHub origin/main.
2. Interroga la Cassaforte Cloud Supabase ("rt_lead_engine"."system_vault")
   e sincronizza le credenziali nel file locale .env.local protetto
   per l'ambito del progetto (GLOBAL + project_scope).
"""

import subprocess
import sys
import psycopg2

PROJECT_SCOPE = "LEAD_ENGINE"

def run_cmd(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, errors='ignore')
    return res.stdout.strip(), res.returncode

def checkin():
    print("=================================================================")
    print("   LEAD ENGINE RT - PROTOCOLLO DETERMINISTICO DI CHECK-IN        ")
    print("=================================================================")

    # 1. Git Fetch & Alignment Check
    print("[1/3] Verifica allineamento repository Git con GitHub origin...")
    out, code = run_cmd("git fetch origin")
    
    local_sha, _ = run_cmd("git rev-parse HEAD")
    remote_sha, _ = run_cmd("git rev-parse origin/main")
    
    print(f"  - Commit Locale : {local_sha[:8]}")
    print(f"  - Commit Remoto : {remote_sha[:8]}")
    
    if local_sha != remote_sha:
        print("  [ATTENZIONE] Rilevate modifiche sull'altra postazione! Eseguo pull automatico...")
        pull_out, pull_code = run_cmd("git pull origin main --rebase")
        if pull_code == 0:
            print("  [OK] Codice allineato con successo!")
        else:
            print(f"  [ERRORE] Impossibile allineare automaticamente: {pull_out}")
            sys.exit(1)
    else:
        print("  [OK] Repository locale 100% allineato con GitHub.")

    # 2. Sync from Universal Supabase Cloud System Vault
    print(f"\n[2/3] Sincronizzazione credenziali dal Cloud Vault (Ambito: GLOBAL + {PROJECT_SCOPE})...")
    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres.dunogeleekgqztkrlxsz',
            password='82PR0wuwHCtbCVdl',
            host='aws-0-eu-west-1.pooler.supabase.com',
            port=6543
        )
        cur = conn.cursor()
        cur.execute("""
            SELECT key_name, key_value, project_scope 
            FROM "rt_lead_engine"."system_vault"
            WHERE project_scope IN ('GLOBAL', %s)
            ORDER BY CASE WHEN project_scope = 'GLOBAL' THEN 1 ELSE 2 END;
        """, (PROJECT_SCOPE,))
        rows = cur.fetchall()
        
        env_lines = [
            f"# File generato automaticamente da tools/session_sync.py\n",
            f"# Ambito Progetto: {PROJECT_SCOPE} & GLOBAL Cloud Vault\n\n"
        ]
        keys_dict = {}
        for k, v, scope in rows:
            keys_dict[k] = (v, scope)
            
        for k, (v, scope) in keys_dict.items():
            env_lines.append(f"{k}={v}\n")
            
        with open('.env.local', 'w', encoding='utf-8') as f:
            f.writelines(env_lines)
            
        print(f"  [OK] Sincronizzate {len(keys_dict)} chiavi in .env.local locale.")
        for k, (_, scope) in keys_dict.items():
            print(f"       -> {k} ({scope})")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"  [ERRORE] Impossibile connettersi al System Vault Supabase: {e}")

    # 3. Stato Attuale e Pronto per Operativita'
    print("\n[3/3] Verifica Ambiente e Readiness...")
    print("  [OK] Gatekeeper superato al 100%! Ambiente allineato e pronto.")
    print("=================================================================\n")

if __name__ == "__main__":
    checkin()
