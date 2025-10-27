import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TalentResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    const [countdown, setCountdown] = useState(10);

    if (!data) {
        navigate("/404");
        return null;
    }

    const { totalQuestions, summary, autoSubmitted } = data;

    // ✅ Exit fullscreen on this page
    useEffect(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen?.().catch((err) => console.warn("Exit fullscreen failed:", err));
        }
    }, []);

    // ✅ Countdown + Redirect Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/"); // Redirect after countdown
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const handleBackBtn = () => {
        navigate("/");
    }

    return (
        <div className="page-wrapper">
            <div className="content-row">
                <main className="app-container">
                    <div className="exam-result text-center border-0">
                        <h5 className="text-sm">Exam Submitted!</h5>
                        {autoSubmitted ? (
                            <>⏰ <strong className="text-sm fw-semibold text-danger"> Your exam has been auto-submitted.</strong></>
                        ) : (
                            <>🎉 <strong className='text-sm fw-semibold text-success'>Your exam has been submitted successfully.</strong></>
                        )}
                        <p className='pt-2'>
                            You cannot retake this contest. Results will be announced soon. Winners will be notified via the app or registered email/SMS
                        </p>
                        <table className="table table-xxsm table-striped mb-2 mt-2">
                            <tbody className="text-xxsm text-start">
                                <tr><td>Total Questions:</td><td>{totalQuestions}</td></tr>
                                <tr><td>Attended:</td><td>{summary.attended}</td></tr>
                                <tr><td>Skipped:</td><td>{summary.skipped}</td></tr>
                                <tr><td>Marked for Review:</td><td>{summary.markReview}</td></tr>
                                <tr><td>Not Visited:</td><td>{summary.notVisited}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div>
                        <span onClick={handleBackBtn} className="cursor-pointer text-primary text-xxsm">
                            <i className="bi bi-arrow-left-short"></i> Back
                        </span>
                        <p className="text-muted text-xxsm mt-2">
                            Redirecting to home in <strong className="text-danger">{countdown}</strong> seconds...
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TalentResult;
