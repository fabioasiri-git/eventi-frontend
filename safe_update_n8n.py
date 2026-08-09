import sys, requests, json
sys.stdout.reconfigure(encoding='utf-8')

API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
WF_ID = 'L1NourCRWYTJBJVd'
BASE = 'https://n8n.generazionedance.it/api/v1'
HEADERS = {'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json'}

# 1. Scarica il workflow valido dal server
r = requests.get(f"{BASE}/workflows/{WF_ID}", headers=HEADERS)
wf = r.json()

# 2. Sostituisci il nodo dell'IA (Groq vision con credenziale non valida) con un nodo Code nativo
new_nodes = []
for node in wf['nodes']:
    if node['id'] == 'f61d05e8-8d47-4389-a2d9-d90ba9e85707':
        # Nodo Code con chiamata reale a Groq Vision
        groq_code = r"""
// ===== ANALISI REALE CON GROQ VISION =====
// Recupera l'immagine binaria scaricata dal nodo Telegram
const binaryKey = Object.keys($binary || {})[0];
if (!binaryKey) {
  throw new Error('Nessun dato binario trovato. Assicurati che il nodo Telegram abbia scaricato il file.');
}
const imgBase64 = $binary[binaryKey].data;
const mimeType = $binary[binaryKey].mimeType || 'image/jpeg';

// Chiama Groq Vision API
const response = await $helpers.httpRequest({
  method: 'POST',
  url: 'https://api.groq.com/openai/v1/chat/completions',
  headers: {
    'Authorization': 'Bearer ' + $env['GROQ_API_KEY'],
    'Content-Type': 'application/json'
  },
  body: {
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: { url: `data:${mimeType};base64,${imgBase64}` }
        },
        {
          type: 'text',
          text: 'Sei un assistente che analizza foto di cartelloni pubblicitari, insegne commerciali e locandine. Identifica TUTTE le aziende, attività commerciali, marchi o sponsor visibili nella foto. Per ciascuno restituisci un oggetto JSON. Rispondi ESCLUSIVAMENTE con un array JSON valido, senza markdown, senza spiegazioni, nel formato: [{"ditta": "nome azienda o attività", "comune": "città se leggibile altrimenti stringa vuota", "settore": "settore merceologico es. Automotive, Ristorazione, Abbigliamento, Servizi, ecc."}]'
        }
      ]
    }],
    max_tokens: 1024,
    temperature: 0.1
  },
  json: true
});

// Parsing risposta Groq
const content = response.choices[0].message.content.trim();
let aziende = [];
try {
  // Estrai solo il JSON array dalla risposta
  const match = content.match(/\[[\s\S]*\]/);
  if (match) {
    aziende = JSON.parse(match[0]);
  } else {
    throw new Error('JSON array non trovato nella risposta: ' + content.substring(0, 200));
  }
} catch(e) {
  throw new Error('Errore parsing risposta Groq: ' + e.message);
}

if (!aziende.length) {
  throw new Error('Nessuna azienda identificata nella foto');
}

return aziende.map(a => ({
  json: {
    ditta: a.ditta || 'Sconosciuta',
    comune: a.comune || '',
    settore: a.settore || 'Generico',
    stato_workflow: 'SCOPERTO',
    campagna: 'OOH_CATCH'
  }
}));
"""
        new_nodes.append({
            "parameters": {
                "jsCode": groq_code.strip()
            },
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [1616, 16],
            "id": "f61d05e8-8d47-4389-a2d9-d90ba9e85707",
            "name": "👁️ Analisi Foto Native"
        })
    elif node['id'] == 'dfbd9c07-5efb-4557-bab5-7d7a40c09ee5':
        # Salva su Supabase
        new_nodes.append({
            "parameters": {
                "tableId": "leads",
                "fieldsUi": {
                    "fieldValues": [
                        {"fieldId": "ditta", "fieldValue": "={{ $json.ditta }}"},
                        {"fieldId": "comune", "fieldValue": "={{ $json.comune }}"},
                        {"fieldId": "stato_workflow", "fieldValue": "SCOPERTO"},
                        {"fieldId": "campagna", "fieldValue": "OOH_CATCH"},
                        {"fieldId": "settore", "fieldValue": "={{ $json.settore }}"}
                    ]
                }
            },
            "type": "n8n-nodes-base.supabase",
            "typeVersion": 1,
            "position": [1840, 16],
            "id": "dfbd9c07-5efb-4557-bab5-7d7a40c09ee5",
            "name": "💾 Salva su Supabase",
            "credentials": {
                "supabaseApi": {
                    "id": "jFFk0FHONMD18IKW",
                    "name": "Supabase account"
                }
            }
        })
    elif node['id'] == 'aabbcc00-1234-5678-abcd-ef0123456789':
        # Conferma Ricezione
        new_nodes.append({
            "parameters": {
                "chatId": "={{ $node[\"📸 Telegram Trigger (Foto)\"].json.message.chat.id }}",
                "text": "=\n📸 Foto ricevuta!\n\nSto analizzando il messaggio pubblicitario...\n\nRiceverai a breve il report con il lead trovato! 🔍",
                "additionalFields": {}
            },
            "type": "n8n-nodes-base.telegram",
            "typeVersion": 1.2,
            "position": [944, 128],
            "id": "aabbcc00-1234-5678-abcd-ef0123456789",
            "name": "🔔 Conferma Ricezione",
            "credentials": {
                "telegramApi": {
                    "id": "jHIRf4daCSx1CtHv",
                    "name": "Mostro Bot"
                }
            }
        })
    elif node['id'] == '47d904b5-a99f-4ebf-9166-7a387a5529a4':
        # Notifica Telegram Multi-Azienda
        new_nodes.append({
            "parameters": {
                "chatId": "={{ $node[\"📸 Telegram Trigger (Foto)\"].json.message.chat.id }}",
                "text": "=🎯 Lead Multi-Azienda Acquisito!\n\n🏢 Ditta: {{ $json.ditta }}\n📍 Comune: {{ $json.comune }}\n📁 Settore: {{ $json.settore }}\n\n✅ Registrato nel CRM Supabase (Origine: OOH_CATCH)!",
                "additionalFields": {}
            },
            "type": "n8n-nodes-base.telegram",
            "typeVersion": 1.2,
            "position": [2064, 16],
            "id": "47d904b5-a99f-4ebf-9166-7a387a5529a4",
            "name": "💬 Notifica Telegram",
            "credentials": {
                "telegramApi": {
                    "id": "Fau7BXnPilezCPxv",
                    "name": "Telegram account"
                }
            }
        })
    else:
        new_nodes.append(node)

# Aggiorna le connessioni saltando Scarica File
new_connections = {
    "📸 Telegram Trigger (Foto)": {
        "main": [[{"node": "🖼️ Ha Foto?", "type": "main", "index": 0}]]
    },
    "🖼️ Ha Foto?": {
        "main": [
            [{"node": "🔔 Conferma Ricezione", "type": "main", "index": 0}],
            []
        ]
    },
    "🔔 Conferma Ricezione": {
        "main": [[{"node": "📡 Ottieni Path File", "type": "main", "index": 0}]]
    },
    "📡 Ottieni Path File": {
        "main": [[{"node": "👁️ Analisi Foto Native", "type": "main", "index": 0}]]
    },
    "👁️ Analisi Foto Native": {
        "main": [[{"node": "💾 Salva su Supabase", "type": "main", "index": 0}]]
    },
    "💾 Salva su Supabase": {
        "main": [[{"node": "💬 Notifica Telegram", "type": "main", "index": 0}]]
    }
}

payload = {
    "name": wf['name'],
    "nodes": new_nodes,
    "connections": new_connections,
    "settings": {"executionOrder": "v1"}
}

print("Disattivo...")
requests.post(f"{BASE}/workflows/{WF_ID}/deactivate", headers=HEADERS)

print("Aggiorno...")
resp = requests.put(f"{BASE}/workflows/{WF_ID}", headers=HEADERS, json=payload)
print("PUT STATUS:", resp.status_code)
if resp.status_code != 200:
    print("ERRORE:", resp.text)

print("Riattivo...")
requests.post(f"{BASE}/workflows/{WF_ID}/activate", headers=HEADERS)
print("COMPLETATO!")
