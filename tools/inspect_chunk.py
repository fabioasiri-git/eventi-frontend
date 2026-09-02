import urllib.request

url = "https://radio-toscana-moster-engine.vercel.app/_next/static/chunks/app/page-54e3c7c0320ff0b5.js"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
text = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

print("Dimensione Chunk JS:", len(text))
print("Contiene Mastiscio:", "Mastiscio" in text)
print("Contiene Modern UX:", "Modern UX" in text)
print("Contiene v7.6.0:", "v7.6.0" in text)
print("Contiene Stampa / Salva in PDF:", "Stampa / Salva in PDF" in text)
