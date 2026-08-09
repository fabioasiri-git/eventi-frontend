import sys, requests, json
sys.stdout.reconfigure(encoding='utf-8')

key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3OiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzBjNDEwZGEtNDc3NS00ZTUwLTg2MmUtMWViNzc5NTRlY2M2IiwiaWF0IjoxNzg0NTQzNTE3fQ.rifC1F_rWiPvhtMfg8c-mDFEQsQAD6NIR2GqP-gLAMo'
h = {'X-N8N-API-KEY': key}

r = requests.get('https://n8n.generazionedance.it/api/v1/workflows/L1NourCRWYTJBJVd', headers=h)
print("STATUS CODE:", r.status_code)
data = r.json()
print("KEYS IN RESPONSE:", list(data.keys()))
if 'nodes' in data:
    for n in data['nodes']:
        print(f"Node: {n.get('name')} (Type: {n.get('type')})")
