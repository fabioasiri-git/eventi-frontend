import os
import re
import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

def main():
    folder = os.path.join(os.path.dirname(__file__), "preventivi_reali")
    files = [f for f in os.listdir(folder) if f.lower().endswith(".pdf")]
    
    for f in files:
        full_path = os.path.join(folder, f)
        reader = pypdf.PdfReader(full_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
            
        print(f"==================================================")
        print(f"📄 FILE: {f}")
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        for line in lines:
            if any(k in line.lower() for k in ["dal", "al", "periodo", "programmazione", "messa in onda", "scadenza", "2026"]):
                print(f"  • {line}")

if __name__ == "__main__":
    main()
