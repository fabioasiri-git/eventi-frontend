import os
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

def scan_telegram_cache():
    user_home = os.path.expanduser("~")
    telegram_paths = [
        os.path.join(user_home, r"AppData\Roaming\Telegram Desktop\tdata"),
        os.path.join(user_home, r"AppData\Roaming\Telegram Desktop"),
        os.path.join(user_home, r"AppData\Local\Packages"),
        os.path.join(user_home, r"Downloads\Telegram Desktop")
    ]
    
    print("🔍 SCANSIONE DELLA CACHE DI TELEGRAM DESKTOP SUL TUO PC:\n")
    
    found_files = []
    for tp in telegram_paths:
        if os.path.exists(tp):
            for root, dirs, files in os.walk(tp):
                for f in files:
                    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) or "photo" in f.lower():
                        full_p = os.path.join(root, f)
                        try:
                            mtime = os.path.getmtime(full_p)
                            dt = datetime.fromtimestamp(mtime)
                            found_files.append((full_p, dt, os.path.getsize(full_p)))
                        except Exception:
                            pass
                            
    found_files.sort(key=lambda x: x[1], reverse=True)
    
    print(f"📸 TROVATE {len(found_files)} FOTO RECENTI NELLA CACHE TELEGRAM:\n")
    for path, dt, size in found_files[:20]:
        print(f"  • [{dt.strftime('%Y-%m-%d %H:%M:%S')}] {path} ({size} bytes)")

if __name__ == "__main__":
    scan_telegram_cache()
