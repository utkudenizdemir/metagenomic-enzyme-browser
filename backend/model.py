from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, Date, BigInteger
from sqlalchemy.ext.declarative import declared_attr

# Initialize SQLAlchemy
db = SQLAlchemy()


class BaseModel(db.Model):
    """Base model that provides a to_dict method."""
    __abstract__ = True  # Indicates this class is only a base class

    @declared_attr
    def __tablename__(cls):
        """Automatically set the table name to the lowercase name of the model."""
        return cls.__name__.lower()
    
    def to_dict(self):
        """
        Converts the SQLAlchemy model to a dictionary, excluding private attributes and relationship fields.
        """
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }


# 1. Study Model
class Study(BaseModel):
    __tablename__ = 'study'
    
    study_num_id = Column(Integer, primary_key=True, autoincrement=True)  # Numeric auto-increment ID
    study_unique_id = Column(String(20), unique=True, nullable=False)  # Alphanumeric unique ID
    title = Column(Text, nullable=False)
    description = Column(Text)
    submitter_name = Column(String(255))
    submission_date = Column(Date)
    publication_link = Column(Text)
    short_study_name = Column(String(3))  # Abbreviated study name
    
    # Relationships
    samples = db.relationship('Sample', back_populates='study')


# 2. Biome Model
class Biome(BaseModel):
    __tablename__ = 'biome'
    
    biome_num_id = Column(Integer, primary_key=True, autoincrement=True)  # Numeric auto-increment ID
    biome_unique_id = Column(String(20), unique=True, nullable=False)  # Alphanumeric unique ID
    biome_name = Column(String(255), nullable=False, unique=True)  # Updated to be unique
    environment_ontology = Column(String(255))


# 3. Sample Model
class Sample(BaseModel):
    __tablename__ = 'sample'
    
    sample_num_id = Column(Integer, primary_key=True, autoincrement=True)  # Numeric auto-increment ID
    sample_unique_id = Column(String(20), unique=True, nullable=False)  # Alphanumeric unique ID
    prozomix_id = Column(String(20))  # External Prozomix identifier
    study_num_id = Column(Integer, ForeignKey('study.study_num_id'), nullable=False)
    biome_name = Column(String(255), ForeignKey('biome.biome_name'))  # References biome_name
    collection_date = Column(Date)
    location = Column(Text)
    environment = Column(Text)
    short_sample_name = Column(String(6))
    description = Column(Text)
    temperature = Column(Float)
    ph = Column(Float)
    other_factors = Column(Text)
    
    # Relationships
    study = db.relationship('Study', back_populates='samples')
    geolocation = db.relationship('Geolocation', back_populates='sample', uselist=False)
    dna_preps = db.relationship('DNAPrep', back_populates='sample')
    assemblies = db.relationship('Assembly', back_populates='sample')


# 4. Geolocation Model
class Geolocation(BaseModel):
    __tablename__ = 'geolocation'
    
    geolocation_num_id = Column(Integer, primary_key=True, autoincrement=True)  # Numeric auto-increment ID
    geolocation_unique_id = Column(String(20), unique=True, nullable=False)  # Alphanumeric unique ID
    sample_num_id = Column(Integer, ForeignKey('sample.sample_num_id'), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    altitude = Column(Float)
    depth = Column(Float)  # Depth in meters
    country = Column(String(255))
    region = Column(String(255))
    additional_info = Column(Text)
    
    # Relationships
    sample = db.relationship('Sample', back_populates='geolocation')


# 5. DNAPrep Model
class DNAPrep(BaseModel):
    __tablename__ = 'dna_prep'
    
    prep_num_id = Column(Integer, primary_key=True, autoincrement=True)
    prep_unique_id = Column(String(20), unique=True, nullable=True)
    sample_num_id = Column(Integer, ForeignKey('sample.sample_num_id'), nullable=False)
    prep_date = Column(Date)
    technician = Column(String(255))
    kit_used = Column(String(255))
    concentration = Column(Float)
    user_identifier = Column(String(255))
    
    # Relationships
    sample = db.relationship('Sample', back_populates='dna_preps')
    sequencing_runs = db.relationship('SequencingRun', back_populates='dna_prep')


# 6. SequencingRun Model
class SequencingRun(BaseModel):
    __tablename__ = 'sequencing_run'
    
    run_num_id = Column(Integer, primary_key=True, autoincrement=True)
    run_unique_id = Column(String(20), unique=True, nullable=False)  # Unique ID for the run
    prep_num_id = Column(Integer, ForeignKey('dna_prep.prep_num_id'), nullable=False)  # Foreign key to DNAPrep
    sequence_provider_id = Column(String)
    sequencing_platform = Column(String(255))
    read_length = Column(Integer)
    number_of_reads = Column(Integer)
    quality_score_avg = Column(Float)
    sequencing_method = Column(String(255))
    total_base_pairs = Column(BigInteger)
    
    # Relationships
    dna_prep = db.relationship('DNAPrep', back_populates='sequencing_runs')


# 7. Assembly Model
class Assembly(BaseModel):
    __tablename__ = 'assembly'
    
    assembly_num_id = Column(Integer, primary_key=True, autoincrement=True)
    assembly_unique_id = Column(String(20), unique=True, nullable=False)
    sample_num_id = Column(Integer, ForeignKey('sample.sample_num_id'), nullable=False)
    assembler_tool = Column(String(255))
    assembly_version = Column(String(20))
    contig_count = Column(Integer)
    largest_contig = Column(Integer)
    N50 = Column(Integer)
    GC_content = Column(Float)
    total_assembled_length = Column(Integer)
    cds_count = Column(Integer)  # New column for total CDS
    
    # Relationships
    sample = db.relationship('Sample', back_populates='assemblies')


# 8. OverallStats Model
class OverallStats(BaseModel):
    __tablename__ = 'overall_stats'
    
    stats_id = Column(Integer, primary_key=True, autoincrement=True)
    total_bp = Column(BigInteger, default=1000000000)
    total_cds = Column(BigInteger, default=125000000)
    total_samples = Column(Integer, default=90)
    total_studies = Column(Integer, default=10)
