import { useNavigate } from "react-router-dom";

function VotingClosed() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1>Voting is now closed</h1>
            <button onClick={() => navigate("/results")}>
                View Results
            </button>
        </div>
    );
}

export default VotingClosed;