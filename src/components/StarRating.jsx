import React, { useState, useEffect } from "react";

// Star Rating Component
const StarRating = ({ rating }) => {
    const percentage = (rating / 5) * 100;
    return (
        <div style={{ position: "relative", display: "inline-block", fontSize: "18px", color: "#ccc" }}>
            <div style={{ position: "absolute", top: 0, left: 0, whiteSpace: "nowrap", overflow: "hidden", color: "#f8ce0b", width: `${percentage}%` }}>
                ★★★★★
            </div>
            <div>★★★★★</div>
        </div>
    );
};

const BookStartRating = ({ bookId, defaultRating, defaultCount }) => {
    const [userRatings, setUserRatings] = useState([]); // dynamic real user ratings
    const [avgRating, setAvgRating] = useState(defaultRating);
    const [totalCount, setTotalCount] = useState(defaultCount);

    useEffect(() => {
        // Simulate fetching user ratings from backend
        const fetchUserRatings = async () => {
            //       useEffect(() => {
            //   const fetchUserRatings = async () => {
            //     const response = await fetch(`/api/ratings?bookId=${bookId}`);
            //     const ratings = await response.json(); // should return array of numbers
            //     setUserRatings(ratings);
            //     const totalRating = ratings.reduce((a, b) => a + b, 0) + defaultRating * defaultCount;
            //     const count = ratings.length + defaultCount;
            //     setAvgRating(parseFloat((totalRating / count).toFixed(1)));
            //     setTotalCount(count);
            //   };
            //   fetchUserRatings();
            // }, [bookId, defaultRating, defaultCount]);

            // Example: ratings fetched per bookId
            const allUserRatings = {
                1: [5, 4, 3.5, 5],
              
            };




            const ratings = allUserRatings[bookId] || [];
            setUserRatings(ratings);

            const totalRating = ratings.reduce((a, b) => a + b, 0) + defaultRating * defaultCount;
            const count = ratings.length + defaultCount;

            setAvgRating(parseFloat((totalRating / count).toFixed(1)));
            setTotalCount(count);
        };

        fetchUserRatings();
    }, [bookId, defaultRating, defaultCount]);

    return (
        <div>
            <StarRating rating={avgRating} /> <span className="text-dark">({totalCount})</span>
        </div>
    );
};

export default BookStartRating;
