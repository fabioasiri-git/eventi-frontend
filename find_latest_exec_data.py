import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
HEADERS = {'X-N8N-API-KEY': API_KEY}
WF_ID = 'Iz4FEv42Ll6dl8pU'

r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=5', headers=HEADERS, verify=False)
execs = r.json().get('data', [])

for e in execs:
    eid = e['id']
    status = e['status']
    started = e['startedAt']
    print(f"\n--- EXECUTION ID: {eid} | Status: {status} | Started: {started} ---")
    det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{eid}?includeData=true", headers=HEADERS, verify=False).json()
    
    # Save det to JSON for inspection if eid == execs[0]['id']
    if eid == execs[0]['id']:
        with open('latest_exec_full.json', 'w', encoding='utf-8') as f:
            json.dump(det, f, indent=2)
        print(f"Saved latest execution {eid} full data to latest_exec_full.json")
