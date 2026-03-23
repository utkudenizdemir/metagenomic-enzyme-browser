import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Updated path for the SQLite database in the instance directory
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'instance', 'metagenome.db')
    
    # Disable SQLAlchemy event system to save resources
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Updated path for the YAML file in the data directory
    EXCEL_FILE_NAME = os.path.join(basedir, 'data', 'Copy of flat_schema_entry_all_jan23_final.xlsx')

