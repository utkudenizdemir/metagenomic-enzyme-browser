-- Study table
CREATE TABLE Study (
    study_num_id INTEGER PRIMARY KEY AUTOINCREMENT,       -- Numeric auto-increment ID
    study_unique_id TEXT UNIQUE,                         -- Alphanumeric unique ID (e.g., STD1)
    title TEXT,                             
    description TEXT,                       
    submitter_name VARCHAR(255),            
    submission_date DATE,                   
    publication_link TEXT,                  
    short_study_name VARCHAR(3)             
);

-- Sample table
CREATE TABLE Sample (
    sample_num_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sample_unique_id TEXT UNIQUE,
    prozomix_id TEXT,
    study_num_id INTEGER NOT NULL REFERENCES Study(study_num_id),
    biome_name VARCHAR(255) REFERENCES Biome(biome_name),  -- References biome_name in Biome table
    collection_date DATE,
    location TEXT,
    environment TEXT,
    short_sample_name VARCHAR(6),
    description TEXT,
    temperature FLOAT,       
    ph FLOAT,                
    other_factors TEXT       
);

-- Biome table
CREATE TABLE Biome (
    biome_num_id INTEGER PRIMARY KEY AUTOINCREMENT,
    biome_unique_id TEXT UNIQUE,
    biome_name VARCHAR(255) UNIQUE,
    environment_ontology VARCHAR(255)
);

-- Geolocation table
CREATE TABLE Geolocation (
    geolocation_num_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Numeric auto-increment ID
    geolocation_unique_id TEXT UNIQUE,                   -- Alphanumeric unique ID (e.g., GEO1)
    sample_num_id INTEGER NOT NULL REFERENCES Sample(sample_num_id),  -- Foreign key to Sample table
    latitude FLOAT,                                    
    longitude FLOAT,                                   
    altitude FLOAT,                                    
    depth FLOAT,                -- New field for underwater depth in meters
    country VARCHAR(255),                              
    region VARCHAR(255),                               
    additional_info TEXT                               
);

-- DNAPrep table
CREATE TABLE DNAPrep (
    prep_num_id INTEGER PRIMARY KEY AUTOINCREMENT,       -- Numeric auto-increment ID
    prep_unique_id TEXT UNIQUE,                         -- Alphanumeric unique ID (e.g., PREP1)
    sample_num_id INTEGER NOT NULL REFERENCES Sample(sample_num_id), -- Foreign key to Sample table
    prep_date DATE,                                       -- Date of the DNA prep
    technician VARCHAR(255),                              -- Name of the technician performing the prep
    kit_used VARCHAR(255),                                -- Kit used for the DNA prep
    concentration FLOAT,                                  -- DNA concentration
    user_identifier VARCHtherapeutic_potentialAR(255)                          -- User-assigned identifier for the prep
);

-- SequencingRun table
CREATE TABLE SequencingRun (
    run_num_id INTEGER PRIMARY KEY AUTOINCREMENT,        -- Numeric auto-increment ID
    run_unique_id TEXT UNIQUE,                          -- Alphanumeric unique ID (e.g., RUN1)
    prep_num_id INTEGER REFERENCES DNAPrep(prep_num_id), -- Foreign key to DNAPrep table
    sequence_provider_id TEXT,                           -- ID for the run provided by the seq vendor e.g. Novagene
    sequencing_platform VARCHAR(255),                     -- Name of sequencing platform
    read_length INTEGER,                                  -- Average read length
    number_of_reads INTEGER,                              -- Total number of reads
    quality_score_avg FLOAT,                              -- Average quality score
    sequencing_method VARCHAR(255),                       -- Description of sequencing method
    total_base_pairs BIGINT                               -- Total base pairs from the sequencing run
);

-- Assembly table
CREATE TABLE Assembly (
    assembly_num_id INTEGER PRIMARY KEY AUTOINCREMENT,   -- Numeric auto-increment ID
    assembly_unique_id TEXT UNIQUE,                     -- Alphanumeric unique ID (e.g., ASM1)
    sample_num_id INTEGER NOT NULL REFERENCES Sample(sample_num_id), -- Foreign key to Sample table
    assembler_tool VARCHAR(255),                              
    assembly_version VARCHAR(20),                             
    contig_count INTEGER,                                     
    largest_contig INTEGER,                                   
    N50 INTEGER,                                              
    GC_content FLOAT,                                         
    total_assembled_length INTEGER,                          
    cds_count INTEGER                                         -- New column for total CDS count
);

-- OverallStats table
CREATE TABLE OverallStats (
    stats_id INTEGER PRIMARY KEY AUTOINCREMENT,           -- Numeric auto-increment ID as primary key
    total_bp BIGINT DEFAULT 1000000000,        
    total_cds BIGINT DEFAULT 125000000,        
    total_samples INTEGER DEFAULT 90,          
    total_studies INTEGER DEFAULT 10           
);

CREATE TABLE enzyme_protein (
    protein_id TEXT,
    ec_number TEXT,
    go_terms TEXT,
    product TEXT
);

CREATE TABLE protein_function (
    protein_id TEXT,
    signature_acc TEXT,
    signature_desc TEXT,
    source TEXT
);

CREATE TABLE protein_confidence (
    protein_id TEXT PRIMARY KEY,
    e_value FLOAT,
    status TEXT,
    date TEXT
);

CREATE TABLE protein_localization (
    protein_id TEXT,
    start INTEGER,    end INTEGER,
    alignment_length INTEGER
);

CREATE TABLE functional_pathway (
    protein_id TEXT,
    pathway_db TEXT,
    pathway_id TEXT
);


-- Tekrarlayan proteinleri temizle
DELETE FROM enzyme_protein
WHERE rowid NOT IN (
    SELECT MIN(rowid)
    FROM enzyme_protein
    GROUP BY protein_id
);




