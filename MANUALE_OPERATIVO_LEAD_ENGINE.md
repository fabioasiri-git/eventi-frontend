# 📘 Manuale Operativo - Radio Toscana Lead Engine & Cloud CRM ("Sistema Mostro")

**Versione:** 7.5 (Edizione Playbook Settoriali Automotive/PA, Calcolatore Potenziale Cliente & Next.js 14 Engine)  
**Destinatari:** Team Commerciale (Fabio Asiri), Redazione/Copy (Edi), Studio di Registrazione & Amministratori di Sistema  
**Stazione:** Radio Toscana (Solo Toscana | Solo Hit)

---

## 📖 Indice dei Contenuti
1. [Visione Strategica & Protocollo Anti-Allucinazione (v3)](#1-visione-strategica--protocollo-anti-allucinazione-v3)
2. [Le 11 Regole d'Oro per la Scrittura Cold Email](#2-le-11-regole-doro-per-la-scrittura-cold-email)
3. [Sequenza Multi-Step & Temperatura del Contatto (Caldo vs Freddo)](#3-sequenza-multi-step--temperatura-del-contatto-caldo-vs-freddo)
4. [Protocollo di Compliance Obbligatoria & Registro Privacy](#4-protocollo-di-compliance-obbligatoria--registro-privacy)
5. [Prerequisiti Tecnici di Deliverability (SPF, DKIM, DMARC & Warm-Up)](#5-prerequisiti-tecnici-di-deliverability-spf-dkim-dmarc--warm-up)
6. [Protocollo di Classificazione & Whitelist Settori](#6-protocollo-di-classificazione--whitelist-settori)
7. [Le Tre Code di Controllo & Alert Errori](#7-le-tre-code-di-controllo--alert-errori)
8. [Il Multi-Radar Ingestion System (6 Canali di Acquisizione Lead)](#8-il-multi-radar-ingestion-system-6-canali-di-acquisizione-lead)
9. [Media Kit 2026 & Mappatura Geografica (Area 1, 2, 3, 4)](#9-media-kit-2026--mappatura-geografica-area-1-2-3-4)
10. [Architettura del Clock Radiofonico & Format Commerciali](#10-architettura-del-clock-radiofonico--format-commerciali)
11. [Il Meccanismo "Universal Memory Lock" (Sagre, Fiere, Mostre, Festival, Sport)](#11-il-meccanismo-universal-memory-lock-sagre-fiere-mostre-festival-sport)
12. [Modulo Web Preventivi & Contratti (Addio Canva ed Excel - Email + WA)](#12-modulo-web-preventivi--contratti-addio-canva-ed-excel---email--wa)
13. [Pipeline di Produzione & SLA 7 Giorni (Semaforo di Rischio)](#13-pipeline-di-produzione--sla-7-giorni-semaforo-di-rischio)
14. [Gestione Cambio Merce (Barter Deals & Valutazione Beni)](#14-gestione-cambio-merce-barter-deals--valutazione-beni)
15. [Procedure Operative Giornaliere per Fabio Asiri & Edi](#15-procedure-operative-giornaliere-per-fabio-asiri--edi)
16. [Listino Prezzi Ufficiale & Motore di Sconto](#16-listino-prezzi-ufficiale--motore-di-sconto)
17. [Lead Scoring & Priorità Commerciale](#17-lead-scoring--priorità-commerciale)
18. [Trigger di Rinnovo & Upsell su Clienti Attivi](#18-trigger-di-rinnovo--upsell-su-clienti-attivi)
19. [Dashboard Fatturato & Pipeline](#19-dashboard-fatturato--pipeline)
20. [Note di Attenzione su Sezioni Esistenti](#20-note-di-attenzione-su-sezioni-esistenti)

---

## 🛡️ 1. Visione Strategica & Protocollo Anti-Allucinazione (v3)

Il **Lead Engine di Radio Toscana** non è uno strumento di spam o di invio preventivi automatici. È un agente commerciale autonomo sul Cloud a supporto del Responsabile Commerciale (**Fabio Asiri**) che applica la filosofia **"Ricerca Massiva sul Territorio, Outreach Chirurgico di Alta Qualità"**.

Nessun lead riceve un'e-mail generata o approssimativa. Il sistema applica il **Protocollo Anti-Allucinazione (v3)**:
- **Nessuna E-mail Senza Classificazione Esplicita:** Ogni lead grezzo passa obbligatoriamente attraverso una chiamata LLM dedicata che assegna una categoria presa unicamente da una lista chiusa (`CATEGORIE_VALIDE`).
- **Zero Allucinazioni:** Se un settore non è presente o la confidenza è bassa, l'e-mail NON viene generata. Il lead viene inviato a una delle 3 code di revisione manuale.
- **Copywriting Validato a Mano:** Ogni script di settore (`SETTORI_APPROVATI`) ha un hook, un tono e una CTA scritti e validati personalmente da **Fabio Asiri**.

---

## 📜 2. Le 11 Regole d'Oro per la Scrittura Cold Email

1. **Scrivi 1-a-1**: Parla ad una singola persona. Niente "Gentili Signori" o "Spettabile Azienda". Inizia con un saluto umano.
2. **Valore Prima, Vendita Dopo**: Presenta la radio come partner del territorio, non come venditore di spazi pubblicitari.
3. **Zero Aperture Vuote**: Vietato iniziare con "Spero che questa mail ti trovi bene" o varianti simili. Si va dritti al valore fin dalla prima riga.
4. **Frasi Brevi**: Massimo 20 parole per frase. Un concetto per frase, mai subordinate multiple.
5. **Lunghezza Corpo Email**: Massimo 90-100 parole, firma esclusa.
6. **Oggetto**: Massimo 5-7 parole, tono personale, mai da comunicato stampa, mai simboli come "&".
7. **Niente Markdown nel Corpo Email**: Mai asterischi per il grassetto (`**bold**`). Se serve enfasi, usare il MAIUSCOLO su singole parole, con parsimonia.
8. **Niente Em-Dash (—)**: Usa unicamente la virgola o il punto.
9. **Una Sola CTA per Email**: Mai offrire due alternative insieme (es. "rispondimi" E "chiamami").
10. **Zero Dati Inventati**: Usa solo i numeri del Media Kit forniti nel prompt e le informazioni presenti nel record del lead. Mai inventare dettagli sull'azienda, eventi passati, o numeri non forniti.
11. **Opt-Out Obbligatorio**: Includi sempre in fondo: *"Se preferisci non ricevere altre comunicazioni, rispondi con STOP."*

---

## 🔁 3. Sequenza Multi-Step & Temperatura del Contatto (Caldo vs Freddo)

Nessun lead approvato riceve una sola e-mail isolata, ma una sequenza cadenzata e programmata in base alla **temperatura del contatto**:

### A. Mappatura della Temperatura:
- **Lead FREDDO (da Scraping/Banner/Primo Contatto):**  
  * **Massimo 3 Touchpoint** (Giorno 0, Giorno 3, Giorno 10). Cadenza prudente per tutelare la reputazione dell'IP.
- **Lead CALDO (Cliente Attivo / Pro Loco Conosciuta):**  
  * **Massimo 4 Touchpoint** (Giorno 0, Giorno 3, Giorno 10, Giorno 17).

### B. Struttura degli Step:
* **STEP 1 (Giorno 0 - Iniziale):** E-mail di valore 1-a-1 secondo le 11 Regole d'Oro (martedì o mercoledì mattina).
* **STEP 2 (Giorno 3 - Follow-up Leggero):** Risposta rapida con UN elemento nuovo (un dato dell'Area o un dettaglio dell'evento). *Vietate le formule "solo per ricontattarvi" o "riporto a galla"*.
* **STEP 3 (Giorno 10 - Ultimo Tocco):** Domanda diretta a basso impegno o informazione utile senza secondi fini. Ultimo invio per i lead freddi.
* **STEP 4 (Giorno 17 - Chiusura Soft solo per Lead Caldi):** Breakup email con tono di chiusura rispettoso, comunicando che non si insisterà oltre lasciando la porta aperta.

---

## 🔒 4. Protocollo di Compliance Obbligatoria & Registro Privacy

Ogni e-mail generata viene registrata nel database Supabase Cloud nello schema dedicato `rt_lead_engine` con un **Log di Compliance**:

```json
{
  "lead": "Pro Loco Sagra del Tordello",
  "fonte_contatto": "Pro Loco List Database",
  "categoria_pertinenza": "Evento Enogastronomico",
  "temperatura": "caldo",
  "data_raccolta": "2026-07-20",
  "opt_out_incluso": true
}
```

- **Identità Mittente Chiara:** Fabio Asiri, Responsabile Commerciale Radio Toscana, contatti reali mai abbreviati (Via de' Pucci 2, 50122 Firenze, Italia — (+39) 055 285030).
- **Pertinenza Tematica:** Dichiarata e verificata dalla classificazione AI.
- **Opt-Out Obbligatorio in OGNI Step:** Riga *"Se preferisci non ricevere altre comunicazioni, rispondi con STOP."* in fondo a tutte le e-mail.

---

## 🛠️ 5. Prerequisiti Tecnici di Deliverability (SPF, DKIM, DMARC & Warm-Up)

Prima di scalare il volume d'invio sul server di produzione (n8n / SMTP Brevo):

1. **Dominio Dedicato all'Outreach:** Le e-mail a freddo NON vengono inviate dal dominio principale `@radiotoscana.it` (usato per contratti, fatture e comunicazioni istituzionali). Si utilizza invece un sottodominio dedicato, ad esempio `commerciale.radiotoscana.it` o `mail.radiotoscana.it`. Il destinatario vede comunque il brand Radio Toscana nell'indirizzo, ma la reputazione di invio resta isolata: eventuali bounce o spam complaint sulla campagna a freddo non intaccano le comunicazioni ordinarie della radio.

2. **Configurazione Record DNS:** Verificare la presenza dei record **SPF**, **DKIM** e **DMARC** configurati correttamente sul sottodominio dedicato, non sul dominio principale.

3. **Warm-Up del Dominio:** Incremento graduale e prudente dei volumi su un arco di 4-6 settimane, non 2:
   - **Settimana 1-2:** 5-10 mail/giorno
   - **Settimana 3-4:** 15-20 mail/giorno
   - **Settimana 5-6:** 30-40 mail/giorno
   
   Curve più aggressive rischiano di essere lette come comportamento anomalo dai filtri antispam, specialmente su un dominio senza storico di invio pregresso.

4. **Soglie di Allerta:** Bounce rate sopra il 2% o spam complaint sopra lo 0,3% richiedono la sospensione immediata dell'invio e la revisione della lista contatti prima di riprendere.

---

## 🚦 6. Protocollo di Classificazione & Whitelist Settori

Il flusso di elaborazione del lead segue un ordine rigoroso:

```
[Lead Grezzo] ➔ [Validazione Campi] ➔ [Validazione Temperatura] ➔ [Classificazione AI LLM]
                                                                        │
        ┌───────────────────────────────────────────────────────────────┴───────────────────────────────┐
        ▼                                                                                               ▼
[Categoria fuori da CATEGORIE_VALIDE o null] ➔ 🚫 Coda Non Riconosciuta                     [Confidenza Bassa] ➔ ⚠️ Coda Da Validare
        │                                                                                               │
        ▼                                                                                               ▼
[Categoria Valida] ➔ {In SETTORI_APPROVATI?} ➔ NO ➔ 📝 Coda Settore da Scrivere
                          │
                         SÌ
                          ▼
             [✅ Genera Sequenza Email 1-a-1 Validata]
```

- **`CATEGORIE_VALIDE`:** Lista chiusa di categorie merceologiche riconosciute (`"Evento Enogastronomico"`, `"Automotive"`, `"Beauty & Wellness"`, `"Retail"`). Cresce solo dopo revisione manuale di Fabio.
- **`SETTORI_APPROVATI`:** Whitelist dei settori con script pronto e validato a mano (`"Evento Enogastronomico"`, `"Automotive"`).

---

## 📥 7. Le Tre Code di Controllo & Alert Errori

Nel database e sulla Dashboard Cloud, i lead che non superano i filtri rigidi vengono smistati nelle tre code dedicate per l'intervento di Fabio:

1. **🚫 Coda Categoria Non Riconosciuta:** Lead con settore ambiguo, incompleto o non presente in `CATEGORIE_VALIDE`.
2. **⚠️ Coda Bassa Confidenza:** Lead con classificazione incerta che richiede la conferma della categoria.
3. **📝 Coda Settore da Scrivere:** Lead con categoria valida, ma per la quale Fabio non ha ancora redatto il template e gli hook in `SETTORI_APPROVATI`.

---

## 🛰️ 8. Il Multi-Radar Ingestion System (6 Canali di Acquisizione Lead)

Il sistema scansiona la regione attraverso 6 canali attivi:

1. **Telegram Bot OOH Scouter:** Fabio scatta foto a cartelloni stradali e locandine. Llama 3.2 Vision estrae ditta, comune ed evento.
2. **Web Banner Scraper (Portali News Toscani):** Scansione dei banner pubblicitari grafici sui portali d'informazione di tutte le 10 province (*GoNews.it, PisaToday, FirenzeToday, LivornoToday, ArezzoNotizie, LuccaInDiretta, Il Giunco Maremma, SienaNews, Notizie di Prato*, ecc.).
3. **News Radar "Cosa Succede in Toscana":** Scansione di notizie locali, nuove aperture commerciali e inaugurazioni.
4. **Press Box Scanner (IMAP Redazione):** Parsing dei comunicati stampa inviati in redazione per intercettare eventi con 2-3 mesi di anticipo.
5. **Competitor Audio Intercept:** Intercettazione degli spot trasmessi sulle radio concorrenti via Whisper/Groq per scoprire nicchie merceologiche attive (*Vedi Sezione 20 per i limiti d'uso*).
6. **Data Marketing Stagionale:** Suggerimento automatico delle categorie calde del mese (Settembre: Automotive/Scuole; Ottobre: Terme/Sagre; Dicembre: Retail/Gioiellerie).

---

## 📊 9. Media Kit 2026 & Mappatura Geografica (Area 1, 2, 3, 4)

Tutte le e-mail di outreach utilizzano i dati ufficiali di **Radio Toscana (Media Kit 2026)**:
- **298.000** ascoltatori settimanali in Toscana.
- **61.000** ascoltatori medi al giorno con **61 minuti** di ascolto medio giornaliero.
- **67% Responsabili d'Acquisto**.

### 🗺️ Mappatura delle Aree:
- **AREA 1 (Firenze, Prato, Pistoia):** Cuore economico e popoloso della Toscana (298k ascoltatori).
- **AREA 2 (La Costa - Pisa, Livorno, Lucca, Massa, Follonica):** Flussi turistici e presenza locale (61k ascoltatori/giorno).
- **AREA 3 (Toscana Interna - Arezzo, Grosseto, Siena, Mugello, Valdarno):** Community di fedelissimi ed eccellenze territoriali.
- **AREA 4 (Digital Radio - DAB+, Streaming, App, Alexa, Google Home, CarPlay):** Presenza per chi è in mobilità.

---

## ⏰ 10. Architettura del Clock Radiofonico & Format Commerciali

Il clock orario ufficiale dei 60 minuti di Radio Toscana è strutturato in modo sinergico:

```
[ :00 ] GIORNALE RADIO (Notiziario principale)
[ :10 ] 🎙️ PILLOLA 1 (Intervista 60"-90" lanciata con rampa dallo speaker live)
[ :20 ] 📢 BLOCCO SPOT 1 (Pubblicità tabellare di massa)
[ :30 ] 🚗 VIABILITÀ & METEO
[ :40 ] 🎙️ PILLOLA 2 (Seconda Pillola / Intervista con rampa dallo speaker live)
[ :45 ] 📢 BLOCCO SPOT 2 (Pubblicità tabellare)
[ :55 ] 📢 BLOCCO SPOT 3 (Pre-notiziario)
```

- **Spot Classico (10", 20", 30")** ai minuti **.20, .45, .55**: il pilastro fondamentale per creare frequenza e copertura di massa (indispensabile per sagre, fiere, concessionarie, retail).
- **Pillole / Interviste (60"/90")** ai minuti **.10 e .40**: lanciate in rampa dallo speaker live come valore aggiunto integrato *"OLTRE allo spot"*.
- **Primo di Barra (10")**: spot in testa ai notiziari/viabilità.
- **Citazioni Live dello Speaker**: nei programmi di punta (es. Alessandro Masti la mattina).

---

## 🔄 11. Il Meccanismo "Universal Memory Lock" (Sagre, Fiere, Mostre, Festival, Sport)

Il **Memory Lock** si applica a qualsiasi iniziativa commerciale o evento ricorrente (Sagre, Fiere, Mostre, Festival Musicali, Maratone, Mercatini di Natale):
- **Formula Automatizzata:** `Data_Sveglia_Anno_Successivo = (Data_Evento_Corrente + 1 Anno) - 90 Giorni`.
- **Trigger:** n8n e Supabase svegliano automaticamente la scheda del lead **3 mesi prima dell'edizione dell'anno dopo**, riaprendo il contatto prima di qualsiasi concorrente.

---

## 📄 12. Modulo Web Preventivi & Contratti (Addio Canva ed Excel - Email + WA)

Dalla Dashboard Cloud (`https://radio-toscana-commerciale.vercel.app`), Fabio gestisce l'emissione dei documenti in 30 secondi:
- **Preventivatore Web (`Preventivo AT` Style):** Numerazione progressiva automatica, opzioni omaggio (15 giorni + 2 omaggio), export PDF HD e Link Web Interattivo.
- **Contrattualizzatore Ufficiale (`Radio Monte Serra s.r.l.`):** Numerazione commissione (`N. Comm.`), conversione in 1 click dal preventivo approvato, inserimento delle **17 clausole legali ufficiali** e firma digitale (*Vedi Sezione 20 per la verifica legale FEA/FEQ*).
- **Invio Multicanale:** Invio con 1 click via **E-mail Ufficiale** o **WhatsApp Business**.

---

## 🚦 13. Pipeline di Produzione & SLA 7 Giorni (Semaforo di Rischio)

Quando un contratto passa in `CONTRATTO ATTIVO`, si attiva il tracciamento della lavorazione in **6 Fasi**:
1. `COMMESSA CREATA` ➔ 2. `BRIEFING EDI` ➔ 3. `APPROVAZIONE TESTO` ➔ 4. `STUDIO INCISIONE` ➔ 5. `APPROVAZIONE AUDIO` ➔ 6. `ON AIR REGIA`.

### 🚦 Semaforo di Rischio Produzione:
- 🟢 **VERDE (> 7 Giorni alla Messa in Onda):** Lavorazione ottimale (Target Gold 7 giorni prima).
- 🟡 **GIALLO (3 - 6 Giorni):** Sollecito automatico a Edi/Cliente per approvazione testo/audio.
- 🔴 **ROSSO / CRITICO (1 - 2 Giorni / Last Minute):** Alert prioritario Telegram a Fabio ed Edi per evitare buchi in regia.

---

## 🛍️ 14. Gestione Cambio Merce (Barter Deals & Valutazione Beni)

Il sistema gestisce i contratti di **Cambio Merce (Barter Deals)** a saldo totale o parziale (*Vedi Sezione 20 per la nota fiscale IVA*):
- **Destinazione Beni:**
  1. *Premi On-Air per Contest Ascoltatori* (buoni sconto, pernottamenti hotel, biglietti concerti, cene).
  2. *Uso Aziendale & Allestimento Eventi Radio Toscana* (catering, materiale promozionale, service tecnico).
  3. *Welfare & Benefit Interni*.
- **Integrazione Documentale:** Inserimento della clausola di scambio beni nei preventivi/contratti con indicazione precisa dei prodotti concordati.

---

## 📋 15. Procedure Operative Giornaliere per Fabio Asiri & Edi

1. **Accesso alla Dashboard Cloud:** Apertura di `https://radio-toscana-commerciale.vercel.app` da qualsiasi dispositivo.
2. **Controllo Notifiche & Alert:** Verifica lead `CALDI`, alert di produzione spot in rosso/giallo e coda delle 3 anomalie.
3. **Ingestion Territoriale:** Scatto foto locandine/cartelloni via Bot Telegram durante gli spostamenti.
4. **Generazione Documenti:** Emissione di preventivi e contratti con 1 click senza aprire Canva o Excel.
5. **Gestione Lavorazioni Edi:** Aggiornamento dello stato dei testi e degli audio fino al benestare On Air.

---

## 💰 16. Listino Prezzi Ufficiale & Motore di Sconto

**Nota:** Listino provvisorio in attesa di conferma del file ufficiale da caricare da Fabio. Struttura prezzi verificata al 25/07/2026, valori da riconfermare.

### A. Listino Spot 20" (prezzo per singolo passaggio, IVA esclusa)

| Area | Copertura | Prezzo Listino |
|---|---|---|
| AREA 1 | Firenze, Prato, Pistoia | €9,00 |
| AREA 2 | Livorno, Pisa, Lucca, Massa Carrara, Follonica | €5,50 |
| AREA 3 | Siena, Arezzo, Grosseto | €4,50 |
| RETE | Tutte le province | €13,00 |
| 88.7 Radio Firenze | Provincia di Firenze | €6,00 |
| AREA 4 | Digital (DAB+, streaming, app, Alexa, Google Home, CarPlay) | +€1,00 su formula base |

**Modificatori formato:**
- Spot 30": +20% sul prezzo base
- Spot 15": -10% sul prezzo base
- Spot 10": -20% sul prezzo base

**Costo Produzione Spot (una tantum, non scontabile):**
- €100 se in onda solo su Radio Toscana/Radio Firenze
- €169 se in onda su altre radio o in-store

### B. Listino Primo/Ultimo di Barra 10"

| Formato | Durata | RETE | AREA 1 | AREA 2 | AREA 3 |
|---|---|---|---|---|---|
| Primo di Barra | 14gg (196 passaggi) | €800 | €600 | €450 | €350 |
| Ultimo di Barra | 14gg (196 passaggi) | €700 | €500 | €350 | €300 |
| Primo di Barra | 28gg (392 passaggi) | €1100 | €900 | €750 | €650 |
| Ultimo di Barra | 28gg (392 passaggi) | €1000 | €800 | €650 | €600 |

+ Costo produzione spot €100 (sempre a parte, non scontabile).

### C. Listino Servizi Editoriali

| Servizio | Prezzo |
|---|---|
| Citazione (copy incluso) | €30,00 |
| Prima messa in onda Pillola | €150,00 |
| Dalla seconda messa in onda Pillola | €100,00 |
| DJ Set + Promo Radio (5 citazioni) | €500,00 |
| Presentazione evento | €400,00 |
| Presenza in onda in programma di punta (max 5') | €250,00 |

### D. Segnale Orario

| Durata campagna | Prezzo | Copertura |
|---|---|---|
| 2 settimane (120 momenti) | €650 | Solo Rete |
| 4 settimane (240 momenti) | €950 | Solo Rete |

---

### 🎛️ Motore di Sconto (Flag Manuale)

Ogni preventivo generato dal sistema può attivare uno sconto, sempre a discrezione esplicita di Fabio, mai calcolato o proposto in autonomia dal motore AI.

**Campi del flag:**
```
sconto_attivo: true / false
percentuale_sconto: [inserita manualmente da Fabio, es. 15]
motivo_sconto: [testo libero opzionale, es. "volume 4 settimane", "cliente storico", "barter parziale"]
soglia_attenzione_sconto: 25% (valore di riferimento, modificabile)
```

**Comportamento del Preventivatore:**
- Se `sconto_attivo = false`: il documento mostra solo il prezzo di listino pieno.
- Se `sconto_attivo = true`: il documento mostra **entrambi i prezzi**, mai solo quello scontato:
  * Prezzo di listino: €9,00/passaggio
  * Prezzo riservato: €7,65/passaggio (sconto 15%)
- Se `percentuale_sconto` supera `soglia_attenzione_sconto`: alert visivo non bloccante in Dashboard ("Sconto sopra la soglia abituale, verificare margine prima dell'invio").
- Costo Produzione Spot e servizi editoriali a prezzo fisso sono non scontabili per default, salvo indicazione esplicita contraria di Fabio.

**Log e apprendimento:**
```json
{
  "prezzo_listino_totale": 0,
  "percentuale_sconto_applicata": 0,
  "motivo_sconto": "",
  "esito_contratto": "chiuso"
}
```

---

### 🏷️ Nota Cross-Sell Radio Firenze (Area 1)

Per lead classificati in AREA 1, il Preventivatore propone come opzione aggiuntiva (non automatica) un pacchetto combinato Radio Toscana + Radio Firenze (88.7, prezzo dedicato provincia FI), da valutare caso per caso in base al budget del cliente.

---

## 🎯 17. Lead Scoring & Priorità Commerciale

Con 6 canali di ingestion attivi (sezione 8), il volume di lead in coda cresce rapidamente. Senza un punteggio di priorità, Fabio rischia di dedicare lo stesso tempo a un lead da 300€ e uno da 5.000€.

### A. Formula di Scoring (0-100 punti)
`SCORE_LEAD = (Peso_Area × 30) + (Peso_Urgenza × 25) + (Peso_Dimensione × 25) + (Peso_Storico_Settore × 20)`

- **Peso_Area (0-1):** AREA 1 = 1.0, AREA 2 = 0.7, AREA 3 = 0.5, AREA 4/Digital = 0.4 (basato sul valore di listino per area).
- **Peso_Urgenza (0-1):** Memory Lock a <30gg dall'evento = 1.0, 30-90gg = 0.7, >90gg o nessuna scadenza = 0.3.
- **Peso_Dimensione (0-1):** stimata da segnali disponibili (numero dipendenti se noto, presenza multi-sede, budget dichiarato in contatti pregressi). Se non disponibile, default 0.5.
- **Peso_Storico_Settore (0-1):** tasso di chiusura storico per quella categoria in `SETTORI_APPROVATI` (richiede almeno 10 contratti chiusi per categoria per essere affidabile, altrimenti default 0.5).

### B. Fasce di Priorità
| Score | Fascia | Azione |
|---|---|---|
| 75-100 | 🔴 Priorità Alta | Contatto entro 24h, gestione diretta Fabio |
| 50-74 | 🟡 Priorità Media | Sequenza standard, contatto entro 3-5gg |
| 0-49 | 🟢 Priorità Bassa | Sequenza automatica, revisione settimanale in batch |

### C. Nota Importante
Lo scoring non sostituisce il protocollo anti-allucinazione già in vigore (sezioni 1 e 6): un lead con score alto ma categoria non riconosciuta o confidenza bassa segue comunque il flusso delle 3 code di controllo prima di qualunque invio.

---

## 🔄 18. Trigger di Rinnovo & Upsell su Clienti Attivi

Un cliente con contratto attivo (sezione 13) è la fonte di fatturato più economica da massimizzare, ma il sistema attuale non prevede nulla di dedicato oltre alla sequenza email caldo/freddo generica (sezione 3).

### A. Trigger Automatico di Rinnovo
`Data_Alert_Rinnovo = Data_Fine_Contratto - 30 Giorni`

n8n/Supabase generano un alert dedicato (separato dal semaforo di produzione, sezione 13) quando un contratto entra nella finestra dei 30 giorni dalla scadenza. L'alert propone a Fabio:
- Rinnovo alle stesse condizioni.
- Upsell (aggiunta di un formato non ancora acquistato, es. cliente con solo spot 20" ➔ proposta di Pillola o Primo di Barra).
- Cross-sell Radio Firenze per clienti Area 1 (vedi sezione 16).

### B. Segmentazione Upsell per Storico d'Acquisto
Il sistema categorizza i clienti attivi in base ai formati già acquistati (`rt_lead_engine`), per suggerire l'upsell più coerente:
- *Solo spot tradizionale* ➔ proporre Pillola/Intervista per approfondire lo storytelling del brand.
- *Solo formati editoriali* ➔ proporre spot per aumentare la frequenza.
- *Cliente Area singola* ➔ proporre estensione ad AREA superiore o RETE.

### C. Timing
L'alert di rinnovo/upsell ha priorità superiore rispetto alla sequenza cold email standard: un cliente attivo non deve mai ricevere una email da "primo contatto a freddo" per errore di categorizzazione temperatura.

---

## 📊 19. Dashboard Fatturato & Pipeline

Il sistema traccia contratti, produzione e barter, ma manca una vista aggregata che risponda alla domanda: il sistema sta aumentando il fatturato o solo il volume di attività?

### A. Metriche da Esporre in Dashboard
- **Fatturato Contrattualizzato del Mese** (somma contratti CONTRATTO ATTIVO).
- **Pipeline Attesa** (somma preventivi aperti × probabilità di chiusura stimata).
- **Valore Barter Convertito** (equivalente monetario dei beni scambiati, sezione 14).
- **Tasso di Conversione per Fascia di Score** (sezione 17).
- **Tasso di Conversione per Fascia di Sconto** (sezione 16).
- **Valore Medio Contratto per Settore** (`SETTORI_APPROVATI`).

### B. Frequenza di Aggiornamento
Dashboard aggiornata in tempo reale per i dati contrattuali, con riepilogo settimanale inviato via Telegram/WhatsApp a Fabio (stesso canale già usato per gli alert di produzione, sezione 13).

---

## 🔄 20. Ciclo di Vita Completo della Commessa Commerciale (a 4 Fasi)

Il sistema gestisce l'intero ciclo commerciale in modo deterministico e tracciato, dalla prima trattativa fino alla conferma finale di trasmissione al cliente.

### A. Le 4 Fasi della Commessa Commerciale
1. **Fase 1 — Preventivo (Commercial Lead)**: Trattativa commerciale, profilazione settore, area target, elenco voci di listino acquistate, percentuale sconto % e calcolo automatico del Lead Scoring (0-100).
2. **Fase 2 — Contratto (Signed Deal)**: Perfezionamento dell'accordo con numero di contratto univoco (es. `2023/14197`), valore monetario netto, gestione dell'eventuale flag Cambio Merce (Barter) e data sottoscrizione.
3. **Fase 3 — Produzione Spot Audio & Listino Tariffe**: Gestione dell'audio spot secondo 4 tipologie commerciali con tariffazione automatica:
   - 🎙️ **Produzione Esclusiva RT + RF** (Solo Radio Toscana + Radio Firenze): `€ 100,00 + IVA` (SLA standard: 7 giorni lavorativi).
   - 📻 **Produzione Multi-Radio Toscana** (RT/RF + Altre Radio Toscane): `€ 169,00 + IVA` (SLA standard: 7 giorni lavorativi).
   - ✂️ **Montaggio Codino Tecnico** (Aggiunta di voce/recapito locale a spot master fornito): `€ 30,00 + IVA` (SLA ridotto: 2-3 giorni lavorativi).
   - 📁 **Spot Fornito dal Cliente** (Traccia audio pronta Direct On-Air): `€ 0,00` (SLA: 0 giorni / Verifica formato immediata).
4. **Fase 4 — Programmazione On-Air, Ingestion Rete & Dispatch Email**:
   - Acquisizione del prospetto PDF della **Programmazione On-Air** (Schedules) direttamente dalla cartella condivisa di rete sul PC di lavoro (o via Web Drag & Drop).
   - Estrazione automatica dei dati di trasmissione: numero contratto, date on-air (inizio/fine), totale spot pianificati (es. 84 spot su 14 giorni) e scansione oraria giornaliera.
   - Invio dell'email di trasmissione al cliente con il file PDF allegato e tracciamento dello stato d'invio visibile in Dashboard (🟢 *Programmazione Inviata il DD/MM/YYYY HH:MM* | 🟡 *Programmazione Pronta - Da Inviare* | 🔴 *Errore Email*).

### B. Modello Email Preconfigurato (Programmazione On-Air)
**Oggetto Email:**
> `Radio Toscana — Programmazione Messa in Onda Campagna "[Nome Campagna]" (Contratto Nr. [Numero Contratto])`

**Corpo Email:**
> Gentile **[Nome Cliente / Azienda]**,
>
> desideriamo confermarLe che la Sua campagna pubblicitaria **"[Nome Campagna]"** è stata regolarmente pianificata ed è pronta per la messa in onda sulle nostre frequenze.
>
> 📌 **RIEPILOGO DELLA PROGRAMMAZIONE ON-AIR:**
> • **Contratto di Riferimento:** Nr. [Numero Contratto]  
> • **Periodo Messa in Onda:** dal [Data Inizio] al [Data Fine]  
> • **Totale Spot Pianificati:** [Numero Spot] spot (media [Spot al Giorno] spot al giorno)  
> • **Area Target:** [Area / Copertura]  
> • **File Audio Spot:** [Nome File Spot Audio]  
>
> In allegato a questa email trova il prospetto ufficiale della **Programmazione On-Air** con la scansione esatta di tutti gli orari di trasmissione giornalieri.
>
> Per qualsiasi necessità o chiarimento, il Suo referente commerciale rimane a completa disposizione.
>
> Cordiali saluti,  
> **Direzione Commerciale & Programmazione**  
> *Radio Toscana*  
> 📧 commerciale@radiotoscana.it  
> 🌐 www.radiotoscana.it

---

## ⚠️ 21. Note di Attenzione su Sezioni Esistenti

### A. Sezione 8 — Competitor Audio Intercept
**Limite d'Uso:** Il canale "Competitor Audio Intercept" è utilizzato esclusivamente per identificare categorie merceologiche attive nella concorrenza (es. "un concessionario pubblicizza in zona X"). Il sistema non deve mai riprodurre, parafrasare o ispirarsi testualmente al wording, agli hook o agli script captati dagli spot dei competitor. L'output ammesso è solo: nome settore, area geografica, frequenza stimata di messa in onda.

### B. Sezione 12 — Firma Digitale
**Nota:** Verificare con consulenza legale se la firma digitale utilizzata nel Contrattualizzatore è firma elettronica semplice, avanzata (FEA) o qualificata (FEQ), poiché la validità probatoria cambia significativamente per contratti pubblicitari con terze parti.

### C. Sezione 14 — Barter Deals
**Nota Fiscale:** Il cambio merce ha comunque rilevanza IVA in Italia e va fatturato al valore normale del bene scambiato, anche in assenza di flusso di cassa. Verificare con il commercialista l'adempimento corretto per ogni operazione di barter prima della chiusura del contratto.

### D. Sezione 4 — Firma Email Completa
Aggiungere ai contatti mittente già presenti (nome, ruolo, telefono, email) anche l'indirizzo fisico e il centralino ufficiale:  
**Via de' Pucci 2, 50122 Firenze, Italia — (+39) 055 285030**

