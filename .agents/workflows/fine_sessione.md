---
description: Audit di verifica a fine sessione. Controlla inventario, requisiti, test e coerenza, scrive le note di consegna in .agents/HANDOFF.md e dà il via libera a SALVA_E_CHIUDI.bat.
---

# FINE SESSIONE - AUDIT DI VERIFICA

Questo workflow lavora insieme a APRI_LAVORO_v3.bat e SALVA_E_CHIUDI_v3.bat.

## Regole ferme
- Nulla è "fatto" o "funzionante" senza prova: mostra l'output reale di un comando eseguito ORA. Se non puoi verificare, scrivi NON VERIFICATO e spiega perché. Non riassumere a memoria.
- NON fare git commit, NON fare git push, NON cambiare branch, NON cancellare .git\index.lock, NON toccare SESSIONE_ATTIVA.lock, LOG_SESSIONI.txt né i file .bat. Commit e push li fa SALVA_E_CHIUDI.bat, che include anche HANDOFF.md.
- Non scrivere mai password, chiavi o token in nessun file.
- Niente comandi distruttivi per "sistemare" (reset --hard, clean -fd, rm -rf, checkout su file).

## 1. Inventario reale
- `git status -sb` e `git diff --stat` per il repository di questo workspace. Mostra l'output.
- Elenca ogni file creato, modificato o cancellato in questa sessione.
- Segnala: TODO, placeholder, stub, funzioni vuote, import mancanti, codice commentato lasciato per errore, duplicati o file con suffisso strano ("(1)", "conflict", "copia", "2").
- Segnala tra le modifiche i file dal nome sensibile (credenzial, password, secret, .env, .pem, .key): SALVA_E_CHIUDI.bat si bloccherebbe. Proponi la voce per .gitignore, ma non toccare git.
- Se hai modificato dati fuori dal repository (cartella Clienti, storico_commerciale_sintesi.xlsx, altri file nel cloud), elencali: SALVA_E_CHIUDI.bat copia Clienti e storico nel cloud.

## 2. Tracciabilità dei requisiti
- Elenco numerato di ogni richiesta che ti ho fatto in questa sessione.
- Per ciascuna: file/righe che la implementano + prova (comando + output).
- Stato: ✅ verificato / ⚠️ parziale / ❌ mancante / ❓ non verificabile.

## 3. Verifica tecnica
- Build, lint, type-check e test esistenti: eseguili e riporta gli errori integralmente. Nessun errore "pre-esistente" ignorato senza dirlo.
- Esegui davvero lo script/workflow con un input realistico e uno limite (vuoto, molto grande, accenti e caratteri speciali). Mostra il risultato.
- Rieseguilo una seconda volta: il risultato deve essere lo stesso (idempotenza).
- Cerca regressioni: cosa funzionava prima e potrebbe essersi rotto? Testalo.
- Per contenuti non-codice (testi, script radio, flussi n8n, Excel): riapri il file finale e verifica che sia completo, senza sezioni vuote, formule rotte o segnaposto.

## 4. Coerenza
- Import, percorsi, nomi di variabili/config/chiavi: nulla deve puntare a qualcosa che non esiste. Solo percorsi relativi, mai assoluti di una macchina (niente C:\Users\..., E:\...).
- README, config e documentazione allineati al codice attuale.

## 5. Note di consegna (OBBLIGATORIO)
- Aggiorna `.agents/HANDOFF.md` di questo repository: aggiungi IN CIMA una nuova sezione datata (data, ora, nome del PC) con: cosa è stato fatto, file toccati, cosa è verificato, cosa è rotto o incompleto, prossimo passo esatto. NON cancellare né riscrivere le sezioni precedenti. Se il file non esiste, crealo. Questo file viaggia con Git.
- Poi, se riesci ad accedere alla cartella cloud PROGETTI (percorso: %USERPROFILE%\CloudDrive\myfiles\PROGETTI), aggiorna anche STATO_ATTUALE.md con al massimo 5 righe per questo progetto. Se non riesci, scrivilo nel report: HANDOFF.md è la fonte principale.

## 6. Report finale
- Tabella: requisito | stato | prova.
- Elenco onesto dei rischi residui e delle cose NON VERIFICATE.
- Se trovi un problema: correggilo e ripeti i punti 3-4 prima di riportare.
- Chiudi con UNA sola riga:
  "VIA LIBERA: salva tutto con Ctrl+S, chiudi Antigravity ed esegui SALVA_E_CHIUDI_v3.bat"
  oppure "NON PRONTO: <motivo>".
  Via libera solo se non c'è nessun ❌, ogni ⚠️/❓ è scritto in HANDOFF.md e HANDOFF.md è stato aggiornato ora.
