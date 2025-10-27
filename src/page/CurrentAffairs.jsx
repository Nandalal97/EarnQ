import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

const CurrentAffairs = () => {
    const [dateWise, setDateWise] = useState([]);
    const [monthWise, setMonthWise] = useState([]);
    const [yearWise, setYearWise] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate=useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get("/news/current-affairs/table");
                if (res.data.success && res.data.data) {
                    setDateWise(res.data.data.dateWise || []);
                    setMonthWise(res.data.data.monthWise || []);
                    setYearWise(res.data.data.yearWise || []);
                }
            } catch (error) {
                console.error("Error fetching current affairs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p className="text-center mt-4">Loading current affairs...</p>;
    }

    const handleMcqDaily = (items) => {
         navigate('/current-affairs-mcq', { state: { items } });
    }
    const handleMcqMonthly = (items) => {
         navigate('/current-affairs-mcq', { state: { items } });
    }
    const handleMcqYearly = (items) => {
         navigate('/current-affairs-mcq', { state: { items } });
    }

    const handleCADaily = (items) => {
              navigate('/daily-current-affairs', { state: { items } });
    }
    const handleCAMonthly = (items) => {
              navigate('/daily-current-affairs', { state: { items } });
    }
    const handleCAYearly = (items) => {
              navigate('/daily-current-affairs', { state: { items } });
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content-row">
                    <main className="app-container mb-2">
                        <div className="mcq-ca-container">
                            <h1 className="text-md"> Daily Current Affairs - Exam Ready MCQs</h1>
                            <p>
                                Get daily accurate and updated current affairs in India and around the world.
                                Our daily, monthly, and yearly tables provide easy access to important events, MCQs,
                                and detailed explanations for competitive exams preparation, enhancing general knowledge
                                and boosting confidence.
                            </p>

                            {/* Date-wise Table */}
                            <div className="mt-2">
                                <h3 className="text-sm">Current Affairs Daily</h3>
                                <table className="table table-border text-xsm fw-normal">
                                    <tbody className="text-xsm">
                                        {loading ? (
                                            <p className='text-center'>Loading daily CA MCQs...</p>
                                        ) : dateWise.length <= 1 ? (
                                            <p className="text-center fw-semibold text-danger">No Current Affairs found.</p>
                                        ) : (
                                            <>
                                                {dateWise.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="icon-cell">
                                                            <i className={`bi ${item.icon} ca-mcq-icon`}></i>
                                                            Current Affairs - {item.formatedate}
                                                        </td>
                                                        <td className="text-end">
                                                            <span className="badge bg-one me-2 cursor-pointer" onClick={() => handleMcqDaily(item)}>MCQ</span>
                                                            <span className="badge bg-two cursor-pointer" onClick={() => handleCADaily(item)}>Details</span>
                                                        </td>
                                                    </tr>
                                                ))}

                                            </>
                                        ) }
                                    </tbody>
                                </table>
                            </div>

                            {/* Month-wise Table */}
                            <div className="mt-3">
                                <h3 className="text-sm mb-0">Current Affairs Monthly</h3>
                                <table className="table table-border fw-normal text-xsm">
                                    <tbody className="text-xsm">
                                        {loading ? (
                                            <p className='text-center'>Loading Monthly CA MCQs...</p>
                                        ) : dateWise.length <= 1 ? (
                                            <p className="text-center fw-semibold text-danger">No Current Affairs found.</p>
                                        ) : (
                                            <>
                                                {monthWise.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="icon-cell">
                                                            <i className={`bi ${item.icon} ca-mcq-icon`}></i>
                                                            CA - {item.month}
                                                        </td>
                                                        <td className="text-end">
                                                            <span className="badge bg-one me-2 cursor-pointer" onClick={() => handleMcqMonthly(item)}>MCQ</span>
                                                            <span className="badge bg-two cursor-pointer" onClick={() => handleCAMonthly(item)}>Details</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        )
                                        }
                                    </tbody>
                                </table>
                            </div>

                            {/* Year-wise Table */}
                            <div className="mt-2">
                                <h3 className="text-sm">Current Affairs Yearly</h3>
                                <table className="table table-border text-xsm fw-normal">
                                    <tbody className="text-xsm">
                                        {loading ? (
                                            <p className='text-center'>Loading Yearly CA MCQs...</p>
                                        ) : dateWise.length <= 1 ? (
                                            <p className="text-center fw-semibold text-danger">No Current Affairs found.</p>
                                        ) : (
                                            <>
                                                {yearWise.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="icon-cell">
                                                            <i className={`bi ${item.icon} ca-mcq-icon`}></i>
                                                            Current Affairs Yearly - {item.year}
                                                        </td>
                                                        <td className="text-end">
                                                            <span className="badge bg-one me-2 cursor-pointer" onClick={() => handleMcqYearly(item)}>MCQ</span>
                                                            <span className="badge bg-two cursor-pointer" onClick={() => handleCAYearly(item)}>Details</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        )
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default CurrentAffairs;
