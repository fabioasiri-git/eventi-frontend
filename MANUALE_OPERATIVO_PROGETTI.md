# 📘 MANUALE OPERATIVO PROGETTI & ARCHITETTURA GUARDRAIL (2026)

**Versione:** 1.0  
**Ambito:** Sistema di Isolamento Multi-Progetto & Guardrail Deterministici per Agenti AI  
**Progetti Supportati:** Lead Engine RT, DB Musicale, Generazione Dance, Elisir di Collina  

---

## 🛡️ 1. Architettura a 4 Pilastri per la Prevenzione del Drift

Per garantire zero allucinazioni e impedire la sovrapposizione tra progetti diversi, l'Agente applica i seguenti 4 pilastri architetturali:

### Pilastro 1: Pre-Action Deterministic Gatekeeper
- Nessuna azione diretta su Database o server esterni viene eseguita affidandosi unicamente al testo del prompt.
- Ogni operazione viene validata dallo script deterministico `tools/validate_guardrails.py`.

### Pilastro 2: Context Locking & Least-Privilege Execution
- Ogni progetto possiede una perimetrazione isolata con regole dedicate.
- L'Agente opera unicamente all'interno del progetto dichiarato attivo (es. **LEAD ENGINE RT**), senza richiamare schema o regole di altri progetti.

### Pilastro 3: Immutable Snapshots & Pre-Commit Validation
- Nessun file viene lasciato sospeso in stato incompleto.
- Le modifiche vengono verificate ed esportate con snapshot verificabili.

### Pilastro 4: Self-Healing & Continuous Evaluation Loop
- Gli errori o i tentativi di violazione guardrail vengono registrati nello script `tools/self_analysis_evals.py`.
- L'Agente applica una fase interna di Reflection (Generate ➔ Critique ➔ Deliver) prima di restituire il risultato finale.

---

## 📁 2. Struttura del Progetto Lead Engine RT

- **Manuale Operativo:** MANUALE_OPERATIVO_LEAD_ENGINE.md
- **Schema DB Supabase:** `rt_lead_engine` (`rt_lead_engine_pool`)
- **Dashboard Cloud:** `dashboard/` (Vercel deployment: `eventi-frontend`)
- **Script di Validazione:** `tools/validate_guardrails.py`
- **Script Evals & Self-Healing:** `tools/self_analysis_evals.py`
