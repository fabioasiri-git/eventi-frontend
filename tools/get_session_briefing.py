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
    print("\n🚨 [1. URGENZE IMMEDIATE — PROSSIME 24 ORE / LUNEDÌ 24 AGOSTO]")
    print("  • 🎵 GD Outreach Campaign Re-Start (ore 09:00):")
    print("    - Riattivare nodo scheduler in n8n workflow 'PT8HlVTxFmHgOy5R'.")
    print("    - 91 stazioni FM in coda pronte (19 partono da Email 3; 72 nuove da Email 1).")
    print("  • 📻 GD Contatti Diretti Prioritari:")
    print("    - Radio Arcobaleno (Franco Airi) → Mail con file audio prova syndication.")
    print("    - Radio Stereocittà (Massimo Righetto) → Follow-up WhatsApp (392 9959535).")
    print("    - Radio Velluto (Alessandro) → Mail pianificazione palinsesto autunno.")
    print("    - Radio Vicenza, Vallebelbo, Amore Nostalgia Catania → Invio test file regia.")
    print("  • 🎧 Music Intelligence (Radio Toscana & Radio Firenze):")
    print("    - Verifica auto-catchup passaggi weekend e invio report settimanale PDF.")
    print("    - Radio Toscana (Adult Pop) → invio a redazione musicale.")
    print("    - Radio Firenze (Dance Discoradio) → invio a Gabriele Doria (doria@radiotoscana.it).")

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
