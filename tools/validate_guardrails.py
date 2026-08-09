import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

def validate_lead_engine_guardrails():
    print("🛡️ ESECUZIONE VALIDATION GUARDRAILS: LEAD ENGINE RT")
    errors = []

    # 1. Verifica esistenza file manuali chiave
    required_files = [
        "MANUALE_OPERATIVO_LEAD_ENGINE.md",
        "MANUALE_OPERATIVO_PROGETTI.md",
        "dashboard/index.html",
        "dashboard/app.js",
        "dashboard/vercel.json"
    ]
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for rel_path in required_files:
        full_path = os.path.join(base_dir, rel_path)
        if not os.path.exists(full_path):
            errors.append(f"❌ File obbligatorio mancante: {rel_path}")

    # 2. Verifica che dashboard/app.js non contenga solo finti dati statici
    app_js_path = os.path.join(base_dir, "dashboard", "app.js")
    if os.path.exists(app_js_path):
        with open(app_js_path, "r", encoding="utf-8") as f:
            content = f.read()
            if "INITIAL_LEADS" in content and "createClient" not in content and "fetchSupabaseLeads" not in content:
                errors.append("⚠️ Guardrail Warning: dashboard/app.js non ha ancora l'integrazione Supabase attiva!")

    # 3. Risultato della validazione
    if errors:
        print("\n🚨 GUARDRAIL VALIDATION ERRORI TROVATI:")
        for err in errors:
            print(f"  {err}")
        return False
    else:
        print("\n✅ TUTTI I GUARDRAIL SUPERATI CON SUCCESSO! Ambito Lead Engine RT isolato e valido.")
        return True

if __name__ == "__main__":
    success = validate_lead_engine_guardrails()
    sys.exit(0 if success else 1)
