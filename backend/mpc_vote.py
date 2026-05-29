from flask import Blueprint, request, jsonify
from backend.mpc_database import get_db
import time

vote_bp = Blueprint('vote', __name__)

@vote_bp.route('/cast_vote', methods=['POST'])
def cast_vote():
    data = request.json
    username = data['username']

    # Retry mechanism for SQLite lock
    for attempt in range(5):
        try:
            conn = get_db()
            cursor = conn.cursor()

            cursor.execute("SELECT has_voted FROM voters WHERE voter_id=?", (username,))
            result = cursor.fetchone()

            if result and result['has_voted'] == 0:
                cursor.execute("UPDATE voters SET has_voted=1 WHERE voter_id=?", (username,))
                conn.commit()
                conn.close()

                # Audit log
                with open("audit_log.txt", "a") as f:
                    f.write(f"Voter {username} has voted\n")

                return jsonify({"message": "Vote accepted"})
            else:
                conn.close()
                return jsonify({"message": "Already voted or invalid voter"})

        except:
            time.sleep(1)  # Wait and retry if DB locked

    return jsonify({"message": "Database busy, try again"})
    

@vote_bp.route('/results', methods=['GET'])
def results():
    import requests
    try:
        response = requests.get("http://127.0.0.1:7000/final_result")
        return jsonify(response.json())
    except:
        return jsonify({"message": "Reconstruction server not running"})