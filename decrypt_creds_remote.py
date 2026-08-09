
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
