import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { castVote } from "../api/api";

const P = 104729;

function encodeVote(candidate) {
    if (candidate === "Alice") return [1, 0, 0];
    if (candidate === "Bob") return [0, 1, 0];
    if (candidate === "Charlie") return [0, 0, 1];
    return [0, 0, 0];
}

function generateShares(secretVector) {
    let shares1 = [];
    let shares2 = [];
    let shares3 = [];

    for (let secret of secretVector) {
        let a1 = Math.floor(Math.random() * P);

        shares1.push((secret + a1 * 1) % P);
        shares2.push((secret + a1 * 2) % P);
        shares3.push((secret + a1 * 3) % P);
    }

    return [shares1, shares2, shares3];
}

function Vote() {
    const [vote, setVote] = useState("");
    const navigate = useNavigate();
    const username = localStorage.getItem("user");

    const sendShare = async (url, data) => {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Server error");

            return true;
        } catch (error) {
            console.error("Server error:", url, error);
            return false;
        }
    };

    const handleVote = async () => {

        // FIX 1: Ensure user exists
        if (!username) {
            alert("User not logged in");
            return;
        }

        // FIX 2: Ensure vote selected
        if (!vote) {
            alert("Please select a candidate");
            return;
        }

        let voteVector = encodeVote(vote);
        let [s1, s2, s3] = generateShares(voteVector);

        let ok1 = await sendShare("http://127.0.0.1:6001/receive_share", { voter_id: username, share: s1 });
        let ok2 = await sendShare("http://127.0.0.1:6002/receive_share", { voter_id: username, share: s2 });
        let ok3 = await sendShare("http://127.0.0.1:6003/receive_share", { voter_id: username, share: s3 });

        if (ok1 && ok2 && ok3) {
            try {
                const res = await castVote(username, vote);

                // FIX 3: validate backend response
                if (!res.ok) {
                    throw new Error("Vote API failed");
                }

                const data = await res.json();

                console.log("Vote response:", data);

                navigate("/voted");

            } catch (err) {
                console.error("Vote submission failed:", err);
                alert("Vote failed at backend");
            }
        } else {
            alert("One or more MPC servers are not running.");
        }
    };

    return (
        <div className="container">
            <h2>Cast Your Vote</h2>

            <select onChange={(e) => setVote(e.target.value)}>
                <option value="">Select Candidate</option>
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Charlie">Charlie</option>
            </select>

            <button onClick={handleVote}>Submit Vote</button>
        </div>
    );
}

export default Vote;