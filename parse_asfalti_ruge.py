import os
import re
import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

def main():
    pdf_path = os.path.join(os.path.dirname(__file__), "Contratto Asfalti Ru.Ge 26.06.2026.pdf")
    if not os.path.exists(pdf_path):
        print(f"❌ File non trovato: {pdf_path}")
        return

    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    print(f"📄 DETTAGLI ESTRATTI DA: Contratto Asfalti Ru.Ge 26.06.2026.pdf\n")
    print(f"Lunghezza testo: {len(text)} caratteri\n")

    lines = [line.strip() for line in text.split('\n') if line.strip()]
    for line in lines[:25]:
        print(f"  • {line}")

if __name__ == "__main__":
    main()
