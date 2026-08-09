import requests
import json
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    WF_ID = 'Iz4FEv42Ll6dl8pU'

    print("Checking n8n healthz...")
    for i in range(15):
        try:
            r = requests.get('https://n8n.generazionedance.it/healthz', verify=False, timeout=5)
            if r.status_code == 200:
                print(f"n8n is ONLINE! (Attempt {i+1})")
                break
        except Exception:
            pass
        time.sleep(2)

    print("Activating workflow via REST API...")
    act = requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/activate", headers=HEADERS, verify=False)
    print("Activate API status:", act.status_code, act.text[:100])

    print("Triggering report webhook...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
    print("Webhook response status:", tr.status_code)
    print("Webhook response body:", tr.text)

    if tr.status_code != 200:
        print("Webhook error, aborting verification.")
        return

    print("Waiting 15 seconds for Groq AI & Email/Telegram delivery...")
    time.sleep(15)

    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if execs:
        latest = execs[0]
        eid = latest['id']
        status = latest['status']
        started = latest['startedAt']
        print(f"\nREAL LATEST EXECUTION: ID={eid}, Status={status}, StartedAt={started}")

        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{eid}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed nodes:", list(run_data.keys()))

        if 'Telegram Weekly Report' in run_data:
            tg = run_data['Telegram Weekly Report'][0]['data']['main'][0][0]['json']
            print("Telegram Success:", tg.get('ok'), "Message ID:", tg.get('result', {}).get('message_id'))

        if 'Email Weekly Report' in run_data:
            em = run_data['Email Weekly Report'][0]['data']['main'][0][0]['json']
            print("Email Accepted:", em.get('accepted'), "Response:", em.get('response'))

if __name__ == '__main__':
    main()
