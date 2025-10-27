import React, { useRef, useEffect, useState } from 'react';
import API from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/getAuthToken';
import { load } from '@cashfreepayments/cashfree-js';
import { decodeToken } from '../utils/decodeToken';

import contestTranslate from "../language/contestPage.json";

import Swal from 'sweetalert2';
import WinnerToast from '../components/WinnerToast';
import { FaTrophy } from 'react-icons/fa6';
const UpcomingContest = () => {
    const [allContests, setAllContests] = useState([]);
    const [contests, setContests] = useState([]);
    const [bookingInfo, setBookingInfo] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const navigate = useNavigate();
    const cashfreeRef = useRef(null);
    // Fetch contests from API
    useEffect(() => {
        const getContestGroupData = async () => {
            try {
                const token = getAuthToken();
                const res = await API.get('/contest/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = res.data.data;
                setAllContests(data);
                setContests(data); // default to all


            } catch (error) {
                console.error('Failed to fetch contest groups:', error);
            }
        };

        getContestGroupData();
    }, []);


    // Open join Button 

    useEffect(() => {
        const fetchBookingStatuses = async () => {
            try {
                const token = getAuthToken();
                const user = decodeToken(token);

                const bookingMap = {};

                for (const contest of contests) {
                    const res = await API.get('/contest/user-booking-status', {
                        params: {
                            contestId: contest._id,
                            userId: user.id
                        },
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    bookingMap[contest._id] = res.data;
                }

                setBookingInfo(bookingMap);

                // console.log(bookingMap);

            } catch (err) {
                console.error('Booking status fetch error:', err);
            }
        };

        if (contests.length > 0) fetchBookingStatuses();
    }, [contests]);

    // auto update canJoin 
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setBookingInfo(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(contestId => {
                    const contest = contests.find(c => c._id === contestId);
                    if (contest) {
                        const startTime = new Date(contest.startTime);
                        const endTime = new Date(startTime.getTime() + contest.duration * 60000);
                        updated[contestId].canJoin = now >= startTime && now <= endTime;
                    }
                });
                return updated;
            });
        }, 10000); // every 10 seconds

        return () => clearInterval(interval);
    }, [contests]);


    // Countdown timer updater
    useEffect(() => {
        const interval = setInterval(() => {
            const updated = {};

            contests.forEach((contest) => {
                const startTime = new Date(contest.startTime);
                const endTime = new Date(startTime.getTime() + contest.duration * 60000); // duration in minutes
                const now = new Date();

                if (now < startTime) {
                    // 🕒 Contest not started yet: Show countdown
                    const diff = startTime - now;
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    updated[contest._id] = {
                        text: `${hours.toString().padStart(2, '0')} : ${minutes
                            .toString()
                            .padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`,
                        isClosed: false,
                        status: 'countdown',
                    };
                } else if (now >= startTime && now <= endTime) {
                    // 🟢 Contest is running
                    updated[contest._id] = {
                        text: 'Running',
                        isClosed: false,
                        status: 'running',
                    };
                } else {
                    // 🔴 Contest is over
                    updated[contest._id] = {
                        text: 'Closed',
                        isClosed: true,
                        status: 'closed',
                    };
                }
            });

            setCountdowns(updated);
        }, 1000);

        return () => clearInterval(interval);
    }, [contests]);

    // Format DateTime for UI
    const formatDateTime = (isoString) => {
        const options = {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Date(isoString).toLocaleString('en-IN', options);
    };

    // Filter by language
    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        if (lang === 'all') {
            setContests(allContests);
        } else {
            const filtered = allContests.filter((c) => c.language === lang);
            setContests(filtered);
        }
    };
    const languageMap = {
        en: 'English',
        hi: 'हिंदी',
        bn: 'বাংলা',
        mr: 'मराठी',
        ta: 'தமிழ்',
        te: 'తెలుగు',
        gu: 'ગુજરાતી',
        kn: 'ಕನ್ನಡ',
        or: 'ଓଡ଼ିଆ',
        pa: 'ਪੰਜਾਬੀ',
    };


    const [lang, setLang] = useState("en");
    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "en";
        setLang(storedLang);
    }, []);
    const trans = contestTranslate[lang] || contestTranslate["en"];


    // handelBooking
    const bookingHandeler = async (id, amount) => {

        const initSDK = async () => {
            const cf = await load({ mode: 'production' });
            cashfreeRef.current = cf;
        };
        initSDK();
        const getSessionId = async () => {
            const token = getAuthToken();
            const userData = decodeToken(token)
            try {
                const generatedOrderId = 'ORDER_' + Date.now();
                const res = await API.post('/contest/new-booking', {
                    order_id: generatedOrderId,
                    order_amount: amount,
                    customer_details: {
                        customer_id: userData.id,
                        customer_email: userData.email,
                        customer_phone: userData.phone
                    },
                    order_note: "Contest Booking"
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = res.data;

                // console.log(data);
                if (data && data.payment_session_id) {
                    localStorage.setItem('orderId', generatedOrderId);
                    localStorage.setItem('contestId', id);
                    return data.payment_session_id;
                } else {
                    alert('Failed to initiate payment');
                }
            } catch (err) {
                console.log(err);
            }

        };

        const sessionId = await getSessionId();
        if (!sessionId) {
            alert("❌ Failed to generate session ID");
          
            return;
        }
        const checkoutOptions = {
            paymentSessionId: sessionId,
            redirectTarget: "_modal"
        };

        try {
            await cashfreeRef.current.checkout(checkoutOptions);
            setBookingInfo(prev => ({
                ...prev,
                [id]: {
                    isBooked: true,
                    canJoin: false,
                }
            }));



            navigate('/bookingStatus'); // ✅ Redirect after modal completes
        } catch (err) {
            console.error("Payment failed or cancelled:", err);
        }
    };

    const handleWinnerList=()=>{
        navigate('/contests-list')
    }

    return (
        <div className="page-wrapper">
        <WinnerToast/>
            <div className="content-row">
                <main className="app-container">
                    <div className="exam-container">
                        <div className='d-flex justify-content-between'>
                            <h5 className='color-two text-md mb-0'>{trans.contestTitle}</h5>
                            <h6 className='cursor-pointer color-white px-1 py-1 rounded text-xxsm mb-0 bg-two' onClick={handleWinnerList}><FaTrophy/> Winners</h6>
                        </div>
                        <p className=" mt-2 mb-2">{trans.contestSubText}</p>
                        {/* Language Dropdown Filter */}
                        <div className="mb-3">
                            <label className="form-label fw-bold text-sm">Filter by Language:</label>
                            <select className="form-select text-sm" value={selectedLanguage} onChange={handleLanguageChange}>
                                <option value="all">All Languages</option>
                                {[...new Set(allContests.map((c) => c.language))].map((lang) => (
                                    <option key={lang} value={lang}>
                                        {languageMap[lang] || lang}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="row g-2">
                            {contests.map((contestItems, index) => (
                                <div className="col-12 col-md-6" key={contestItems._id || index}>
                                    <div className="quiz-card border-0">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <p className="p-0 m-0">
                                                    <span className="exam-date">
                                                        {formatDateTime(contestItems.startTime)}
                                                    </span>
                                                </p>
                                                <p className="p-0 m-0">
                                                    {(() => {
                                                        const countdown = countdowns[contestItems._id];
                                                        const status = countdown?.status;

                                                        let textClass = 'text-danger'; // default: closed
                                                        if (status === 'countdown') textClass = 'text-danger'; // before start
                                                        else if (status === 'running') textClass = 'text-success'; // during

                                                        return (
                                                            <span className={`countdown ${textClass}`}>
                                                                <span className="fw-medium"></span>{' '}
                                                                {countdown?.text || '-- : --'}
                                                            </span>
                                                        );
                                                    })()}


                                                </p>
                                            </div>

                                            <div className="exmal-question-card">
                                                <p className="mb-0 questions-Title text-sm">{contestItems.title}</p>
                                                <small className="text-secondary">
                                                    Language -  {languageMap[contestItems.language] || contestItems.language}
                                                </small>
                                            </div>

                                            <div className="d-flex justify-content-between mt-2 text-sm">
                                                <small>
                                                    <strong>Time :</strong> {contestItems.duration} min
                                                </small>
                                                <small>
                                                    <strong>Ques :</strong> {contestItems.totalQuestions}
                                                </small>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mt-2 text-sm">
                                                <div className="text-warning d-flex align-items-center">
                                                    <i className="fas fa-trophy me-1 prize-icon"></i>
                                                    <small className="text-dark fw-bold">
                                                        Prize :{' '}
                                                        <strong className="text-dark ms-1 fw-medium">
                                                            ₹{contestItems.prizeAmount}
                                                        </strong>
                                                    </small>
                                                </div>
                                                <small className="text-dark fw-bold">
                                                    Entry :{' '}
                                                    <strong className="fw-medium">₹{contestItems.entryFee}</strong>
                                                </small>
                                            </div>

                                            <hr />

                                            <div className="d-flex justify-content-between text-muted">


                                                {(() => {
                                                    const booking = bookingInfo[contestItems._id];
                                                    const isBooked = booking?.isBooked === true;
                                                    const now = new Date();
                                                    const startTime = new Date(contestItems.startTime);
                                                    const isBookingClosed = now >= startTime;

                                                    return (
                                                        <span
                                                            className={`exam-entryBtn ${isBookingClosed || isBooked ? 'disabled' : 'cursor-pointer'} ${isBooked ? 'exam-entryBtn bg-danger' : ''}`}
                                                            style={{
                                                                pointerEvents: isBookingClosed || isBooked ? 'none' : 'auto',
                                                                opacity: isBookingClosed ? 0.5 : 1,

                                                            }}
                                                            onClick={() => {
                                                                if (!isBooked && !isBookingClosed) {
                                                                    bookingHandeler(contestItems._id, contestItems.entryFee);
                                                                }
                                                            }}
                                                        >
                                                            {isBooked ? 'Booked' : 'Book Now'}
                                                        </span>
                                                    );
                                                })()}



                                                {(() => {
                                                    const booking = bookingInfo[contestItems._id];
                                                    const isBooked = booking?.isBooked;
                                                    const canJoin = booking?.canJoin;
                                                    const isAttempted = booking?.isAttempted === true;


                                                    const showJoin = isBooked && canJoin && !isAttempted;

                                                    return (
                                                        <>
                                                       <span
                                                            className={`exam-joinBtn ${!showJoin ? 'disabled' : 'cursor-pointer'}`}
                                                            style={!showJoin ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                                            onClick={async () => {
                                                                if (!showJoin) return;

                                                                const result = await Swal.fire({
                                                                    title: 'Are you sure?',
                                                                    text: "You can't rejoin  this contest once started.",
                                                                    icon: 'warning',
                                                                    iconColor: '#f39c12',
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: '#3085d6',
                                                                    cancelButtonColor: '#d33',
                                                                    confirmButtonText: 'Yes, Start Now',
                                                                    cancelButtonText: 'Cancel',
                                                                    customClass: {
                                                                        popup: 'small-alert'
                                                                    },
                                                                    backdrop: true,
                                                                    allowOutsideClick: false
                                                                });

                                                                if (result.isConfirmed) {
                                                                    const token = getAuthToken();
                                                                    const userData = decodeToken(token);

                                                                    try {
                                                                        // 🔄 Update isAttempted in DB
                                                                        await API.post('/contest/update-attempt', {
                                                                            userId: userData.id,
                                                                            contestId: contestItems._id,
                                                                        });

                                                                        // Navigate to exam
                                                                        navigate('/exam', {
                                                                            state: { contest: contestItems },
                                                                        });
                                                                    } catch (err) {
                                                                        console.error('Error updating attempt:', err);
                                                                        Swal.fire('Error', 'Something went wrong. Try again.', 'error');
                                                                    }
                                                                }
                                                            }}
                                                         >
                                                            Join Now
                                                        </span> 
                                                        {/* <span
                                                            className={`exam-joinBtn ${!showJoin ? 'disabled' : 'cursor-pointer'}`}
                                                            // style={!showJoin ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                                            onClick={async () => {
                                                                // if (!showJoin) return;

                                                                const result = await Swal.fire({
                                                                    title: 'Are you sure?',
                                                                    text: "You can't rejoin  this contest once started.",
                                                                    icon: 'warning',
                                                                    iconColor: '#f39c12',
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: '#3085d6',
                                                                    cancelButtonColor: '#d33',
                                                                    confirmButtonText: 'Yes, Start Now',
                                                                    cancelButtonText: 'Cancel',
                                                                    customClass: {
                                                                        popup: 'small-alert'
                                                                    },
                                                                    backdrop: true,
                                                                    allowOutsideClick: false
                                                                });

                                                    
                                                                    const token = getAuthToken();
                                                                    const userData = decodeToken(token);

                                                                    try {
                                                                        // 🔄 Update isAttempted in DB
                                                                        await API.post('/contest/update-attempt', {
                                                                            userId: userData.id,
                                                                            contestId: contestItems._id,
                                                                        });

                                                                        // Navigate to exam
                                                                        navigate('/exam', {
                                                                            state: { contest: contestItems },
                                                                        });
                                                                    } catch (err) {
                                                                        console.error('Error updating attempt:', err);
                                                                        Swal.fire('Error', 'Something went wrong. Try again.', 'error');
                                                                    }
                                                                
                                                            }}
                                                        >
                                                            Join Now
                                                        </span>  */}
                                                        
                                                        </>
                                                    );
                                                })()}



                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {contests.length === 0 && (
                                <p className="text-muted text-center mt-4">
                                    No upcoming contests available.
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UpcomingContest;
