import requests, json

key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3OiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzBjNDEwZGEtNDc3NS00ZTUwLTg2MmUtMWViNzc5NTRlY2M2IiwiaWF0IjoxNzg0NTQzNTE3fQ.rifC1F_rWiPvhtMfg8c-mDFEQsQAD6NIR2GqP-gLAMo'
headers = {'X-N8N-API-KEY': key}

r = requests.get('https://n8n.generazionedance.it/api/v1/executions', headers=headers, params={'workflowId': 'L1NourCRWYTJBJVd', 'limit': 5})
print("STATUS:", r.status_code)
print("RESPONSE:", json.dumps(r.json(), indent=2))
