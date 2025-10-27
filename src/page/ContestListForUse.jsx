import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import API from "../utils/axios";
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";

export default function ContestList() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const authToken = getAuthToken();
    const userData = decodeToken(authToken);
    const userId = userData?.id;
    useEffect(() => {
        const fetchContests = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/contest/userBookingContest/${userId}`
                );
                setContests(res.data || []);
            } catch (error) {
                console.error("Error fetching contests:", error);
                setContests([]);
            } finally {
                setLoading(false); // stop loading
            }
        };

        fetchContests();
    }, [userId]);

    const handleContestClick = (contest) => {
        navigate(`/contest/winners`, { state: contest });
    };

    const truncateTitle = (title) => {
        return title.length > 25 ? title.substring(0, 25) + "..." : title;
    };

    const totalPages = Math.ceil(contests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentContests = contests.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="content-row">
                    <main className="app-container">
                        <div className="user-contest-list">
                            <h2 className="text-lg font-bold mb-1">Contests</h2>
                            <p className="mb-2 text-gray-700">
                                View all contests you can join and see detailed results on the
                                leaderboard of all contest winners.
                            </p>
                            <hr />

                            {/* ✅ Show loading first */}
                            {loading ? (
                                <p className="text-center text-gray-500 mt-4">
                                    Loading contests...
                                </p>
                            ) : contests.length < 1 ? (
                                <p className="text-center text-danger mt-4">
                                    You haven't joined any contests yet. Join a contest to
                                    participate and see your results here.{" "}
                                    <span className="text-primary text-sm">
                                        You Can <Link to={"/contest"}> Join Contest</Link>
                                    </span>
                                </p>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="rank-table w-full">
                                            <thead className="text-sm">
                                                <tr>
                                                    <th>Contest</th>
                                                    <th colSpan={2} className="text-center">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-xsm">
                                                {currentContests.map((contest, index) => (
                                                    <tr key={index} onClick={() => handleContestClick(contest)} className="cursor-pointer">
                                                        <td className="fw-semibold py-1" title={contest.title} >
                                                            {truncateTitle(contest.title)}
                                                        </td>
                                                        <td className="text-sm text-end py-1">
                                                            {new Date(contest.startTime).toLocaleDateString()}
                                                        </td>
                                                        <td className="text-end py-2">
                                                            <span className="text-xsm color-one fw-semibold">
                                                                <FaChevronRight />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    {contests.length > itemsPerPage && (
                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                onClick={handlePrev}
                                                disabled={currentPage === 1}
                                                className={`btn-one bg-one py-0 color-white border-0  ${currentPage === 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                            >
                                                Prev
                                            </button>
                                            <span className="text-gray-600">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={handleNext}
                                                disabled={currentPage === totalPages}
                                                className={`btn-one bg-one py-0 color-white border-0 ${currentPage === totalPages
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
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
        </>
    );
}
