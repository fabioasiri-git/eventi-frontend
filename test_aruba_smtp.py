import subprocess
import json
import base64
import hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import smtplib
from email.mime.text import MIMEText
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

ssh_cmd = [
    "ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70",
    "sudo sqlite3 /home/ubuntu/.n8n/database.sqlite 'SELECT data FROM credentials_entity WHERE id=\"dYiylDMKpow6JbDi\";'"
]

res = subprocess.run(ssh_cmd, capture_output=True, text=True)
enc_str = res.stdout.strip()
cred = json.loads(decrypt_n8n(enc_str))

user = cred['user']
pwd = cred['password']
print("Testing smtps.aruba.it for user:", user)

# Test SSL 465
try:
    print("Connecting SSL port 465...")
    server = smtplib.SMTP_SSL('smtps.aruba.it', 465, timeout=10)
    server.login(user, pwd)
    msg = MIMEText("<h2>Test Mail via smtps.aruba.it:465</h2><p>Se vedi questa mail il server SMTP Aruba funziona!</p>", "html")
    msg['From'] = user
    msg['To'] = "fabio.asiri@gmail.com"
    msg['Subject'] = "TEST ARUBA SMTP SUCCESS SSL 465"
    server.sendmail(user, ["fabio.asiri@gmail.com"], msg.as_string())
    server.quit()
    print("SUCCESS SSL 465! Mail sent to fabio.asiri@gmail.com")
except Exception as e:
    print("SSL 465 Failed:", e)

# Test TLS 587
try:
    print("Connecting TLS port 587...")
    server = smtplib.SMTP('smtps.aruba.it', 587, timeout=10)
    server.starttls()
    server.login(user, pwd)
    msg = MIMEText("<h2>Test Mail via smtps.aruba.it:587</h2><p>Se vedi questa mail il server SMTP Aruba funziona!</p>", "html")
    msg['From'] = user
    msg['To'] = "fabio.asiri@gmail.com"
    msg['Subject'] = "TEST ARUBA SMTP SUCCESS TLS 587"
    server.sendmail(user, ["fabio.asiri@gmail.com"], msg.as_string())
    server.quit()
    print("SUCCESS TLS 587! Mail sent to fabio.asiri@gmail.com")
except Exception as e:
    print("TLS 587 Failed:", e)
