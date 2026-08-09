# 🧠 Report Tecnico - Ottimizzazione & Sincronizzazione RT Lead Engine

Questo documento riassume lo stato di avanzamento, le ottimizzazioni applicate al workflow n8n e la riorganizzazione del database dei lead (Excel/Google Sheets) effettuati nella sessione odierna.

---

## 📊 1. Riorganizzazione del Database Lead (`Lead Radio Toscana.xlsx`)

Abbiamo ripulito ed esteso il file master situato in `C:\RT Lead Engine\Lead Radio Toscana.xlsx`. Il file è ora strutturato in tre schede logiche distinte per evitare sovrapposizioni e garantire la massima compatibilità con l'automazione.

### A. Scheda `Lead Pool` (Lead Freddi - Storico)
*   **Contenuto**: Lista originale dei lead freddi estratti dallo storico contratti.
*   **Totale**: **1.037 contatti**.
*   **Stato**: Ripristinato allo stato originale pulito. Attualmente solo il lead di test (`Auto P s.r.l.`, riga 3) è arricchito ed in stato `INVIATO_STEP1`. Gli altri 1.036 lead sono nello stato di partenza `SCOPERTO` (con email/siti vuoti).

### B. Scheda `Lead Caldi Brevo` (Nuova Tab Separata) 🌟
*   **Contenuto**: Contatti caldi esportati da Brevo (dalle liste *Clienti* e *Conversazioni attive*).
*   **Totale**: **261 contatti unici ed esclusivi** (rimosse 181 email duplicate tra le due liste esportate).
*   **Mappatura**: Strutturata con le stesse identiche colonne e nello stesso ordine di `Lead Pool` per garantire la compatibilità nativa con n8n.
*   **Stato**: Impostato su `CALDO_BREVO` con arricchimento "Smart Naming" (es. estrazione del nome azienda dal dominio email non generico, es. `Revet (Diego Barsotti)` o `Brandini (Matteo Costa)`).

### C. Scheda `Pro Loco List` (Campagna Sagre)
*   **Contenuto**: Lista delle Pro Loco toscane.
*   **Totale**: **342 contatti** con ben **338 email già popolate** e pronte all'uso.

---

## ⚡ 2. Ottimizzazione del Workflow n8n (`ENRICHMENT + OUTREACH.json`)

Il file JSON del workflow n8n in `C:\RT Lead Engine\` è stato modificato e ottimizzato per risolvere tre problemi bloccanti rilevati durante i test:

| Problema Rilevato | Ottimizzazione Applicata | Impatto Tecnico |
| :--- | :--- | :--- |
| **Ciclo Aperto (Loop Interrotto)** | Collegati i rami di uscita dei nodi `Update row in sheet`, `🟢 Segna INVIATA` e `❌ Segna ERRORE` di nuovo al nodo di partenza `🔂 1 Lead alla Volta`. | Ora n8n elabora l'intera lista in modo ciclico e automatico fino all'ultimo lead. |
| **Crash su Errore Groq AI** | Impostato `continueOnFail: true` sul nodo `🤖 Chiama Groq AI`. | Se un singolo lead fallisce la chiamata LLM o va in timeout, il ciclo non si interrompe più ma passa al successivo. |
| **Rate-Limit & Ban IP** | Inserito un delay asincrono di **2.5 secondi** nel Code Node `Sequence Manager` all'inizio del loop. | Previene il blocco delle API di Groq e riduce il rischio che i siti web dei clienti blocchino l'IP di n8n per scraping troppo rapido. |

---

## 🗺️ 3. Schema dell'Integrazione (Gumloop ➔ n8n ➔ CRM)

La sinergia tra i vari strumenti segue questo schema a blocchi:

```mermaid
graph TD
    subgraph Ingestion [1. ACQUISIZIONE (Gumloop)]
        A[News Radar: Nuove Aperture] -->|Webhook| E(n8n Webhook / Sheets)
        B[Multi-Ad: Scraper Banner Portali] -->|Webhook| E
    end

    subgraph CoreEngine [2. ORCHESTRAZIONE (n8n)]
        E --> F[Filtro Blacklist Competitor]
        F --> G[Scarica & Pulisce HTML Sito]
        G --> H[Groq AI: Estrae Email & Crea Copy]
        H --> I{Email Valida?}
        I -->|Sì| L[Invia Email SMTP/Brevo]
        I -->|No| M[Segna Stato ERRORE]
        L --> N[Aggiorna Sheets/Supabase]
        M --> N
        N -->|Loop 2.5s| E
    end

    subgraph Database [3. CONTATTI (Sheets / Supabase)]
        N --> O[(Lead Pool)]
        N --> P[(Lead Caldi Brevo)]
    end
```

---

## 🚀 4. Prossimi Passaggi Operativi per il Team

1.  **Sincronizzazione Google Sheets**:
    *   Creare una nuova scheda chiamata `Lead Caldi Brevo` sul foglio online.
    *   Importare il file locale `C:\RT Lead Engine\Lead Radio Toscana.xlsx` sostituendo solo la scheda corrente `Lead Caldi Brevo`.
2.  **Importazione Workflow su n8n**:
    *   Caricare il file ottimizzato `C:\RT Lead Engine\ENRICHMENT + OUTREACH.json` sul pannello n8n online per attivare il loop continuo con i delay e la gestione degli errori.
3.  **Avvio Campagna Nurturing**:
    *   Configurare su n8n il trigger per leggere la nuova scheda dei contatti caldi di Brevo inviando un'email di follow-up/nurturing personalizzata (anziché il pitch freddo standard).
