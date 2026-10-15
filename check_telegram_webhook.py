import sys
import os
import requests

sys.stdout.reconfigure(encoding='utf-8')

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

def main():
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo"
    r = requests.get(url).json()
    print("📡 VERIFICA WEBHOOK TELEGRAM BOT:")
    print(r)

if __name__ == "__main__":
    main()
