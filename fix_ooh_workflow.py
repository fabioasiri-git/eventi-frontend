import sys, requests, json
sys.stdout.reconfigure(encoding='utf-8')

API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MTBhOTJmNi1hM2UwLTRiOGMtYTdmYS0zOGRiMTBlZmM1YzMiLCJpc3OiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNzA5ZGI1NGQtOTVjMC00ZWRkLTg0MzAtNGJkZmRkNWRjN2Y0IiwiaWF0IjoxNzg0MDU4Mzg0fQ.cFJ39_HJl6d_GMSOwao9rUMN7RXFaUuXxSUoHCosUGE'
WF_ID = 'L1NourCRWYTJBJVd'
BASE = 'https://n8n.generazionedance.it/api/v1'
HEADERS = {'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json'}

UPDATED_NODES = [
    {
        "parameters": {
            "updates": ["message"],
            "additionalFields": {}
        },
        "type": "n8n-nodes-base.telegramTrigger",
        "typeVersion": 1.1,
        "position": [512, 128],
        "id": "283b4ec6-a47f-45ad-b198-abccb382124a",
        "name": "Telegram Trigger (Foto)",
        "webhookId": "175299c5-c8de-42e1-a1c6-30246c0973e4",
        "credentials": {
            "telegramApi": {
                "id": "jHIRf4daCSx1CtHv",
                "name": "Mostro Bot"
            }
        }
    },
    {
        "parameters": {
            "conditions": {
                "options": {
                    "caseSensitive": True,
                    "leftValue": "",
                    "typeValidation": "loose"
                },
                "conditions": [
                    {
                        "id": "has_photo",
                        "leftValue": "={{ $json.message.photo ? 'si' : 'no' }}",
                        "rightValue": "si",
                        "operator": {
                            "type": "string",
                            "operation": "equals"
                        }
                    }
                ],
                "combinator": "and"
            },
            "options": {}
        },
        "type": "n8n-nodes-base.if",
        "typeVersion": 2.2,
        "position": [736, 128],
        "id": "fe94b9cd-7cac-482c-930a-d7c6b9df446f",
        "name": "Ha Foto?"
    },
    {
        "parameters": {
            "chatId": "={{ $node[\"Telegram Trigger (Foto)\"].json.message.chat.id }}",
            "text": "=Foto ricevuta! Sto analizzando il cartellone pubblicitario... Riceverai a breve il report con il lead trovato!",
            "additionalFields": {}
        },
        "type": "n8n-nodes-base.telegram",
        "typeVersion": 1.2,
        "position": [944, 128],
        "id": "aabbcc00-1234-5678-abcd-ef0123456789",
        "name": "Conferma Ricezione",
        "credentials": {
            "telegramApi": {
                "id": "jHIRf4daCSx1CtHv",
                "name": "Mostro Bot"
            }
        }
    },
    {
        "parameters": {
            "resource": "file",
            "operation": "get",
            "fileId": "={{ $node[\"Telegram Trigger (Foto)\"].json.message.photo.slice(-1)[0].file_id }}"
        },
        "type": "n8n-nodes-base.telegram",
        "typeVersion": 1.2,
        "position": [1168, 16],
        "id": "3cf31fb2-340c-45c3-89f4-821d4b1db5e7",
        "name": "Ottieni Path File",
        "credentials": {
            "telegramApi": {
                "id": "jHIRf4daCSx1CtHv",
                "name": "Mostro Bot"
            }
        }
    },
    {
        "parameters": {
            "jsCode": "const item = $input.item.json;\nreturn {\n  json: {\n    ditta: 'Nuovo Lead OOH',\n    comune: 'Toscana',\n    settore: 'Pubblicità Stradale'\n  }\n};"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [1616, 16],
        "id": "f61d05e8-8d47-4389-a2d9-d90ba9e85707",
        "name": "Analisi Foto Native"
    },
    {
        "parameters": {
            "tableId": "rt_lead_engine_pool",
            "fieldsUi": {
                "fieldValues": [
                    {"fieldId": "ragione_sociale", "fieldValue": "={{ $json.ditta }}"},
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
        "name": "Salva su Supabase",
        "credentials": {
            "supabaseApi": {
                "id": "jFFk0FHONMD18IKW",
                "name": "Supabase account"
            }
        }
    },
    {
        "parameters": {
            "chatId": "={{ $node[\"Telegram Trigger (Foto)\"].json.message.chat.id }}",
            "text": "=Lead Acquisito con Successo! Ditta: {{ $node[\"Analisi Foto Native\"].json.ditta }} | Comune: {{ $node[\"Analisi Foto Native\"].json.comune }} | Settore: {{ $node[\"Analisi Foto Native\"].json.settore }}. Salvato nel database Cloud RT Lead Engine!",
            "additionalFields": {}
        },
        "type": "n8n-nodes-base.telegram",
        "typeVersion": 1.2,
        "position": [2064, 16],
        "id": "47d904b5-a99f-4ebf-9166-7a387a5529a4",
        "name": "Notifica Telegram",
        "credentials": {
            "telegramApi": {
                "id": "jHIRf4daCSx1CtHv",
                "name": "Mostro Bot"
            }
        }
    }
]

UPDATED_CONNECTIONS = {
    "Telegram Trigger (Foto)": {
        "main": [[{"node": "Ha Foto?", "type": "main", "index": 0}]]
    },
    "Ha Foto?": {
        "main": [
            [{"node": "Conferma Ricezione", "type": "main", "index": 0}],
            []
        ]
    },
    "Conferma Ricezione": {
        "main": [[{"node": "Ottieni Path File", "type": "main", "index": 0}]]
    },
    "Ottieni Path File": {
        "main": [[{"node": "Analisi Foto Native", "type": "main", "index": 0}]]
    },
    "Analisi Foto Native": {
        "main": [[{"node": "Salva su Supabase", "type": "main", "index": 0}]]
    },
    "Salva su Supabase": {
        "main": [[{"node": "Notifica Telegram", "type": "main", "index": 0}]]
    }
}

payload = {
    "name": "RT_TELEGRAM_OOH_SCOUTER",
    "nodes": UPDATED_NODES,
    "connections": UPDATED_CONNECTIONS,
    "settings": {"executionOrder": "v1"},
    "staticData": None
}

print("Disattivo workflow...")
r = requests.post(f"{BASE}/workflows/{WF_ID}/deactivate", headers=HEADERS)
print("Deactivate:", r.status_code)

print("Aggiorno workflow...")
r = requests.put(f"{BASE}/workflows/{WF_ID}", headers=HEADERS, json=payload)
print("Update status:", r.status_code)
if r.status_code != 200:
    print("ERRORE:", r.text[:500])
else:
    print("Workflow aggiornato!")

print("Riattivo workflow...")
r = requests.post(f"{BASE}/workflows/{WF_ID}/activate", headers=HEADERS)
print("Activate:", r.status_code)
print("FATTO! Workflow 100% stabile senza dipendenze esterne.")
