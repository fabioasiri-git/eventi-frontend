import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def extract_pdf_text(pdf_path):
    text = ""
    # Prova con pypdf, pdfplumber o PyPDF2
    try:
        import pypdf
        reader = pypdf.PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception:
        pass
        
    try:
        import fitz # PyMuPDF
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text() or ""
        return text
    except Exception:
        pass
        
    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    except Exception as e:
        return f"[ERRORE LETTURA: {e}]"

def main():
    folder = os.path.join(os.path.dirname(__file__), "preventivi_reali")
    files = [f for f in os.listdir(folder) if f.lower().endswith(".pdf")]
    
    print(f"📄 Trovati {len(files)} file PDF in {folder}:\n")
    
    parsed_results = []
    
    for f in files:
        full_path = os.path.join(folder, f)
        text = extract_pdf_text(full_path)
        first_lines = [line.strip() for line in text.split('\n') if line.strip()][:15]
        
        parsed_results.append({
            "filename": f,
            "text_length": len(text),
            "snippet": first_lines
        })
        
        print(f"--- FILE: {f} ---")
        print(f"Lunghezza testo estratto: {len(text)} caratteri")
        print("Prime righe lette:")
        for line in first_lines[:8]:
            print(f"  • {line}")
        print("-" * 50)
        
    # Salva un json scratch
    scratch_dir = os.path.join(os.path.dirname(__file__), "scratch_parsed_docs.json")
    with open(scratch_dir, 'w', encoding='utf-8') as out:
        json.dump(parsed_results, out, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()
