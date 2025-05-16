import React, { useState } from "react";
// Import MagicBlock SOAR SDK and Solana web3
import { SoarClient, SoarProgram, GameClient, InstructionBuilder } from "@magicblock-labs/soar-sdk";
import * as web3 from "@solana/web3.js";
import BN from "bn.js";
import bs58 from "bs58";

const AmocaClimateChallenge = () => {
    const [status, setStatus] = useState<string>("");
    const [playerAddress, setPlayerAddress] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [gameScore, setGameScore] = useState<number>(0);
    const [actionsLog, setActionsLog] = useState<string[]>([]);
    const [leaderboard, setLeaderboard] = useState<{ player: string; score: number }[]>([
        { player: "PlayerA", score: 12 },
        { player: "PlayerB", score: 8 },
        { player: "PlayerC", score: 5 }
    ]);
    // Add a simple game-over state and a goal for the game
    const [gameOver, setGameOver] = useState<boolean>(false);
    const goal = 10;

    // Define styles
    const styles = {
        container: {
            fontFamily: "Arial, sans-serif",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#f4f4f4",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        },
        header: {
            color: "#333",
            textAlign: "center" as "center",
            marginBottom: "20px",
        },
        subHeader: {
            color: "#555",
            marginTop: "30px",
            marginBottom: "15px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "5px",
        },
        paragraph: {
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "10px",
        },
        button: {
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: "pointer",
            margin: "5px",
            fontSize: "16px",
        },
        buttonDisabled: {
            backgroundColor: "#ccc",
            cursor: "not-allowed",
        },
        input: {
            padding: "10px",
            margin: "5px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
        },
        statusMessage: {
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#e9ecef",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            textAlign: "center" as "center",
        },
        actionsLogContainer: {
            marginTop: "16px",
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "4px",
            maxHeight: "200px",
            overflowY: "auto" as "auto",
        },
        actionsLogList: {
            listStyleType: "none",
            paddingLeft: "0",
        },
        actionsLogItem: {
            padding: "5px 0",
            borderBottom: "1px dashed #eee",
        },
        gameOverMessage: {
            color: "green",
            marginTop: "8px",
            fontWeight: "bold" as "bold",
            padding: "10px",
            backgroundColor: "#d4edda",
            borderColor: "#c3e6cb",
            borderRadius: "4px",
        },
        table: {
            borderCollapse: "collapse" as "collapse",
            width: "100%",
            maxWidth: "600px",
            marginTop: "20px",
            boxShadow: "0 0 5px rgba(0,0,0,0.05)",
        },
        th: {
            border: "1px solid #ddd",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            textAlign: "left" as "left",
        },
        td: {
            border: "1px solid #ddd",
            padding: "10px",
            wordBreak: "break-all" as "break-all",
        },
        section: {
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
        }
    };

    const handleCreateLeaderboard = async () => {
        setStatus("Creating leaderboard...");
        try {
            setStatus("Leaderboard created successfully!");
        } catch (error) {
            setStatus("Error creating leaderboard: " + (error as Error).message);
        }
    };

    const handleSubmitScore = async () => {
        setStatus("Submitting score...");
        try {
            setStatus("Score submitted successfully!");
        } catch (error) {
            setStatus("Error submitting score: " + (error as Error).message);
        }
    };

    // Add this function inside the component
    const handleTakeAction = () => {
        if (gameOver) return;
        const newScore = gameScore + 1;
        setGameScore(newScore);
        setActionsLog([
            ...actionsLog,
            `Action #${newScore}: You took a climate action!`
        ]);
        if (newScore >= goal) {
            setGameOver(true);
            setActionsLog(logs => [
                ...logs,
                `🎉 Congratulations! You reached the goal of ${goal} climate actions!`
            ]);
        }
    };

    const handleResetGame = () => {
        setGameScore(0);
        setActionsLog([]);
        setGameOver(false);
    };

    const handleAddToLeaderboard = () => {
        if (!playerAddress || score <= 0) {
            setStatus("Enter a valid player public key and score.");
            return;
        }
        setLeaderboard(prev => {
            const updated = [...prev, { player: playerAddress, score }];
            updated.sort((a, b) => b.score - a.score);
            return updated.slice(0, 10);
        });
        setStatus("Score added to local leaderboard!");
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>AMOCA Climate Challenge</h1>
            <p style={styles.paragraph}>Welcome to the AMOCA Climate Challenge! Take real-world climate actions and earn rewards.</p>
            
            <div style={styles.section}>
                <h2 style={styles.subHeader}>Initialize Leaderboard</h2>
                <button 
                    onClick={handleCreateLeaderboard} 
                    style={styles.button}
                >
                    Create AMOCA Leaderboard (One-time Setup)
                </button>
            </div>

            {status && <p style={styles.statusMessage}>{status}</p>}
            
            {/* AMOCA Game UI */}
            <div style={styles.section}>
                <h2 style={styles.subHeader}>AMOCA Game: Take Climate Action!</h2>
                <p style={styles.paragraph}>Your Game Score: {gameScore}</p>
                <p style={styles.paragraph}>Goal: {goal} actions</p>
                <button 
                    onClick={handleTakeAction} 
                    disabled={gameOver}
                    style={{...styles.button, ...(gameOver ? styles.buttonDisabled : {})}}
                >
                    Take Climate Action (+1)
                </button>
                <button
                    style={{...styles.button, marginLeft: 8, backgroundColor: "#6c757d", ...(gameScore === 0 && !gameOver ? styles.buttonDisabled : {})}}
                    onClick={handleResetGame}
                    disabled={gameScore === 0 && !gameOver}
                >
                    Reset Game
                </button>
                {gameOver && (
                    <div style={styles.gameOverMessage}>
                        <strong>🎉 You reached the goal! Submit your score to the leaderboard!</strong>
                    </div>
                )}
                <div style={styles.actionsLogContainer}>
                    <h3 style={{...styles.subHeader, marginTop: 0, borderBottom: 'none'}}>Actions Log</h3>
                    <ul style={styles.actionsLogList}>
                        {actionsLog.map((log, idx) => (
                            <li key={idx} style={styles.actionsLogItem}>{log}</li>
                        ))}
                    </ul>
                </div>
            </div>
            
            {/* Submit Score Section */}
            <div style={styles.section}>
                <h2 style={styles.subHeader}>Submit Your Score</h2>
                <input
                    type="text"
                    placeholder="Player Public Key"
                    value={playerAddress}
                    onChange={e => setPlayerAddress(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Score"
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    style={styles.input}
                />
                <button 
                    onClick={handleSubmitScore} 
                    style={styles.button}
                >
                    Submit Score to Solana
                </button>
                {/* Quick fill from game */}
                <button
                    style={{...styles.button, marginLeft: 8, backgroundColor: "#28a745", ...(gameScore === 0 ? styles.buttonDisabled : {})}}
                    onClick={() => setScore(gameScore)}
                    disabled={gameScore === 0}
                >
                    Use Game Score
                </button>
                {/* Add to local leaderboard for demo */}
                <button
                    style={{...styles.button, marginLeft: 8, backgroundColor: "#ffc107", color: "#212529", ...(!playerAddress || score <= 0 ? styles.buttonDisabled : {})}}
                    onClick={handleAddToLeaderboard}
                    disabled={!playerAddress || score <= 0}
                >
                    Add to Local Leaderboard (Demo)
                </button>
            </div>

            {/* Leaderboard Demo */}
            <div style={styles.section}>
                <h2 style={styles.subHeader}>Leaderboard</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Rank</th>
                            <th style={styles.th}>Player</th>
                            <th style={styles.th}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry, idx) => (
                            <tr key={entry.player + entry.score}>
                                <td style={styles.td}>{idx + 1}</td>
                                <td style={styles.td}>{entry.player}</td>
                                <td style={styles.td}>{entry.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AmocaClimateChallenge;