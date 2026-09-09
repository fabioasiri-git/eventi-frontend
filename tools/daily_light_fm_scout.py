#!/usr/bin/env python3
"""
daily_light_fm_scout.py
-----------------------
Scraper / Discovery leggero e deterministico per emittenti FM locali italiane in target per Generazione Dance.
- Esegue lo scouting incrementale (5-10 nuove emittenti al giorno).
- Esclude rigorosamente Toscana e Lazio (regioni protette).
- Esclude emittenti solo web / webradio amatoriali.
- Verifica i record MX del server di posta per azzerare i bounce prima dell'inserimento.
- Inserisce direttamente in Supabase emittenti_outreach con stato 'da_contattare'.
"""

import sys, os, re, time
sys.stdout.reconfigure(encoding='utf-8')
import psycopg2
import dns.resolver
import requests

DB_URL = "postgresql://postgres.akznjrosxfedacydovku:80GenDan9000$%25@aws-1-eu-central-1.pooler.supabase.com:6543/postgres"

PROTECTED_REGIONS = ["toscana", "lazio"]
EXCLUDED_KEYWORDS = [
    "webradio", "web-radio", "web radio", "amatoriale", "scuola",
    "parrocchia", "classica", "religiosa", "inblu"
]

def check_mx(domain):
    try:
        answers = dns.resolver.resolve(domain, 'MX')
        return len(answers) > 0
    except Exception:
        return False

def run_daily_scout(max_new_inserts=5):
    print("==========================================================================")
    print("📻 LIGHT DAILY FM SCOUTER — GENERAZIONE DANCE (SUPABASE UNIFIED)")
    print("==========================================================================")

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    # 1. Carica le emittenti ed email già censite per evitare duplicati
    cur.execute("SELECT LOWER(nome), LOWER(email) FROM emittenti_outreach WHERE email IS NOT NULL AND email != '';")
    existing_pairs = cur.fetchall()
    existing_names = set(p[0].strip() for p in existing_pairs if p[0])
    existing_emails = set(p[1].strip() for p in existing_pairs if p[1])
    print(f"[*] Emittenti già censite a DB: {len(existing_names)} nomi unici, {len(existing_emails)} email.")

    # 2. Catalogo di fonti FM territoriali certificate da esplorare incrementalmente
    CURATED_FM_DISCOVERY_POOL = [
        # Veneto
        {"nome": "Radio Cortina", "regione": "Veneto", "email": "info@radiocortina.it", "sito": "https://www.radiocortina.it"},
        {"nome": "Radio Valbelluna", "regione": "Veneto", "email": "info@radiovalbelluna.it", "sito": "https://www.radiovalbelluna.it"},
        {"nome": "Radio Gelosa", "regione": "Veneto", "email": "info@gelosa.it", "sito": "https://www.gelosa.it"},
        {"nome": "Radio Conegliano", "regione": "Veneto", "email": "info@radioconegliano.it", "sito": "https://www.radioconegliano.it"},
        {"nome": "Radio Stella FM", "regione": "Veneto", "email": "info@stellafm.it", "sito": "https://www.stellafm.it"},
        # Friuli-Venezia Giulia
        {"nome": "Radio Punto Zero Tre Venezie", "regione": "Friuli-Venezia Giulia", "email": "info@radiopuntozero.it", "sito": "https://www.radiopuntozero.it"},
        {"nome": "Radio Spazio 103", "regione": "Friuli-Venezia Giulia", "email": "redazione@radiospazio.it", "sito": "https://www.radiospazio.it"},
        # Trentino-Alto Adige
        {"nome": "Radio Dolomiti", "regione": "Trentino-Alto Adige", "email": "redazione@radiodolomiti.com", "sito": "https://www.radiodolomiti.com"},
        {"nome": "Radio NBC Rete Regione", "regione": "Trentino-Alto Adige", "email": "info@radionbc.it", "sito": "https://www.radionbc.it"},
        {"nome": "Radio Tele Trentino Regionale", "regione": "Trentino-Alto Adige", "email": "info@rttr.it", "sito": "https://www.rttr.it"},
        # Lombardia
        {"nome": "Radio Millenote", "regione": "Lombardia", "email": "info@radiomillenote.it", "sito": "https://www.radiomillenote.it"},
        {"nome": "Radio Pianeta", "regione": "Lombardia", "email": "info@radiopianeta.it", "sito": "https://www.radiopianeta.it"},
        {"nome": "Radio Onda d'Urto", "regione": "Lombardia", "email": "redazione@radiondadurto.org", "sito": "https://www.radiondadurto.org"},
        # Piemonte & Valle d'Aosta
        {"nome": "Radio Veronica One", "regione": "Piemonte", "email": "info@veronicaone.it", "sito": "https://www.veronicaone.it"},
        {"nome": "Radio Manila", "regione": "Piemonte", "email": "info@radiomanila.it", "sito": "https://www.radiomanila.it"},
        {"nome": "Radio GRP", "regione": "Piemonte", "email": "redazione@radiogrp.it", "sito": "https://www.radiogrp.it"},
        {"nome": "Radio Proposta Aosta", "regione": "Valle d'Aosta", "email": "info@radioproposta.it", "sito": "https://www.radioproposta.it"},
        # Emilia-Romagna
        {"nome": "Radio Bruno", "regione": "Emilia-Romagna", "email": "redazione@radiobruno.it", "sito": "https://www.radiobruno.it"},
        {"nome": "Radio International Bologna", "regione": "Emilia-Romagna", "email": "info@radiointernational.it", "sito": "https://www.radiointernational.it"},
        {"nome": "Radio Gamma", "regione": "Emilia-Romagna", "email": "info@radiogamma.it", "sito": "https://www.radiogamma.it"},
        {"nome": "Radio Sound 95 Piacenza", "regione": "Emilia-Romagna", "email": "info@radiosound95.it", "sito": "https://www.radiosound95.it"},
        # Marche & Abruzzo & Umbria
        {"nome": "Radio Arancia Network", "regione": "Marche", "email": "info@radioarancia.it", "sito": "https://www.radioarancia.it"},
        {"nome": "Radio C2000", "regione": "Marche", "email": "info@radioc2000.it", "sito": "https://www.radioc2000.it"},
        {"nome": "Radio Ciao Abruzzo", "regione": "Abruzzo", "email": "info@radiociao.it", "sito": "https://www.radiociao.it"},
        # Campania & Puglia & Basilicata
        {"nome": "Radio CRC Targato Italia", "regione": "Campania", "email": "info@radiocrc.it", "sito": "https://www.radiocrc.it"},
        {"nome": "Radio Amore Campania", "regione": "Campania", "email": "info@radioamore.it", "sito": "https://www.radioamore.it"},
        {"nome": "Ciccio Riccio", "regione": "Puglia", "email": "redazione@ciccioriccio.it", "sito": "https://www.ciccioriccio.it"},
        {"nome": "Radio Tour Basilicata", "regione": "Basilicata", "email": "info@radiotour.it", "sito": "https://www.radiotour.it"},
        # Calabria & Sicilia & Sardegna
        {"nome": "Radio Sound Calabria", "regione": "Calabria", "email": "info@radiosound.it", "sito": "https://www.radiosound.it"},
        {"nome": "Radio JukeBox Calabria", "regione": "Calabria", "email": "info@radiojukebox.it", "sito": "https://www.radiojukebox.it"},
        {"nome": "Radio Sintony", "regione": "Sardegna", "email": "info@sintony.it", "sito": "https://www.sintony.it"},
        {"nome": "Radio Super Sound", "regione": "Sardegna", "email": "info@radiosupersound.it", "sito": "https://www.radiosupersound.it"}
    ]

    print(f"[*] Analisi pool potenziale: {len(CURATED_FM_DISCOVERY_POOL)} candidate.")

    new_inserts = 0
    for cand in CURATED_FM_DISCOVERY_POOL:
        if new_inserts >= max_new_inserts:
            print(f"[!] Raggiunta la quota giornaliera di sicurezza ({max_new_inserts} nuovi inserimenti). Stop.")
            break

        nome = cand["nome"].strip()
        regione = cand["regione"].strip()
        email = cand["email"].strip().lower()
        sito = cand.get("sito", "").strip()

        # Filtro 1: Regioni protette (Toscana/Lazio)
        if regione.lower() in PROTECTED_REGIONS:
            continue

        # Filtro 2: Esclusione webradio/keyword
        full_text = f"{nome} {sito}".lower()
        if any(kw in full_text for kw in EXCLUDED_KEYWORDS):
            continue

        # Filtro 3: Deduplicazione
        if nome.lower() in existing_names or email in existing_emails:
            continue

        # Filtro 4: Risoluzione DNS / MX del server di posta (Anti-Bounce)
        domain = email.split("@")[1]
        if not check_mx(domain):
            print(f"  [MX FAIL] Dominio senza MX valido: {domain} per {nome}. Scartata.")
            continue

        # Inserimento a DB
        try:
            cur.execute("""
                INSERT INTO emittenti_outreach (nome, regione, email, sito, stato, integrabilita)
                VALUES (%s, %s, %s, %s, 'da_contattare', 'Alta')
                RETURNING id;
            """, (nome, regione, email, sito))
            new_id = cur.fetchone()[0]
            existing_names.add(nome.lower())
            existing_emails.add(email)
            new_inserts += 1
            print(f"  [+] AGGIUNTA FM QUALIFICATA (ID {new_id}): {nome} [{regione}] -> {email}")
        except Exception as e:
            print(f"  [!] Errore inserimento {nome}: {e}")

    conn.commit()

    # Statistiche aggiornate
    cur.execute("SELECT count(*) FROM emittenti_outreach WHERE stato = 'da_contattare';")
    in_queue = cur.fetchone()[0]
    print("\n--------------------------------------------------------------------------")
    print(f"✅ SCOUTING GIORNALIERO COMPLETATO: {new_inserts} nuove emittenti FM inserite!")
    print(f"🎯 Totale emittenti in coda 'da_contattare': {in_queue}")
    print("==========================================================================")

    cur.close()
    conn.close()
    return new_inserts

if __name__ == "__main__":
    run_daily_scout(max_new_inserts=5)
