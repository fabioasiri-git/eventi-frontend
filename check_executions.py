import sys, requests, json
sys.stdout.reconfigure(encoding='utf-8')

key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
h = {'X-N8N-API-KEY': key}
BASE = 'https://n8n.generazionedance.it/api/v1'

r = requests.get(f'{BASE}/executions/2384?includeData=true', headers=h)
e = r.json()

print('STATUS:', e.get('status'))
print('STARTED:', e.get('startedAt'))
print('STOPPED:', e.get('stoppedAt'))

# Cerca errore nei nodi
data = e.get('data', {})
if isinstance(data, dict):
    result_data = data.get('resultData', {})
    run_data = result_data.get('runData', {})
    for node_name, node_runs in run_data.items():
        for run in node_runs:
            error = run.get('error')
            if error:
                print(f'\n❌ ERRORE in nodo: {node_name}')
                print(f'   Messaggio: {error.get("message", "?")}')
                print(f'   Tipo: {error.get("name", "?")}')
            else:
                out = run.get('data', {}).get('main', [[]])
                count = len(out[0]) if out and out[0] else 0
                print(f'✅ OK: {node_name} ({count} items)')
