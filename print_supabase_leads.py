import sys, requests, json, os
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv('e:/Lead Engine RT/DB Musicale/.env')

url = f"https://dunogeleekgqztkrlxsz.supabase.co/rest/v1/rt_lead_engine_pool?select=id,ragione_sociale,comune,settore,stato_workflow,campagna,created_at&order=created_at.desc"
headers = {
    'apikey': os.getenv('SUPABASE_KEY'),
    'Authorization': f"Bearer {os.getenv('SUPABASE_KEY')}"
}

res = requests.get(url, headers=headers)
rows = res.json()

print("=" * 70)
print(f"📊 REPORT DETTAGLIATO SUPABASE CLOUD ({len(rows)} RECORD TOTALI)")
print("=" * 70)

for r in rows:
    print(f"ID: {r.get('id')}")
    print(f"  🏢 Ditta / Ragione Sociale: {r.get('ragione_sociale')}")
    print(f"  📍 Comune: {r.get('comune')}")
    print(f"  📁 Settore: {r.get('settore')}")
    print(f"  🏷️ Campagna (Origine): {r.get('campagna')}")
    print(f"  ⚙️ Stato Workflow: {r.get('stato_workflow')}")
    print(f"  📅 Data Creazione: {r.get('created_at')}")
    print("-" * 70)
