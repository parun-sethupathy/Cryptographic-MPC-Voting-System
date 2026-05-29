const API_URL = "http://localhost:5000";

// Register
export const registerUser = async (username, password) => {
    return fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });
};

// Login
export const loginUser = async (username, password) => {
    return fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });
};

// Cast Vote
export const castVote = async (username, vote) => {
    return fetch(`${API_URL}/cast_vote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, vote })
    });
};

// Get Results
export const getResults = async () => {
    return fetch(`${API_URL}/results`);
};