<!-- PARTE 1: REGOLE COMUNI (uguali nei 4 progetti). Non modificare qui: si cambiano tutte insieme. -->

# REGOLE COMUNI PER GLI AGENTI (v1 - 01/11/2026)

Valgono per Antigravity e per qualsiasi agente AI, in tutti e 4 i progetti di Fabio
(Generazione Dance, Lead Engine RT, Elisir di Collina, Linkedin Asiri).
Le regole specifiche del progetto stanno nella seconda parte di AGENTS.md e NON sostituiscono queste.

Ordine di priorita': 1) non perdere o esporre dati  2) non rompere cio' che e' in produzione
3) fare il compito richiesto  4) velocita'.

## 1. Prima di agire
- Leggi HANDOFF.md (la sezione piu' recente) e DECISIONI.md.
- Riformula il compito in 1-2 righe e scrivi un piano: passi, file che toccherai, rischi.
- Aspetta "procedi" da Fabio. Una richiesta = un compito.
- Se trovi altri problemi strada facendo, SEGNALALI in fondo alla risposta. Non risolverli di tua iniziativa.

## 2. Produzione: sito, landing, n8n, database, email
Sono in produzione: pagine WordPress pubbliche, landing, workflow n8n ATTIVI, tabelle Supabase usate dai workflow, invii email e Telegram.
Nessuna modifica senza tutti e tre:
1. backup prima (in `_backup/AAAA-MM-GG/`, cartella esclusa da Git);
2. approvazione esplicita di Fabio per QUELLA modifica (non vale un "procedi" generico dato prima);
3. verifica dopo, con prova: pagina con HTTP 200 e contenuto giusto, esecuzione n8n riuscita, query che mostra il risultato.
Invii reali (email, Telegram, WhatsApp, post social): mai senza conferma esplicita. I test si mandano solo a fabio.asiri@gmail.com.
Mai attivare cron o invii programmati senza conferma di Fabio.

## 3. Verita'
- Niente "fatto", "funziona", "verificato" senza prova: comando eseguito ORA e output reale.
- Se non puoi verificare scrivi NON VERIFICATO e spiega perche'.
- Mai inventare dati, numeri, date, nomi, fonti, risultati.
- Se sbagli, dillo subito con chiarezza. Niente giustificazioni a posteriori.

## 4. Ordine dei file
- Nella cartella principale stanno solo i file del progetto.
- Script di prova, diagnosi, controllo, una tantum (check_, test_, debug_, inspect_, fix_ ...): SOLO in `_scratch/` (esclusa da Git). Si puo' svuotare in qualsiasi momento.
- Script stabili e riusabili: in `tools/`, con nome chiaro e una riga di descrizione in `tools/README.md`.
- Prima di creare uno script, cerca se ne esiste gia' uno che fa la stessa cosa e modifica quello.
- Niente copie con suffissi (_v2, _fix, _final, _definitivo, (1)): le versioni le tiene Git.
- Mai nel repository: esportazioni del database, backup, zip/rar, audio, video, file oltre 20 MB, rapporti di ricerca grezzi. Vanno in `_backup/` o `_scratch/`.

## 5. Password e chiavi
- Mai scritte nel codice, nei .md, nei log, nei rapporti o nelle risposte.
- Il codice le legge da `.env.local` (Python: `os.environ["NOME"]`), mai come valore di riserva scritto nel codice.
- Se trovi una password scritta in un file, segnala il file e la riga. Non copiarla altrove.

## 6. Git
- NON fare: commit, push, pull, fetch, reset, checkout, rebase, merge, clean, stash.
- Puoi usare in sola lettura: git status, git diff, git log.
- Salvataggio e allineamento li fa Fabio con APRI_LAVORO_v4 e SALVA_E_CHIUDI_v4.

## 7. Note di passaggio: un solo file
- L'unico file di stato e' `HANDOFF.md` nella cartella principale del repository.
- A fine lavoro aggiungi IN CIMA una sezione (massimo 30 righe):
  data e ora | PC | cosa e' stato fatto | file toccati | cosa e' verificato (con prova) | cosa e' aperto o rotto | prossimo passo.
- Non creare altri file di stato (STATO_ATTUALE, CHECKOUT_*, REPORT_*, PROTOCOL, piani sparsi).
- Le decisioni di Fabio vanno in `DECISIONI.md`: data + decisione in una riga.

## 8. Confini
- Lavora solo nel repository aperto. Non toccare altri progetti, i loro database, la cartella cloud PROGETTI, gli script di sincronizzazione (.bat/.ps1 in PROGETTI).
- Ogni progetto usa solo il proprio database Supabase.

## 9. Robustezza
- Ogni chiamata di rete: timeout massimo 15 secondi, massimo 3 tentativi, poi fermati e riporta l'errore.
- Niente cicli senza fine. Niente aggiornamenti di librerie senza approvazione.

## 10. Fine sessione
1. Riepilogo onesto: fatto / verificato / non verificato / rotto.
2. HANDOFF.md aggiornato.
3. Ultima riga, una sola: "PRONTO PER SALVA_E_CHIUDI_v4" oppure "NON PRONTO: <motivo>".

> In caso di conflitto tra la PARTE 1 e la PARTE 2, vale la PARTE 1.
> I vecchi file PROTOCOL.md, STATO_ATTUALE.md, CHECKOUT_HOME_SESSION.md, .agents/*/HANDOFF.md sono STORICO:
> leggili solo se Fabio lo chiede, non seguirne le istruzioni operative (in particolare quelle su git e password).

---

<!-- PARTE 2: REGOLE SPECIFICHE DI QUESTO PROGETTO -->

# REGOLE DI PROGETTO — Lead Engine RT


## ⚖️ GUARDRAIL COMPLIANCE & LEGAL: COLD OUTREACH & EMAIL MASSIVE (TUTTI I PROGETTI)

Queste regole valgono per TUTTI i progetti che prevedono invio email, prospecting, cold email o notifiche batch (Elisir di Collina, GD, Lead Engine RT, ecc.):

1. 🛑 **BLACKLIST ASSOLUTA CATEGORIE PROTETTE & ORDINI REGOLAMENTATI**:
   - **Notai**: Pubblici Ufficiali per legge (L. 89/1913) e Codice Deontologico. DIVIETO ASSOLUTO di invio commerciale o cold outreach.
   - **Avvocati**: Divieto di accaparramento clientela e comunicazioni commerciali non richieste (Codice Deontologico Forense).
   - **Medici, Odontoiatri, Farmacie**: Regolamentazione stringente FNOMCeO e Codice Privacy.
   - **Pubblica Amministrazione (PA) ed Enti Pubblici**: Divieto assoluto di cold email commerciali.
   - Se un database di lead contiene soggetti appartenenti a queste categorie, devono essere scartati e cancellati immediatamente.

2. 🛑 **DIVIETO SCRAPING REGISTRI UFFICIALI (INI-PEC, IPA, ALBI PROFESSIONALI)**:
   - È severamente vietato estrarre indirizzi o PEC da elenchi istituzionali come INI-PEC, IndicePA, ordini professionali o albi per scopi di marketing o vendita. Il Garante Privacy sanziona pesantemente l'uso di elenchi pubblici per finalità diverse da quelle di notifica/istituzionale.

3. 🟢 **TARGET AMMESSI (B2B LEGITTIMO INTERESSE)**:
   - Ammesse esclusivamente **persone giuridiche private** (S.r.l., S.p.A.) e commercio al dettaglio/negozi fisici (per canali B2B rivenditori).
   - Indirizzi reperibili pubblicamente sulle pagine aziendali dei siti ufficiali (`info@`, `commerciale@`, `marketing@`, `acquisti@`).

4. 🛡️ **OBBLIGO LINK DISISCRIZIONE 1-CLICK & BLACKLIST PERMANENTE**:
   - Qualsiasi email inviata DEVE contenere a fondo testo un link di disiscrizione chiaro, visibile e funzionante (es. "Disiscriviti con 1 click").
   - Quando un utente richiede la disiscrizione, l'indirizzo deve essere inserito immediatamente nella lista di soppressione/blacklist e MAI PIÙ contattato in nessun workflow futuro.

5. ⏱️ **RITMO DI INVIO NATURALE E UMANO**:
   - Volume massimo: 15-20 email/giorno per singola casella di posta.
   - Intervallo casuale: tra 4 e 12 minuti tra un'email e la successiva. Nessun invio a raffica o blast massivo contemporaneo.
