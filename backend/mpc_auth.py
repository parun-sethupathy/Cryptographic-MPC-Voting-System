from flask import Blueprint, request, jsonify
from backend.mpc_database import get_db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']

    hashed_password = generate_password_hash(password)

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO voters (voter_id, password, has_voted) VALUES (?, ?, 0)",
            (username, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "Registered successfully"})
    except:
        return jsonify({"message": "User already exists"})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM voters WHERE voter_id=?", (username,))
    user = cursor.fetchone()

    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"message": "Invalid credentials"})