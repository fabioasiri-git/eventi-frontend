import os
import re
import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

def main():
    folder = os.path.join(os.path.dirname(__file__), "preventivi_reali")
    files = [f for f in os.listdir(folder) if f.lower().endswith(".pdf")]
    
    print("📅 ISPEZIONE DATE DI INIZIO E FINE NEI CONTRATTI REALI:\n")
    
    for f in files:
        full_path = os.path.join(folder, f)
        reader = pypdf.PdfReader(full_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
            
        # Cerca pattern tipo "Dal DD/MM/YYYY Al DD/MM/YYYY" o date isolate
        dates = re.findall(r"(\b\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}\b)", text)
        dal_al = re.findall(r"(Dal\s+\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}\s+Al\s+\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})", text, re.IGNORECASE)
        
        print(f"--- FILE: {f} ---")
        if dal_al:
            print(f"  📌 PERIODO RILEVATO: {dal_al}")
        else:
            print(f"  📌 TUTTE LE DATE NEL TESTO: {dates[:6]}")
        print("-" * 50)

if __name__ == "__main__":
    main()
