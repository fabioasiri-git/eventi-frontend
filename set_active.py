
import sqlite3
conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("UPDATE workflow_entity SET active = 1 WHERE id = 'Iz4FEv42Ll6dl8pU'")
conn.commit()
conn.close()
print('Workflow active set to 1 in SQLite')
