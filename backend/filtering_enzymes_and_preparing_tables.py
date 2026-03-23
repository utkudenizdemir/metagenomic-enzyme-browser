import pandas as pd
import sqlite3
import re

df = pd.read_csv("subset_300.tsv", sep="\t", header=None)
df.columns = [
    "protein_id", "md5", "alignment_length", "source", "signature_acc", "signature_desc",
    "start", "end", "e_value", "status", "date", "interpro_id", "interpro_desc", "go_terms", "pathways"
] #Describing columns

# Filtering enzymes with using GO terms
go_terms_list = ["GO:0003824", "GO:0016491", "GO:0004672", "GO:0016787", "GO:0008168"]
def is_enzyme(go_str):
    if pd.isna(go_str): return False
    return any(term in go_str for term in go_terms_list)

df["is_enzyme"] = df["go_terms"].apply(is_enzyme)
enzymes = df[df["is_enzyme"]].copy()


# Database connection
conn = sqlite3.connect("metagenome.db")
cursor = conn.cursor()

# enzyme_protein
for _, row in enzymes.iterrows():
    cursor.execute("""
        INSERT OR REPLACE INTO enzyme_protein (protein_id, ec_number, go_terms, product)
        VALUES (?, ?, ?, ?)
        """, (row["protein_id"], row.get("ec_number", None), row["go_terms"], row["interpro_desc"]))

# Other tables
function_rows = enzymes[["protein_id", "signature_acc", "signature_desc", "source"]].dropna().drop_duplicates()
for _, row in function_rows.iterrows():
    cursor.execute("INSERT OR IGNORE INTO protein_function VALUES (?, ?, ?, ?)", tuple(row))

confidence_rows = enzymes[["protein_id", "e_value", "status", "date"]].drop_duplicates()
for _, row in confidence_rows.iterrows():
    cursor.execute("INSERT OR IGNORE INTO protein_confidence VALUES (?, ?, ?, ?)", tuple(row))

pathway_rows = []
for _, row in enzymes.iterrows():
    if pd.notna(row["pathways"]) and row["pathways"] != "-":
        for pw in row["pathways"].split("|"):
            if ":" in pw:
                db, pwid = pw.split(":", 1)
                cursor.execute("INSERT INTO functional_pathway (protein_id, pathway_db, pathway_id) VALUES (?, ?, ?)",
                               (row["protein_id"], db.strip(), pwid.strip()))
for r in set(pathway_rows):
    cursor.execute("INSERT OR IGNORE INTO functional_pathway VALUES (?, ?, ?)", r)

loc_rows = enzymes[["protein_id", "start", "end", "alignment_length"]]
for _, row in loc_rows.iterrows():
    cursor.execute("INSERT INTO protein_localization (protein_id, start, end, alignment_length) VALUES (?, ?, ?, ?)",
                   tuple(row))


# 3. Product (interpro_desc) number
product_counts = (
    enzymes["interpro_desc"]
    .value_counts()
    .reset_index()
)
product_counts.columns = ["product", "count"]

# 4. For taking most common 20 proteins
print(product_counts.head(20))

conn.commit()
conn.close()
print("✅ Datas has loaded to metagenome.db.")
