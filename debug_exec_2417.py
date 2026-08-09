import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    WF_ID = 'Iz4FEv42Ll6dl8pU'

    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=3', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    print("Latest 3 executions:")
    for e in execs:
        print(f"ID: {e['id']}, Status: {e['status']}, Mode: {e['mode']}, StartedAt: {e['startedAt']}")

    if execs:
        latest_id = execs[0]['id']
        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{latest_id}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print(f"\n--- Detailed Run Data for Execution {latest_id} ---")
        for node_name, node_runs in run_data.items():
            print(f"\nNode: {node_name}")
            for idx, run in enumerate(node_runs):
                status = run.get('executionStatus')
                print(f"  Run #{idx} Status: {status}")
                if 'data' in run and 'main' in run['data']:
                    for output_idx, output in enumerate(run['data']['main']):
                        print(f"    Output #{output_idx}: {json.dumps(output, indent=2)[:500]}")
                if 'error' in run:
                    print(f"    Error: {run['error']}")

if __name__ == '__main__':
    main()
