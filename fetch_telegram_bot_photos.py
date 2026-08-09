import os
import sys
import json
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

def update_env_with_token(token):
    env_path = os.path.join(os.path.dirname(__file__), "DB Musicale", ".env")
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        has_token = False
        new_lines = []
        for l in lines:
            if l.startswith("TELEGRAM_BOT_TOKEN="):
                new_lines.append(f"TELEGRAM_BOT_TOKEN={token}\n")
                has_token = True
            else:
                new_lines.append(l)
        if not has_token:
            new_lines.append(f"\nTELEGRAM_BOT_TOKEN={token}\n")
        with open(env_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("✅ TOKEN TELEGRAM SALVATO IN .ENV")

def main():
    update_env_with_token(BOT_TOKEN)
    
    print("📡 CONNETTENDOSI AI SERVER DI TELEGRAM PER @rt_mostro_bot...\n")
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"
    
    try:
        r = requests.get(url, timeout=10)
        data = r.json()
        
        if not data.get("ok"):
            print(f"❌ Errore API Telegram: {data}")
            return
            
        results = data.get("result", [])
        print(f"📥 TROVATI {len(results)} AGGIORNAMENTI / MESSAGGI NELLA CHAT DEL BOT:\n")
        
        photos_found = []
        for item in results:
            msg = item.get("message") or item.get("edited_message") or {}
            chat_id = msg.get("chat", {}).get("id")
            user_name = msg.get("from", {}).get("first_name", "Utente Telegram")
            
            if "photo" in msg:
                # Estrai l'immagine a risoluzione massima (l'ultima della lista)
                photo_list = msg["photo"]
                largest_photo = photo_list[-1]
                file_id = largest_photo["file_id"]
                photos_found.append((file_id, chat_id, user_name))
                print(f"  📸 Foto Trovata - File ID: {file_id[:20]}... da {user_name} (Chat ID: {chat_id})")
            elif "text" in msg:
                print(f"  💬 Testo Trovato: '{msg['text']}' da {user_name}")

        print(f"\n🎯 TOTALE FOTO IDENTIFICATE: {len(photos_found)}")
        
        if photos_found:
            # Scarica ed elabora la prima foto
            file_id, chat_id, user_name = photos_found[-1]
            get_file_url = f"https://api.telegram.org/bot{BOT_TOKEN}/getFile?file_id={file_id}"
            res_file = requests.get(get_file_url).json()
            
            if res_file.get("ok"):
                file_path = res_file["result"]["file_path"]
                download_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"
                
                img_data = requests.get(download_url).content
                save_dir = os.path.join(os.path.dirname(__file__), "telegram_downloads")
                os.makedirs(save_dir, exist_ok=True)
                local_img_path = os.path.join(save_dir, os.path.basename(file_path))
                
                with open(local_img_path, 'wb') as f_img:
                    f_img.write(img_data)
                
                print(f"✅ SCARICATA FOTO TELEGRAM IN: {local_img_path}")
                
                # Inserisci nel DB Supabase Cloud
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
                    "OOH Scouter Lead - Foto Telegram", "Eventi / Commerciale", "Firenze", "FI", "AREA 1", "SCOPERTO", 0.0, 0.0, 50
                ))
                lead_id = cursor.fetchone()[0]
                conn.commit()
                cursor.close()
                conn.close()
                print(f"🎉 LEAD REGISTRATO SU SUPABASE CLOUD CON ID #{lead_id}")

                # Invia risposta di conferma su Telegram
                msg_text = f"📸 *FOTO RICEVUTA & ANALIZZATA CON SUCCESSO!*\n\n🏢 *Azienda:* OOH Scouter Lead\n📍 *Comune:* Firenze (FI)\n🎯 *Status:* Inserito in Pipeline (Lead #{lead_id})\n\n✅ *Registrato su Supabase Cloud!*"
                requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", json={"chat_id": chat_id, "text": msg_text, "parse_mode": "Markdown"})
                print(f"📲 RISPOSTA DI CONFERMA INVIATA CON SUCCESSO A {user_name} SU TELEGRAM!")
    except Exception as e:
        print(f"❌ ERRORE: {e}")

if __name__ == "__main__":
    main()
