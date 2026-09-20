---
description: Inizio sessione. Legge STATO_ATTUALE.md, riassume cosa risulta fatto e cosa no, controlla git status. Non modifica nulla.
---

# INIZIO SESSIONE

Questo workflow va usato dopo che APRI_LAVORO.bat e' finito verde.

1. Leggi STATO_ATTUALE.md nella cartella cloud PROGETTI (percorso: %USERPROFILE%\CloudDrive\myfiles\PROGETTI). Se non riesci ad accedere alla cartella, dimmelo e ti incollo il contenuto io.
2. Riassumimi in poche righe: cosa risulta fatto e verificato, cosa e' rotto o incompleto, qual e' il prossimo passo.
3. Esegui `git status -sb` su ogni repository del progetto e mostrami l'output. Segnala se il branch e' indietro, avanti o divergente rispetto a origin, o se ci sono modifiche non salvate.
4. NON modificare nulla e NON fare git pull, push o checkout. Aspetta la mia conferma prima di iniziare a lavorare.
