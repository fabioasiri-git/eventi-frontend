# HANDOFF - Lead Engine RT

File unico di passaggio tra sessioni e tra PC (regola 7 di AGENTS.md).
Ogni sessione aggiunge IN CIMA una sezione di massimo 30 righe:
data e ora | PC | fatto | file toccati | verificato (con prova) | aperto o rotto | prossimo passo.

Storico precedente (sola lettura): CHECKOUT_HOME_SESSION.md, MANUALE_OPERATIVO_LEAD_ENGINE.md

---

## 02/11/2026 18:30 - PC ufficio "fabio" - Claude (supervisore)
- Fatto: regola 8 v2 (8a-8e, cartella dati condivisa) in AGENTS.md PARTE 1; riga in DECISIONI.md; creata `PROGETTI\RT_Archivio_Commerciale\` con `_IN_USO.txt` (LIBERO) e `_inventario\inventario_UFFICIO.csv`.
- File toccati: AGENTS.md, DECISIONI.md, HANDOFF.md (backup in `_backup/2026-11-02/`).
- Verificato: inventario copiato identico (cmp), 2.309 righe; 1.369 contenuti unici, 940 copie identiche; Archivio_Commerciale e storico_contratti: 913 comuni, 216 solo Archivio, 206 solo storico.
- Aperto: inventario PC di casa (DESKTOP-7DSGCU1) stasera; regola 8 v2 da riportare negli altri 3 progetti; `PROGETTI\Lead_Engine_RT` contiene una cartella .git (in contrasto con 8c): da valutare, non toccata.
- Prossimo passo: inventario casa -> unione -> piano di riordino file per file da approvare.

## 01/11/2026 - DESKTOP-7DSGCU1 - Claude (supervisore)
- Fatto: installate le REGOLE COMUNI in AGENTS.md (parte 1), creato questo HANDOFF.md e DECISIONI.md, aggiunte `_scratch/` e `_backup/` al .gitignore.
- Sincronizzazione: da oggi si usano APRI_LAVORO_v4 e SALVA_E_CHIUDI_v4 (cartella PROGETTI\_v4). Gli agenti non usano git.
- Prossimo passo: supervisione del progetto da parte di Claude (workflow, database, pagine, script).
