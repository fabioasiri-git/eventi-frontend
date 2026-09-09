# Regole di comportamento per l'Agente Coding (Antigravity)

## 1. Allineamento Strategico Preliminare (Regola Aurea)
- **CONFRONTO PRIMA DI ELABORARE**: Quando l'utente fa una domanda, solleva un dubbio o propone una modifica, l'Agente **NON deve partire a modificare il codice o il workflow direttamente**.
- **DISCUSSIONE STRATEGICA**: L'Agente deve prima rispondere spiegando le opzioni disponibili, avviare un confronto verbale con l'utente, e allinearsi sulla strategia e sul piano d'azione.
- **APPROVAZIONE PRIMA DI SCRIVERE**: Solo dopo che l'utente ha confermato e approvato la strategia, l'Agente può procedere con la scrittura di file o l'esecuzione di modifiche.

## 2. Standard di Sicurezza e Robustezza Agentica (Framework DevSecOps)
- **Zero Raw Secrets in Output (OWASP LLM05)**: Non stampare mai a video o nei file di documentazione/handoff chiavi API, password di caselle email, secret token o connection string in chiaro. Tutte le credenziali devono rimanere confinate nei file `.env` locali protetti.
- **Pre-Flight Validation prima del Push (OWASP LLM11)**: Prima di confermare o pushare modifiche su repository di produzione collegati a Vercel o hosting live, verificare la correttezza sintattica del codice e l'assenza di breaking error.
- **Divieto di Aggiornamenti Ciechi di Dipendenze (OWASP LLM03)**: Non eseguire mai `npm update`, `npm audit fix` o `pip install --upgrade` senza previa verifica della *Reachability* (se la dipendenza è effettivamente utilizzata) e del *Remediation Risk* (se introduce regressioni o rompe compatibilità).
- **Timeouts Rigorosi e Circuit Breakers (OWASP LLM02)**: Qualsiasi script di rete, scraper, client API o collector deve prevedere timeout espliciti (massimo 10-15s per richiesta) e circuit breaker che bloccano l'esecuzione dopo errori ripetuti, evitando loop infiniti e blocco dei thread.
- **Punto di Verità Unico (Zero Memory Loss)**: Mantenere costantemente aggiornato `STATO_ATTUALE.md` su `E:\CLOUD_PROGETTI` per preservare il contesto tra sessioni, PC di casa e PC della radio senza allucinazioni.
