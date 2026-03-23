# Metagenomic Enzyme Browser

A bioinformatics web application for exploring enzyme-related annotations derived from metagenomic datasets.

This project is based on an existing metagenome browser framework. My work focused on extending and adapting the system during my MSc Bioinformatics project, particularly in enzyme-focused data filtering, database design, backend querying, and template-based result integration.

---

## My Contributions

The main contributions in this version include:

* Implemented GO-term based filtering of enzyme-related proteins
* Developed scripts for processing subset metagenomic annotation data
* Designed and updated SQLite database schema for enzyme-focused protein records
* Implemented backend query logic for search and protein detail retrieval
* Integrated backend outputs into template-based pages (search, results, protein detail views)

---

## Key Features

* Enzyme-focused filtering workflow using subset annotation data
* SQLite-based storage of protein and annotation data
* Flask backend for querying enzyme-related protein records
* Template-based interface for browsing search results and protein-level annotations

---

## Project Structure

```
metagenomic-enzyme-browser/
│
├── backend/        # Flask backend, schema, scripts, templates
├── frontend/       # Original frontend (not modified significantly)
├── data/           # Example subset data and filtered outputs
├── app.py          # Entry point for the application
├── config.py
└── README.md
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/utkudenizdemir/metagenomic-enzyme-browser.git
cd metagenomic-enzyme-browser
```

### 2. Create a virtual environment (recommended)

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate   # Windows
source venv/bin/activate  # Mac/Linux
```

### 3. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Run the application

```bash
python app.py
```

Then open:

```
http://localhost:3000
```

---

## Example Data

A small subset of metagenomic annotation data is included for demonstration purposes:

* `data/example_subset.tsv` → input dataset
* `data/example_filtered_output.tsv` → filtered output

This allows testing of the filtering workflow without requiring large datasets.

---

## Database

The SQLite database file is not included in this repository.
It is generated locally using the provided schema and initialization scripts.

---

## Notes

* This project extends an existing metagenome browser framework rather than being built entirely from scratch
* My contributions focus on data processing, filtering, database schema design, backend query logic, and template-based integration
* The frontend structure is part of the original framework and was not the primary focus of this work
* Large or proprietary datasets are not included

---
