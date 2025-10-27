import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import { load } from '@cashfreepayments/cashfree-js';
import API from '../utils/axios';

const Billing = () => {
  const navigate = useNavigate();
  const [billingmsg, setBillingMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState(null);
  const [plan, setPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const [orderId, setOrderId] = useState("");
  const cashfreeRef = useRef(null);

  const planValue = parseInt(localStorage.getItem("plan"), 10);
  const isPlanInvalid = ![1, 6, 12].includes(planValue);

  // Set billingCycle from planValue
  useEffect(() => {
    if (isPlanInvalid) return;

    const labelMap = {
      1: "Monthly",
      6: "Half-Yearly",
      12: "Yearly"
    };

    setBillingCycle({
      label: labelMap[planValue],
      multiplier: planValue
    });
  }, []);

  // Fetch plan details
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await API.get(`/subscription/getPlan?lang=en`);
        const premiumPlan = res.data.plans.find(p => p.planCode === 'premium');
        if (premiumPlan) {
          setPlan(premiumPlan);
        } else {
          setBillingMsg("Plan not found");
        }
      } catch (err) {
        setBillingMsg("Failed to load plan details");
      }
    };

    if (billingCycle) {
      fetchPlan();
    }
  }, [billingCycle]);

  useEffect(() => {
    if (billingmsg) {
      const timer = setTimeout(() => setBillingMsg(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [billingmsg]);

  // Handle invalid plan value
  if (isPlanInvalid) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">Invalid access. Please select a plan first.</h4>
        <p className="cursor-pointer text-primary text-sm" onClick={() => navigate('/subscription')}>
          <i class="fas fa-arrow-left text-xsm"></i> Back to Plans
        </p>
      </div>
    );
  }

  // Loading state
  if (!billingCycle || !plan) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  // Pricing calculations
  const multiplier = billingCycle.multiplier;
  const discountPercent = plan.discounts?.[billingCycle.label] || 0;
  const basePrice = plan.basePrice * multiplier;
  const discountAmount = (basePrice * discountPercent) / 100;
  const finalPrice = basePrice - discountAmount;

  // Expiry date
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + multiplier);
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });



  // cashfree payment sessionId


  // Subscribe handler
  const handleSubscribe = async (e) => {
    e.preventDefault();
    const planValue = parseInt(localStorage.getItem("plan"), 10);
    if (![1, 6, 12].includes(planValue)) {
      setBillingMsg('Invalid plan selected. Please go back and choose a valid plan.');
      return;
    }

    const authToken = getAuthToken();
    if (!authToken) {
      setBillingMsg('Login required to subscribe');
      return;
    }
    const usersData = decodeToken(authToken);
    const userName = `${usersData.firstName || ""} ${usersData.middleName || ""} ${usersData.lastName || ""}`.trim();


    try {
      setLoading(true);
      const initSDK = async () => {
        const cf = await load({ mode: 'production' });
        cashfreeRef.current = cf;
      };
      initSDK();
      const getSessionId = async () => {
        try {
          const generatedOrderId = 'ORDER_' + Date.now();
          const res = await API.post('/payment/create-order', {
            order_id: generatedOrderId,
            order_amount: finalPrice,
            customer_details: {
              customer_id: usersData.id,
              customer_email: usersData.email,
              customer_phone: usersData.phone,
              customer_name: userName
            },
            order_note: "Premium Subscription"
          }, {
            headers: { 'Content-Type': 'application/json' }
          });


          const data = res.data;
          if (data && data.payment_session_id) {
            setOrderId(generatedOrderId);
            setPaymentStatus(data.order_status)
            localStorage.setItem('orderId', generatedOrderId);
            localStorage.setItem('plan', planValue); 

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
        return;
      }

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal"
      };

      try {
        await cashfreeRef.current.checkout(checkoutOptions);
                  navigate('/payment-status');
      } catch (err) {
        console.error("Payment failed or cancelled:", err);
      }

      setBillingMsg(response.data.msg || 'Subscription request processed.');

    } catch (err) {
      const msg = err.response?.data?.msg || 'Failed to process subscription';
      setBillingMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <h2 className="text-center text-xlg">Billing Summary</h2>
          <p className="text-center text-muted mb-4">
            Review your selected plan, pricing details, and subscription duration before proceeding to payment.
          </p>

          <div>
            <h4 className="text-lg">{plan.name} Plan ({billingCycle.label})</h4>
            <ul className="list-unstyled mb-4">
              {(plan.features || []).map((feature, i) => (
                <li key={i}>
                  <i className="fas fa-check-circle text-success me-2"></i>
                  {feature.translations?.en || feature.key || feature}
                </li>
              ))}
            </ul>

            <div className="border-top pt-3">
              <p><strong>Base Price:</strong> ₹{basePrice}</p>
              <p><strong>Discount:</strong> {discountPercent}% (-₹{discountAmount.toFixed(2)})</p>
              <h5 className='text-lg'><strong>Total Payable:</strong> ₹{finalPrice.toFixed(2)}</h5>
              <p className="text-muted mt-2">
                <i className="fas fa-calendar-alt me-2"></i>
                <strong>Expires On:</strong> {formattedExpiryDate}
              </p>
            </div>

            <button
              className="btn-invite border-0 mt-3 color-white bg-one"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>

          {billingmsg && (
            <div className="text-center alert alert-info mt-2 border-0 position-relative">
              <p>{billingmsg}</p>
            </div>
          )}
        </main>
      </div>
      <AdsButtom />
    </div>
  );
};

export default Billing;
