import subprocess
import json
import requests
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Fetch credentials list from remote n8n DB
ssh_cmd = [
    "ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70",
    "sudo sqlite3 /home/ubuntu/.n8n/database.sqlite 'SELECT id, name, type FROM credentials_entity WHERE type=\"smtp\";'"
]

res = subprocess.run(ssh_cmd, capture_output=True, text=True)
print("SMTP Credentials in DB:\n", res.stdout)

target_cred_id = None
for line in res.stdout.strip().split('\n'):
    if line:
        parts = line.split('|')
        cid, cname, ctype = parts[0], parts[1], parts[2]
        if "SMTP RT account Asiri Fabio" in cname or "Asiri" in cname:
            target_cred_id = cid
            print(f"FOUND MATCHING CREDENTIAL: ID={cid}, Name={cname}")
            break

if not target_cred_id:
    # Default to first SMTP if name matches closely
    first_line = res.stdout.strip().split('\n')[0]
    target_cred_id = first_line.split('|')[0]
    print(f"Fallback to credential ID: {target_cred_id}")

print(f"Using Credential ID: {target_cred_id} for Email node")

# 2. Update local workflow JSON
json_path = 'DB Musicale/ac_music_intelligence_n8n_workflow.json'
with open(json_path, 'r', encoding='utf-8') as f:
    wf = json.load(f)

for node in wf['nodes']:
    if node['name'] == 'Email Weekly Report':
        node['parameters']['fromEmail'] = 'fabio.asiri@radiotoscana.it'
        node['parameters']['toEmail'] = 'fabio.asiri@gmail.com, fabio.asiri@radiotoscana.it'
        node['credentials'] = {
            'smtp': {
                'id': target_cred_id,
                'name': 'SMTP RT account Asiri Fabio'
            }
        }
    elif node['name'] == 'Telegram Weekly Report':
        node['parameters']['chatId'] = '648657216'
        node['credentials'] = {
            'telegramApi': {
                'id': '1ptOx94b0a6lwld0',
                'name': 'Telegram Music Intelligence Bot'
            }
        }

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(wf, f, indent=2)

# Write temp nodes and connections
with open('nodes_temp.json', 'w', encoding='utf-8') as f:
    json.dump({'nodes': wf['nodes'], 'connections': wf['connections']}, f)

subprocess.run(["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "nodes_temp.json", "ubuntu@92.4.175.70:/tmp/nodes_temp.json"], check=True)

remote_update = """
import sqlite3, json
with open('/tmp/nodes_temp.json', 'r') as f:
    data = json.load(f)

nodes = json.dumps(data['nodes'])
connections = json.dumps(data['connections'])

conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("UPDATE workflow_entity SET nodes = ?, connections = ?, active = 1 WHERE id = 'Iz4FEv42Ll6dl8pU'", (nodes, connections))
conn.commit()
conn.close()
print('SQLite updated with target SMTP credential!')
"""

with open('update_db.py', 'w', encoding='utf-8') as f:
    f.write(remote_update)

subprocess.run(["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "update_db.py", "ubuntu@92.4.175.70:/tmp/update_db.py"], check=True)
subprocess.run(["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo python3 /tmp/update_db.py"], check=True)

# 3. Restart n8n container
print("Restarting n8n container...")
subprocess.run(["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo docker restart $(sudo docker ps -q --filter name=n8n)"], check=True)

print("Waiting 22 seconds for n8n to recover...")
time.sleep(22)

API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
HEADERS = {'X-N8N-API-KEY': API_KEY}
WF_ID = 'Iz4FEv42Ll6dl8pU'

act = requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/activate", headers=HEADERS, verify=False)
print("Activate API status:", act.status_code)

print("Triggering report webhook...")
tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
print("Webhook response:", tr.status_code, tr.text)

print("Waiting 15 seconds for Groq AI & Email execution...")
time.sleep(15)

r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
execs = r.json().get('data', [])
if execs:
    latest = execs[0]
    print(f"LATEST EXECUTION ID: {latest['id']}, STATUS: {latest['status']}")
    det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{latest['id']}?includeData=true", headers=HEADERS, verify=False).json()
    run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
    print("Executed nodes:", list(run_data.keys()))
    if 'Telegram Weekly Report' in run_data:
        print("Telegram Weekly Report SUCCESS:", run_data['Telegram Weekly Report'][0]['data']['main'][0][0]['json'].get('ok'))
    if 'Email Weekly Report' in run_data:
        print("Email Weekly Report Output:", run_data['Email Weekly Report'][0]['data']['main'][0][0]['json'])

if __name__ == '__main__':
    main()
