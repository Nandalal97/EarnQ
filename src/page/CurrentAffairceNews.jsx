import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import API from "../utils/axios";

const CurrentAffairceNews = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // API limit

    const currentYear = new Date().getFullYear();
    const location = useLocation();
    const dateItems = location.state?.items || {};
    const date = dateItems.date || "";
    const month = dateItems.monthNumber || "";
    const year = dateItems.year || currentYear;


    const fetchNews = async (pageNumber = 1) => {
        setLoading(true);

        // Language from localStorage, default 'en'
        const lang = localStorage.getItem("lang") || "en";

        try {
            const response = await API.get(`/news/all/current-news`,
                { params: { lang, page: pageNumber, limit, startDate: date, endDate: date, month: month, year: year } }
            );

            const data = response.data;
            setNewsData(data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(page);
    }, [page]);

    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="page-wrapper">
            <div className="content-row">
             
                <main className="app-container my-2 p-2">
                    <div className="ca-container">
                        <h5 className="text-md mb-0">Current Affairs - {dateItems.formatedate || dateItems.month || dateItems.year}</h5>
                        {newsData.map((news, index) => (
                            <div className="news-card mb-3 rounded" key={news.newsId || index}>
                                <h5 className="news-heading text-md color-one mb-2">{news.heading}</h5>
                                <p>{news.shortDescription}</p>
                                <h6 className="mt-3 text-sm">Key Points:</h6>
                                <ul className="news-keypoints text-xsm">
                                    {news.keyPoints.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                                <p className="news-source">
                                    Source: <a href={news.rawNews.link} target="_blank" rel="noopener noreferrer">{news.rawNews.source}</a>
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-buttons my-3 d-flex justify-content-between gap-2 mt-2">
                        <button className={`bg-one text-xxsm color-white cursor-pointer rounded border-0 px-2 ${page === 1 ? 'bg-secondary disabled' : ''}`} onClick={handlePrev}>
                            Prev
                        </button>
                        <span className="align-self-center text-xxsm">Page {page} of {totalPages}</span>
                        <button className={`bg-one text-xxsm color-white cursor-pointer rounded border-0 px-3 py-1 ${page === totalPages ? 'bg-secondary disabled' : ''}`} onClick={handleNext}>
                            Next
                        </button>
                    </div>

                    )}
                    
                </main>
            </div>
        </div>
    );
};

export default CurrentAffairceNews;
