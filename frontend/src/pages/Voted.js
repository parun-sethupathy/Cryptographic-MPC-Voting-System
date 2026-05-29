import { useNavigate } from "react-router-dom";

function Voted() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Your vote has been securely recorded.</h2>
            <button onClick={() => navigate("/")}>
                Next Voter
            </button>
        </div>
    );
}

export default Voted;