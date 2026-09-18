# 🛡️ MANDATORY ENGINEERING RULES & AGENTIC GUARDRAILS

## 1. REGOLA D'ORO: DIVIETO ASSOLUTO DI AUTOCERTIFICAZIONE
L'Agente AI ha il **divieto categorico e non negoziabile** di dichiarare:
- *"Tutto risolto / Operativo al 100% / Sistema blindato / Zero rimbalzi"*
a meno che non abbia eseguito formalmente la suite di test deterministica:
```bash
python tools/test_e2e_guardrails.py
```
e verificato che tutti i test abbiano superato le asserzioni con codice di uscita `0`. Se i test falliscono o non sono stati eseguiti, l'Agente deve riportare lo stato come **NON VERIFICATO** o mostrare il traceback dell'errore.

---

## 2. BULKHEAD ISOLATION & DIVIETO DI TEST IN PRODUZIONE
- **Nessun invio live non autorizzato:** È vietato avviare cron continui o script di invio massivo agganciati a caselle email reali di produzione (`fabio.asiri@radiotoscana.it`, `fabio@generazionedance.it`).
- **Modalità DRY_RUN predefinita:** Qualsiasi script o workflow di outreach deve avere come default `DRY_RUN = True` e simulare l'invio scrivendo nella tabella di audit `registro_simulazione_invii`.
- **Human-in-the-Loop:** Gli invii reali possono avvenire **esclusivamente a batch controllati** previa notifica di riepilogo a Fabio su Telegram e comando esplicito da terminale con `--confirm-send`.

---

## 3. INTEGRITÀ DEI DATI & VINCOLI DI DATABASE (POSTGRESQL)
- I vincoli di validità risiedono a livello di database tramite il trigger `trg_enforce_outreach_safety`.
- Nessun record può avere `verificata_smtp = true` o `stato = 'approvato_invio'` se non possiede una nota certificata Reoon (`Reoon SAFE%` o `Reoon ROLE_ACCOUNT%`).
- Ogni lead con stato `escluso%` deve avere `verificata_smtp = false`.

---

## 4. GATEKEEPER APPLICATIVO
- In ogni workflow n8n o script Python, deve essere presente un blocco Gatekeeper immediatamente prima della funzione/nodo SMTP che solleva un'eccezione bloccante se il lead non è certificato.
- Se si modifica una query o un nodo a monte, l'Agente è **obbligato a verificare l'intero grafo a valle** (nodi Switch, connettori, formattatori).
