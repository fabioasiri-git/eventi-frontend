# 📘 MANUALE OPERATIVO & HANDOFF: RT AC MUSIC INTELLIGENCE

**Progetto:** Radio Toscana — AC Music Intelligence & Benchmark  
**Workflow n8n ID:** `Iz4FEv42Ll6dl8pU`  
**File di Configurazione Locale:** [ac_music_intelligence_n8n_workflow.json](file:///e:/Lead%20Engine%20RT/DB%20Musicale/ac_music_intelligence_n8n_workflow.json)  
**Data Ultimo Aggiornamento:** 29 Luglio 2026  

---

## 🎯 1. Obiettivo del Prodotto

Il sistema esegue un'analisi strategica settimanale automatizzata basata sui passaggi radiofonici storici reali (~1.894 brani negli ultimi 7 giorni) rilevati tra **Radio Toscana** e le emittenti di benchmark (**RDS Relax**, **Radio Monte Carlo**, **Dimensione Suono Soft**).

I dati vengono elaborati dall'IA tramite l'API di **Groq** (modello `llama-3.3-70b-versatile`), integrando i dati di popolarità globale di **Deezer** (`0-100`), per generare un **Report Strategico Weekly** suddiviso in 4 categorie:

1. 🟢 **I GRANDI ASSENTI**: Brani ad alto successo sul benchmark RDS Relax ma assenti dal catalogo di Radio Toscana.
2. 🟡 **DA INCREMENTARE**: Brani in catalogo ma sotto-ruotati rispetto al benchmark.
3. 🔴 **DA FAR USCIRE**: Rami secchi ad alta rotazione interna con 0 passaggi sul benchmark e bassa popolarità Deezer.
4. 🕵️ **IL RADAR COMPETITOR**: Brani scoperti su Radio Monte Carlo / Dimensione Suono Soft adatti al formato AC.

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
