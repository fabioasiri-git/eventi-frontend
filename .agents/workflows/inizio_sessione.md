---
description: Inizio sessione. Ricostruisce cosa è stato fatto dall'ultima volta leggendo Git (fonte affidabile), HANDOFF.md e STATO_ATTUALE.md. Mostra git status. Non modifica nulla.
---

# INIZIO SESSIONE

Va usato dopo che APRI_LAVORO_v3.bat è finito verde. Vale per il repository di questo workspace.

## Regole
- Mostra l'output reale di ogni comando. Se non riesci a eseguire o leggere qualcosa, scrivi NON VERIFICATO e spiega perché. Non riassumere a memoria e non dire "sessione allineata" senza prova.
- NON modificare nulla. NON fare git pull, push, checkout, reset o commit.

## 1. Git (fonte più affidabile di ciò che è stato fatto)
Esegui e mostra l'output di:
- `git status -sb`
- `git log -5 --date=format:"%d/%m/%Y %H:%M" --pretty=format:"%h | %ad | %s" --stat`

I commit creati da SALVA_E_CHIUDI hanno un messaggio del tipo "sync: sessione <NOME PC> <data> <ora>": da lì ricavi da quale PC e quando è stato fatto l'ultimo salvataggio, e dalle statistiche quali file sono stati toccati.

## 2. Note di consegna
- Leggi `.agents/HANDOFF.md` (se esiste) e riporta la sezione più recente con la sua data.
- Leggi STATO_ATTUALE.md nella cartella cloud PROGETTI (percorso: %USERPROFILE%\CloudDrive\myfiles\PROGETTI). Se non riesci ad accedere alla cartella, dimmelo.

## 3. Riassunto (tre blocchi)
- **Ultimo salvataggio**: data, ora, PC e file modificati, ricavati dal log Git.
- **Cosa dicono le note**: cosa riportano HANDOFF.md e STATO_ATTUALE.md. Segnala ogni discrepanza con il log Git (per esempio file modificati che le note non citano) e se le note sono più vecchie dell'ultimo commit.
- **Prossimo passo proposto**.

## 4. Fine
Poi fermati e aspetta la mia conferma prima di lavorare.
