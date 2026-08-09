import requests
import json
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    WF_ID = 'Iz4FEv42Ll6dl8pU'

    # 1. Check healthz until n8n is 100% online
    print("Checking n8n healthz...")
    for _ in range(10):
        try:
            r = requests.get('https://n8n.generazionedance.it/healthz', verify=False, timeout=5)
            if r.status_code == 200:
                print("n8n is ONLINE!")
                break
        except Exception:
            pass
        time.sleep(2)

    # 2. Activate workflow via REST API
    print("Activating workflow via n8n REST API...")
    act = requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/activate", headers=HEADERS, verify=False)
    print("Activate API status:", act.status_code, act.text)

    # 3. Trigger webhook
    print("Triggering report webhook...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
    print("Webhook response:", tr.status_code, tr.text)

    if tr.status_code != 200:
        print("Webhook failed, cannot proceed.")
        return

    # 4. Wait 15 seconds for execution
    print("Waiting 15 seconds for Groq AI analysis & Email/Telegram delivery...")
    time.sleep(15)

    # 5. Fetch execution details
    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if execs:
        latest = execs[0]
        exec_id = latest['id']
        status = latest['status']
        print(f"NEW EXECUTION ID: {exec_id}, STATUS: {status}")

        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{exec_id}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed nodes:", list(run_data.keys()))

        if 'Build Groq Request' in run_data:
            groq_out = run_data['Build Groq Request'][0]['data']['main'][0][0]['json']
            print("Groq AI Total Tracks Analyzed:", groq_out.get('total_analyzed_tracks'))
            print("Groq AI Grandi Assenti count:", len(groq_out.get('grandi_assenti', [])))

        if 'Telegram Weekly Report' in run_data:
            tg_out = run_data['Telegram Weekly Report'][0]['data']['main'][0][0]['json']
            print("Telegram Bot Delivery Status:", tg_out.get('ok'))

        if 'Email Weekly Report' in run_data:
            email_out = run_data['Email Weekly Report'][0]['data']['main'][0][0]['json']
            print("Email Delivery Accepted:", email_out.get('accepted'))

if __name__ == '__main__':
    main()
