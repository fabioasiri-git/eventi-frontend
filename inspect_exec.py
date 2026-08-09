import sys, requests, json
sys.stdout.reconfigure(encoding='utf-8')

N8N_BASE_URL = "https://n8n.generazionedance.it"
N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzBjNDEwZGEtNDc3NS00ZTUwLTg2MmUtMWViNzc5NTRlY2M2IiwiaWF0IjoxNzg0NTQzNTE3fQ.rifC1F_rWiPvhtMfg8c-mDFEQsQAD6NIR2GqP-gLAMo"
headers = {"X-N8N-API-KEY": N8N_API_KEY}

exec_id = 2385
r = requests.get(f"{N8N_BASE_URL}/api/v1/executions/{exec_id}", headers=headers, timeout=10)
data = r.json()

# Stampa tutto l'oggetto data senza runData (troppo lungo)
top_level = {k: v for k, v in data.items() if k != 'data'}
print("=== TOP LEVEL ===")
print(json.dumps(top_level, indent=2))

print("\n=== DATA.resultData.error ===")
err = data.get('data', {}).get('resultData', {}).get('error')
print(json.dumps(err, indent=2) if err else "Nessun errore top-level")

print("\n=== DATA.resultData (senza runData) ===")
rd = data.get('data', {}).get('resultData', {})
rd_no_run = {k: v for k, v in rd.items() if k != 'runData'}
print(json.dumps(rd_no_run, indent=2))
