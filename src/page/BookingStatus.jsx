import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import API from '../utils/axios';

const BookingStatus = () => {
  const navigate = useNavigate();
  const orderId = localStorage.getItem('orderId');
  const contestId = localStorage.getItem('contestId');

  const [status, setStatus] = useState();
  const [seconds, setSeconds] = useState(10);
  const [isVerifying, setIsVerifying] = useState(true);

  // Ref to prevent double call
  const hasRun = useRef(false);

  useEffect(() => {
    if (!orderId || !contestId || hasRun.current) return;
    hasRun.current = true;
const verifyPayment = async () => {
  try {
    const token = getAuthToken();
    const user = decodeToken(token);

    const res = await API.post(
      "/contest/booking-verify",
      { orderId },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const paymentData = res.data;

    // console.log(paymentData);
    
    const payment = Array.isArray(paymentData) ? paymentData[0] : '';
    const response = await API.post(
      '/contest/booking',
      {
        contestId,
        orderID: orderId,
        userId: user.id,
        bookingAmout: payment.payment_amount,
        paymentStatus: payment.payment_status,
        paymentDetails: {
          paymentMethod: payment.payment_group,
          transactionId: payment.cf_payment_id
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // console.log('Booking response:', response.data);

    if (response.data.success) {
      setStatus('success');
    } else {
      setStatus('failed');
    }

  } catch (err) {
    console.error('Booking error:', err?.response?.data?.message || err.message);
    setStatus('failed');
  } finally {
    setIsVerifying(false);
  }
};

localStorage.removeItem('orderId');
localStorage.removeItem('contestId');

    verifyPayment();
  }, [orderId, contestId]);

  useEffect(() => {
    if (status) {
      const timer = setInterval(() => {
        setSeconds(prev => {
          if (prev === 1) {
            clearInterval(timer);
            navigate('/contest');
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, navigate]);

  return (
    <div className="text-center mt-5">
      {isVerifying ? (
        <h4>Verifying payment...</h4>
      ) : status === 'success' ? (
        <div>
          <h2 className="text-success">Booking Successful!</h2>
          <p>Your contest booking is confirmed.</p>
          <p>Redirecting in <span className="text-danger">{seconds}</span> seconds...</p>
        </div>
      ) : (
        <div>
          <h2 className="text-danger">Payment Failed</h2>
          <p>Booking unsuccessful. Please try again.</p>
          <p>Redirecting in <span className="text-danger">{seconds}</span> seconds...</p>
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
