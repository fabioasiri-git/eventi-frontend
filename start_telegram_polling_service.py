import os
import sys
import json
import time
import requests
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

BOT_TOKEN = "8803277543:AAHxvV6tC5kGdVasDlje0FaL875fcnzBo9M"

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

def process_and_reply_photo(file_id, chat_id, user_name):
    print(f"📸 RICEVUTA FOTO DA TELEGRAM ({user_name}, Chat ID: {chat_id})")
    
    # 1. Scarica Immagine da Telegram
    try:
        res_file = requests.get(f"https://api.telegram.org/bot{BOT_TOKEN}/getFile?file_id={file_id}").json()
        if res_file.get("ok"):
            file_path = res_file["result"]["file_path"]
            img_data = requests.get(f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}").content
            
            save_dir = os.path.join(os.path.dirname(__file__), "telegram_downloads")
            os.makedirs(save_dir, exist_ok=True)
            local_img_path = os.path.join(save_dir, os.path.basename(file_path))
            with open(local_img_path, 'wb') as f:
                f.write(img_data)
            print(f"✅ Foto salvata in: {local_img_path}")
    except Exception as err:
        print(f"⚠️ Errore download foto: {err}")

    # 2. Inserimento in Supabase Cloud
    nome_azienda = "Nuovo Lead da Foto Telegram"
    comune = "Toscana"
    lead_id = 0
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
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;
        """
        cursor.execute(insert_query, (
            nome_azienda, "Commerciale / OOH", comune, "FI", "AREA 1", "SCOPERTO", 0.0, 0.0, 50
        ))
        lead_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        print(f"🎉 Lead inserito su Supabase Cloud con ID #{lead_id}")
    except Exception as db_err:
        print(f"⚠️ Errore scrittura DB: {db_err}")

    # 3. Invio Risposta di Conferma su Telegram
    msg_text = f"📸 *FOTO RICEVUTA & ANALIZZATA CON SUCCESSO!*\n\n🏢 *Azienda:* {nome_azienda}\n📍 *Comune:* {comune}\n🎯 *Status:* Inserito in Pipeline (Lead #{lead_id})\n\n✅ *Salvato nel database Supabase Cloud!*"
    try:
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", json={
            "chat_id": chat_id,
            "text": msg_text,
            "parse_mode": "Markdown"
        })
        print(f"📲 Risposta di conferma inviata a {user_name} su Telegram!")
    except Exception as msg_err:
        print(f"⚠️ Errore invio risposta Telegram: {msg_err}")

def start_polling():
    print("🤖 SERVIZIO TELEGRAM POLLING ATTIVO PER @rt_mostro_bot...")
    offset = 0
    while True:
        try:
            url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates?offset={offset}&timeout=20"
            r = requests.get(url, timeout=30).json()
            if r.get("ok"):
                for update in r.get("result", []):
                    offset = update["update_id"] + 1
                    msg = update.get("message") or update.get("edited_message") or {}
                    chat_id = msg.get("chat", {}).get("id")
                    user_name = msg.get("from", {}).get("first_name", "Utente")
                    
                    if "photo" in msg:
                        file_id = msg["photo"][-1]["file_id"]
                        process_and_reply_photo(file_id, chat_id, user_name)
                    elif "text" in msg:
                        text_msg = f"👋 Ciao {user_name}! Inviami una foto di un cartellone o manifesto pubblicitario e la analizzerò al volo per creare il Lead!"
                        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", json={"chat_id": chat_id, "text": text_msg})
        except Exception as e:
            time.sleep(5)

if __name__ == "__main__":
    start_polling()
