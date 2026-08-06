import pandas as pd
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== STARTING CONTRACT COMPILATION ===")

search_dirs = [
    r"C:\eventi-frontend\scraper\data\TC\PREVENTIVI INVIATI",
    r"C:\eventi-frontend\scraper\data\backup_preventivi_chiavetta"
]

contract_files = []
for sd in search_dirs:
    if os.path.exists(sd):
        for root, dirs, files in os.walk(sd):
            for f in files:
                if f.endswith(".xls") and ("contratto" in f.lower() or "rms" in f.lower() or "tc -" in f.lower()):
                    contract_files.append(os.path.join(root, f))

print(f"Found {len(contract_files)} contract files to process.")

def parse_contract(fpath):
    try:
        df = pd.read_excel(fpath, header=None)
        
        garante_val = None
        company_val = None
        piva_val = None
        email_val = None
        total_val = 0.0
        dates_val = None
        date_signed = None
        notes_val = None
        
        # Scan cell by cell
        for r in range(df.shape[0]):
            for c in range(df.shape[1]):
                val = df.iat[r, c]
                if pd.isna(val):
                    continue
                val_str = str(val).strip()
                
                # Garante (Il Sig.)
                if val_str.startswith("Il Sig."):
                    for col_offset in range(1, 15):
                        if c + col_offset < df.shape[1]:
                            v = df.iat[r, c + col_offset]
                            if pd.notna(v) and str(v).strip():
                                garante_val = str(v).strip()
                                break
                                
                # Company (che agisce come garante)
                if "che agisce come garante" in val_str:
                    for col_offset in range(1, 20):
                        if c + col_offset < df.shape[1]:
                            v = df.iat[r, c + col_offset]
                            if pd.notna(v) and str(v).strip() and len(str(v).strip()) > 3:
                                company_val = str(v).strip()
                                break
                                
                # P.IVA
                if val_str.startswith("P:IVA") or val_str.startswith("P.IVA") or val_str.startswith("P. IVA"):
                    for col_offset in range(1, 10):
                        if c + col_offset < df.shape[1]:
                            v = df.iat[r, c + col_offset]
                            if pd.notna(v) and str(v).strip():
                                piva_val = str(v).strip()
                                break
                                
                # Email
                if "e-mail" in val_str or "email" in val_str:
                    if "@" in val_str:
                        email_val = val_str
                    else:
                        for col_offset in range(1, 15):
                            if c + col_offset < df.shape[1]:
                                v = df.iat[r, c + col_offset]
                                if pd.notna(v) and "@" in str(v):
                                    email_val = str(v).strip()
                                    break
                elif "@" in val_str and not email_val:
                    email_val = val_str
                                    
                # Total spaces / Totale complessivo
                if "Totale complessivo" in val_str or "Prezzo totale spazi" in val_str:
                    for col_offset in range(1, 25):
                        if c + col_offset < df.shape[1]:
                            v = df.iat[r, c + col_offset]
                            if pd.notna(v) and str(v).strip():
                                clean_val = str(v).strip().replace('€', '').replace(' ', '').replace(',', '.')
                                try:
                                    total_val = float(clean_val)
                                    break
                                except ValueError:
                                    pass
                                
                # Campaign dates (dal ... al ...)
                if "dal " in val_str and " al " in val_str:
                    dates_val = val_str
                    
                # Notes / Details of spot
                if "spot in totale" in val_str or "passaggi" in val_str:
                    notes_val = val_str
                    
                # Date signed (Redatto in 3 copie, letto e sottoscritto il giorno)
                if "sottoscritto il giorno" in val_str:
                    parts = []
                    # Scan next 30 columns to find day, month, year
                    for col_offset in range(1, 30):
                        if c + col_offset < df.shape[1]:
                            v = df.iat[r, c + col_offset]
                            if pd.notna(v) and str(v).strip() and str(v).strip() != "/":
                                val_clean = str(v).strip()
                                if val_clean.endswith(".0"):
                                    val_clean = val_clean[:-2]
                                parts.append(val_clean)
                    if len(parts) >= 3:
                        date_signed = f"{parts[0]}/{parts[1]}/{parts[2]}"
                    elif len(parts) == 2:
                        date_signed = f"{parts[0]}/{parts[1]}"
                    elif len(parts) == 1:
                        date_signed = parts[0]
                        
        # Fallbacks for Company and Garante if not matched by standard keywords
        if not company_val:
            for col in range(df.shape[1]):
                if col < df.shape[1]:
                    v = df.iat[1, col]
                    if pd.notna(v) and str(v).strip() and len(str(v).strip()) > 3 and not any(k in str(v).lower() for k in ["copia", "sig.", "garante", "toscana"]):
                        company_val = str(v).strip()
                        break
        
        if total_val == 0.0:
            for r in range(df.shape[0]):
                for c in range(df.shape[1]):
                    val = df.iat[r, c]
                    if pd.isna(val):
                        continue
                    val_str = str(val).strip()
                    if val_str == "780" or val_str == "780.0":
                        total_val = 780.0
                    elif val_str == "500" or val_str == "500.0":
                        total_val = 500.0
                    elif val_str == "250" or val_str == "250.0":
                        total_val = 250.0
                        
        return {
            "File_Sorgente": os.path.basename(fpath),
            "Azienda": company_val or "Sconosciuta",
            "Garante": garante_val or "Sconosciuto",
            "P_IVA": piva_val or "N/D",
            "Email": email_val or "N/D",
            "Importo_Totale_Euro": total_val,
            "Date_Campagna": dates_val or "N/D",
            "Data_Firma": date_signed or "N/D",
            "Dettagli_Spot": notes_val or "N/D"
        }
    except Exception as e:
        print(f"Error parsing {os.path.basename(fpath)}: {e}")
        return None

parsed_contracts = []
for cf in contract_files:
    res = parse_contract(cf)
    if res:
        parsed_contracts.append(res)

df_all = pd.DataFrame(parsed_contracts)
df_all = df_all.drop_duplicates(subset=["Azienda", "Importo_Totale_Euro", "Date_Campagna"])

output_path = r"C:\eventi-frontend\scraper\data\storico_contratti.xlsx"
df_all.to_excel(output_path, index=False)

print(f"\nSuccessfully compiled {len(df_all)} unique contracts and saved to {output_path}!")
print(df_all.to_string())
