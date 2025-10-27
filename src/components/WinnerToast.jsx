import React, { useEffect, useState } from "react";

// Dummy winner list (can replace with props or API data)
const winnerList = [
    { name: "Raj", city: "Delhi", prize: "₹500", topic: "General Knowledge" },
    { name: "Pooja", city: "Mumbai", prize: "₹500", topic: "Current Affairs" },
    { name: "Amit", city: "Bangalore", prize: "₹1000", topic: "Science & Tech" },
    { name: "Sneha", city: "Hyderabad", prize: "₹500", topic: "History" },
    { name: "Vikram", city: "Chennai", prize: "₹500", topic: "Geography" },
    { name: "Neha", city: "Pune", prize: "₹500", topic: "Economy" },
    { name: "Arjun", city: "Kolkata", prize: "₹500", topic: "Sports" },
    { name: "Kiran", city: "Ahmedabad", prize: "₹500", topic: "Politics" },
    { name: "Deepa", city: "Jaipur", prize: "₹500", topic: "Environment" },
    { name: "Ravi", city: "Lucknow", prize: "₹500", topic: "Culture & Heritage" },
];


const getRandomDelay = () => Math.floor(Math.random() * 7000) + 8000;
const WinnerToast = () => {
    const [visible, setVisible] = useState(false);
    const [currentWinner, setCurrentWinner] = useState(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let showTimeout, hideTimeout;

        const showNextWinner = () => {
            setCurrentWinner(winnerList[index]);
            setVisible(true);

            hideTimeout = setTimeout(() => {
                setVisible(false);
                setIndex((prev) => (prev + 1) % winnerList.length);

                // Show next after 60 seconds
                showTimeout = setTimeout(showNextWinner, 30000);
            }, 5000); // visible for 5 sec
        };

        // First one starts after 60 seconds
        showTimeout = setTimeout(showNextWinner, 30000);

        return () => {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
        };
    }, [index]);


    return (
        <>
            {visible && currentWinner && (
                <div style={styles.toast}>
                    <div style={styles.header}>
                        🎉 <span style={styles.title}>Congratulations!</span>
                    </div>
                    <div style={styles.message}>
                        <strong>{currentWinner.name}</strong> from {currentWinner.city} <strong>earned {currentWinner.prize}</strong> by scoring high in <strong>{currentWinner.topic}</strong> quiz contest!

                    </div>
                </div>

            )}
        </>
    );
};

const styles = {
    toast: {
        position: "fixed",
        bottom: "5px",
        right: "20px",
        background: "#1e293beb", // dark slate blue
        color: "#fff",
        padding: "6px 10px 10px 10px",
        borderRadius: "5px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        width: "300px",
        zIndex: 1000,
        fontFamily: "Segoe UI, sans-serif",
        animation: "fadeIn 0.3s ease-in-out",
    },
    header: {
        fontSize: "12px",
        marginBottom: "2px",
        display: "flex",
        alignItems: "center",
        fontWeight: 600,
    },
    title: {
        marginLeft: "8px",
        color: "#facc15",
    },
    message: {
        fontSize: "11px",
        lineHeight: "1.4",
    }
};


export default WinnerToast;
