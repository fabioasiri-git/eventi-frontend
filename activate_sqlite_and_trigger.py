import json
import subprocess
import time
import requests
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    WF_ID = 'Iz4FEv42Ll6dl8pU'

    # Remote script to set active = 1 in SQLite
    remote_python_script = """
import sqlite3
conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("UPDATE workflow_entity SET active = 1 WHERE id = 'Iz4FEv42Ll6dl8pU'")
conn.commit()
conn.close()
print('Workflow active set to 1 in SQLite')
"""
    with open('set_active.py', 'w', encoding='utf-8') as f:
        f.write(remote_python_script)

    scp_script = ["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "set_active.py", "ubuntu@92.4.175.70:/tmp/set_active.py"]
    subprocess.run(scp_script, check=True)

    ssh_run = ["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo python3 /tmp/set_active.py"]
    subprocess.run(ssh_run, check=True)

    # Restart n8n container so it registers webhooks for active workflows
    print("Restarting n8n container...")
    ssh_restart = ["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo docker restart $(sudo docker ps -q --filter name=n8n)"]
    subprocess.run(ssh_restart, check=True)

    print("Waiting 20 seconds for n8n to register webhooks...")
    time.sleep(20)

    # Trigger webhook
    print("Sending webhook request to trigger weekly report...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, timeout=60, verify=False)
    print("Webhook Response:", tr.status_code, tr.text)

    print("Waiting 6 seconds for execution completion...")
    time.sleep(6)

    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if not execs:
        print("No execution found.")
        return

    latest = execs[0]
    exec_id = latest['id']
    status = latest['status']
    print(f"Latest Execution ID: {exec_id}, Status: {status}")

    det = requests.get(f'https://n8n.generazionedance.it/api/v1/executions/{exec_id}?includeData=true', headers=HEADERS, verify=False).json()
    run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
    print("Executed Nodes:", list(run_data.keys()))

    if 'Call Groq API' in run_data:
        groq_node = run_data['Call Groq API'][0]['data']['main'][0][0]['json']
        print("Call Groq API Status Code:", groq_node.get('statusCode', 200))
        if 'body' in groq_node and 'choices' in groq_node['body']:
            print("Groq AI Output Snippet:", groq_node['body']['choices'][0]['message']['content'][:250])
    
    if 'Telegram Weekly Report' in run_data:
        print("Telegram Weekly Report: SUCCESS!")

    if 'Email Weekly Report' in run_data:
        print("Email Weekly Report: SUCCESS!")

if __name__ == '__main__':
    main()
