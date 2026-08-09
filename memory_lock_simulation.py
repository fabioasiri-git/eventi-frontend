import datetime
import json

def calculate_memory_lock(event_date_str, advance_days=90):
    event_date = datetime.datetime.strptime(event_date_str, "%Y-%m-%d").date()
    
    # Anno successivo
    try:
        next_year_event = event_date.replace(year=event_date.year + 1)
    except ValueError:
        # Gestione anni bisestili (29 Febbraio)
        next_year_event = event_date + datetime.timedelta(days=365)
        
    # Data di risveglio: 90 giorni prima dell'evento dell'anno successivo
    wakeup_date = next_year_event - datetime.timedelta(days=advance_days)
    
    return {
        "data_evento_2026": event_date.strftime("%Y-%m-%d"),
        "data_evento_2027": next_year_event.strftime("%Y-%m-%d"),
        "giorni_anticipo": advance_days,
        "data_sveglia_ricontatto_2027": wakeup_date.strftime("%Y-%m-%d"),
        "mese_evento": event_date.strftime("%B")
    }

SAMPLE_UNIVERSAL_EVENTS = [
    {"nome": "Mostra Internazionale dell'Artigianato (Firenze)", "tipo": "Fiera / Mostra", "data": "2026-04-25"},
    {"nome": "Pistoia Blues Festival (Pistoia)", "tipo": "Festival Musicale", "data": "2026-07-10"},
    {"nome": "Half Marathon Firenze (Firenze)", "tipo": "Evento Sportivo", "data": "2026-04-05"},
    {"nome": "Mercatini di Natale & Luci (Arezzo)", "tipo": "Rassegna / Mercatino", "data": "2026-11-20"},
    {"nome": "Pro Loco Sagra del Tordello (Camaiore)", "tipo": "Sagra Enogastronomica", "data": "2026-09-15"}
]

def main():
    simulations = []
    for event in SAMPLE_UNIVERSAL_EVENTS:
        lock_data = calculate_memory_lock(event["data"])
        simulations.append({
            "evento": event["nome"],
            "tipologia": event["tipo"],
            "memory_lock": lock_data
        })
        
    print(json.dumps(simulations, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
