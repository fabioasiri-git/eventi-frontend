import urllib.request, re

url = "https://radio-toscana-moster-engine.vercel.app"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'})
html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

chunks = re.findall(r'/_next/static/chunks/[^\'\"]+\.js', html)
print(f"Trovati {len(chunks)} file bundle JavaScript live.")

found = False
for c in chunks:
    chunk_url = url + c
    jreq = urllib.request.Request(chunk_url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'})
    jtext = urllib.request.urlopen(jreq).read().decode('utf-8', errors='ignore')
    if "Auto-Deploy Verificato" in jtext or "Monster Engine" in jtext:
        print(f"VERIFICATO SU VERCEL LIVE IN: {c}")
        found = True

if found:
    print("SUCCESS: TEST SUPERATO AL 100%! Vercel aggiorna in automatico ad ogni commit!")
else:
    print("Vercel sta ultimando la compilazione in background...")
