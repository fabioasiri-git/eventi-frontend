import subprocess
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Script di sincronizzazione automatica da Bitwarden Secrets Manager
# Genera il file .env.local locale in totale sicurezza (ignorato da Git)

SERVER_URL = os.getenv("BWS_SERVER_URL", "https://vault.bitwarden.eu")
PROJECT_ID = "d34d93cb-9713-4b12-aea5-b4e4014b3a58" # Lead Engine RT

def pull_secrets():
    print("🔐 Connessione a Bitwarden Secrets Manager...")
    cmd = ["bws", "--server-url", SERVER_URL, "secret", "list"]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    
    if res.returncode != 0:
        print(f"❌ Errore durante il recupero dei segreti: {res.stderr.strip()}")
        sys.exit(1)
        
    try:
        secrets = json.loads(res.stdout)
    except Exception as e:
        print(f"❌ Errore parsing JSON: {e}")
        sys.exit(1)

    project_secrets = [s for s in secrets if s.get("projectId") == PROJECT_ID]
    
    env_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local")
    
    lines = [
        "# ===================================================================",
        "# FILE GENERATO AUTOMATICAMENTE DA BITWARDEN SECRETS MANAGER",
        "# NON COMMIFRICARE MAI QUESTO FILE SU GIT",
        "# ===================================================================\n"
    ]
    
    for s in sorted(project_secrets, key=lambda x: x.get("key", "")):
        k = s.get("key")
        v = s.get("value")
        lines.append(f"{k}={v}")
        
    with open(env_file_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
        
    print(f"✅ Sincronizzati {len(project_secrets)} segreti in .env.local con successo!")

if __name__ == "__main__":
    pull_secrets()
