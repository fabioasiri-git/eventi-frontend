import os
import sys
import json
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

LOG_FILE = os.path.join(os.path.dirname(__file__), "evals_history.json")

def log_failure_trace(component, error_type, details, solution):
    trace = {
        "timestamp": datetime.now().isoformat(),
        "component": component,
        "error_type": error_type,
        "details": details,
        "solution": solution
    }
    history = []
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, "r", encoding="utf-8") as f:
                history = json.load(f)
        except Exception:
            history = []
    
    history.append(trace)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)
    
    print(f"📝 Failure trace registrata in evals_history.json [{component} - {error_type}]")

def run_self_evals():
    print("🔍 ESECUZIONE SELF-ANALYSIS & EVALUATION LOOP...")
    # Check if there are past failure traces to learn from
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            history = json.load(f)
            print(f"ℹ️ Storico Tracce di Errore: {len(history)} registrate.")
    else:
        print("✅ Registro Tracce di Errore pulito. Nessuna anomalia pregressa.")

if __name__ == "__main__":
    run_self_evals()
