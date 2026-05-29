import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Vote from "./pages/Vote";
import Voted from "./pages/Voted";
import VotingClosed from "./pages/VotingClosed";
import Results from "./pages/Results";

function MPCVotingIndex() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/vote" element={<Vote />} />
                <Route path="/voted" element={<Voted />} />
                <Route path="/closed" element={<VotingClosed />} />
                <Route path="/results" element={<Results />} />
            </Routes>
        </Router>
    );
}

export default MPCVotingIndex;