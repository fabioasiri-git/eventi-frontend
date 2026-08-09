import os
import pypdf

def main():
    folder = os.path.join(os.path.dirname(__file__), "preventivi_reali")
    files = ["Contratto Etruria Luce e Gas Spa 09.06.26_1.pdf", "Contratto Confesercenti Firenze 30.06.26.pdf"]
    
    for f in files:
        path = os.path.join(folder, f)
        if os.path.exists(path):
            reader = pypdf.PdfReader(path)
            print(f"=== TEXT OF {f} ===")
            for i, page in enumerate(reader.pages):
                print(f"--- PAGE {i+1} ---")
                print(page.extract_text())

if __name__ == "__main__":
    main()
