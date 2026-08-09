"""
Antigravity Quota Tracker v3.0
- Baseline reale da quota_config.json (aggiornato manualmente ogni sera dall'interfaccia)
- Delta consumo di sessione corrente tracciato dai log locali (da last_check in poi)
- Quota finale = baseline - delta sessione odierna
- Separazione Gemini vs Claude/GPT
- Finestra mobile 5 ore
- Countdown reset settimanale
"""

import glob
import json
import os
from datetime import datetime, timedelta, timezone

# ─── PERCORSI ─────────────────────────────────────────────────────────────────
BRAIN_DIR          = r"C:\Users\fabio\.gemini\antigravity\brain"
CURRENT_CONV_ID    = "29845249-802f-4301-99a3-04819cb49321"
OUTPUT_PATH        = os.path.join(BRAIN_DIR, CURRENT_CONV_ID, "quota_status.md")
CONFIG_PATH        = os.path.join(os.path.dirname(__file__), "quota_config.json")

# ─── CARICA CONFIGURAZIONE BASELINE ──────────────────────────────────────────
def load_config():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

# ─── UTILITY ──────────────────────────────────────────────────────────────────
def parse_iso_date(ts_str):
    if not ts_str:
        return None
    try:
        ts_str = ts_str.replace("Z", "+00:00")
        return datetime.fromisoformat(ts_str)
    except Exception:
        return None

def build_bar(pct_remaining, width=22):
    """Barra a scalare: piena = quota disponibile, vuota = esaurita."""
    pct = max(0.0, min(100.0, pct_remaining))
    filled = int(round((pct / 100.0) * width))
    return "█" * filled + "░" * (width - filled)

def status_icon(pct_remaining):
    if pct_remaining <= 5:   return "🔴 CRITICO"
    if pct_remaining <= 20:  return "🟠 Molto basso"
    if pct_remaining <= 40:  return "🟡 In calo"
    return "🟢 Disponibile"

def format_delta(dt_target, now):
    secs = int((dt_target - now).total_seconds())
    if secs <= 0:
        return "RESET AVVENUTO"
    d, rem = divmod(secs, 86400)
    h, rem = divmod(rem, 3600)
    m      = rem // 60
    if d > 0:
        return f"{d}g {h}h {m}m"
    return f"{h}h {m}m"

day_names_it = {
    'Monday':'Lunedi', 'Tuesday':'Martedi', 'Wednesday':'Mercoledi',
    'Thursday':'Giovedi', 'Friday':'Venerdi', 'Saturday':'Sabato', 'Sunday':'Domenica'
}

CLAUDE_GPT_KEYWORDS = ['claude', 'gpt', 'sonnet', 'opus', 'haiku', 'turbo']
GEMINI_KEYWORDS      = ['gemini', 'flash', 'pro']

def detect_group(data):
    s = (str(data.get('model','')+data.get('model_id','')+data.get('model_name',''))).lower()
    if any(k in s for k in CLAUDE_GPT_KEYWORDS): return 'claude_gpt'
    if any(k in s for k in GEMINI_KEYWORDS):      return 'gemini'
    return 'unknown'

# ─── ANALISI LOG LOCALI (SOLO DA last_check IN POI) ──────────────────────────
def analyze_delta(since_dt):
    """
    Conta i prompt USER_INPUT avvenuti DOPO since_dt sui log locali.
    Restituisce:
      delta_gemini_weekly  : prompt Gemini dopo since_dt
      delta_claude_weekly  : prompt Claude/GPT dopo since_dt
      gemini_5h            : prompt Gemini ultime 5 ore
      claude_5h            : prompt Claude/GPT ultime 5 ore
      daily_table          : dict date_str -> {gemini, claude_gpt, unknown}
    """
    files = glob.glob(os.path.join(BRAIN_DIR, "*", ".system_generated", "logs", "transcript.jsonl"))

    now_utc      = datetime.now(timezone.utc)
    five_h_ago   = now_utc - timedelta(hours=5)

    # Rendi since_dt aware
    if since_dt.tzinfo is None:
        since_dt = since_dt.replace(tzinfo=timezone.utc)

    delta_gemini = 0
    delta_claude = 0
    gemini_5h    = 0
    claude_5h    = 0
    daily_table  = {}

    for f in files:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            for line in fp:
                line = line.strip()
                if not line: continue
                try:
                    data  = json.loads(line)
                    stype = data.get('type')
                    if stype != 'USER_INPUT':
                        continue
                    ts = parse_iso_date(data.get('timestamp') or data.get('created_at'))
                    if not ts: continue
                    if ts.tzinfo is None:
                        ts = ts.replace(tzinfo=timezone.utc)

                    group    = detect_group(data)
                    date_str = ts.strftime('%Y-%m-%d')

                    # Tabella giornaliera (tutti i giorni)
                    if date_str not in daily_table:
                        daily_table[date_str] = {'gemini': 0, 'claude_gpt': 0, 'unknown': 0}
                    daily_table[date_str][group] = daily_table[date_str].get(group, 0) + 1

                    # Delta da last_check
                    if ts >= since_dt:
                        if group == 'claude_gpt':
                            delta_claude += 1
                        else:
                            delta_gemini += 1

                    # Finestra 5 ore
                    if ts >= five_h_ago:
                        if group == 'claude_gpt':
                            claude_5h += 1
                        else:
                            gemini_5h += 1

                except Exception:
                    pass

    return delta_gemini, delta_claude, gemini_5h, claude_5h, daily_table

# ─── GENERA REPORT MARKDOWN ───────────────────────────────────────────────────
def generate_report(cfg, delta_g, delta_c, g5h, c5h, daily_table):
    now = datetime.now()

    # ── Calcolo quota rimanente reale ─────────────────────────────────────────
    # Stima: ogni prompt consuma circa 0.4% di quota su Gemini (calibrabile)
    # Usiamo un peso conservativo: ogni prompt locale corrisponde a ~0.5% di quota
    GEMINI_PCT_PER_PROMPT = 0.5
    CLAUDE_PCT_PER_PROMPT = 0.5

    gemini_baseline = cfg['gemini']['weekly_pct_remaining']
    claude_baseline  = cfg['claude_gpt']['weekly_pct_remaining']

    gemini_remaining = max(0.0, gemini_baseline - delta_g * GEMINI_PCT_PER_PROMPT)
    claude_remaining  = max(0.0, claude_baseline  - delta_c * CLAUDE_PCT_PER_PROMPT)

    gemini_5h_baseline = cfg['gemini']['fivehour_pct_remaining']
    claude_5h_baseline  = cfg['claude_gpt']['fivehour_pct_remaining']
    gemini_5h_rem = max(0.0, gemini_5h_baseline - g5h * GEMINI_PCT_PER_PROMPT)
    claude_5h_rem  = max(0.0, claude_5h_baseline  - c5h * CLAUDE_PCT_PER_PROMPT)

    # ── Countdown reset ───────────────────────────────────────────────────────
    last_check_dt     = parse_iso_date(cfg['last_check'])
    if last_check_dt.tzinfo is None:
        last_check_dt = last_check_dt.replace(tzinfo=timezone.utc)

    gemini_reset_dt = last_check_dt + timedelta(hours=cfg['gemini']['reset_in_hours'])
    claude_reset_dt  = last_check_dt + timedelta(hours=cfg['claude_gpt']['reset_in_hours'])
    now_tz           = now.replace(tzinfo=timezone.utc)
    gemini_reset_str = format_delta(gemini_reset_dt, now_tz)
    claude_reset_str  = format_delta(claude_reset_dt, now_tz)

    # ── Alert principale ──────────────────────────────────────────────────────
    if gemini_remaining <= 2 and claude_remaining <= 10:
        alert = """> [!CAUTION]
> QUOTA CRITICA SU ENTRAMBI I POOL! Rallenta al massimo fino al reset.
"""
    elif gemini_remaining <= 5:
        alert = f"""> [!WARNING]
> QUOTA GEMINI CRITICA ({gemini_remaining:.1f}% stimato rimasto)
> Usa solo Claude/GPT ({claude_remaining:.0f}% disponibile). Reset Gemini tra: {gemini_reset_str}
"""
    elif gemini_remaining <= 20 or claude_remaining <= 20:
        alert = f"""> [!IMPORTANT]
> QUOTA IN ESAURIMENTO — Gemini: {gemini_remaining:.1f}% | Claude/GPT: {claude_remaining:.0f}%
> Distribuisci con attenzione i prompt tra i due pool.
"""
    else:
        alert = f"""> [!NOTE]
> Situazione gestibile. Gemini: {gemini_remaining:.1f}% | Claude/GPT: {claude_remaining:.0f}%
"""

    # ── Tabella 7 giorni ──────────────────────────────────────────────────────
    today_str = now.strftime('%Y-%m-%d')
    last_7    = [(now - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(6, -1, -1)]
    rows = []
    for d in last_7:
        d_obj  = datetime.strptime(d, '%Y-%m-%d')
        label  = day_names_it.get(d_obj.strftime('%A'), d_obj.strftime('%A'))
        label += f" ({d_obj.strftime('%d/%m')})"
        dd     = daily_table.get(d, {'gemini': 0, 'claude_gpt': 0, 'unknown': 0})
        g_p    = dd.get('gemini', 0)
        c_p    = dd.get('claude_gpt', 0)
        u_p    = dd.get('unknown', 0)
        tot    = g_p + c_p + u_p
        marker = " <-- Oggi" if d == today_str else ""
        rows.append(f"| **{label}**{marker} | `{g_p}` | `{c_p}` | `{u_p}` | `{tot}` |")
    table = "\n".join(rows)

    # ── Nota baseline ─────────────────────────────────────────────────────────
    last_check_local = parse_iso_date(cfg['last_check'])
    last_check_str   = last_check_local.strftime('%d/%m/%Y alle %H:%M') if last_check_local else "N/D"

    md = f"""# Antigravity Quota & Pacing Tracker

Ultimo aggiornamento: {now.strftime('%Y-%m-%d %H:%M:%S')}
Baseline letta dall'interfaccia: {last_check_str} | Delta sessione locale incluso.

{alert}

---

## Quota Settimanale Rimanente (Stimata)

| Gruppo Modelli | % Rimasta | Barra | Stato | Reset tra |
| :--- | :---: | :--- | :---: | :---: |
| Gemini (Flash / Pro) | **{gemini_remaining:.1f}%** | `[{build_bar(gemini_remaining)}]` | {status_icon(gemini_remaining)} | {gemini_reset_str} |
| Claude & GPT (Sonnet / GPT-4o) | **{claude_remaining:.1f}%** | `[{build_bar(claude_remaining)}]` | {status_icon(claude_remaining)} | {claude_reset_str} |

> [!TIP]
> La % mostrata e' la **quota RIMASTA** (come nell'interfaccia Antigravity).
> Baseline inserita manualmente a sera. Delta locale aggiunto automaticamente dalla sessione corrente.

---

## Finestra Breve — Short-Term Limit (Ultime 5 Ore)

| Gruppo | Prompt usati (5h) | % 5h Rimasta | Barra |
| :--- | :---: | :---: | :--- |
| Gemini | `{g5h}` | `{gemini_5h_rem:.0f}%` | `[{build_bar(gemini_5h_rem)}]` |
| Claude & GPT | `{c5h}` | `{claude_5h_rem:.0f}%` | `[{build_bar(claude_5h_rem)}]` |

---

## Utilizzo Giornaliero — Ultimi 7 Giorni (Log Locali)

| Giorno | Prompt Gemini | Prompt Claude/GPT | Non Identificati | Totale |
| :--- | :---: | :---: | :---: | :---: |
{table}

---

## Come Aggiornare la Baseline (ogni sera)

1. Apri Antigravity > Settings > Model Quota
2. Guarda le % rimanenti per Gemini e Claude/GPT
3. Apri il file e aggiorna i valori:

```
e:\\Lead Engine RT\\scripts\\quota_config.json
```

4. Riesegui lo script:

```powershell
python "e:\\Lead Engine RT\\scripts\\quota_tracker.py"
```
"""

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(md)

    print(f"[OK] Dashboard aggiornata: {OUTPUT_PATH}")
    print(f"   Baseline: Gemini {gemini_baseline}% | Claude {claude_baseline}%")
    print(f"   Delta sessione locale: +{delta_g} Gemini, +{delta_c} Claude/GPT")
    print(f"   Stima attuale rimasta: Gemini {gemini_remaining:.1f}% | Claude {claude_remaining:.1f}%")
    print(f"   Reset Gemini: {gemini_reset_str} | Reset Claude: {claude_reset_str}")

# ─── MAIN ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    cfg        = load_config()
    since_dt   = parse_iso_date(cfg['last_check'])
    dg, dc, g5h, c5h, daily = analyze_delta(since_dt)
    generate_report(cfg, dg, dc, g5h, c5h, daily)
