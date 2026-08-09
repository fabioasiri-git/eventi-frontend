import sys
import requests

sys.stdout.reconfigure(encoding='utf-8')

BOT_TOKEN = "8803277543:AAHxvV6tC5kGdVasDlje0FaL875fcnzBo9M"

def main():
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo"
    r = requests.get(url).json()
    print("📡 VERIFICA WEBHOOK TELEGRAM BOT:")
    print(r)

if __name__ == "__main__":
    main()
