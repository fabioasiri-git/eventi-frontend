import sys, os
from datetime import datetime, date

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

def print_executive_briefing():
    today = date.today()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    print("\n==========================================================================")
    print(f"📋 EXECUTIVE BRIEFING & PRIORITÀ SESSIONE — {now_str}")
    print("==========================================================================")

    # 1. URGENZE IMMEDIATE (Oggi / Prossime 24 Ore)
    # 1. STATO ATTUALE & PRIORITÀ ATTIVE (Martedì 8 Settembre 2026)
    print("\n🚨 [1. PRIORITÀ ATTIVE — MARTEDÌ 8 SETTEMBRE 2026]")
    print("  • 🎵 GD Outreach Campaign (Start ore 10:00):")
    print("    - Workflow n8n 'PT8HlVTxFmHgOy5R' ATTIVO (True).")
    print("    - Database emittenti bonificato al 100%: 21 domini inesistenti rimossi, 10 radio FM reali con MX verificato in coda.")
    print("  • 📻 GD Accordi Syndication Prioritari:")
    print("    - Radio Nostalgia (Lancio confermato Venerdì 2 Ottobre ore 21:00).")
    print("    - Radio Arcobaleno (Franco Airi) → Confermato accordo syndication.")
    print("    - Radio Stereocittà (Massimo Righetto) & Radio Velluto.")
    print("  • 🎧 Music Intelligence (Radio Toscana & Radio Firenze):")
    print("    - Workflow Toscana ('Iz4FEv42Ll6dl8pU') & Firenze ('7h7x6US8dj2yTC9l') entrambi ATTIVI.")
    print("    - Dati passaggi storici sincronizzati fino al 6-7 Settembre.")

    # 2. ROADMAP PRIORITARIA DI RIPARTENZA (DOMENICA)
    print("\n🎯 [2. ROADMAP PRIORITARIA LEAD ENGINE RT — DOMENICA]")
    print("  • 1. PERSISTENZA PREVENTIVI & CONTRATTI:")
    print("       Salvare in automatico le trattative aperte in localStorage + Supabase Cloud (zero perdite al refresh).")
    print("  • 2. AZIONI RAPIDE SULLA CARD KANBAN:")
    print("       Aggiungere sulla scheda del cliente i bottoni '📄 Riapri Proposta A4' e '📝 Passa a Contratto RMS'.")
    print("  • 3. PIPELINE REALIZZAZIONE SPOT AUDIO:")
    print("       Collegare la voce di produzione spot audio al flusso copywriter/studio di registrazione (SLA 7 gg).")

    # 3. STATO SISTEMI & 5 PROGETTI
    print("\n🟢 [3. STATO ATTIVO SUI 5 PROGETTI]")
    print("  • RT Lead Engine:           🟢 CRM Kanban v7.7 Vercel LIVE | Proposta & Contratto RMS A4 Print Fix OK")
    print("  • Music Intelligence:       🟢 3.260 brani RT | 858 brani RF | Deezer/Spotify API attiva")
    print("  • Generazione Dance (GD):  🟢 13/13 Puntate Schedulate | Funnel 5-step & 5 landing live")
    print("  • Elisir B2B:               🟢 Landing WordPress ID 129/286 live | XML-RPC OK")
    print("  • Syndication Nostalgia:    🟢 Messa in onda confermata 2 Ottobre 2026")
    print("==========================================================================\n")

if __name__ == "__main__":
    print_executive_briefing()
