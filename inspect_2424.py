import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
HEADERS = {'X-N8N-API-KEY': API_KEY}
r = requests.get('https://n8n.generazionedance.it/api/v1/executions/2424?includeData=true', headers=HEADERS, verify=False)
data = r.json()

print("Execution Keys:", list(data.keys()))
run_data = data.get('resultData', {}).get('runData', {})
print("Run Data Keys:", list(run_data.keys()))

if 'Validate & Format Report' in run_data:
    out = run_data['Validate & Format Report'][0]['data']['main'][0][0]['json']
    print("\n=== EXECUTION 2424 TELEGRAM TEXT ===")
    print(out.get('formatted_text'))
