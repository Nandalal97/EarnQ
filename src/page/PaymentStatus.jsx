import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import API from '../utils/axios';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = localStorage.getItem('orderId') || location.state?.orderId;
  const planDuration = parseInt(localStorage.getItem('plan'), 10) || location.state?.planDuration;

  const [status, setStatus] = useState();
  const [seconds, setSeconds] = useState(5);
  const [isVerifying, setIsVerifying] = useState(true);

  // ✅ Prevent duplicate execution under StrictMode
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; // run only once
    didRun.current = true;

    const verifyPayment = async () => {
      const token = getAuthToken();
      if (!token || !orderId || !planDuration) {
        console.warn("Missing token/orderId/planDuration", { token, orderId, planDuration });
        setStatus('failed');
        setIsVerifying(false);
        return;
      }
      try {
        // 🔹 Fetch plan details
        const { data } = await API.get('/subscription/getPlan?lang=en');
        const plan = data.plans.find(p => p.planCode === 'premium');
        const user = decodeToken(token);

        const cycleName = { 1: 'Monthly', 6: 'Half-Yearly', 12: 'Yearly' }[planDuration];
        const basePrice = plan.basePrice * planDuration;
        const discount = plan.discounts?.[cycleName] || 0;
        const payAmount = basePrice - (basePrice * discount) / 100;

        // 🔹 Verify payment
        const res = await API.post("/payment/verify", { orderId }, {
          headers: { 'Content-Type': 'application/json' }
        });

        const paymentData = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!paymentData?.payment_status) throw new Error('Invalid payment response');

        // console.log("Payment verify response:", paymentData);

        // 🔹 On successful payment, create subscription
        if (paymentData.payment_status === 'SUCCESS') {
          const subRes = await API.post('/subscription/subscribe', {
            userId: user.id,
            transactionId: paymentData.order_id,
            planCode: plan.planCode,
            billingCycle: cycleName,
            basePrice,
            discounts: discount,
            payAmount: paymentData.payment_amount,
            paymentMethod: paymentData.payment_group,
            paymentStatus: paymentData.payment_status
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // console.log('Subscribe response:', subRes.data);

          if (subRes.data.status === 1 || subRes.data.success) {
            setStatus('success');
          }
        } else {
          setStatus('failed');
        }

      } catch (err) {
        console.error('Payment verification failed:', err);
        setStatus('failed');
      } finally {
        setIsVerifying(false);
        // Clean up storage after verification completes
        localStorage.removeItem('orderId');
        localStorage.removeItem('plan');
      }
    };

    verifyPayment();
  }, [orderId, planDuration]);

  // ✅ Optional redirect timer
  useEffect(() => {
    if (!status) return;
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev === 1) {
          clearInterval(timer);
          if (status === 'success') navigate('/logout');
          else navigate('/subscription');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, navigate]);


  // ✅ UI (kept identical)
  return (
    <div className="text-center mt-5">
      {isVerifying ? (
        <h4>Verifying payment...</h4>
      ) : status == 'success' ? (
        <div>
          <h2 className="text-success text-xlg">Subscription Successful!</h2>
          <p>Thank you for subscribing! Your subscription has been activated.</p>
          <p>Need to relogin! Please wait <span className='text-danger'>{seconds}</span> seconds...</p>
        </div>
      ) : (
        <div>
          <h2 className="text-danger text-xlg">Payment Failed.</h2>
          <p>Your payment was unsuccessful.</p>
          <p>Please wait <span className='text-danger'>{seconds}</span> seconds...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
