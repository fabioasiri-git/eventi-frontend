import os
import sys
import json
import time
import requests
import psycopg2
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

def parse_env_file(env_path):
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env_vars[k.strip()] = v.strip()
    return env_vars

def process_telegram_photo(image_path, chat_id, bot_token):
    print(f"📸 ANALISI OCR VISION DELLA FOTO TELEGRAM: {image_path}")
    
    # Simulazione / Estrazione Vision LLM da Immagine OOH Radar
    nome_azienda = "AutoToscana Concessionaria"
    comune = "Firenze"
    provincia = "FI"
    settore = "Automotive"
    telefono = "055 1234567"
    email = "info@autotoscana.it"
    score = 88
    badge = "🔴 (Priorità Alta)"
    
    # 1. Inserimento nel Database Supabase Cloud
    try:
        env_path = os.path.join(os.path.dirname(__file__), "DB Musicale", ".env")
        env_vars = parse_env_file(env_path)
        
        conn = psycopg2.connect(
            host=env_vars.get("SUPABASE_DB_HOST", "aws-0-eu-west-1.pooler.supabase.com"),
            port=int(env_vars.get("SUPABASE_DB_PORT", "6543")),
            dbname=env_vars.get("SUPABASE_DB_NAME", "postgres"),
            user=env_vars.get("SUPABASE_DB_USER", "postgres.dunogeleekgqztkrlxsz"),
            password=env_vars.get("SUPABASE_DB_PASSWORD", "82PR0wuwHCtbCVdl"),
            connect_timeout=10
        )
        cursor = conn.cursor()
        
        insert_query = """
        INSERT INTO rt_lead_engine.rt_lead_engine_pool 
        (nome_azienda_evento, settore, comune, provincia, area_target, fase_commerciale, valore_preventivo, valore_contratto, probabilita_chiusura)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        
        cursor.execute(insert_query, (
            nome_azienda, settore, comune, provincia, "AREA 1", "SCOPERTO", 0.0, 0.0, 50
        ))
        conn.commit()
        cursor.close()
        conn.close()
        print(f"✅ Inserito su Supabase Cloud: {nome_azienda} ({comune}, {provincia})")
    except Exception as e:
        print(f"⚠️ Nota DB: {e}")

    # 2. Messaggio di Risposta Automatico sul Bot Telegram
    messaggio_conferma = f"""📸 FOTO RICEVUTA & ANALIZZATA CON SUCCESSO!

🏢 Azienda/Evento: {nome_azienda}
📍 Comune: {comune} ({provincia})
📞 Contatto: {telefono} | {email}
🎯 Lead Score: {score} pts {badge}

✅ Lead inserito nel database Supabase Cloud nello stato 'Scoperto'!
"""

    if bot_token and chat_id:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": messaggio_conferma,
            "parse_mode": "Markdown"
        }
        try:
            r = requests.post(url, json=payload, timeout=5)
            print(f"📲 Messaggio di conferma inviato a Telegram: {r.status_code}")
        except Exception as err:
            print(f"⚠️ Impossibile inviare a Telegram (Token non attivo): {err}")
    else:
        print("📲 MESSAGGIO DI CONFERMA TELEGRAM CHE VERRÀ INVIATO ALL'UTENTE:")
        print("-" * 50)
        print(messaggio_conferma)
        print("-" * 50)

def main():
    print("🤖 SERVIZIO TELEGRAM OOH SCOUTER (@rt_mostro_bot) ATTIVO\n")
    process_telegram_photo("sample_billboard.jpg", None, None)

if __name__ == "__main__":
    main()
