from flask import Flask
from flask_cors import CORS
from backend.mpc_models import create_tables
from backend.mpc_auth import auth_bp
from backend.mpc_vote import vote_bp

app = Flask(__name__)

# Secret key for sessions
app.config['SECRET_KEY'] = 'supersecretkey'

# CORS so React can talk to Flask
CORS(app)

# Create database tables
create_tables()

# Register blueprints (routes)
app.register_blueprint(auth_bp)
app.register_blueprint(vote_bp)

# Run server
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)