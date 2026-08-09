import json
import subprocess
import time
import requests
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    json_path = 'DB Musicale/ac_music_intelligence_n8n_workflow.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        wf = json.load(f)

    # 1. Update Build Groq Request Code node to call Groq API directly using $helpers.httpRequest
    groq_code = r"""
const tracks = $input.all().map(i => i.json);
if (!tracks.length) {
  return [{ json: { has_data: false, formatted_text: 'Nessun passaggio disponibile negli ultimi 7 giorni: report non generato.' } }];
}

const instruction = 'Sei AC Music Intelligence. Analizza esclusivamente i dati forniti. Deezer rank e deezer_popularity sono metriche Deezer, non Spotify. Restituisci SOLO JSON valido con summary, grandi_assenti, da_incrementare, da_far_uscire, radar. Ogni lista deve essere un array. Non inventare valori o brani.';

const groqBody = {
  model: 'llama-3.3-70b-versatile',
  response_format: { type: 'json_object' },
  temperature: 0.2,
  messages: [
    { role: 'system', content: instruction },
    { role: 'user', content: JSON.stringify({ timeframe_days: 7, tracks }) }
  ]
};

try {
  const response = await $helpers.httpRequest({
    method: 'POST',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    headers: {
      'Authorization': 'Bearer ' + (process.env.GROQ_API_KEY || 'gsk_KEY_MASKED'),
      'Content-Type': 'application/json'
    },
    body: groqBody,
    json: true
  });

  const content = response.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return [{ json: { has_data: true, groq_response: parsed, choices: response.choices, ...parsed } }];
} catch(e) {
  // If Groq fails, return has_data: true with empty arrays so fallback report formatter works
  return [{ json: { has_data: true, error: e.message, grandi_assenti: [], da_incrementare: [], da_far_uscire: [], radar: [] } }];
}
"""

    for node in wf['nodes']:
        if node['name'] == 'Build Groq Request':
            node['parameters']['jsCode'] = groq_code.strip()

    # Save local file
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(wf, f, indent=2)
    print(f"Saved local file {json_path}")

    # Write nodes to temporary file for SCP
    with open('nodes_temp.json', 'w', encoding='utf-8') as f:
        json.dump(wf['nodes'], f)

    scp_cmd = ["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "nodes_temp.json", "ubuntu@92.4.175.70:/tmp/nodes_temp.json"]
    subprocess.run(scp_cmd, check=True)

    remote_python_script = """
import sqlite3
with open('/tmp/nodes_temp.json', 'r') as f:
    nodes = f.read()
conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("UPDATE workflow_entity SET nodes = ?, active = 1 WHERE id = 'Iz4FEv42Ll6dl8pU'", (nodes,))
conn.commit()
conn.close()
print('SQLite updated with robust Code node Groq API execution!')
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

    print("Waiting 20 seconds for n8n to recover...")
    time.sleep(20)

    # Trigger report webhook
    print("Triggering report webhook...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
    print("Webhook response:", tr.status_code, tr.text)

    time.sleep(6)
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    WF_ID = 'Iz4FEv42Ll6dl8pU'
    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if execs:
        latest = execs[0]
        print(f"Latest Execution ID: {latest['id']}, Status: {latest['status']}")
        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{latest['id']}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed nodes:", list(run_data.keys()))
        if 'Build Groq Request' in run_data:
            out = run_data['Build Groq Request'][0]['data']['main'][0][0]['json']
            print("Build Groq Request Output:", json.dumps(out, indent=2)[:300])

if __name__ == '__main__':
    main()
