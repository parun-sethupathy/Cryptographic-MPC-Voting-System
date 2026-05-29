import requests
from flask import Flask, jsonify
from flask_cors import CORS
from backend.mpc_secret_sharing import reconstruct_secret

app = Flask(__name__)
CORS(app)

EXPECTED_LENGTH = 3

def safe_fetch(url):
    try:
        res = requests.get(url)
        data = res.json().get("sum", [])

        # Ensure valid structure
        if not isinstance(data, list):
            return [0] * EXPECTED_LENGTH

        # Pad or trim to exact length
        if len(data) < EXPECTED_LENGTH:
            data += [0] * (EXPECTED_LENGTH - len(data))
        elif len(data) > EXPECTED_LENGTH:
            data = data[:EXPECTED_LENGTH]

        # Ensure integers
        return [int(x) for x in data]

    except:
        return [0] * EXPECTED_LENGTH


@app.route('/final_result', methods=['GET'])
def final_result():
    s1 = safe_fetch("http://127.0.0.1:6001/compute_sum")
    s2 = safe_fetch("http://127.0.0.1:6002/compute_sum")
    s3 = safe_fetch("http://127.0.0.1:6003/compute_sum")

    try:
        result = reconstruct_secret(s1, s2, s3)

        # Final safety check
        if not isinstance(result, list) or len(result) < EXPECTED_LENGTH:
            result = [0] * EXPECTED_LENGTH

        return jsonify({
            "Alice": int(result[0]),
            "Bob": int(result[1]),
            "Charlie": int(result[2])
        })

    except Exception as e:
        print("Reconstruction Error:", e)
        return jsonify({
            "Alice": 0,
            "Bob": 0,
            "Charlie": 0
        })


if __name__ == '__main__':
    app.run(port=7000)