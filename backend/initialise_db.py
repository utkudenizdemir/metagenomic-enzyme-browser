import sys
import os
import sqlite3  # 🆕 SQLAlchemy yerine sqlite3 ile doğrudan çalışacağız

# Adjust the path to access config from the root directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import Config

def initialize_database():
    # Define paths
    db_path = os.path.join(os.path.dirname(__file__), 'metagenome.db')
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')

    # Remove existing database
    if os.path.exists(db_path):
        os.remove(db_path)
        print("Old database removed.")

    # 🆕 Load and execute schema.sql
    with open(schema_path, 'r') as f:
        schema = f.read()

    conn = sqlite3.connect(db_path)
    conn.executescript(schema)
    conn.close()

    print("✅ Database initialized from schema.sql.")

if __name__ == "__main__":
    initialize_database()

