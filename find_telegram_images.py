import os
import sys
import glob
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

def scan_images(folder_path):
    found = []
    if os.path.exists(folder_path):
        for root, dirs, files in os.walk(folder_path):
            if "node_modules" in root or ".git" in root: continue
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    full_p = os.path.join(root, f)
                    mtime = os.path.getmtime(full_p)
                    dt = datetime.fromtimestamp(mtime)
                    found.append((full_p, dt, os.path.getsize(full_p)))
    return found

def main():
    print("🔍 RICERCA IMMAGINI CARICATE DA TELEGRAM / USER:\n")
    
    dirs_to_check = [
        os.path.join(os.path.dirname(__file__)),
        os.path.expanduser(r"~\.gemini\antigravity\brain\61ae2c06-482c-421d-bf96-33b3e91af999\.user_uploaded"),
        os.path.expanduser(r"~\Downloads"),
        r"C:\tmp",
        os.path.expanduser(r"~\AppData\Local\Temp")
    ]
    
    all_imgs = []
    for d in dirs_to_check:
        imgs = scan_images(d)
        all_imgs.extend(imgs)
        
    all_imgs.sort(key=lambda x: x[1], reverse=True)
    
    print(f"📸 TROVATE {len(all_imgs)} IMMAGINI RECENTI:\n")
    for path, dt, size in all_imgs[:15]:
        print(f"  • [{dt.strftime('%Y-%m-%d %H:%M:%S')}] {path} ({size} bytes)")

if __name__ == "__main__":
    main()
