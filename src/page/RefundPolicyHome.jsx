import React from 'react';
import AdsTop from "../components/AdsTop";
import AdsButtom from "../components/AdsButtom";

const RefundPolicyHome = () => {
    return (
        <>
            <div className="page-wrapper">
             <AdsTop />
                <div className="content-row">
                    <main className="app-container">
                        <h1 className="header-three text-center">Refund Policy</h1>
                        <p>
                            At <strong>EarnQ</strong>, we value transparency and customer satisfaction. Please read our refund policy carefully before purchasing any subscription plan.
                        </p>

                        <h2 className="mt-2 text-md">1. Free Plan</h2>
                        <p>Users can access the Free Plan at no cost. No payment or refund is applicable for this plan.</p>

                        <h3 className="mt-2 text-md">2. Paid Subscriptions (Pro / Premium Plans)</h3>
                        <p>We offer digital subscriptions that unlock additional features. As these services are delivered immediately upon purchase, we follow these refund conditions:</p>
                        <h5 className="mt-2 text-md">Eligible Refunds</h5>
                        <ul className="text-xsm">
                            <li>Accidental duplicate payment</li>
                            <li>Technical issues that prevent access despite support assistance</li>
                            <li>Payment processed but features not activated (with proof)</li>
                        </ul>
                        <p>All refund requests must be made within <strong>7 days</strong> of the original transaction.</p>

                        <h5 className="mt-2 text-md">Non-Refundable</h5>
                        <ul className='text-xsm'>
                            <li>Change of mind after successful subscription</li>
                            <li>Unused time or features</li>
                            <li>Subscription cancellation after 7 days</li>
                            <li>Refunds for failed test scores or unsatisfactory performance</li>
                        </ul>
                        <h5 className="mt-2 text-md">3. No Auto-Renewal</h5>
                        <p>
                            We do <strong>not</strong> offer automatic renewals for any subscription plans. When your selected plan expires, your account will automatically switch back to the <strong>Free Plan</strong>. You may choose to manually upgrade again at any time.
                        </p>
                        <h5 className="mt-2 text-md">4. Cancellation</h5>
                        <p>
                            You may cancel your subscription at any time. The cancellation will be effective at the end of your current billing cycle. During the active period, all features of your selected plan will remain available.
                        </p>

                        <h5 className="mt-2 text-md">4. No Refunds</h5>
                        <p>
                            Payments made for any subscription plans are <strong>non-refundable</strong>. We do not offer partial or full refunds once a payment is processed, including cases of early cancellation or limited use.
                        </p>

                        <h4 className="mt-2 text-md">5. Billing Support</h4>
                        <p>If you have any billing-related concerns or disputes, feel free to contact our support team at</p>
                        <ul className="text-xsm">
                            <li><strong>support@earnq.in</strong></li>
                            {/* <li><strong>+91-XXXXXXXXXX</strong></li> */}
                        </ul>
                        <p>
                            <strong> Please include:</strong>
                            <ul className="text-xsm">
                                <li>Full name and registered email</li>
                                <li>Payment receipt/transaction ID</li>
                                <li>Reason for refund</li>
                            </ul>
                        </p>

                        <h4 className="mt-2 text-md">⚖️ Final Decision</h4>
                        <p>
                            Refund approval is at our sole discretion, based on policy compliance and investigation. Approved refunds will be processed within <strong>7–10 business days</strong> via the original payment method.
                        </p>
                        <p className="mt-2 text-muted"><small>Update: June 10, 2025.</small></p>

                    </main>
                </div>
                  <AdsButtom />
            </div>
        </>

    );
};

export default RefundPolicyHome;
