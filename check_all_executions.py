import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    WF_ID = 'Iz4FEv42Ll6dl8pU'

    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=5', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    print("Latest 5 Executions:")
    for e in execs:
        eid = e['id']
        status = e['status']
        started = e['startedAt']
        print(f"\nID: {eid} | Status: {status} | StartedAt: {started}")
        det = requests.get(f'https://n8n.generazionedance.it/api/v1/executions/{eid}?includeData=true', headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed Nodes:", list(run_data.keys()))
        if 'Validate & Format Report' in run_data:
            fmt = run_data['Validate & Format Report'][0]['data']['main'][0][0]['json']
            print("Formatted Text Snippet:", json.dumps(fmt.get('formatted_text', ''))[:300])

if __name__ == '__main__':
    main()
