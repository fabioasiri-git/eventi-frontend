import subprocess

ssh_cmd = [
    "ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70",
    "sudo python3 -c \"import sqlite3, json; conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite'); c = conn.cursor(); c.execute('SELECT id, name, type, data FROM credentials_entity WHERE id IN (\\'rTeLNmNBidUvMaja\\', \\'EzD85y9zbtJRUi5d\\')'); print(c.fetchall())\""
]

res = subprocess.run(ssh_cmd, capture_output=True, text=True)
print("Decrypted creds info:")
print(res.stdout)
