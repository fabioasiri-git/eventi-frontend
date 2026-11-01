# HANDOFF - Lead Engine RT

File unico di passaggio tra sessioni e tra PC (regola 7 di AGENTS.md).
Ogni sessione aggiunge IN CIMA una sezione di massimo 30 righe:
data e ora | PC | fatto | file toccati | verificato (con prova) | aperto o rotto | prossimo passo.

Storico precedente (sola lettura): CHECKOUT_HOME_SESSION.md, MANUALE_OPERATIVO_LEAD_ENGINE.md

---

## 01/11/2026 - DESKTOP-7DSGCU1 - Claude (supervisore)
- Fatto: installate le REGOLE COMUNI in AGENTS.md (parte 1), creato questo HANDOFF.md e DECISIONI.md, aggiunte `_scratch/` e `_backup/` al .gitignore.
- Sincronizzazione: da oggi si usano APRI_LAVORO_v4 e SALVA_E_CHIUDI_v4 (cartella PROGETTI\_v4). Gli agenti non usano git.
- Prossimo passo: supervisione del progetto da parte di Claude (workflow, database, pagine, script).
