from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

shares = {}

@app.route('/receive_share', methods=['POST'])
def receive_share():
    data = request.json
    voter_id = data['voter_id']
    share = data['share']

    if voter_id not in shares:
        shares[voter_id] = share

    return jsonify({"message": "Share stored on Server 2"})

@app.route('/compute_sum', methods=['GET'])
def compute_sum():
    if not shares:
        return jsonify({"sum": [0, 0, 0]})

    all_shares = list(shares.values())
    length = len(all_shares[0])
    total = [0] * length

    for share in all_shares:
        for i in range(length):
            total[i] += int(share[i])

    return jsonify({"sum": total})

if __name__ == '__main__':
    app.run(port=6002)