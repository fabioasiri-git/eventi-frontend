# Eventi Frontend - Sistema di Gestione Eventi

Sistema di automazione per la raccolta di eventi da vari portali web e gestione dei contatti con gli organizzatori.

## 🚀 Prerequisiti

- Node.js 18+ (consigliata LTS)
- npm 9+ o yarn 1.22+
- Account Supabase
- Account Brevo (ex Sendinblue) per l'invio email

## 🛠 Configurazione Ambiente

1. **Clona il repository**
   ```bash
   git clone [URL_DEL_REPOSITORY]
   cd eventi-frontend
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   # oppure
   yarn install
   ```

3. **Configura le variabili d'ambiente**
   Crea un file `.env.local` nella root del progetto con le seguenti variabili:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   
   # Brevo (Email)
   BREVO_API_KEY=tu_api_key_brevo
   
   # Altre configurazioni
   NODE_ENV=development
   ```

## 🚦 Avvio del Progetto

1. **Modalità Sviluppo**
   ```bash
   npm run dev
   # oppure
   yarn dev
   ```
   Apri [http://localhost:3000](http://localhost:3000) nel browser.

2. **Compilazione per Produzione**
   ```bash
   npm run build
   npm start
   ```

## 📁 Struttura del Progetto

```
eventi-frontend/
├── app/                  # Pagine e layout Next.js
├── components/           # Componenti React riutilizzabili
├── integrations/         # Script di integrazione con servizi esterni
│   ├── test-brevo.js     # Test integrazione Brevo
│   └── ...
├── lib/                  # Librerie e utility
├── public/               # File statici
├── styles/               # Stili globali
├── .env.local            # Variabili d'ambiente (da creare)
└── package.json          # Dipendenze e script
```

## 🔐 Configurazione Supabase

1. Crea un nuovo progetto su [Supabase](https://supabase.com/)
2. Importa lo schema del database da `supabase-setup.sql`
3. Configura le policy di sicurezza nelle impostazioni di Supabase
4. Aggiorna le variabili d'ambiente con le tue credenziali

## 📧 Configurazione Brevo (Email)

1. Crea un account su [Brevo](https://www.brevo.com/)
2. Genera una nuova API Key
3. Configura i template email nel pannello di controllo Brevo
4. Aggiorna la variabile `BREVO_API_KEY` nel file `.env.local`

## 🛠 Script Utili

- **Avvia lo scraper**: `node scripts/scraper.js`
- **Esegui migrazione dati**: `node scripts/migrate-data.js`
- **Test invio email**: `node integrations/test-brevo.js`

## 👥 Collaborazione

1. Crea un nuovo branch per le tue modifiche
2. Fai commit delle modifiche
3. Crea una Pull Request

## 📄 Licenza

[Inserire tipo di licenza]
