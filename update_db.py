
import sqlite3, json
with open('/tmp/nodes_temp.json', 'r') as f:
    data = json.load(f)

nodes = json.dumps(data['nodes'])
connections = json.dumps(data['connections'])

conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
c = conn.cursor()
c.execute("UPDATE workflow_entity SET nodes = ?, connections = ?, active = 1 WHERE id = 'Iz4FEv42Ll6dl8pU'", (nodes, connections))
conn.commit()
conn.close()
print('SQLite updated with target SMTP credential!')
