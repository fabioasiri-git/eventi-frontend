import sys, base64
sys.stdout.reconfigure(encoding='utf-8')

# n8n usa CryptoJS (AES OpenSSL compatible) per cifrare le credenziali
# Formato: "Salted__" + 8 byte salt + encrypted data
# Chiave derivata con EVP_BytesToKey (MD5, 1 iterazione)

from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import hashlib

ENCRYPTION_KEY = "4MkrsQpAOMqIPyCuks47NwIXSCvCDPNq"

def evp_bytes_to_key(password, salt, key_len=32, iv_len=16):
    d = b''
    d_i = b''
    while len(d) < key_len + iv_len:
        d_i = hashlib.md5(d_i + password.encode() + salt).digest()
        d += d_i
    return d[:key_len], d[key_len:key_len+iv_len]

def decrypt_n8n_cred(encrypted_b64):
    data = base64.b64decode(encrypted_b64)
    assert data[:8] == b'Salted__', "Header Salted__ mancante"
    salt = data[8:16]
    ct = data[16:]
    key, iv = evp_bytes_to_key(ENCRYPTION_KEY, salt)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    plain = unpad(cipher.decrypt(ct), AES.block_size)
    return plain.decode('utf-8')

# Groq account (RHv8gdpz4GjDheZq)
enc1 = "U2FsdGVkX19jBWoGDtCxwv1+oN2fGJGA8lIrgpJ2a/kaAw6iTA+ELAaESAzFR/Bs"
# Groq account 2 (rTeLNmNBidUvMaja)
enc2 = "U2FsdGVkX1+HPmiNzHdoRTrkNGw4eoDFORnekswudcKjTmL+TSkCmixn1p8OpnvmQEWyoKRUIxJSyYoqe85B0UHvi+IkkyLtYJop/lcJf6J8ymZCeIGmVJ2dbJla1DaK"

try:
    print("=== Groq account ===")
    print(decrypt_n8n_cred(enc1))
except Exception as e:
    print(f"Errore: {e}")

try:
    print("\n=== Groq account 2 ===")
    print(decrypt_n8n_cred(enc2))
except Exception as e:
    print(f"Errore: {e}")
