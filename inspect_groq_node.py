import subprocess

ssh_cmd = [
    "ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70",
    "sudo python3 -c \"import sqlite3, json; conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite'); c = conn.cursor(); c.execute('SELECT nodes FROM workflow_entity WHERE id=\\'Iz4FEv42Ll6dl8pU\\''); nodes = json.loads(c.fetchone()[0]); groq = [n for n in nodes if n['name'] == 'Call Groq API'][0]; print(json.dumps(groq, indent=2))\""
]

res = subprocess.run(ssh_cmd, capture_output=True, text=True)
print("Call Groq API node in DB:")
print(res.stdout)
