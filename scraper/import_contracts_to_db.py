import pandas as pd
import urllib.request
import json
import os
import sys
import ssl

sys.stdout.reconfigure(encoding='utf-8')

# Disabilita verifica SSL per ambienti di sviluppo locali con certificati mancanti
ctx = ssl._create_unverified_context()

SUPABASE_URL = "https://unwqyqguxiumkrnlxatz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3F5cWd1eGl1bWtybmx4YXR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkzNDEwMCwiZXhwIjoyMDY4NTEwMTAwfQ.aKrye-cf9QkyTfmLLcWdLgDX0pxa85QWbzjvA8z2S3g"

excel_path = r"C:\eventi-frontend\scraper\data\storico_contratti.xlsx"

print("=== IMPORTATORE CONTRATTI IN RT LEAD ENGINE DATABASE ===")

if not os.path.exists(excel_path):
    print(f"❌ File Excel non trovato: {excel_path}")
    sys.exit(1)

# Carica dati da Excel
df = pd.read_excel(excel_path)
print(f"Caricati {len(df)} contratti da importare...")

# Converti NaN in None per JSON compatibilità
df = df.where(pd.notnull(df), None)

# Per superare i problemi di DNS su questa macchina, facciamo prima una risoluzione DoH del dominio Supabase
print("Risoluzione IP di unwqyqguxiumkrnlxatz.supabase.co...")
domain = "unwqyqguxiumkrnlxatz.supabase.co"
doh_url = f"https://cloudflare-dns.com/dns-query?name={domain}&type=A"

target_url = f"{SUPABASE_URL}/rest/v1/storico_contratti"
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

try:
    req = urllib.request.Request(doh_url, headers={"Accept": "application/dns-json"})
    with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
        dns_data = json.loads(resp.read().decode('utf-8'))
        answers = dns_data.get("Answer", [])
        ips = [ans["data"] for ans in answers if ans["type"] == 1]
        if ips:
            # Sostituiamo il dominio con l'IP e aggiungiamo l'header Host
            target_url = f"https://{ips[0]}/rest/v1/storico_contratti"
            headers["Host"] = domain
            print(f"Bypass DNS attivo: usando IP {ips[0]}")
except Exception as dns_err:
    print(f"⚠️ Impossibile fare bypass DoH ({dns_err}). Proverò con la connessione diretta.")

# Prepariamo i record per il database
records = []
for idx, row in df.iterrows():
    record = {
        "azienda": row["Azienda"],
        "garante": row["Garante"],
        "piva": row["P_IVA"],
        "email": row["Email"],
        "importo": float(row["Importo_Totale_Euro"]) if row["Importo_Totale_Euro"] is not None else 0.0,
        "date_campagna": row["Date_Campagna"],
        "data_firma": row["Data_Firma"],
        "dettagli": row["Dettagli_Spot"],
        "file_sorgente": row["File_Sorgente"]
    }
    records.append(record)

# Eseguiamo la chiamata REST POST per inserire/aggiornare i record
print("\nInviando i dati a Supabase...")
try:
    data_json = json.dumps(records).encode('utf-8')
    req_api = urllib.request.Request(
        target_url,
        data=data_json,
        headers=headers,
        method="POST"
    )
    with urllib.request.urlopen(req_api, timeout=15, context=ctx) as resp_api:
        print("✅ Importazione completata con successo in Supabase!")
        print("I contratti ora sono visibili online sulla Dashboard!")
except Exception as e:
    print(f"\n❌ Errore durante l'inserimento nel database: {e}")
    print("Nota: Se l'errore è 'getaddrinfo failed' o 'timed out', assicurati che il database sia stato riattivato (unpaused) su Supabase.")
