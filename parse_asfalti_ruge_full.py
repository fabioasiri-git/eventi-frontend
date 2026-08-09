import os
import re
import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

def main():
    pdf_path = os.path.join(os.path.dirname(__file__), "Contratto Asfalti Ru.Ge 26.06.2026.pdf")
    if not os.path.exists(pdf_path):
        print("File non trovato")
        return

    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    print("📄 CONTRATTO ASFALTI RU.GE ESTRATTO:\n")
    for line in text.split('\n'):
        if any(k in line.lower() for k in ["ditta", "ru.ge", "asfalti", "euro", "890", "spot", "firenze", "2026"]):
            print(f"  • {line.strip()}")

if __name__ == "__main__":
    main()
