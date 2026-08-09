import json
import subprocess
import time
import requests

def main():
    json_path = 'DB Musicale/ac_music_intelligence_n8n_workflow.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        wf = json.load(f)

    # 1. Update Groq Authorization Header
    fixed = False
    for node in wf['nodes']:
        if node['name'] == 'Call Groq API':
            params = node.get('parameters', {}).get('headerParameters', {}).get('parameters', [])
            for p in params:
                if p.get('name') == 'Authorization':
                    p['value'] = 'Bearer ' + (os.getenv('GROQ_API_KEY') or 'gsk_KEY_MASKED')
                    fixed = True

    print(f"Groq Header Fixed: {fixed}")

    # Save local json
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(wf, f, indent=2)
    print(f"Updated local file {json_path}")

    # Write nodes to temporary file for SCP
    with open('nodes_temp.json', 'w', encoding='utf-8') as f:
        json.dump(wf['nodes'], f)

    # 2. SCP nodes_temp.json to remote server
    scp_cmd = ["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "nodes_temp.json", "ubuntu@92.4.175.70:/tmp/nodes_temp.json"]
    print("Uploading nodes_temp.json to server...")
    subprocess.run(scp_cmd, check=True)

    # 3. Update SQLite database on server
    remote_python_script = """
import sqlite3, json
with open('/tmp/nodes_temp.json', 'r') as f:
    nodes = f.read()
conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("UPDATE workflow_entity SET nodes = ? WHERE id = 'Iz4FEv42Ll6dl8pU'", (nodes,))
conn.commit()
conn.close()
print('SQLite workflow_entity updated successfully!')
"""
    # Write python script to /tmp/update_db.py on remote server
    with open('update_db.py', 'w', encoding='utf-8') as f:
        f.write(remote_python_script)

    scp_script = ["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "update_db.py", "ubuntu@92.4.175.70:/tmp/update_db.py"]
    subprocess.run(scp_script, check=True)

    ssh_run = ["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo python3 /tmp/update_db.py"]
    print("Executing SQLite update on server...")
    res = subprocess.run(ssh_run, capture_output=True, text=True)
    print("SQLite Update Output:", res.stdout, res.stderr)

    # 4. Restart n8n on server
    print("Restarting n8n service/container on server...")
    ssh_restart = ["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo docker restart $(sudo docker ps -q) || sudo systemctl restart n8n"]
    res_restart = subprocess.run(ssh_restart, capture_output=True, text=True)
    print("Restart Output:", res_restart.stdout, res_restart.stderr)

    # Wait for n8n to start back up
    print("Waiting 8 seconds for n8n to recover...")
    time.sleep(8)

    # 5. Trigger Webhook Report
    print("Triggering Webhook Report...")
    try:
        tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, timeout=30, verify=False)
        print("Webhook response:", tr.status_code, tr.text)
    except Exception as e:
        print("Webhook error:", e)

    # Check execution result via n8n API
    time.sleep(4)
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    r = requests.get('https://n8n.generazionedance.it/api/v1/executions?workflowId=Iz4FEv42Ll6dl8pU&limit=1', headers=HEADERS, verify=False)
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
                print("Groq Response preview:", out['body']['choices'][0]['message']['content'][:200])

if __name__ == '__main__':
    main()
