import subprocess, sys, os

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

print("==========================================================================")
print("🚀 PROTOCOLLO INIZIO SESSIONE (CHECK-IN) — CASA / RADIO WORKSPACE")
print("==========================================================================")

print("\n--- 1. SCARICO GLI ULTIMI AGGIORNAMENTI DA GITHUB (GIT PULL) ---")
try:
    res = subprocess.run(["git", "pull", "origin", "main"], capture_output=True, text=True, check=True)
    print(res.stdout)
except Exception as e:
    print("⚠️ Attenzione durante il git pull:", e)

tools_dir = os.path.dirname(os.path.abspath(__file__))
sync_path = os.path.join(tools_dir, "session_sync.py")
if os.path.exists(sync_path):
    subprocess.run([sys.executable, sync_path])

validator_path = os.path.join(tools_dir, "validate_guardrails.py")
val_res = subprocess.run([sys.executable, validator_path])

if val_res.returncode == 0:
    print("\n✅ CHECK-IN COMPLETATO CON SUCCESSO! IL SISTEMA È ALLINEATO E PRONTO.")
    briefing_path = os.path.join(tools_dir, "get_session_briefing.py")
    subprocess.run([sys.executable, briefing_path])
else:
    print("\n❌ CHECK-IN BLOCCATO: Riscontrate anomalie nei dati o nei guardrail.")
