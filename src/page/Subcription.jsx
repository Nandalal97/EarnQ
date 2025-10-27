import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionLanguageData from '../language/subscription.json';
import API from '../utils/axios';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';

const billingOptions = [
  { label: 'Monthly', multiplier: 1 },
  { label: 'Half-Yearly', multiplier: 6 },
  { label: 'Yearly', multiplier: 12 }
];

function Subscription() {
  const [userId, setUserId] = useState(null);
  const [billingCycle, setBillingCycle] = useState(billingOptions[0]);
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState({ name: 'Free' });
  const [message, setMessage] = useState();
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();
  const [userBillingCycle, setUserBillingCycle] = useState();
  const [activeCode, setActiveCode] = useState();
  useEffect(() => {
    const authToken = getAuthToken();
    const userData = decodeToken(authToken);
    if (userData?.id) {
      setUserId(userData.id);
    } else {
      console.warn('Invalid or missing token');
    }
  }, []);
  useEffect(() => {
    const fetchActiveSubscription = async () => {
      try {
        const res = await API.get(`subscription/user/${userId}`);
        const subscription = res.data.subscriptions?.[0];

        if (subscription?.isActive) {
          setUserBillingCycle(subscription.billingCycle);

          const billingCycleCodeMap = {
            'Monthly': 1,
            'Half-Yearly': 6,
            'Yearly': 12
          };
          const code = billingCycleCodeMap[subscription.billingCycle] || null;
          setActiveCode(code);

          console.log("Billing Cycle:", subscription.billingCycle, "Code:", code);
        } else {
          setUserBillingCycle(null);
          setActiveCode(null);
        }
      } catch (error) {
        console.error("Failed to fetch subscription", error);
      }
    };

    if (userId) {
      fetchActiveSubscription();
    }
  }, [userId]);

  // Load selected language
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, []);

  const trans = subscriptionLanguageData[lang] || subscriptionLanguageData["en"];

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await API.get(`/subscription/getPlan?lang=${lang}`);
        const result =response.data

        setPlans(result.plans || []);

        const code = activeCode;
        const planInfo = [1, 6, 12].includes(code)
          ? {
            name: result.plans.find(p => p.planCode === 'premium')?.name || 'Premium',
            billingCycle: billingOptions.find(opt => opt.multiplier === code)?.label
          }
          : { name: 'Free' };

        setActivePlan(planInfo);
      } catch (err) {
        console.error("Error loading plans:", err);
      }
    };

    if (lang) fetchPlans();
  }, [lang, activeCode]);

  const getPrice = (plan) => {
    const multiplier = billingCycle.multiplier;
    const discountPercent = plan.discounts?.[billingCycle.label] || 0;
    const total = plan.basePrice * multiplier;
    const finalPrice = total - (total * discountPercent) / 100;
    return `₹${finalPrice.toFixed(0)}`;
  };

  const getDiscountText = (plan) => {
    const discount = plan.discounts?.[billingCycle.label];
    return (!discount || plan.basePrice === 0) ? null : `${discount}${trans.discount}`;
  };

  const isActivePlan = (plan) =>
    plan.name === activePlan.name &&
    (plan.name === 'Free' || billingCycle.label === activePlan.billingCycle);

  const handlePlanSelect = (plan) => {
    if (plan.planCode === 'free') {
      setMessage(trans.freePlanMsg);
      return;
    }

    const numberOfMonths = billingCycle.multiplier;
    localStorage.setItem('plan', numberOfMonths);

    navigate('/billing', {
      state: {
        numberOfMonths
      }
    });
  };

  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container">
          <h2 className="text-center text-md color-one">{trans.choosePlan}</h2>
          <p className="mb-4">{trans.planInfo}</p>

          {/* Billing Cycle Buttons */}
          <div className="d-flex justify-content-center mb-0">
            {billingOptions.map((option, idx) => (
              <button
                key={idx}
                className={`btn text-xsm mx-1 py-1 ${billingCycle.label === option.label ? 'btn-primary text-bold' : 'btn-outline-primary'}`}
                onClick={() => setBillingCycle(option)}
              >
                {trans[option.label.toLowerCase().replace(/[-\s]/g, '')] || option.label}
              </button>
            ))}
          </div>

          {/* Subscription Plans */}
          <div className="row g-1">
            {plans.map((plan, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="summary-box h-100 d-flex flex-column">
                  <div className="card-body d-flex flex-column text-center">
                    <h5 className="text-md">{plan.name}</h5>
                    <h3 className="color-one text-lg mb-0">
                      {plan.basePrice === 0 ? '₹0' : getPrice(plan)}
                    </h3>
                    {plan.basePrice > 0 && getDiscountText(plan) && (
                      <p className="text-success">{getDiscountText(plan)}</p>
                    )}
                    <ul className="list-unstyled text-xxsm my-3 text-start flex-grow-1">
                      {(plan.features || []).map((feature, i) => (
                        <li key={i}>
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {feature.translations?.[lang] || feature.key}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="btn text-sm btn-outline-primary w-100 mt-auto"
                      disabled={isActivePlan(plan)}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      {isActivePlan(plan) ? trans.active : plan.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {message && <div className="alert text-xsm alert-info mt-3 mb-0">{message}</div>}

            {/* Offers Section */}
            <div className="alert text-xsm alert-warning p-3 mt-3 border-0">
              {/* <h5 className="text-lg mb-1">{trans.freePlanOffer}</h5>
              <p>{trans.freePlanDetails}</p> */}

              <h5 className="text-xsm mb-1 pt-3">{trans.premiumPlanOffer}</h5>
              <p className="p-0 m-0">{trans.premiumPlanDetails}</p>
              <ul className='text-xxsm'>
                {trans.premiumPlanInstruction.map((lists, index) => (
                  <li key={index}>{lists}</li>
                ))}

              </ul>

              <p ><strong className='text-xxsm'>{trans.note}</strong></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default Subscription;
