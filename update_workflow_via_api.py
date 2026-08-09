import requests
import json
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type': 'application/json'
    }
    WF_ID = 'Iz4FEv42Ll6dl8pU'

    json_path = 'DB Musicale/ac_music_intelligence_n8n_workflow.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        wf = json.load(f)

    # 1. Deactivate workflow
    print("Deactivating workflow...")
    requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/deactivate", headers=HEADERS, verify=False)

    # 2. PUT updated workflow via REST API
    print("Updating workflow via n8n REST API (PUT)...")
    payload = {
        "name": wf['name'],
        "nodes": wf['nodes'],
        "connections": wf['connections']
    }
    put_res = requests.put(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}", json=payload, headers=HEADERS, verify=False)
    print("PUT API status:", put_res.status_code)

    if put_res.status_code != 200:
        print("PUT failed:", put_res.text)
        return

    # 3. Activate workflow
    print("Activating workflow...")
    act_res = requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/activate", headers=HEADERS, verify=False)
    print("Activate API status:", act_res.status_code)

    # 4. Trigger webhook
    print("Triggering webhook...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
    print("Webhook response:", tr.status_code, tr.text)

    print("Waiting 18 seconds for Groq AI to process all 1,894 tracks...")
    time.sleep(18)

    # 5. Fetch execution results
    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if execs:
        latest = execs[0]
        eid = latest['id']
        status = latest['status']
        print(f"\nLATEST EXECUTION ID: {eid}, STATUS: {status}")

        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{eid}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed nodes:", list(run_data.keys()))

        if 'Validate & Format Report' in run_data:
            fmt = run_data['Validate & Format Report'][0]['data']['main'][0][0]['json']
            print("\n=== FORMATTED REPORT OUTPUT FROM GROQ ===")
            print(fmt.get('formatted_text'))

if __name__ == '__main__':
    main()
