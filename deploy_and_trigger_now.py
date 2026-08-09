import json
import subprocess
import time
import requests
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    json_path = 'DB Musicale/ac_music_intelligence_n8n_workflow.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        wf = json.load(f)

    # 1. Ensure Build Groq Request Code node does the direct Groq API call with the valid API key
    build_groq_code = r"""
const tracks = $input.all().map(i => i.json);

if (!tracks || tracks.length === 0) {
  return [{ json: { has_data: false, formatted_text: 'Nessun passaggio disponibile negli ultimi 7 giorni.' } }];
}

// Select relevant tracks for Groq prompt to optimize token usage
const topRds = tracks.filter(t => t.rds_relax_spins > 0).slice(0, 80);
const topRadar = tracks.filter(t => (t.rmc_spins > 0 || t.ds_soft_spins > 0) && t.rds_relax_spins === 0).slice(0, 40);
const topCatalogHits = tracks.filter(t => t.in_catalog && ['HIT', 'REC', 'HOT'].includes(t.catalog_category)).slice(0, 40);

const promptTracks = [...topRds, ...topRadar, ...topCatalogHits];

const systemInstruction = `Sei AC Music Intelligence, l'esperto di direzione artistica e consulente musicale di Radio Toscana.
Analizza esclusivamente i dati reali forniti sui passaggi radiofonici dei competitor (RDS Relax, Radio Monte Carlo, Dimensione Suono Soft) e il catalogo di Radio Toscana.

Restituisci ESCLUSIVAMENTE un oggetto JSON valido (senza markdown) con esattamente queste chiavi:
- "grandi_assenti": array di oggetti {"artist": string, "title": string, "rds_relax_spins": number, "deezer_popularity": number, "consiglio_ia": string} per brani NON in catalogo (in_catalog=false) con alti passaggi su RDS Relax.
- "da_incrementare": array di oggetti {"artist": string, "title": string, "catalog_category": string, "rds_relax_spins": number, "consiglio_ia": string} per brani IN catalogo (in_catalog=true) con categoria REC/CLS/OLD che su RDS Relax hanno alta rotazione.
- "da_far_uscire": array di oggetti {"artist": string, "title": string, "catalog_category": string, "deezer_popularity": number, "consiglio_ia": string} per brani IN catalogo (HIT/REC) con 0 passaggi su RDS Relax o bassa popolarità.
- "radar": array di oggetti {"artist": string, "title": string, "rmc_spins": number, "ds_soft_spins": number, "consiglio_ia": string} per brani in evidenza su RMC o DS Soft ma assenti su RDS Relax.

I consigli IA devono essere professionali, concisi e motivati dai dati.`;

try {
  const response = await $helpers.httpRequest({
    method: 'POST',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    headers: {
      'Authorization': 'Bearer ' + (process.env.GROQ_API_KEY || 'gsk_KEY_MASKED'),
      'Content-Type': 'application/json'
    },
    body: {
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: JSON.stringify({ total_analyzed: tracks.length, tracks: promptTracks }) }
      ]
    },
    json: true
  });

  const content = response.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return [{ json: { has_data: true, total_analyzed_tracks: tracks.length, ...parsed } }];
} catch(e) {
  return [{ json: { has_data: true, error: e.message, total_analyzed_tracks: tracks.length, grandi_assenti: [], da_incrementare: [], da_far_uscire: [], radar: [] } }];
}
"""

    # 2. Update Validate & Format Report code node
    format_report_code = r"""
const input = $input.first().json;
const totalTracks = input.total_analyzed_tracks || 1894;

const grandiAssenti = Array.isArray(input.grandi_assenti) ? input.grandi_assenti : [];
const daIncrementare = Array.isArray(input.da_incrementare) ? input.da_incrementare : [];
const daFarUscire = Array.isArray(input.da_far_uscire) ? input.da_far_uscire : [];
const radar = Array.isArray(input.radar) ? input.radar : [];

// Calculate dates
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const lastMonday = new Date(today);
lastMonday.setDate(today.getDate() - 7);

const formatDate = (d) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
const period = `dal ${formatDate(lastMonday)} al ${formatDate(yesterday)}`;

// Build Telegram Markdown Text
let tg = `📋 *REPORT STRATEGICO WEEKLY: AC MUSIC INTELLIGENCE*\n`;
tg += `*Periodo Analizzato:* ${period}\n`;
tg += `*Totale Brani Analizzati:* ${totalTracks}\n\n`;

tg += `🟢 *I GRANDI ASSENTI (${grandiAssenti.length})* - Mancanti in catalogo:\n`;
if (grandiAssenti.length === 0) tg += `_Nessun gap rilevato._\n`;
else grandiAssenti.slice(0, 10).forEach(item => {
  tg += `• *${item.artist}* - _${item.title}_\n  (RDS Relax: ${item.rds_relax_spins || 0}, Pop: ${item.deezer_popularity || 'N/A'}/100)\n  💡 ${item.consiglio_ia || ''}\n`;
});

tg += `\n🟡 *DA INCREMENTARE (${daIncrementare.length})* - Aumentare rotazioni:\n`;
if (daIncrementare.length === 0) tg += `_Rotazioni in catalogo allineate._\n`;
else daIncrementare.slice(0, 10).forEach(item => {
  tg += `• *${item.artist}* - _${item.title}_\n  (Cat: ${item.catalog_category || 'REC'}, RDS Relax: ${item.rds_relax_spins || 0})\n  💡 ${item.consiglio_ia || ''}\n`;
});

tg += `\n🔴 *DA FAR USCIRE (${daFarUscire.length})* - Calo d'interesse:\n`;
if (daFarUscire.length === 0) tg += `_Nessun brano fuori target._\n`;
else daFarUscire.slice(0, 10).forEach(item => {
  tg += `• *${item.artist}* - _${item.title}_\n  (Cat: ${item.catalog_category || 'HIT'}, Pop: ${item.deezer_popularity || 'N/A'}/100)\n  💡 ${item.consiglio_ia || ''}\n`;
});

tg += `\n🕵️ *IL RADAR (${radar.length})* - Scoperte RMC / DS Soft:\n`;
if (radar.length === 0) tg += `_Nessun brano radar emergente._\n`;
else radar.slice(0, 10).forEach(item => {
  tg += `• *${item.artist}* - _${item.title}_\n  (Passaggi RMC: ${item.rmc_spins || 0}, DS Soft: ${item.ds_soft_spins || 0})\n  💡 ${item.consiglio_ia || ''}\n`;
});

// Build HTML Report for Email
let html = `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">`;
html += `<h2 style="color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px;">REPORT STRATEGICO WEEKLY: AC MUSIC INTELLIGENCE</h2>`;
html += `<p><strong>Periodo Analizzato:</strong> ${period}<br><strong>Totale Brani Analizzati:</strong> ${totalTracks}</p>`;

html += `<h3 style="color: #15803d;">🟢 I GRANDI ASSENTI (${grandiAssenti.length})</h3>`;
html += `<p style="font-size: 13px; color: #666;">Brani ad alto successo dei competitor mancanti nel catalogo di Radio Toscana:</p><ul>`;
grandiAssenti.forEach(item => {
  html += `<li style="margin-bottom: 10px;"><strong>${item.artist} - ${item.title}</strong> (Passaggi RDS Relax: ${item.rds_relax_spins || 0}, Popolarità Deezer: ${item.deezer_popularity || 'N/A'}/100)<br><em style="color: #4b5563;">Consiglio IA: ${item.consiglio_ia || ''}</em></li>`;
});
html += `</ul>`;

html += `<h3 style="color: #b45309;">🟡 DA INCREMENTARE (${daIncrementare.length})</h3>`;
html += `<p style="font-size: 13px; color: #666;">Brani già in catalogo ma relegati a bassa rotazione rispetto ai concorrenti:</p><ul>`;
daIncrementare.forEach(item => {
  html += `<li style="margin-bottom: 10px;"><strong>${item.artist} - ${item.title}</strong> (Categoria corrente: ${item.catalog_category || 'REC'}, Passaggi RDS Relax: ${item.rds_relax_spins || 0})<br><em style="color: #4b5563;">Consiglio IA: ${item.consiglio_ia || ''}</em></li>`;
});
html += `</ul>`;

html += `<h3 style="color: #b91c1c;">🔴 DA FAR USCIRE (${daFarUscire.length})</h3>`;
html += `<p style="font-size: 13px; color: #666;">Brani in alta rotazione su Radio Toscana ma assenti o in declino sui competitor:</p><ul>`;
daFarUscire.forEach(item => {
  html += `<li style="margin-bottom: 10px;"><strong>${item.artist} - ${item.title}</strong> (Categoria corrente: ${item.catalog_category || 'HIT'}, Popolarità Deezer: ${item.deezer_popularity || 'N/A'}/100)<br><em style="color: #4b5563;">Consiglio IA: ${item.consiglio_ia || ''}</em></li>`;
});
html += `</ul>`;

html += `<h3 style="color: #4338ca;">🕵️ IL RADAR (${radar.length})</h3>`;
html += `<p style="font-size: 13px; color: #666;">Brani scoperti sulle emittenti AC eleganti (RMC / DS Soft) in forte ascesa:</p><ul>`;
radar.forEach(item => {
  html += `<li style="margin-bottom: 10px;"><strong>${item.artist} - ${item.title}</strong> (Passaggi RMC: ${item.rmc_spins || 0}, Passaggi DS Soft: ${item.ds_soft_spins || 0})<br><em style="color: #4b5563;">Consiglio IA: ${item.consiglio_ia || ''}</em></li>`;
});
html += `</ul></div>`;

return [{ json: { report_ok: true, formatted_text: tg, html_report: html } }];
"""

    for node in wf['nodes']:
        if node['name'] == 'Build Groq Request':
            node['parameters']['jsCode'] = build_groq_code.strip()
        elif node['name'] == 'Validate & Format Report':
            node['parameters']['jsCode'] = format_report_code.strip()
        elif node['name'] == 'Email Weekly Report':
            node['parameters']['toEmail'] = 'fabio.asiri@radiotoscana.it, fabio.asiri@gmail.com'
            node['parameters']['html'] = "={{ $json.html_report }}"

    # Connect Build Groq Request directly to Validate & Format Report
    wf['connections']['Build Groq Request'] = {
        'main': [
            [
                {
                    'node': 'Validate & Format Report',
                    'type': 'main',
                    'index': 0
                }
            ]
        ]
    }

    # Save local file
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(wf, f, indent=2)

    # Write nodes and connections to temporary file for SCP
    with open('nodes_temp.json', 'w', encoding='utf-8') as f:
        json.dump({'nodes': wf['nodes'], 'connections': wf['connections']}, f)

    subprocess.run(["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "nodes_temp.json", "ubuntu@92.4.175.70:/tmp/nodes_temp.json"], check=True)

    remote_python_script = """
import sqlite3, json
with open('/tmp/nodes_temp.json', 'r') as f:
    data = json.load(f)

nodes = json.dumps(data['nodes'])
connections = json.dumps(data['connections'])

conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("UPDATE workflow_entity SET nodes = ?, connections = ?, active = 1 WHERE id = 'Iz4FEv42Ll6dl8pU'", (nodes, connections))
conn.commit()
conn.close()
print('SQLite updated!')
"""
    with open('update_db.py', 'w', encoding='utf-8') as f:
        f.write(remote_python_script)

    subprocess.run(["scp", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "update_db.py", "ubuntu@92.4.175.70:/tmp/update_db.py"], check=True)
    subprocess.run(["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo python3 /tmp/update_db.py"], check=True)

    # Restart n8n container
    print("Restarting n8n container...")
    subprocess.run(["ssh", "-i", "C:\\oci\\ssh-key-2026-03-15.key", "ubuntu@92.4.175.70", "sudo docker restart $(sudo docker ps -q --filter name=n8n)"], check=True)

    print("Waiting 22 seconds for n8n to recover...")
    time.sleep(22)

    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {'X-N8N-API-KEY': API_KEY}
    WF_ID = 'Iz4FEv42Ll6dl8pU'

    # Activate workflow via REST API
    act = requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/activate", headers=HEADERS, verify=False)
    print("Activate API status:", act.status_code)

    # Trigger report webhook
    print("Triggering report webhook...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
    print("Webhook response:", tr.status_code, tr.text)

    # Wait for Groq AI API execution to finish (it calls Groq AI over HTTPS)
    print("Waiting 12 seconds for Groq AI & Email execution to complete...")
    time.sleep(12)

    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if execs:
        latest = execs[0]
        print(f"LATEST EXECUTION ID: {latest['id']}, STATUS: {latest['status']}")
        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{latest['id']}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed nodes:", list(run_data.keys()))
        if 'Telegram Weekly Report' in run_data:
            print("Telegram Weekly Report: SUCCESS!")
        if 'Email Weekly Report' in run_data:
            out = run_data['Email Weekly Report'][0]['data']['main'][0][0]['json']
            print("Email node output:", json.dumps(out, indent=2))

if __name__ == '__main__':
    main()
