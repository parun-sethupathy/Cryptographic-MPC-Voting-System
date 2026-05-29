import { useEffect, useState } from "react";
import { getResults } from "../api/api";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Results() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await getResults();
                const result = await response.json();

                console.log("Results from backend:", result);

                if (
                    result &&
                    typeof result.Alice === "number" &&
                    typeof result.Bob === "number" &&
                    typeof result.Charlie === "number"
                ) {
                    setData(result);
                } else {
                    setError("Invalid result format from server");
                }
            } catch (err) {
                console.error("Error fetching results:", err);
                setError("Failed to fetch results");
            }
        };

        fetchResults();
    }, []);

    if (error) {
        return (
            <div className="container">
                <h2>{error}</h2>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container">
                <h2>Loading Results...</h2>
            </div>
        );
    }

    const alice = Number(data.Alice) || 0;
    const bob = Number(data.Bob) || 0;
    const charlie = Number(data.Charlie) || 0;

    const totalVotes = alice + bob + charlie;

    const winner =
        alice > bob && alice > charlie
            ? "Alice"
            : bob > alice && bob > charlie
            ? "Bob"
            : charlie > alice && charlie > bob
            ? "Charlie"
            : "Tie";

    // UPDATED BAR DATA (colors added)
    const barData = {
        labels: ["Alice", "Bob", "Charlie"],
        datasets: [
            {
                label: "Votes",
                data: [alice, bob, charlie],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(75, 192, 192, 0.8)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(75, 192, 192, 1)"
                ],
                borderWidth: 2
            }
        ]
    };

    // UPDATED PIE DATA (colors added)
    const pieData = {
        labels: ["Alice", "Bob", "Charlie"],
        datasets: [
            {
                data: [alice, bob, charlie],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(75, 192, 192, 0.8)"
                ],
                borderColor: "#ffffff",
                borderWidth: 2
            }
        ]
    };

    // UPDATED OPTIONS (visibility on dark UI)
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: { color: "white" }
            },
            title: {
                display: true,
                text: "Vote Count",
                color: "white"
            }
        },
        scales: {
            x: {
                ticks: { color: "white" }
            },
            y: {
                ticks: { color: "white", precision: 0 },
                beginAtZero: true
            }
        }
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: { color: "white" }
            },
            title: {
                display: true,
                text: "Vote Share",
                color: "white"
            }
        }
    };

    return (
        <div className="container">
            <h2>Election Results</h2>

            <div style={{ maxWidth: "700px", margin: "20px auto" }}>
                <Bar data={barData} options={barOptions} />
            </div>

            <div style={{ maxWidth: "500px", margin: "20px auto" }}>
                <Pie data={pieData} options={pieOptions} />
            </div>

            <h3>Analysis</h3>
            <p>Total Votes Cast: {totalVotes}</p>
            <p>Winner: {winner}</p>
            <p>Alice Vote %: {totalVotes ? ((alice / totalVotes) * 100).toFixed(2) : 0}%</p>
            <p>Bob Vote %: {totalVotes ? ((bob / totalVotes) * 100).toFixed(2) : 0}%</p>
            <p>Charlie Vote %: {totalVotes ? ((charlie / totalVotes) * 100).toFixed(2) : 0}%</p>
        </div>
    );
}

export default Results;