import json
import sys

# Imposta codifica UTF-8 per la console Windows
sys.stdout.reconfigure(encoding='utf-8')

# ==========================================================
# MAPPATURA GEOGRAFICA (Aree Media Kit 2026 Radio Toscana)
# ==========================================================
AREA_MAPPING = {
    "FI": ("AREA 1", "Firenze, Prato, Pistoia - Cuore economico e popoloso (298k ascoltatori)", 1.0, 9.00),
    "PO": ("AREA 1", "Firenze, Prato, Pistoia - Cuore economico e popoloso (298k ascoltatori)", 1.0, 9.00),
    "PT": ("AREA 1", "Firenze, Prato, Pistoia - Cuore economico e popoloso (298k ascoltatori)", 1.0, 9.00),
    "PI": ("AREA 2", "La Costa - Flussi turistici e presenza locale (61k ascoltatori/giorno)", 0.7, 5.50),
    "LI": ("AREA 2", "La Costa - Flussi turistici e presenza locale (61k ascoltatori/giorno)", 0.7, 5.50),
    "LU": ("AREA 2", "La Costa - Flussi turistici e presenza locale (61k ascoltatori/giorno)", 0.7, 5.50),
    "MS": ("AREA 2", "La Costa - Flussi turistici e presenza locale (61k ascoltatori/giorno)", 0.7, 5.50),
    "AR": ("AREA 3", "Toscana Interna - Community di fedelissimi ed eccellenze territoriali", 0.5, 4.50),
    "SI": ("AREA 3", "Toscana Interna - Community di fedelissimi ed eccellenze territoriali", 0.5, 4.50),
    "GR": ("AREA 3", "Toscana Interna - Community di fedelissimi ed eccellenze territoriali", 0.5, 4.50),
}

# ==========================================================
# LISTA CHIUSA DI CATEGORIE RICONOSCIBILI DALLA CLASSIFICAZIONE AI
# ==========================================================
CATEGORIE_VALIDE = [
    "Evento Enogastronomico",
    "Automotive",
    "Beauty & Wellness",
    "Retail",
]

# ==========================================================
# WHITELIST SETTORI CON SCRIPT PRONTO E VALIDATO A MANO DA FABIO
# ==========================================================
SETTORI_APPROVATI = {
    "Evento Enogastronomico": {
        "oggetto_template": "Una domanda su {evento}, {nome_breve}",
        "hook": "Sto seguendo i preparativi per gli eventi di fine estate in provincia di {provincia} "
                "e ho visto il lavoro che state facendo per {nome}.",
        "corpo_extra": "Per un evento come il vostro, il sistema che funziona meglio combina spot "
                       "tradizionali per fare frequenza e citazioni live degli speaker per raccontare "
                       "il programma a chi decide cosa fare nel weekend.",
        "cta": "Se vi va, vi mando due spunti veloci via mail.",
        "tasso_chiusura_storico": 0.8
    },
    "Automotive": {
        "oggetto_template": "Rientro di settembre, {nome_breve}",
        "hook": "Stiamo programmando i palinsesti commerciali per la ripartenza di settembre "
                "su {provincia} e ho pensato al lancio dei vostri nuovi modelli.",
        "corpo_extra": "Per chi come voi punta su chi guida ogni giorno, il Primo di Barra (spot in "
                       "testa al blocco viabilita) funziona particolarmente bene abbinato a una "
                       "campagna spot tradizionale.",
        "cta": "Se avete 5 minuti la prossima settimana, mi farebbe piacere fare una breve chiamata.",
        "tasso_chiusura_storico": 0.7
    },
}

TEMPERATURE_VALIDE = ["caldo", "freddo"]
MAX_TOUCHPOINT = {"caldo": 4, "freddo": 3}

# ==========================================================
# STRUTTURA SEQUENZA MULTI-STEP
# ==========================================================
SEQUENZA_CONFIG = {
    1: {"giorno_offset": 0, "tipo": "iniziale"},
    2: {"giorno_offset": 3, "tipo": "follow_up_leggero"},
    3: {"giorno_offset": 10, "tipo": "ultimo_tocco"},
    4: {"giorno_offset": 17, "tipo": "chiusura_soft"}
}

# ==========================================================
# SAMPLE LEADS (Include lead con urgenza, dimensione e contratti in rinnovo)
# ==========================================================
SAMPLE_LEADS = [
    {
        "nome": "Pro Loco Sagra del Tordello",
        "settore_grezzo": "Sagra paesana enogastronomica",
        "comune": "Camaiore",
        "provincia": "LU",
        "temperatura": "caldo",
        "fonte": "Pro Loco List Database",
        "data_raccolta": "2026-07-20",
        "giorni_a_evento": 25,          # Memory lock urgenza <30gg
        "dimensione_stimata": 0.8,
        "is_cliente_attivo": False
    },
    {
        "nome": "Brandini Auto s.r.l.",
        "settore_grezzo": "Concessionaria auto",
        "comune": "Firenze",
        "provincia": "FI",
        "temperatura": "freddo",
        "fonte": "GoNews Banner Scraper",
        "data_raccolta": "2026-07-24",
        "giorni_a_evento": 60,
        "dimensione_stimata": 0.9,
        "is_cliente_attivo": False
    },
    {
        "nome": "Concessionaria Chianti Motors",
        "settore_grezzo": "Concessionaria auto",
        "comune": "Greve in Chianti",
        "provincia": "FI",
        "temperatura": "caldo",
        "fonte": "Cliente Storico",
        "data_raccolta": "2025-09-01",
        "giorni_a_scadenza_contratto": 20, # Alert rinnovo 30gg (Sezione 18)
        "formati_attuali": ["spot_tradizionale"],
        "is_cliente_attivo": True
    }
]


# ==========================================================
# SEZIONE 17 — FORMULA LEAD SCORING (0-100 punti)
# ==========================================================
def calcola_lead_score(lead, categoria):
    # 1. Peso Area (30%)
    area_info = AREA_MAPPING.get(lead["provincia"], ("AREA 4", "", 0.4, 0))
    peso_area = area_info[2]
    
    # 2. Peso Urgenza Memory Lock (25%)
    gg_ev = lead.get("giorni_a_evento", 999)
    if gg_ev < 30:
        peso_urgenza = 1.0
    elif gg_ev <= 90:
        peso_urgenza = 0.7
    else:
        peso_urgenza = 0.3
        
    # 3. Peso Dimensione (25%)
    peso_dimensione = lead.get("dimensione_stimata", 0.5)
    
    # 4. Peso Storico Settore (20%)
    peso_storico = SETTORI_APPROVATI.get(categoria, {}).get("tasso_chiusura_storico", 0.5)
    
    score = (peso_area * 30) + (peso_urgenza * 25) + (peso_dimensione * 25) + (peso_storico * 20)
    score_totale = round(score)
    
    if score_totale >= 75:
        fascia = "🔴 PRIORITÀ ALTA (Contatto entro 24h - Gestione Diretta Fabio)"
    elif score_totale >= 50:
        fascia = "🟡 PRIORITÀ MEDIA (Sequenza Standard 3-5gg)"
    else:
        fascia = "🟢 PRIORITÀ BASSA (Sequenza Automatica Batch)"
        
    return score_totale, fascia


# ==========================================================
# SEZIONE 16 — MOTORE DI SCONTO E PREVENTIVATORE
# ==========================================================
def calcola_preventivo(passaggi_totali, prezzo_unitario_listino, sconto_attivo=False, percentuale_sconto=0):
    prezzo_listino_totale = passaggi_totali * prezzo_unitario_listino
    
    if not sconto_attivo or percentuale_sconto == 0:
        return {
            "prezzo_unitario_listino": prezzo_unitario_listino,
            "prezzo_totale_listino": prezzo_listino_totale,
            "sconto_attivo": False,
            "prezzo_totale_riservato": prezzo_listino_totale,
            "alert_sconto": False
        }
        
    prezzo_unitario_scontato = prezzo_unitario_listino * (1 - (percentuale_sconto / 100))
    prezzo_totale_riservato = passaggi_totali * prezzo_unitario_scontato
    alert_sconto = percentuale_sconto > 25
    
    return {
        "prezzo_unitario_listino": prezzo_unitario_listino,
        "prezzo_totale_listino": prezzo_listino_totale,
        "sconto_attivo": True,
        "percentuale_sconto": percentuale_sconto,
        "prezzo_unitario_scontato": round(prezzo_unitario_scontato, 2),
        "prezzo_totale_riservato": round(prezzo_totale_riservato, 2),
        "alert_sconto": alert_sconto
    }


# ==========================================================
# SEZIONE 18 — TRIGGER DI RINNOVO & UPSELL (CLIENTI ATTIVI)
# ==========================================================
def controlla_trigger_rinnovo(lead):
    gg_scadenza = lead.get("giorni_a_scadenza_contratto")
    if gg_scadenza and gg_scadenza <= 30:
        formati = lead.get("formati_attuali", [])
        proposta_upsell = []
        if "spot_tradizionale" in formati:
            proposta_upsell.append("Pillola / Redazionale 60'' (al .10 e .40 per approfondire lo storytelling)")
        if lead["provincia"] in ["FI", "PO", "PT"]:
            proposta_upsell.append("Cross-Sell Radio Firenze 88.7")
            
        return {
            "alert_rinnovo": True,
            "giorni_alla_scadenza": gg_scadenza,
            "proposte_upsell": proposta_upsell
        }
    return {"alert_rinnovo": False}


# ==========================================================
# CLASSIFICAZIONE E GENERAZIONE CON FIRMA SEZIONE 20
# ==========================================================
def classifica_settore(settore_grezzo):
    sg = settore_grezzo.lower()
    if any(k in sg for k in ["sagra", "enogastronomico", "festa", "tordello", "vino", "cibo"]):
        return {"categoria": "Evento Enogastronomico", "confidenza": "alta"}
    elif any(k in sg for k in ["auto", "concessionaria", "motori", "automotive"]):
        return {"categoria": "Automotive", "confidenza": "alta"}
    else:
        return {"categoria": None, "confidenza": "bassa"}


def generate_email_step(lead, categoria, step_num):
    area_code, area_desc, _, _ = AREA_MAPPING.get(
        lead["provincia"], ("AREA 4", "Digital Radio e Copertura Regionale", 0.4, 0)
    )
    config_settore = SETTORI_APPROVATI[categoria]
    nome_breve = lead["nome"].split()[0]
    config_seq = SEQUENZA_CONFIG[step_num]

    # FIRMA COMPLETA SEZIONE 20 D
    FIRMA_SEZIONE_20 = """Fabio Asiri
Responsabile Commerciale | Radio Toscana
Via de' Pucci 2, 50122 Firenze, Italia — (+39) 055 285030
Tel: 347/6818595 - fabio.asiri@radiotoscana.it

Se preferisci non ricevere altre comunicazioni, rispondi con STOP."""

    if step_num == 1:
        oggetto = config_settore["oggetto_template"].format(evento=lead["nome"], nome_breve=nome_breve)
        corpo = f"""Ciao,
{config_settore['hook'].format(provincia=lead['provincia'], nome=lead['nome'])}
Come Radio Toscana copriamo la vostra zona ({area_code}: {area_desc}).
{config_settore['corpo_extra']}
{config_settore['cta']}

Un saluto,
{FIRMA_SEZIONE_20}"""

    elif step_num == 2:
        oggetto = f"Re: {config_settore['oggetto_template'].format(evento=lead['nome'], nome_breve=nome_breve)}"
        corpo = f"""Ciao {nome_breve},
Un dettaglio al volo rispetto alla mia mail di prima.
Per gli inserzionisti su {lead['provincia']} abbiamo appena attivato anche lo split geografico dedicato sull'Area {area_code}.
Se ti va di dare un'occhiata a un paio di dati sulla vostra zona, dimmi pure.

Un saluto,
{FIRMA_SEZIONE_20}"""

    elif step_num == 3:
        oggetto = f"Un'ultima domanda su {lead['nome']}"
        corpo = f"""Ciao {nome_breve},
Immagino che in questo periodo siate presissimi con l'organizzazione a {lead['comune']}.
Volevo solo lasciarvi i miei contatti diretti nel caso aveste bisogno di una mano sulla copertura radiofonica locale per la ripartenza.
Nessun problema in ogni caso e buon lavoro.

Un saluto,
{FIRMA_SEZIONE_20}"""

    else:
        oggetto = f"Vi lascio al vostro lavoro, {nome_breve}"
        corpo = f"""Ciao {nome_breve},
Non vi disturbo oltre. So che le priorità in questo momento sono altre.
Se in futuro dovesse servirvi una copertura capillare su Radio Toscana per {lead['nome']}, sapete dove trovarmi.
Buon proseguimento.

Un saluto,
{FIRMA_SEZIONE_20}"""

    return {
        "lead": lead["nome"],
        "step": step_num,
        "giorno_offset": config_seq["giorno_offset"],
        "tipo_step": config_seq["tipo"],
        "oggetto": oggetto,
        "corpo_email": corpo
    }


def main():
    print("=" * 70)
    print("🚀 SISTEMA RADIO TOSCANA LEAD ENGINE - ALLINEAMENTO MANUALE v6.0")
    print("=" * 70)

    for lead in SAMPLE_LEADS:
        print(f"\n📍 PROCESSANDO LEAD: '{lead['nome']}' ({lead['comune']}, {lead['provincia']})")
        
        # 1. TRIGGER RINNOVO (Sezione 18)
        rinnovo = controlla_trigger_rinnovo(lead)
        if rinnovo.get("alert_rinnovo"):
            print(f"🔄 ALERT RINNOVO 30GG ATTIVO: Il contratto scade tra {rinnovo['giorni_alla_scadenza']} giorni!")
            print(f"💡 PROPOSTE UPSELL SUGGERITE: {rinnovo['proposte_upsell']}")
            print("⚠️ Priorità massima: bloccato l'invio della sequenza cold email per evitare sovrapposizioni.")
            continue
            
        # 2. CLASSIFICAZIONE AI (Sezione 6)
        risultato = classifica_settore(lead["settore_grezzo"])
        categoria = risultato.get("categoria")
        
        if not categoria or categoria not in CATEGORIE_VALIDE:
            print(f"🚫 CATEGORIA NON RICONOSCIUTA: Inviato a 'coda_categoria_non_riconosciuta'")
            continue
            
        # 3. LEAD SCORING (Sezione 17)
        score, fascia = calcola_lead_score(lead, categoria)
        print(f"🎯 LEAD SCORE: {score}/100 ➔ {fascia}")
        
        # 4. PREVENTIVATORE & MOTORE DI SCONTO (Sezione 16)
        prezzo_unitario = AREA_MAPPING[lead["provincia"]][3]
        preventivo = calcola_preventivo(passaggi_totali=100, prezzo_unitario_listino=prezzo_unitario, sconto_attivo=True, percentuale_sconto=15)
        print(f"💰 SIMULAZIONE PREVENTIVO (100 passaggi 20''): Listino €{preventivo['prezzo_totale_listino']} | Riservato €{preventivo['prezzo_totale_riservato']} (Sconto 15%)")
        
        # 5. GENERAZIONE STEP 1 CON FIRMA COMPLETA SEZIONE 20
        email = generate_email_step(lead, categoria, 1)
        print(f"📧 EMAIL STEP 1 GENERATA:\nOggetto: {email['oggetto']}\nCorpo:\n{email['corpo_email']}\n")
        print("-" * 60)

if __name__ == "__main__":
    main()
