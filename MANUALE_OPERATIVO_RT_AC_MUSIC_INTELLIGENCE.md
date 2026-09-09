# 📘 MANUALE OPERATIVO: MUSIC INTELLIGENCE (RADIO TOSCANA & RADIO FIRENZE)

**Progetti & Workflow Separati:**
1. **Radio Toscana (RT)** — Formato: **Adult Contemporary (AC)** | Workflow ID: `Iz4FEv42Ll6dl8pU` | Benchmark: **RDS Relax, RMC, Dimensione Suono Soft**
2. **Radio Firenze (RF)** — Formato: **Powerfull Station (Dance / Hit / Energy)** | Workflow ID: `7h7x6US8dj2yTC9l` | Benchmark: **DISCORADIO**

---

## 🎯 1. Due Emittenti Distinte con Due Generi Musicali Opposti (REGOLA ASSOLUTA)

È fondamentale non confondere MAI la linea editoriale delle due emittenti:

| Parametro | 📻 RADIO TOSCANA (RT) | ⚡ RADIO FIRENZE (RF — 95.4 FM) |
| :--- | :--- | :--- |
| **Identità** | Rete Regionale d'Autore | "La Powerfull Station" |
| **Formato Musicale** | **Adult Contemporary (AC)** | **Hit Station / Dance, Pop-Dance, Rhythmic** |
| **BPM & Sound** | Melodico, morbido, rilassato, cantautorale | **Alta energia, cassa in 4, drop potenti, uptempo** |
| **Orizzonte Brani** | Grandi classici italiani (80-90) + Pop soft | **Dagli inizi del 2000 ad oggi (Superhit + Club)** |
| **Target Primario** | 25-54 anni (famiglie, ascolto in casa/ufficio) | 15-44 anni (giovani, chi guida in città, studenti) |
| **Benchmark Esclusivo** | **RDS Relax** (primario), RMC, DS Soft | **DISCORADIO** (esclusivo) |
| **Vietati in Onda** | Hard rock, trap pesante, techno dura | **Ballad lente, acustiche, brani noiosi o lounge** |
| **Tabella Database** | `catalogo_toscana` | `catalogo_firenze` |

---

---

## 🛠️ 2. Architettura & Dettagli Tecnici

### A. Database & Query SQL (Supabase PostgreSQL)
* **Host:** `aws-0-eu-west-1.pooler.supabase.com:6543`
* **Database:** `postgres`
* **Tabella Passaggi:** `storici_passaggi` (contiene i passaggi RDS Relax, RMC, DS Soft e Radio Toscana).
* **Tabella Popolarità:** `deezer_tracks` (contiene la colonna `popularity` da 0 a 100).
* **Nodo n8n:** `Join Weekly Spins` unisce i dati di rotazione degli ultimi 7 giorni con il punteggio Deezer.

### B. Integrazione Groq AI
* **Endpoint API:** `https://api.groq.com/openai/v1/chat/completions`
* **Modello:** `llama-3.3-70b-versatile`
* **API Key (attiva e verificata):** `gsk_KEY_MASKED`
* **Nodo n8n:** `Call Groq API` (nodo `n8n-nodes-base.httpRequest` con header `Authorization: Bearer gsk_...`).

### C. Canali di Invio (Modalità Test)
* **Email SMTP**:
  * **Credenziale n8n:** `SMTP RT account Asiri Fabio` (ID `75o6o4J9v688N1k3`) su `smtps.aruba.it:465` SSL.
  * **Destinatari Test (TASSATIVO):** `fabio.asiri@radiotoscana.it, fabio.asiri@gmail.com` *(NON inviare a Doria, Masti o Quercioli in modalità test)*.
* **Telegram Bot**:
  * **Bot Ufficiale del Workflow:** **`RT Music Intelligence`** (`@RT_Musicintelligence_bot`, ID Credenziale `1ptOx94b0a6lwld0`).
  * **Chat ID Destinatario:** `648657216` (Chat privata Fabio Asiri).

---

## 📋 3. Struttura Richiesta per il Report

Ogni elemento generato dall'IA deve seguire **tassativamente** questo formato (sia in HTML che in Telegram):

```text
📋 REPORT STRATEGICO WEEKLY: AC MUSIC INTELLIGENCE
📅 Periodo Analizzato: dal DD/MM/YYYY al DD/MM/YYYY
📊 Totale Brani Analizzati: 1894

🟢 I GRANDI ASSENTI (10) - Mancanti in catalogo:
• ARTISTA - TITOLO BRANO
  (Passaggi RDS Relax: X, Popolarità Deezer: Y/100)
  💡 Consiglio IA: [Analisi approfondita ed esaustiva dell'IA in 2-3 frasi con consigli pratici per la regia/music director].
```

---

## 🔍 4. Checklist & Anomalie da Risolvere per la Prossima Sessione

1. **Fix Parsing Markdown Telegram**:
   * *Problema:* Telegram API restituisce un errore HTTP 400 se la stringa Markdown generata da Groq contiene caratteri speciali non sfuggiti (es. `_`, `*`, `[`).
   * *Soluzione:* Cambiare la modalità del nodo Telegram da Markdown ad **`HTML`** (convertendo `*` in `<b>` e `_` in `<i>`) oppure applicare una funzione di sanitize sul testo Markdown.

2. **Verifica Recapitazione Email Aruba**:
   * *Stato:* Il server SMTP Aruba risponde `250 2.0.0 Ok: queued`, ma occorre verificare l'effettivo arrivo nella casella `fabio.asiri@gmail.com` / `fabio.asiri@radiotoscana.it` (controllare eventuali filtri antispam o ritardi del server Aruba).

3. **Inizio Invio Automatico (Produzione)**:
   * Una volta validato il test live con Fabio, riattivare il nodo `Schedule Weekly Report (Monday 09:00)` e reinserire i destinatari di produzione (`doria@radiotoscana.it`, `masti@radiotoscana.it`, `quercioli.giulia@gmail.com`).

---

## 🚀 5. Come Riprendere il Lavoro con Antigravity

Per la prossima sessione con l'Agente Antigravity in radio, digita oppure fornisci queste istruzioni all'agente:

> *"Riprendiamo il lavoro sul workflow **RT AC Music Intelligence & Benchmark** (ID: `Iz4FEv42Ll6dl8pU`). Leggi prima il manuale operativo `MANUALE_OPERATIVO_RT_AC_MUSIC_INTELLIGENCE.md`. Dobbiamo verificare la formattazione HTML per Telegram ed assicurarci che l'invio della mail e del bot contenga la settimana di riferimento dinamica ed i consigli IA sui 1894 brani."*

### Script Utili pronti nel workspace:
* **Deploy & Trigger Live:** `python e:\Lead Engine RT\apply_date_range_fix_and_trigger.py`
* **Ispezione Esecuzioni REST API:** `python e:\Lead Engine RT\inspect_latest_rest.py`
