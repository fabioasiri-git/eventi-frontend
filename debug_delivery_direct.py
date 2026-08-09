import subprocess
import requests
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Fetch Telegram bot token from n8n DB via Python SSH
remote_python = """
import sqlite3, base64, hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

ENCRYPTION_KEY = "4MkrsQpAOMqIPyCuks47NwIXSCvCDPNq"

def evp_bytes_to_key(password, salt, key_len=32, iv_len=16):
    d = b''
    d_i = b''
    while len(d) < key_len + iv_len:
        d_i = hashlib.md5(d_i + password.encode() + salt).digest()
        d += d_i
    return d[:key_len], d[key_len:key_len+iv_len]

def decrypt(enc_b64):
    data = base64.b64decode(enc_b64)
    salt = data[8:16]
    ct = data[16:]
    key, iv = evp_bytes_to_key(ENCRYPTION_KEY, salt)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(ct), AES.block_size).decode('utf-8')

conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("SELECT id, name, type, data FROM credentials_entity WHERE id IN ('1ptOx94b0a6lwld0', 'dYiylDMKpow6JbDi')")
rows = c.fetchall()

result = {}
for r in rows:
    try:
        dec = decrypt(r[3])
        result[r[0]] = json.loads(dec)
    except Exception as e:
        result[r[0]] = str(e)

print(json.dumps(result))
"""

with open('decrypt_creds_remote.py', 'w', encoding='utf-8') as f:
    f.write(remote_python)

subprocess.run(["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "decrypt_creds_remote.py", "ubuntu@92.4.175.70:/tmp/decrypt_creds_remote.py"], check=True)
res = subprocess.run(["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo python3 /tmp/decrypt_creds_remote.py"], capture_output=True, text=True)

print("Decrypted Credentials:", res.stdout)

creds = json.loads(res.stdout)

# Test Telegram Bot delivery directly
tg_cred = creds.get('1ptOx94b0a6lwld0', {})
bot_token = tg_cred.get('accessToken')
print(f"Telegram Bot Token found: {bot_token[:10]}...")

tg_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
tg_payload = {
    "chat_id": "648657216",
    "text": "🧪 *TEST DIRETTO TELEGRAM AGENT*\n\nQuesto è un messaggio di verfìca per la chat 648657216.",
    "parse_mode": "Markdown"
}
tg_res = requests.post(tg_url, json=tg_payload)
print("Telegram Direct Send Response:", tg_res.status_code, tg_res.text)

# Also test Telegram getUpdates to see recent chat IDs
tg_updates = requests.get(f"https://api.telegram.org/bot{bot_token}/getUpdates").json()
print("Telegram Bot getUpdates:", json.dumps(tg_updates, indent=2))

# Test SMTP Email delivery directly
smtp_cred = creds.get('dYiylDMKpow6JbDi', {})
print("SMTP Credential Details:", {k: v for k, v in smtp_cred.items() if k != 'password'})

host = smtp_cred.get('user', '').split('@')[-1] if 'user' in smtp_cred else 'smtp.radiotoscana.it'
port = int(smtp_cred.get('port', 587))
user = smtp_cred.get('user', 'fabio.asiri@radiotoscana.it')
password = smtp_cred.get('password')
smtp_host = smtp_cred.get('host', 'smtp.radiotoscana.it')

print(f"Connecting to SMTP {smtp_host}:{port} with user {user}...")

try:
    server = smtplib.SMTP(smtp_host, port, timeout=10)
    server.starttls()
    server.login(user, password)

    msg = MIMEMultipart()
    msg['From'] = user
    msg['To'] = "fabio.asiri@gmail.com, fabio.asiri@radiotoscana.it"
    msg['Subject'] = "TEST DIRETTO SMTP AC MUSIC INTELLIGENCE"
    msg.attach(MIMEText("<h2>Test Diretto SMTP Agent</h2><p>Se vedi questa mail il server SMTP funziona.</p>", 'html'))

    server.sendmail(user, ["fabio.asiri@gmail.com", "fabio.asiri@radiotoscana.it"], msg.as_string())
    server.quit()
    print("SMTP Direct Send SUCCESSFUL!")
except Exception as e:
    print("SMTP Direct Send ERROR:", e)
