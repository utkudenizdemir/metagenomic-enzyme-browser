from flask import Flask
from flask_cors import CORS
from backend.model import db, OverallStats, Study, Sample  # Import necessary models
from config import Config
from backend.routes import main  # Import main blueprint for routes


app = Flask(__name__)
app.config.from_object(Config)  # Load configuration from config.py
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize the database connection without creating tables
db.init_app(app)

# Register the main blueprint for routes
app.register_blueprint(main)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
