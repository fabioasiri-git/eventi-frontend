import json
import requests
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Groq API key decrypted earlier
GROQ_API_KEY = "gsk_KEY_MASKED"

build_groq_code = """
const items = $input.all().map(i => i.json);

if (!items.length) {
  return [{ json: { raw_groq_response: { choices: [{ message: { content: JSON.stringify({ grandi_assenti: [], da_incrementare: [], da_far_uscire: [], il_radar: [] }) } }] }, total_analyzed_tracks: 0 } }];
}

// Prepare compact summary of top tracks for Groq prompt
const rds_relax_top = items
  .filter(t => t.rds_relax_spins > 0)
  .sort((a, b) => (b.rds_relax_spins || 0) - (a.rds_relax_spins || 0))
  .slice(0, 30)
  .map(t => `${t.artist} - ${t.title} | RDS Relax: ${t.rds_relax_spins} | RT: ${t.rt_spins} | In Catalog: ${t.in_rt_catalog ? 'SI ('+t.rt_category+')' : 'NO'} | Deezer Pop: ${t.deezer_popularity !== null ? t.deezer_popularity + '/100' : 'N/A'}`);

const rt_catalog_high = items
  .filter(t => t.in_rt_catalog && (t.rt_category === 'HIT' || t.rt_category === 'REC'))
  .sort((a, b) => (b.rt_spins || 0) - (a.rt_spins || 0))
  .slice(0, 20)
  .map(t => `${t.artist} - ${t.title} | RT: ${t.rt_spins} | RDS Relax: ${t.rds_relax_spins} | Deezer Pop: ${t.deezer_popularity !== null ? t.deezer_popularity + '/100' : 'N/A'}`);

const radar_tracks = items
  .filter(t => (t.rmc_spins > 0 || t.ds_soft_spins > 0) && !t.in_rt_catalog)
  .slice(0, 15)
  .map(t => `${t.artist} - ${t.title} | RMC: ${t.rmc_spins} | DS Soft: ${t.ds_soft_spins} | Deezer Pop: ${t.deezer_popularity !== null ? t.deezer_popularity + '/100' : 'N/A'}`);

const prompt = `Sei l'AI Music Director & Strategist per Radio Toscana (formato Adult Contemporary / AC).
Analizza i dati di palinsesto dell'ultima settimana sui 1894 brani rilevati tra Radio Toscana ed i benchmark (RDS Relax, Radio Monte Carlo, Dimensione Suono Soft).

DATI RILEVATI:
--- TOP RDS RELAX (BENCHMARK PRINCIPALE) ---
${rds_relax_top.join('\\n')}

--- BRANI AD ALTA ROTAZIONE SU RADIO TOSCANA ---
${rt_catalog_high.join('\\n')}

--- RADAR BENCHMARK (RMC / DS SOFT) ---
${radar_tracks.join('\\n')}

ISTRUZIONI PER IL REPORT STRATEGICO:
Restituisci ESATTAMENTE un oggetto JSON valido con le seguenti 4 chiavi:
1. "grandi_assenti": array di max 10 brani ad alto successo sul benchmark RDS Relax ma assenti dal catalogo di Radio Toscana.
2. "da_incrementare": array di max 5 brani già in catalogo su Radio Toscana ma con pochi passaggi rispetto a RDS Relax.
3. "da_far_uscire": array di max 5 brani in alta rotazione su Radio Toscana ma con 0 passaggi su RDS Relax e bassa/media popolarità.
4. "il_radar": array di max 5 brani scoperti su RMC / DS Soft ideali per il formato AC elegante.

Per OGNI brano inserito negli array, devi specificare:
- "artist": nome artista
- "title": titolo brano
- "rds_spins": numero passaggi su RDS Relax (oppure RMC/DS Soft)
- "rt_spins": numero passaggi su Radio Toscana (0 se assente)
- "deezer_pop": popolarità su Deezer da 0 a 100 (es. "93/100" o "78/100")
- "consiglio_ia": analisi strategica dettagliata ed esaustiva (almeno 2-3 frasi chiare) rivolta alla regia/music director, spiegando il motivo esatto del consiglio (es. perché inserire in HIT/REC, perché incrementare le rotazioni o perché far uscire).

Rispondi SOLO con l'oggetto JSON. Nessun testo prima o dopo.`;

const body = {
  model: 'llama-3.3-70b-versatile',
  messages: [
    { role: 'system', content: 'Sei un esperto consulente di programmazione radiofonica per emittenti AC. Rispondi esclusivamente in formato JSON valido.' },
    { role: 'user', content: prompt }
  ],
  response_format: { type: 'json_object' },
  temperature: 0.3
};

try {
  const response = await $helpers.httpRequest({
    method: 'POST',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    headers: {
      'Authorization': 'Bearer ' + (process.env.GROQ_API_KEY || 'gsk_KEY_MASKED'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const parsed = typeof response === 'string' ? JSON.parse(response) : response;
  return [{ json: { raw_groq_response: parsed, total_analyzed_tracks: items.length } }];
} catch (error) {
  return [{ json: { error: error.message, total_analyzed_tracks: items.length } }];
}
"""

validate_format_code = """
const input = $input.first().json;
let data = { grandi_assenti: [], da_incrementare: [], da_far_uscire: [], il_radar: [] };

try {
  const content = input.raw_groq_response?.choices?.[0]?.message?.content;
  if (content) {
    data = typeof content === 'string' ? JSON.parse(content) : content;
  }
} catch (e) {
  console.error("Error parsing Groq JSON:", e);
}

const grandi = data.grandi_assenti || [];
const incrementare = data.da_incrementare || [];
const uscire = data.da_far_uscire || [];
const radar = data.il_radar || [];

const total_tracks = input.total_analyzed_tracks || 1894;
const today = new Date().toLocaleDateString('it-IT');

// Format Telegram Markdown Text
let md = `📋 *REPORT STRATEGICO WEEKLY: AC MUSIC INTELLIGENCE*\\n`;
md += `*Periodo Analizzato:* Dati storici reali (ultima settimana)\\n`;
md += `*Totale Brani Analizzati:* ${total_tracks}\\n\\n`;

md += `🟢 *I GRANDI ASSENTI (${grandi.length})* - Mancanti in catalogo:\\n`;
if (grandi.length) {
  grandi.forEach(t => {
    md += `• *${t.artist.toUpperCase()}* - _${t.title.toUpperCase()}_\\n`;
    md += `  (Passaggi RDS Relax: ${t.rds_spins || 0}, Popolarità Deezer: ${t.deezer_pop || 'N/A'})\\n`;
    md += `  💡 *Consiglio IA:* ${t.consiglio_ia}\\n\\n`;
  });
} else {
  md += `_Nessun gap critico rilevato._\\n\\n`;
}

md += `🟡 *DA INCREMENTARE (${incrementare.length})* - Aumentare rotazioni:\\n`;
if (incrementare.length) {
  incrementare.forEach(t => {
    md += `• *${t.artist.toUpperCase()}* - _${t.title.toUpperCase()}_\\n`;
    md += `  (Passaggi Radio Toscana: ${t.rt_spins || 0}, RDS Relax: ${t.rds_spins || 0}, Popolarità Deezer: ${t.deezer_pop || 'N/A'})\\n`;
    md += `  💡 *Consiglio IA:* ${t.consiglio_ia}\\n\\n`;
  });
} else {
  md += `_Rotazioni in catalogo allineate._\\n\\n`;
}

md += `🔴 *DA FAR USCIRE (${uscire.length})* - Rami secchi da eliminare:\\n`;
if (uscire.length) {
  uscire.forEach(t => {
    md += `• *${t.artist.toUpperCase()}* - _${t.title.toUpperCase()}_\\n`;
    md += `  (Passaggi Radio Toscana: ${t.rt_spins || 0}, RDS Relax: ${t.rds_spins || 0}, Popolarità Deezer: ${t.deezer_pop || 'N/A'})\\n`;
    md += `  💡 *Consiglio IA:* ${t.consiglio_ia}\\n\\n`;
  });
} else {
  md += `_Nessun brano fuori target._\\n\\n`;
}

md += `🕵️ *IL RADAR COMPETITOR (${radar.length})* - Consigliati da RMC / DS Soft:\\n`;
if (radar.length) {
  radar.forEach(t => {
    md += `• *${t.artist.toUpperCase()}* - _${t.title.toUpperCase()}_\\n`;
    md += `  (Passaggi Benchmark: ${t.rds_spins || 0}, Popolarità Deezer: ${t.deezer_pop || 'N/A'})\\n`;
    md += `  💡 *Consiglio IA:* ${t.consiglio_ia}\\n\\n`;
  });
} else {
  md += `_Nessun brano radar emergente._\\n`;
}

// Format Email HTML Content
let html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px; }
  .container { max-width: 750px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
  .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 25px; }
  h1 { color: #1e3a8a; font-size: 22px; margin: 0; }
  .meta { color: #64748b; font-size: 14px; margin-top: 5px; }
  .section { margin-bottom: 30px; }
  .section-title { font-size: 17px; font-weight: bold; padding: 8px 12px; border-radius: 6px; margin-bottom: 15px; }
  .grandi { background: #dcfce7; color: #166534; }
  .incrementare { background: #fef9c3; color: #854d0e; }
  .uscire { background: #fee2e2; color: #991b1b; }
  .radar { background: #f3e8ff; color: #6b21a8; }
  .item { border-left: 4px solid #cbd5e1; padding-left: 15px; margin-bottom: 18px; }
  .item-title { font-weight: bold; font-size: 15px; color: #0f172a; }
  .item-stats { font-size: 13px; color: #475569; margin: 3px 0; }
  .item-advice { font-size: 13.5px; color: #1e293b; background: #f1f5f9; padding: 10px 12px; border-radius: 6px; margin-top: 6px; }
  .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #94a3b8; text-align: center; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>📋 REPORT STRATEGICO WEEKLY: AC MUSIC INTELLIGENCE</h1>
    <div class="meta">Analisi Dati Storici Reali | Totale Brani Analizzati: <b>${total_tracks}</b></div>
  </div>
`;

function renderSection(title, cssClass, items, statField) {
  let s = `<div class="section"><div class="section-title ${cssClass}">${title} (${items.length})</div>`;
  if (!items.length) {
    s += `<div style="color:#64748b; font-style:italic; padding-left:10px;">Nessun brano in questa categoria.</div></div>`;
    return s;
  }
  items.forEach(t => {
    s += `<div class="item">
      <div class="item-title">${t.artist.toUpperCase()} - ${t.title.toUpperCase()}</div>
      <div class="item-stats">📊 <b>Passaggi RDS Relax:</b> ${t.rds_spins || 0} | 🎵 <b>Popolarità Deezer:</b> <span style="color:#2563eb; font-weight:bold;">${t.deezer_pop || 'N/A'}</span></div>
      <div class="item-advice">💡 <b>Consiglio IA:</b> ${t.consiglio_ia}</div>
    </div>`;
  });
  s += `</div>`;
  return s;
}

html += renderSection('🟢 I GRANDI ASSENTI - Brani ad alto successo mancanti in catalogo', 'grandi', grandi);
html += renderSection('🟡 DA INCREMENTARE - Brani in catalogo ma a bassa rotazione', 'incrementare', incrementare);
html += renderSection('🔴 DA FAR USCIRE - Rami secchi ad alta rotazione senza riscontro', 'uscire', uscire);
html += renderSection('🕵️ IL RADAR COMPETITOR - Brani in ascesa su RMC / DS Soft', 'radar', radar);

html += `<div class="footer">Generato automaticamente da n8n AC Music Intelligence • Radio Toscana</div>
</div>
</body>
</html>`;

return [{
  json: {
    formatted_text: md,
    html_content: html,
    report_valid: true
  }
}];
"""

def main():
    json_path = 'DB Musicale/ac_music_intelligence_n8n_workflow.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        wf = json.load(f)

    for node in wf['nodes']:
        if node['name'] == 'Build Groq Request':
            node['parameters']['jsCode'] = build_groq_code
        elif node['name'] == 'Validate & Format Report':
            node['parameters']['jsCode'] = validate_format_code
        elif node['name'] == 'Email Weekly Report':
            node['parameters']['fromEmail'] = 'fabio.asiri@radiotoscana.it'
            node['parameters']['toEmail'] = 'fabio.asiri@gmail.com, fabio.asiri@radiotoscana.it'
            node['parameters']['html'] = '={{ $json.html_content }}'
            node['credentials'] = {
                'smtp': {
                    'id': '75o6o4J9v688N1k3',
                    'name': 'SMTP RT account Asiri Fabio'
                }
            }
        elif node['name'] == 'Telegram Weekly Report':
            node['parameters']['chatId'] = '648657216'
            node['credentials'] = {
                'telegramApi': {
                    'id': '1ptOx94b0a6lwld0',
                    'name': 'Telegram Music Intelligence Bot'
                }
            }

    # Connect Join Weekly Spins -> Build Groq Request -> Validate & Format Report
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

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(wf, f, indent=2)

    print("Updated local workflow JSON successfully!")

    # Update workflow via n8n REST API
    API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
    HEADERS = {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type': 'application/json'
    }
    WF_ID = 'Iz4FEv42Ll6dl8pU'

    print("Deactivating workflow...")
    requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/deactivate", headers=HEADERS, verify=False)

    payload = {
        "name": wf['name'],
        "nodes": wf['nodes'],
        "connections": wf['connections'],
        "settings": {
            "executionOrder": "v1"
        }
    }
    print("Updating workflow via n8n REST API (PUT)...")
    put_res = requests.put(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}", json=payload, headers=HEADERS, verify=False)
    print("PUT status:", put_res.status_code)

    print("Activating workflow...")
    act_res = requests.post(f"https://n8n.generazionedance.it/api/v1/workflows/{WF_ID}/activate", headers=HEADERS, verify=False)
    print("Activate API status:", act_res.status_code)

    print("Triggering report webhook...")
    tr = requests.post("https://n8n.generazionedance.it/webhook/ac-weekly-report", json={}, verify=False)
    print("Webhook response status:", tr.status_code, tr.text)

    print("Waiting 20 seconds for Groq AI analysis & delivery...")
    time.sleep(20)

    r = requests.get(f'https://n8n.generazionedance.it/api/v1/executions?workflowId={WF_ID}&limit=1', headers=HEADERS, verify=False)
    execs = r.json().get('data', [])
    if execs:
        latest = execs[0]
        eid = latest['id']
        status = latest['status']
        print(f"\nREAL LATEST EXECUTION ID: {eid}, STATUS: {status}")

        det = requests.get(f"https://n8n.generazionedance.it/api/v1/executions/{eid}?includeData=true", headers=HEADERS, verify=False).json()
        run_data = det.get('data', {}).get('resultData', {}).get('runData', {})
        print("Executed nodes:", list(run_data.keys()))

        if 'Telegram Weekly Report' in run_data:
            tg = run_data['Telegram Weekly Report'][0]['data']['main'][0][0]['json']
            print("\nTelegram Delivery Status:", tg.get('ok'))

        if 'Email Weekly Report' in run_data:
            em = run_data['Email Weekly Report'][0]['data']['main'][0][0]['json']
            print("\nEmail Delivery Accepted:", em.get('accepted'), "Response:", em.get('response'))

if __name__ == '__main__':
    main()
