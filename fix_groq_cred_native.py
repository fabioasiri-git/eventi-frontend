import json
import subprocess
import time
import requests

def main():
    json_path = 'DB Musicale/ac_music_intelligence_n8n_workflow.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        wf = json.load(f)

    for node in wf['nodes']:
        if node['name'] == 'Call Groq API':
            node['parameters']['authentication'] = 'predefinedCredentialType'
            node['parameters']['nodeCredentialType'] = 'groqApi'
            # Remove custom headerParameters as groqApi handles it automatically
            if 'sendHeaders' in node['parameters']:
                del node['parameters']['sendHeaders']
            if 'specifyHeaders' in node['parameters']:
                del node['parameters']['specifyHeaders']
            if 'headerParameters' in node['parameters']:
                del node['parameters']['headerParameters']
            node['credentials'] = {
                'groqApi': {
                    'id': 'rTeLNmNBidUvMaja',
                    'name': 'Groq account 2'
                }
            }

    # Save local json
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(wf, f, indent=2)
    print(f"Updated local file {json_path}")

    # Write nodes to temporary file for SCP
    with open('nodes_temp.json', 'w', encoding='utf-8') as f:
        json.dump(wf['nodes'], f)

    scp_cmd = ["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "nodes_temp.json", "ubuntu@92.4.175.70:/tmp/nodes_temp.json"]
    subprocess.run(scp_cmd, check=True)

    remote_python_script = """
import sqlite3, json
with open('/tmp/nodes_temp.json', 'r') as f:
    nodes = f.read()
conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("UPDATE workflow_entity SET nodes = ? WHERE id = 'Iz4FEv42Ll6dl8pU'", (nodes,))
conn.commit()
conn.close()
print('SQLite updated with native groqApi credential!')
"""
    with open('update_db.py', 'w', encoding='utf-8') as f:
        f.write(remote_python_script)

    scp_script = ["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "update_db.py", "ubuntu@92.4.175.70:/tmp/update_db.py"]
    subprocess.run(scp_script, check=True)

    ssh_run = ["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo python3 /tmp/update_db.py"]
    subprocess.run(ssh_run, check=True)

    # Restart n8n container
    print("Restarting n8n container...")
    ssh_restart = ["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo docker restart $(sudo docker ps -q --filter name=n8n)"]
    subprocess.run(ssh_restart, check=True)

    print("Waiting 15 seconds for n8n to recover...")
    time.sleep(15)

    # Activate workflow via REST API
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    WF_ID = 'Iz4FEv42Ll6dl8pU'
    requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/activate", headers=HEADERS, verify=False)
    print("Workflow activated via REST API.")

    # Trigger report webhook
    print("Triggering report webhook...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
    print("Webhook response:", tr.status_code, tr.text)

    time.sleep(6)
    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if execs:
        latest = execs[0]
        print(f"Latest Execution ID: {latest['id']}, Status: {latest['status']}")
        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{latest['id']}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed nodes:", list(run_data.keys()))
        if 'Call Groq API' in run_data:
            out = run_data['Call Groq API'][0]['data']['main'][0][0]['json']
            print("Call Groq API Status Code:", out.get('statusCode', 200))
            if 'choices' in out.get('body', {}):
                print("Groq Response preview:", out['body']['choices'][0]['message']['content'][:300])

if __name__ == '__main__':
    main()
