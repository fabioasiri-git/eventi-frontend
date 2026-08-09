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

    # 1. Activate workflow
    print("Activating workflow via REST API...")
    act_res = requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/activate", headers=HEADERS, verify=False)
    print("Activate API status:", act_res.status_code)

    # 2. Trigger webhook
    print("Triggering webhook...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
    print("Webhook response status:", tr.status_code)
    print("Webhook response body:", tr.text)

    if tr.status_code != 200:
        print("Webhook failed!")
        return

    print("Waiting 18 seconds for Groq AI to analyze all 1,894 tracks and format report...")
    time.sleep(18)

    # 3. Fetch execution results
    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if execs:
        latest = execs[0]
        eid = latest['id']
        status = latest['status']
        print(f"\nREAL LATEST EXECUTION ID: {eid}, STATUS: {status}")

        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{eid}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed nodes:", list(run_data.keys()))

        if 'Validate & Format Report' in run_data:
            fmt = run_data['Validate & Format Report'][0]['data']['main'][0][0]['json']
            print("\n=== FORMATTED REPORT OUTPUT FROM GROQ ===")
            print(fmt.get('formatted_text'))

        if 'Telegram Weekly Report' in run_data:
            tg = run_data['Telegram Weekly Report'][0]['data']['main'][0][0]['json']
            print("\nTelegram Delivery:", tg.get('ok'))

        if 'Email Weekly Report' in run_data:
            em = run_data['Email Weekly Report'][0]['data']['main'][0][0]['json']
            print("\nEmail Delivery Accepted:", em.get('accepted'))

if __name__ == '__main__':
    main()
