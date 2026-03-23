import sqlite3

conn = sqlite3.connect("metagenome.db")

with open("schema.sql", "r") as f:
    schema = f.read()
    conn.executescript(schema)

conn.close()
print("✅ DB has created successfully.")
