import subprocess, sys

cmd = "ssh -i C:\\oci\\ssh-key-2026-03-15.key ubuntu@92.4.175.70 \"sudo sqlite3 /home/ubuntu/.n8n/database.sqlite 'SELECT apiKey FROM user_api_keys ORDER BY id DESC LIMIT 1;'\""
res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
print("KEY:", res.stdout.strip())
