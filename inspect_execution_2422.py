import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
HEADERS = {'X-N8N-API-KEY': API_KEY}
EID = '2422'

r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions/{EID}?includeData=true', headers=HEADERS, verify=False)
data = r.json()
run_data = data.get('data', {}).get('resultData', {}).get('runData', {})

print("Executed Nodes:", list(run_data.keys()))

if 'Build Groq Request' in run_data:
    groq_out = run_data['Build Groq Request'][0]['data']['main'][0][0]['json']
    print("\n=== BUILD GROQ REQUEST OUTPUT ===")
    print("Keys in Groq request node:", list(groq_out.keys()))
    if 'raw_groq_response' in groq_out:
        print("\n--- RAW GROQ RESPONSE ---")
        print(json.dumps(groq_out['raw_groq_response'], indent=2)[:1000])

if 'Validate & Format Report' in run_data:
    fmt_out = run_data['Validate & Format Report'][0]['data']['main'][0][0]['json']
    print("\n=== VALIDATE & FORMAT REPORT OUTPUT ===")
    print("Formatted Text:\n", fmt_out.get('formatted_text'))
