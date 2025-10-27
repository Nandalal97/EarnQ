import React, { useEffect, useState } from 'react';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import API from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const MockTest = () => {
    const [mockTests, setMockTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState("All");
    const [totalMocktest, setTotalMocktest] = useState(0);
    const [filterType, setFilterType] = useState("All");
    // Fetch categories dynamically (optional)
    const [categories, setCategories] = useState(["All"]);

    const authToken = getAuthToken();
    const userData = authToken ? decodeToken(authToken) : null;
    const isPremium = userData?.isPremium ?? false;
    const navigate = useNavigate();
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
    // Fetch categories dynamically on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get('/mocktests/categories');
                if (res.data.success) {
                    setCategories(res.data.categories || ["All"]);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);
    // 🔹 Fetch function
    const fetchMockTests = async (searchKeyword = keyword, pageNum = page, selectedCategory = category, selectedType = filterType) => {
        setLoading(true);
        try {
            const res = await API.get('/mocktests/listMockTests', {
                params: {
                    isPremium,
                    lang,
                    page: pageNum,
                    limit: 10,
                    keyword: searchKeyword,
                    category: selectedCategory,
                    type: selectedType  // 👈 added
                }
            });
            setMockTests(res.data.mockTests || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalMocktest(res.data.total);
        } catch (error) {
            console.error("Error fetching mock tests:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategory(value);
        fetchMockTests(keyword.trim(), 1, value);
    };
    // Initial fetch
    useEffect(() => {
        fetchMockTests(keyword.trim(), page, category, filterType);
    }, [keyword, page, lang, isPremium, category, filterType]);


    const handleMockTest = (id) => {
        navigate('/mock-test/questions', { state: { mockTestId: id } });
    };

    const truncateTitle = (title, limit = 40) => {
        if (!title) return "";
        return title.length > limit ? title.slice(0, limit) + "..." : title;
    };

    // 🔹 Pagination handlers
    const goToPage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const formatMockTestTitle = (title, indexMap) => {
        if (!indexMap[title]) {
            indexMap[title] = 1;
            return `${title}-1`;
        } else {
            indexMap[title] += 1;
            return `${title}-${indexMap[title]}`;
        }
    };
    // In your render (mockTests.map)
    const titleIndexMap = {}; // Initialize before mapping

    const handleFilterChange = (value) => {
        setFilterType(value);
        setPage(1);
        fetchMockTests(keyword.trim(), 1, category, value);
    };

    return (
        <div className="page-wrapper">
            <div className="content-row">
                <main className="app-container">
                    <div className="mcq-ca-container">
                        <h1 className="text-md">Mock Test - Exam Ready MCQs</h1>
                        <p>Prepare like a topper! Access <strong className='fw-semibold'> SSC, RRB, PSC, UPSC, NDA, Computer, Programing</strong> etc mock tests with real exam-style MCQ questions. Measure your growth and succeed with confidence.</p>

                        {/* 🔹 Search */}
                        <div className="row g-1 mt-2">
                            <div className="col-12 col-md-6">
                                <div>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder="Search mock tests..."
                                        className="form-control text-xsm"
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <select className="form-select text-xsm mb-2" value={category} onChange={handleCategoryChange}>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="col-12 col-md-3 mt-1">
                                <select
                                    className="form-select text-xsm mb-2"
                                    value={filterType}
                                    onChange={(e) => handleFilterChange(e.target.value)}
                                >
                                    <option value="All">All</option>
                                    <option value="Free">Free</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>

                        </div>
                        <div>
                            <span className='text-xsm color-two'>Total Mocktest: {totalMocktest}</span>
                        </div>

                        {/* 🔹 Table */}
                        <div className="mt-2">
                            <table className="table table-border text-xsm fw-normal">
                                <tbody className="text-xsm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="2" className="text-center">Loading...</td>
                                        </tr>
                                    ) : mockTests.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="text-center">No Mock Tests Found</td>
                                        </tr>
                                    ) : (
                                        mockTests.map((test) => {
                                            const formattedTitle = formatMockTestTitle(test.title, titleIndexMap);
                                            const isLocked = !isPremium && test.isPremium;
                                            return (
                                                <tr key={test._id}>
                                                    <td className="icon-cell pb-1">
                                                        {/* <span>{truncateTitle(test.title)}</span> */}
                                                        <span>{truncateTitle(formattedTitle)}</span>
                                                        <div className="row d-flex justify-content-between text-xxsm text-muted">
                                                            <div className="col-4 border-end">
                                                                <span>{test.questionCount} Questins</span>
                                                            </div>
                                                            <div className="col-4 border-end text-center">
                                                                <span>{test.totalMark} Marks</span>
                                                            </div>
                                                            <div className="col-4">
                                                                <span>{test.duration} Mins</span>

                                                            </div>

                                                        </div>

                                                    </td>
                                                    <td className="text-end">
                                                        {isLocked ? (
                                                            <span className="badge bg-success me-2 mockStartbtn">Premium</span>
                                                        ) : (
                                                            <span className="badge bg-two me-2 mockStartbtn cursor-pointer" onClick={() => handleMockTest(test._id)}>Start Test</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 🔹 Pagination */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <button
                                    className={`bg-one text-xxsm color-white cursor-pointer rounded border-0 px-2 ${page === 1 ? 'bg-secondary disabled' : ''}`}
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Prev
                                </button>
                                <span className="mx-2">Page {page} of {totalPages}</span>
                                <button
                                    className={`bg-one text-xxsm color-white cursor-pointer rounded border-0 px-2 ${page === totalPages ? 'bg-secondary disabled' : ''}`}
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MockTest;
