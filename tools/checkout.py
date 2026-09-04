import subprocess, sys, os

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

print("==========================================================================")
print("🏁 PROTOCOLLO FINE SESSIONE (CHECK-OUT) — CASA / RADIO WORKSPACE")
print("==========================================================================")

tools_dir = os.path.dirname(os.path.abspath(__file__))
validator_path = os.path.join(tools_dir, "validate_guardrails.py")
val_res = subprocess.run([sys.executable, validator_path])

if val_res.returncode != 0:
    print("\n❌ CHECK-OUT ANNULLATO: Trovati errori nei guardrail. Risolverli prima del push.")
    sys.exit(1)

exporter_path = os.path.join(tools_dir, "export_all_n8n_workflows.py")
if os.path.exists(exporter_path):
    print("\n--- 2. ESPORTO IL BACKUP COMPLETO DEI WORKFLOW N8N ---")
    try:
        subprocess.run([sys.executable, exporter_path], check=True)
    except Exception as e:
        print("⚠️ Attenzione export n8n:", e)

print("\n--- 3. SALVO E SPINGO TUTTI I FILE SU GITHUB (GIT COMMIT & PUSH) ---")
try:
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", "Check-out automatico fine sessione: stato verificato e validato"], check=True)
    push_res = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True, check=True)
    print(push_res.stdout)
    print("\n✅ CHECK-OUT COMPLETATO CON SUCCESSO! TUTTO IL LAVORO È SICURO SU GITHUB.")
except Exception as e:
    print("⚠️ Note Git commit/push:", e)
