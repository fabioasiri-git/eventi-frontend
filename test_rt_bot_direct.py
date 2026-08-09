import subprocess
import requests
import json
import base64
import hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import sys

sys.stdout.reconfigure(encoding='utf-8')

ENCRYPTION_KEY = "4MkrsQpAOMqIPyCuks47NwIXSCvCDPNq"

def evp_bytes_to_key(password, salt, key_len=32, iv_len=16):
    d = b''
    d_i = b''
    while len(d) < key_len + iv_len:
        d_i = hashlib.md5(d_i + password.encode() + salt).digest()
        d += d_i
    return d[:key_len], d[key_len:key_len+iv_len]

def decrypt_n8n(enc_b64):
    data = base64.b64decode(enc_b64)
    salt = data[8:16]
    ct = data[16:]
    key, iv = evp_bytes_to_key(ENCRYPTION_KEY, salt)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(ct), AES.block_size).decode('utf-8')

# Fetch enc data for 1ptOx94b0a6lwld0 from remote DB via SSH
ssh_cmd = [
    "ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70",
    "sudo sqlite3 /home/ubuntu/.n8n/database.sqlite 'SELECT data FROM credentials_entity WHERE id=\"1ptOx94b0a6lwld0\";'"
]

res = subprocess.run(ssh_cmd, capture_output=True, text=True)
enc_str = res.stdout.strip()
print("Encrypted data len:", len(enc_str))

dec_json = decrypt_n8n(enc_str)
cred = json.loads(dec_json)
token = cred.get('accessToken')
print(f"RT Music Intelligence Bot Token: {token[:12]}...")

# Send Telegram test message directly
tg_url = f"https://api.telegram.org/bot{token}/sendMessage"
payload = {
    "chat_id": "648657216",
    "text": "🎵 *TEST DIRETTO BOT RT MUSIC INTELLIGENCE*\n\nCiao Fabio! Questo è un test inviato direttamente dal bot RT Music Intelligence. Se vedi questo messaggio significa che la chat è attiva!",
    "parse_mode": "Markdown"
}

r = requests.post(tg_url, json=payload)
print("Telegram Send Response Status:", r.status_code)
print("Telegram Send Response Body:", json.dumps(r.json(), indent=2))
