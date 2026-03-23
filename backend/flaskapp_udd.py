from flask import Flask, render_template, request
import sqlite3
import os

app = Flask(__name__)
DB_PATH = os.path.join(os.path.dirname(__file__), "metagenome.db")  # Defines database

def get_connection():
    return sqlite3.connect(DB_PATH)  # Connects to database

def get_top_products(limit=10):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT product, COUNT(*) as count
        FROM enzyme_protein
        WHERE product IS NOT NULL AND product != ''
        GROUP BY product
        ORDER BY count DESC
        LIMIT ?;
    """, (limit,))
    results = cursor.fetchall()
    conn.close()
    return results

@app.route("/")
def index():
    conn = get_connection()
    cursor = conn.cursor()

    # Take proteins
    cursor.execute("""
        SELECT protein_id, ec_number, go_terms, product
        FROM enzyme_protein
        ORDER BY protein_id
        LIMIT 50
    """)
    proteins = cursor.fetchall()

    #Calculates sample protein amount
    cursor.execute("SELECT COUNT(*) FROM enzyme_protein WHERE protein_id LIKE 'MGYG%'")
    total_sample_proteins = cursor.fetchone()[0]

    conn.close()

    top_products = get_top_products()

    return render_template("index.html",
                           proteins=proteins,
                           top_products=top_products,
                           total_sample_proteins=total_sample_proteins)

@app.route("/search")
def search():
    query = request.args.get("query", "")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT protein_id, ec_number, go_terms, product
        FROM enzyme_protein
        WHERE product LIKE ? OR go_terms LIKE ? OR ec_number LIKE ?
        LIMIT 50
    """, (f"%{query}%", f"%{query}%", f"%{query}%"))
    results = cursor.fetchall()
    conn.close()
    return render_template("results.html", query=query, results=results)

@app.route("/protein/<protein_id>")
def protein_detail(protein_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT ec_number, go_terms, product FROM enzyme_protein WHERE protein_id = ?", (protein_id,))
    protein = cursor.fetchone()

    cursor.execute("SELECT signature_acc, signature_desc, source FROM protein_function WHERE protein_id = ?", (protein_id,))
    functions = cursor.fetchall()

    cursor.execute("SELECT e_value, status, date FROM protein_confidence WHERE protein_id = ?", (protein_id,))
    confidence = cursor.fetchone()

    cursor.execute("SELECT start, end, alignment_length FROM protein_localization WHERE protein_id = ?", (protein_id,))
    locations = cursor.fetchall()

    cursor.execute("SELECT pathway_db, pathway_id FROM functional_pathway WHERE protein_id = ?", (protein_id,))
    pathways = cursor.fetchall()

    # Sample protein number which starts with 'MGYG'
    cursor.execute("SELECT COUNT(*) FROM enzyme_protein WHERE protein_id LIKE 'MGYG%'")
    total_sample_proteins = cursor.fetchone()[0]

    conn.close()
    return render_template("protein_detail.html",
                           protein_id=protein_id,
                           protein=protein,
                           functions=functions,
                           confidence=confidence,
                           pathways=pathways,
                           total_sample_proteins=total_sample_proteins,
                           locations=locations)

if __name__ == "__main__":
    app.run(debug=True)
