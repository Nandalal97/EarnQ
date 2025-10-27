import React, { useRef, useEffect, useState } from "react";
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";
import moment from "moment-timezone";
import { load } from '@cashfreepayments/cashfree-js';
import API from "../utils/axios"; // <-- axios instance
import { useNavigate } from 'react-router-dom';
import TalentMultiLangInstructions from "../components/TalentMultiLangInstructions";

const TalentSearch = () => {
    const navigate = useNavigate();
    const [contest, setContest] = useState({});
    const [contestId, setContestId] = useState();
    const [startDate, setStartDate] = useState();
    const [contesEntryFees, setContesEntryFees] = useState();
    const [slotCounts, setSlotCounts] = useState({});
    const [examDates, setExamDates] = useState([]);
    const [noContest, setNoContest] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registrationClosed, setRegistrationClosed] = useState(false);
    const [examAvailable, setExamAvailable] = useState(false);
    const [loadingContest, setLoadingContest] = useState(true);
     const [examTaken, setExamTaken] = useState(false); 

    const authToken = getAuthToken();
    const userData = decodeToken(authToken);
    const cashfreeRef = useRef(null);

    const username = [userData.firstName, userData.middleName, userData.lastName]
        .filter(Boolean)
        .join(" ");

    const [formData, setFormData] = useState({
        userId: userData.id,
        name: username,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob ? userData.dob.split("T")[0] : "",
        gender: userData.gender,
        contestId: "",
        examDate: "",
        slotId: "",
    });

    const [errors, setErrors] = useState({});
    const [errMsg, setErrMsg] = useState();

    // ✅ Helper to generate all dates between start & end
    const generateDates = (start, end) => {
        const dates = [];
        let d = moment.tz(start, "Asia/Kolkata").startOf("day");
        const last = moment.tz(end, "Asia/Kolkata").startOf("day");

        while (d <= last) {
            dates.push(d.toDate());
            d = d.add(1, "day");
        }

        return dates;
    };

    // ✅ Check registration & exam availability
   const isRegistrationClosed = (startDate) => {
    if (!startDate) return false;

    const start = moment.tz(startDate, "Asia/Kolkata").set({ hour: 7, minute: 0, second: 0 });
    const now = moment.tz("Asia/Kolkata");

    // Registration closes 1 day before at 7 AM IST
    const registrationCloseTime = start.clone().subtract(1, "day");

    return now.isSameOrAfter(registrationCloseTime);
};



    const isExamAvailable = (startDate, endDate) => {
        if (!startDate || !endDate) return false;

        const now = new Date();

        // Start: 7 AM IST on start date
        const start = new Date(startDate);
        start.setHours(7, 0, 0, 0);

        // End: 11:59:59 PM IST on end date
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return now >= start && now <= end;
    };


    // ✅ Fetch contest list
    useEffect(() => {
        const fetchContest = async () => {
            try {
                const res = await API.get("/talent/contest/all");
                if (res.data.contests?.length > 0) {
                    const firstContest = res.data.contests[0];
                    setContest(firstContest);
                    setContestId(firstContest._id);
                    setContesEntryFees(firstContest.entryFee);
                    setFormData((prev) => ({ ...prev, contestId: firstContest._id }));
                    setStartDate(firstContest.startDate);
                    setLoadingContest(false);
                    // generate exam dates
                    const dates = generateDates(firstContest.startDate, firstContest.endDate);
                    if (dates.length === 0 && firstContest.startDate) {
                        dates.push(new Date(firstContest.startDate));
                    }
                    setExamDates(dates);

                    // set registration & exam availability
                    setRegistrationClosed(isRegistrationClosed(firstContest.startDate));
                    setExamAvailable(isExamAvailable(firstContest.startDate, firstContest.endDate));

                    // auto-update exam availability every minute
                    const timer = setInterval(() => {
                        setExamAvailable(isExamAvailable(firstContest.startDate, firstContest.endDate));
                    }, 60000);

                    return () => clearInterval(timer);
                } else {
                    setNoContest(true);
                }
                
            } catch (error) {
                console.error("Error fetching contest:", error);
                setNoContest(true);
            }
        };
        fetchContest();
    }, []);

    // ✅ Fetch slot counts when contestId + examDate selected
    useEffect(() => {
        const fetchSlotCounts = async () => {
            if (!contestId || !formData.examDate) return;
            try {
                const res = await API.get(
                    `/talent/contest/${contestId}/slot-count`,
                    { params: { date: formData.examDate } }
                );
                setSlotCounts(res.data.slotCounts);
            } catch (err) {
                console.error("Error fetching slot counts:", err);
            }
        };
        fetchSlotCounts();
    }, [contestId, formData.examDate]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Full Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone))
            newErrors.phone = "Enter a valid 10-digit number";
        if (!formData.dob) newErrors.dob = "Date of Birth is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.examDate) newErrors.examDate = "Please select exam date";
        if (!formData.slotId) newErrors.slotId = "Please select a slot";
        return newErrors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const res = await API.post("/talent/register", formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.data.status === 1) {
                const bookingId = res.data.booking._id;
                const userEmail = res.data.booking.email;
                const userPhone = res.data.booking.phone;
                const userName = res.data.booking.name;

                try {
                    const initSDK = async () => {
                        const cf = await load({ mode: 'production' });
                        cashfreeRef.current = cf;
                    };
                    await initSDK();

                    const getSessionId = async () => {
                        try {
                            setLoading(true);
                            const generatedOrderId = 'ORDER_' + Date.now();
                            const res = await API.post('/talent/payment/create', {
                                order_id: generatedOrderId,
                                order_amount: contesEntryFees,
                                customer_details: {
                                    customer_id: bookingId,
                                    customer_email: userEmail,
                                    customer_phone: userPhone,
                                    customer_name: userName
                                },
                                order_note: "Talent Search Booking"
                            }, { headers: { 'Content-Type': 'application/json' } });

                            const data = res.data;
                            if (data && data.payment_session_id) {
                                localStorage.setItem('orderId', generatedOrderId);
                                localStorage.setItem('bookingId', bookingId);
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
                        setLoading(false);
                        await API.delete(`/talent/student/delete/${bookingId}`);
                        return;
                    }

                    const checkoutOptions = { paymentSessionId: sessionId, redirectTarget: "_modal" };
                    try {
                        await cashfreeRef.current.checkout(checkoutOptions);
                        navigate('/talent/payment');
                    } catch (err) {
                        console.error("Payment failed or cancelled:", err);
                        await API.delete(`/talent/student/delete/${bookingId}`);
                    }

                } catch (error) {
                    await API.delete(`/talent/student/delete/${bookingId}`);
                }
            }
        } catch (error) {
            setErrMsg(error.response?.data?.message || "Registration failed");
        }
    };

    useEffect(() => {
        if (errMsg) {
            const timer = setTimeout(() => setErrMsg(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [errMsg]);

    const handleStartExamBtn = () => {
        navigate('/talent/exam/instruction', { state: contest });
    };
    const slotTimings = {
        "Slot-1": "8:00 AM – 9:00 AM",
        "Slot-2": "10:00 AM – 11:00 AM",
        "Slot-3": "3:00 PM – 4:00 PM",
        "Slot-4": "5:00 PM – 6:00 PM",
        "Slot-5": "7:00 PM – 8:00 PM",
        "Slot-6": "9:00 PM – 10:00 PM",
    };

    if (loadingContest) {
  return (
    <div className="text-center py-5">
      {/* <div className="spinner-border text-primary" role="status"></div> */}
      <p className="mt-2 text-sm">Loading contest details...</p>
    </div>
  );
}

    return (
        <div className="page-wrapper">
            <div className="content-row">
                <main className="app-container">
                    <div>
                        <section>
                            {noContest ? (
                                <div className="alert alert-warning text-center py-3 border-0">
                                    🚫 No active Talent Search contest is available at the moment.
                                    Please check back later!
                                </div>
                            ) : (
                                <>
                                    <div className="pb-2">
                                        <h2 className="text-sm font-semibold mb-1">
                                            {contest.title}, {new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </h2>
                                        <p>{contest.description}</p>
                                    </div>

                                    {registrationClosed ? (
                                        <div className="alert border-0 alert-warning text-center text-xsm py-2 border-0">
                                            Registration closed for this contest!
                                        </div>
                                    ) : (
                                        <form onSubmit={handleRegister}>
                                            <div className="row g-2 text-xsm">
                                                {/* Name */}
                                                <div className="col-md-6">
                                                    <label className="form-label">Full Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control text-xsm"
                                                        value={formData.name}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, name: e.target.value })
                                                        }
                                                        placeholder="Full Name"
                                                    />
                                                    {errors.name && (
                                                        <small className="text-danger">{errors.name}</small>
                                                    )}
                                                </div>

                                                {/* Email */}
                                                <div className="col-md-6">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control text-xsm"
                                                        value={formData.email}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, email: e.target.value })
                                                        }
                                                        placeholder="Email id"
                                                    />
                                                    {errors.email && (
                                                        <small className="text-danger">{errors.email}</small>
                                                    )}
                                                </div>

                                                {/* Phone */}
                                                <div className="col-md-6">
                                                    <label className="form-label">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control text-xsm"
                                                        maxLength={10}
                                                        value={formData.phone}
                                                        onChange={(e) => {
                                                            const onlyNums = e.target.value.replace(/\D/g, "");
                                                            setFormData({ ...formData, phone: onlyNums });
                                                        }}
                                                        placeholder="Phone Number"
                                                    />
                                                    {errors.phone && (
                                                        <small className="text-danger">{errors.phone}</small>
                                                    )}
                                                </div>

                                                {/* Gender */}
                                                <div className="col-md-6">
                                                    <label className="form-label">Gender</label>
                                                    <select
                                                        className="form-select text-xsm"
                                                        value={formData.gender}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, gender: e.target.value })
                                                        }
                                                    >
                                                        <option value="" disabled>Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Others">Others</option>
                                                    </select>
                                                    {errors.gender && (
                                                        <small className="text-danger">{errors.gender}</small>
                                                    )}
                                                </div>

                                                {/* DOB */}
                                                <div className="col-md-6">
                                                    <label className="form-label">Date of Birth</label>
                                                    <input
                                                        type="date"
                                                        className="form-control text-xsm"
                                                        value={formData.dob}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, dob: e.target.value })
                                                        }
                                                    />
                                                    {errors.dob && (
                                                        <small className="text-danger">{errors.dob}</small>
                                                    )}
                                                </div>

                                                {/* Exam Date Dropdown */}
                                                <div className="col-md-6">
                                                    <label className="form-label">Exam Date</label>
                                                    <select
                                                        className="form-select text-xsm"
                                                        value={formData.examDate}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                examDate: e.target.value,
                                                                slotId: "", // reset slot
                                                            })
                                                        }
                                                    >
                                                        <option value="">Select Exam Date...</option>
                                                        {examDates.map((d) => {
                                                            const val = d.toISOString().split("T")[0];
                                                            const label = d.toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            });
                                                            return (
                                                                <option key={val} value={val}>
                                                                    {label}
                                                                </option>
                                                            );
                                                        })}

                                                    </select>
                                                    {errors.examDate && (
                                                        <small className="text-danger">{errors.examDate}</small>
                                                    )}
                                                </div>

                                                {/* Slot */}
                                                <div className="col-md-6">
                                                    <label className="form-label pb-0 mb-0">Slot</label>
                                                    <select
                                                        className="form-select text-xsm"
                                                        value={formData.slotId}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, slotId: e.target.value })
                                                        }
                                                        disabled={!formData.examDate}
                                                    >
                                                        <option value="" disabled>Choose Slot ...</option>

                                                        {["Slot-1", "Slot-2", "Slot-3", "Slot-4", "Slot-5", "Slot-6"].map(slot => (
                                                            <option
                                                                key={slot}
                                                                value={slot} // ✅ this is what backend will get
                                                                disabled={slotCounts[slot]?.isFull}
                                                            >
                                                                {slotTimings[slot]} {slotCounts[slot]?.isFull ? "(Full)" : ""}
                                                            </option>
                                                        ))}
                                                    </select>


                                                    {errors.slotId && (
                                                        <small className="text-danger">{errors.slotId}</small>
                                                    )}
                                                </div>

                                                <div className="col-12 text-center mt-4">
                                                    <button
                                                        type="submit"
                                                        className="border-0 btn-invite color-white bg-one cursor-pointer text-xsm"
                                                    >
                                                        Book My Seat
                                                    </button>
                                                </div>
                                            </div>

                                            {errMsg && (
                                                <div className="alert alert-danger border-0 py-2 text-center text-xxsm mt-2">
                                                    {errMsg}
                                                </div>
                                            )}
                                        </form>
                                    )}

                                    {examAvailable && (
                                        <div className="text-center mt-2">
                                            <button
                                                className="border-0 btn-invite color-white bg-one cursor-pointer text-xsm"
                                                onClick={handleStartExamBtn}
                                            >
                                                Start Exam
                                            </button>
                                        </div>
                                    )}

                                    <hr />
                                    <TalentMultiLangInstructions />
                                </>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TalentSearch;
