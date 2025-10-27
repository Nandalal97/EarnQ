// MCQNews.js
import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import { useLocation } from "react-router-dom";

const CurrentAffairsMcq = () => {
    const [mcqData, setMcqData] = useState([]);
    const [visibleExplanations, setVisibleExplanations] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const mcqsPerPage = 10;

    const currentYear = new Date().getFullYear();
    const location = useLocation();
    const dateItems = location.state?.items || {};
    const date = dateItems.date || "";
    const month = dateItems.monthNumber || "";
    const year = dateItems.year || currentYear;
    // console.log('dateDATa:', date, "monthdata:", month);
    // console.log(dateItems);
    
    // Language from localStorage, default 'en'
    const lang = localStorage.getItem("lang") || "en";
    // Fetch MCQs from API
    const fetchMCQs = async (page = 1) => {
        try {
            setLoading(true);
            const response = await API.get(
                `/news/all/mcq?lang=${lang}&page=${page}&limit=${mcqsPerPage}&startDate=${date}&endDate=${date}&month=${month}&year=${year}`
            );
            if (response.data.success) {
                setMcqData(response.data.data || []);
                setTotalPages(response.data.totalPages || 1);
            } else {
                setMcqData([]);
            }
        } catch (error) {
            console.error("Error fetching MCQs:", error);
            setMcqData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (date || month || year) {
            fetchMCQs(currentPage);
            setVisibleExplanations({});
        }
        // reset explanations

    }, [currentPage, date]);

    const toggleExplanation = (globalIndex) => {
        setVisibleExplanations((prev) => ({
            ...prev,
            [globalIndex]: !prev[globalIndex],
        }));
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };
    return (
        <div className="page-wrapper">
            <div className="content-row">
                <main className="app-container mb-2">
                    <div className="daily-ca-container">
                        <h1 className="text-md">Daily Current Affairs MCQ – {dateItems.formatedate || dateItems.month || dateItems.year}</h1>
                        <p>
                            Practice today’s current affairs through these MCQs to improve
                            general knowledge, and boost confidence for competitive exams and
                            academic tests.
                        </p>
                        <hr />
                        {loading ? (
                            <p className="text-center">Loading MCQs...</p>
                        ) : mcqData.length === 0 ? (
                            <p className="text-center fw-semibold text-danger">
                                No Current Affairs found.
                            </p>
                        ) : (
                            <>
                                {mcqData.map((mcq, index) => {
                                    const globalIndex = (currentPage - 1) * mcqsPerPage + index;
                                    return (
                                        <div
                                            key={mcq.mcqId || globalIndex}
                                            className="mcq-news bg-white mb-2 rounded"
                                        >
                                            <div className="mcq-question text-sm fw-normal mb-1">
                                                Q{globalIndex + 1}: {mcq.question}
                                            </div>

                                            <ul className="list-group text-xsm mcq-options mb-3">
                                                {Object.entries(mcq.options).map(([key, value]) => (
                                                    <li
                                                        key={key}
                                                        className="list-group-item fw-light border-0 py-0"
                                                    >
                                                        {key.toUpperCase()}: {value}
                                                    </li>
                                                ))}
                                            </ul>

                                            <span
                                                className="color-white text-xsm py-1 btn-one bg-one cursor-pointer hover-color-1 border-color-one"
                                                onClick={() => toggleExplanation(globalIndex)}
                                            >
                                                {visibleExplanations[globalIndex]
                                                    ? "Hide Explanation"
                                                    : "Show Explanation"}
                                            </span>

                                            {visibleExplanations[globalIndex] && (
                                                <div className="mcq-explanation text-xsm mt-2 p-2 bg-light border-start border-3 border-primary rounded">
                                                    <p>
                                                        <strong>Answer:</strong> {mcq.answer}
                                                    </p>
                                                    {mcq.explanation}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <button
                                            className={`bg-one text-xxsm color-white cursor-pointer rounded border-0 px-2 py-1 ${currentPage === 1 ? "bg-secondary disabled" : ""
                                                }`}
                                            onClick={goToPrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>

                                        <span className="fw-normal text-xxsm">
                                            Page {currentPage} / {totalPages}
                                        </span>

                                        <button
                                            className={`bg-one text-xxsm color-white cursor-pointer rounded border-0 px-3 py-1 ${currentPage === totalPages ? "bg-secondary disabled" : ""
                                                }`}
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CurrentAffairsMcq;
