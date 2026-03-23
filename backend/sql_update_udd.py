import sqlite3

# Open database
conn = sqlite3.connect("metagenome.db")

# read schema.sql file and run
with open("schema.sql", "r") as f:
    conn.executescript(f.read())

conn.close()

print("schema.sql has succesfully loaded to the database.")
