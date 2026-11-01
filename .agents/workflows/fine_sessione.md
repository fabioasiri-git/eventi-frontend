---
description: Fine sessione. Verifica con prove, ordina, aggiorna HANDOFF.md e dice se si puo' salvare con SALVA_E_CHIUDI_v4.
---

# FINE SESSIONE

Regole: niente git a parte `git status` e `git diff --stat`. Niente comandi distruttivi. Niente password nei file.

1. Inventario: mostra `git status -sb` e `git diff --stat`. Elenca i file creati, modificati, cancellati in questa sessione.
2. Ordine:
   - script di prova o una tantum fuori da `_scratch/`? Spostali in `_scratch/` (dillo nel riepilogo);
   - file con suffissi _v2/_fix/_final/(1), esportazioni, backup, zip, audio, file oltre 20 MB nel repository? Segnalali;
   - password scritte in file nuovi o modificati? Segnala file e riga, non copiarle.
3. Verifica: per ogni cosa fatta oggi, la prova (comando + output reale) oppure NON VERIFICATO.
   Se hai toccato produzione (sito, n8n attivo, database, invii): mostra backup fatto e verifica dopo la modifica.
4. Aggiorna HANDOFF.md aggiungendo IN CIMA la sezione di oggi (max 30 righe). Decisioni nuove di Fabio in DECISIONI.md.
5. Ultima riga, una sola: "PRONTO PER SALVA_E_CHIUDI_v4" oppure "NON PRONTO: <motivo>".
