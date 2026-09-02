import urllib.request, re

url = "https://radio-toscana-moster-engine.vercel.app/?t=" + str(int(import_time := __import__('time').time()))
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache, no-store, must-revalidate'})
html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

scripts = re.findall(r'src="(/_next/static/chunks/[^"]+)"', html)
print(f"Trovati {len(scripts)} script nel live HTML HTML Vercel:")
for s in scripts:
    print("  ", s)
    s_url = "https://radio-toscana-moster-engine.vercel.app" + s
    stext = urllib.request.urlopen(urllib.request.Request(s_url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8', errors='ignore')
    if "v7.6.0" in stext:
        print("  --> TROVATO v7.6.0 IN:", s)
    if "v7.4.0" in stext:
        print("  --> TROVATO v7.4.0 IN:", s)
    if "v7.3.0" in stext:
        print("  --> TROVATO v7.3.0 IN:", s)
