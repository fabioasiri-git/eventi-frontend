import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def search_files(dir_path):
    tokens = []
    for root, dirs, files in os.walk(dir_path):
        if "node_modules" in root or ".git" in root: continue
        for f in files:
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as file:
                    content = file.read()
                    matches = re.findall(r"(\d{8,10}:[A-Za-z0-9_-]{35})", content)
                    if matches:
                        tokens.extend(matches)
                        print(f"📌 Trovato Token Telegram in {p}: {matches}")
            except Exception:
                pass
    return list(set(tokens))

if __name__ == "__main__":
    print("🔍 RICERCA TELEGRAM BOT TOKEN NEL PROGETTO...")
    tokens = search_files("e:\\Lead Engine RT")
    if not tokens:
        print("⚠️ Nessun Token Bot Telegram fisicamente salvato nel codice locale.")
