import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../utils/axios';

const TalentPaymentStatus = () => {
    const location = useLocation();
    const orderId = localStorage.getItem('orderId');
    const bookingId = localStorage.getItem('bookingId');

    const [status, setStatus] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!orderId) {
                setErrorMessage(
                    <>
                        <h3 className='text-sm'>Booking Missing </h3>
                        <p>
                            We could not find any order information.
                            Please go back and initiate your payment again.
                        </p>
                        <Link to="/talent" className='text-xxsm'>
                            Back to
                        </Link>
                    </>
                );
                return;
            }

            try {
                const res = await API.post(
                    "/talent/payment/verify",
                    { orderId },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const paymentStatus = res.data?.[0]?.payment_status || "Not Found";
                const paymentAmount = res.data?.[0]?.order_amount || 0;

                setStatus(paymentStatus);

                if (paymentStatus === 'SUCCESS') {
                    setSuccessMessage(
                        <>
                            <h3 className='text-sm text-center'>Payment Successful ✅</h3>
                            <p className='text-xxsm text-center'>
                                Thank you for registering for the Talent Search Program.
                                Your payment of <span className='fw-bold'>₹{paymentAmount}</span> has been successfully received.
                                <br />
                                <span className='fw-bold'>Order ID: {orderId}</span>
                                <br />
                                {/* Your login credentials have been sent to your registered email before the exam. */}
                                Please log in to your account on earnq.in at the scheduled date and time to participate in the exam.
                            </p>
                        </>
                    );
                    setErrorMessage("");

                    // Save payment record
                    try {
                        await API.post("/talent/payment", {
                            orderId,
                            bookingId,
                            amount: paymentAmount,
                            status: 'paid' || paymentStatus
                        });
                    } catch (err) {
                        console.error("Failed to save payment:", err);
                    }
                    // Update student booking
                    try {
                        await API.patch("/talent/student/update", {
                            bookingId,
                            orderId,
                            isPaid: true,
                            status: 'paid' || paymentStatus
                        });
                    } catch (err) {
                        console.error("Failed to update student record:", err);
                    }

                } else if (paymentStatus === "Not Found") {
                    setErrorMessage(
                        <>
                            <h3 className='text-sm'>Payment Not Found ⚠️</h3>
                            <p>
                                We could not find your payment details.
                                Please contact support with your order ID: {orderId}.
                            </p>
                            <Link to="/talent" className="btn btn-primary mt-2">
                                Back to Talent Search
                            </Link>
                        </>
                    );
                    setSuccessMessage("");
                } else {
                    setErrorMessage(
                        <>
                            <h3 className='text-sm text-danger text-center'>Payment Failed</h3>
                            <p>
                                Your payment could not be processed. <br />
                                If the amount has been deducted from your account, please contact your bank for assistance.
                            </p>
                            <Link to="/talent" className="btn btn-primary mt-2">
                                Back to Talent Search
                            </Link>
                        </>

                    );
                    setSuccessMessage("");
                    // Delete student record if payment failed
                    try {
                        await API.delete(`/talent/student/delete/${bookingId}`);
                    } catch (err) {
                        console.error("Failed to delete student after payment failure:", err);
                    }
                }

            } catch (err) {
                console.error("Payment verification failed:", err);
                setErrorMessage(
                    <>
                        <h3>Server Error ⚠️</h3>
                        <p>
                            There was an issue verifying your payment.
                            Please try again later or contact support.
                        </p>
                        <Link to="/talent" className="btn btn-primary mt-2">
                            Back to Talent Search
                        </Link>
                    </>
                );
                setSuccessMessage("");
            }
        };

        // Remove localStorage after 2 seconds
        setTimeout(() => {
            localStorage.removeItem('orderId');
            localStorage.removeItem('bookingId');
        }, 2000);
        verifyPayment();
    }, [orderId, bookingId]);

    return (
        <div className="page-wrapper">
            <div className="content-row">
                <main className="app-container">
                    <div className="payment-status-container">
                        {successMessage && (
                            <div className="border-0 alert alert-success mt-3">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="border-0 alert alert-danger mt-3">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TalentPaymentStatus;
