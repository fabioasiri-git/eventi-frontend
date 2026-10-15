import sys
import os
import requests

sys.stdout.reconfigure(encoding='utf-8')

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

def main():
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo"
    r = requests.get(url).json()
    result = r.get("result", {})
    print(f"📌 TELEGRAM WEBHOOK URL ATTIVATO: {result.get('url', 'Nessun Webhook impostato')}")
    print(f"📌 PENDING UPDATE COUNT: {result.get('pending_update_count', 0)}")
    if result.get("last_error_message"):
        print(f"⚠️ ULTIMO ERRORE WEBHOOK: {result.get('last_error_message')}")

if __name__ == "__main__":
    main()
