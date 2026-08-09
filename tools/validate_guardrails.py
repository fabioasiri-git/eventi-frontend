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
        "app/page.tsx",
        "app/layout.tsx",
        "package.json",
        "vercel.json"
    ]
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for rel_path in required_files:
        full_path = os.path.join(base_dir, rel_path)
        if not os.path.exists(full_path):
            errors.append(f"❌ File obbligatorio mancante: {rel_path}")

    # 2. Verifica che app/page.tsx contenga l'integrazione Supabase attiva
    page_tsx_path = os.path.join(base_dir, "app", "page.tsx")
    if os.path.exists(page_tsx_path):
        with open(page_tsx_path, "r", encoding="utf-8") as f:
            content = f.read()
            if "fetchSupabaseLeads" not in content and "supabase" not in content.lower():
                errors.append("⚠️ Guardrail Warning: app/page.tsx non ha l'integrazione Supabase attiva!")

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
