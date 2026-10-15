import sys, requests, json, os
sys.stdout.reconfigure(encoding='utf-8')

N8N_BASE_URL = os.getenv("N8N_BASE_URL", "https://n8n.generazionedance.it")
N8N_API_KEY = os.getenv("N8N_API_KEY", "")
headers = {"X-N8N-API-KEY": N8N_API_KEY} if N8N_API_KEY else {}

# 1. n8n raggiungibile?
try:
    r = requests.get(f"{N8N_BASE_URL}/api/v1/workflows", headers=headers, timeout=10)
    print(f"✅ n8n API status: {r.status_code}")
    if r.status_code == 200:
        wfs = r.json().get("data", [])
        print(f"   Workflow trovati: {len(wfs)}")
        for w in wfs:
            print(f"   - [{w['id']}] {w['name']} | Attivo: {w.get('active', False)}")
    else:
        print(f"   Risposta: {r.text[:200]}")
except Exception as e:
    print(f"❌ n8n non raggiungibile: {e}")

# 2. Ultime esecuzioni workflow OOH
print("\n--- Ultime esecuzioni RT_TELEGRAM_OOH_SCOUTER ---")
try:
    r2 = requests.get(f"{N8N_BASE_URL}/api/v1/executions", headers=headers, params={"workflowId": "L1NourCRWYTJBJVd", "limit": 5}, timeout=10)
    if r2.status_code == 200:
        execs = r2.json().get("data", [])
        if not execs:
            print("   Nessuna esecuzione trovata")
        for ex in execs:
            print(f"   ID: {ex['id']} | Status: {ex.get('status')} | Data: {ex.get('startedAt')}")
    else:
        print(f"   Status: {r2.status_code} - {r2.text[:200]}")
except Exception as e:
    print(f"❌ Errore esecuzioni: {e}")

# 3. Telegram webhook attivo?
try:
    tg_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not tg_token:
        print("   ⚠️ TELEGRAM_BOT_TOKEN non configurato")
    else:
        r3 = requests.get(f"https://api.telegram.org/bot{tg_token}/getWebhookInfo", timeout=10)
        info = r3.json().get("result", {})
        print(f"   URL: {info.get('url', 'non impostato')}")
        print(f"   Pending updates: {info.get('pending_update_count', 0)}")
        if info.get('last_error_message'):
            print(f"   ⚠️ Ultimo errore: {info.get('last_error_message')}")
        else:
            print("   ✅ Nessun errore webhook")
except Exception as e:
    print(f"❌ Errore webhook: {e}")
