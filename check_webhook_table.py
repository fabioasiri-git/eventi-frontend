import subprocess

ssh_cmd = [
    "ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70",
    "sudo python3 -c \"import sqlite3; conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite'); c = conn.cursor(); c.execute('SELECT * FROM webhook_entity WHERE workflowId=\\'Iz4FEv42Ll6dl8pU\\''); print(c.fetchall())\""
]

res = subprocess.run(ssh_cmd, capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
