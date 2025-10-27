import React from "react";
import AdsTop from "../components/AdsTop";
import AdsButtom from "../components/AdsButtom";

const PrivacyPolicy = () => {
  return (
    <div className="page-wrapper">
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <div className="privacy-container">
            <h1 className="header-three text-center">Privacy Policy</h1>

            <p>
              Your privacy matters to us. At <strong>EarnQ</strong>, we are committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights regarding that data.
            </p>
            

            <h2 className="mt-2 text-md">1. What We Collect</h2>
            <ul className="text-xsm">
              <li><strong>Account Info:</strong> Your name, phone number, email address etc.</li>
              <li><strong>Usage Data:</strong> Quiz answers, coin balance, referral activity, contest entries.</li>
              <li><strong>Device Info:</strong> Device ID, IP address, browser type, and session logs.</li>
            </ul>

            <h3 className="mt-2 text-md">2. Why We Collect It</h3>
            <ul className="text-xsm">
              <li>To provide personalized quiz experiences and track rewards.</li>
              <li>To process withdrawals and manage referrals.</li>
              <li>To detect and prevent fraud or system abuse.</li>
              <li>To send updates about features, contests, or bonus offers (with your permission).</li>
            </ul>

            <h4 className="mt-2 text-md">3. Who We Share It With</h4>
            <p>We do not sell or rent your data. We may share limited data only with trusted partners for:</p>
            <ul className="text-xsm">
              <li>Handling withdrawals and payments (e.g., UPI, bank partners).</li>
              <li>Compliance with legal obligations or fraud investigations.</li>
            </ul>

            <h4 className="mt-2 text-md">4. Third-Party Ads & Cookies</h4>
            <p>
              EarnQ uses third-party services like <strong>Google AdSense</strong> to display ads. These services may use cookies or similar technologies to personalize ads.
            </p>
            <ul className="text-xsm">
              <li>
                <strong>Google Ads:</strong> Learn how Google uses cookies at 
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer"> Google Ads Policy</a>.
              </li>
              <li>
                <strong>Opt-out:</strong> You can manage ad preferences at 
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer"> Google Ad Settings</a> or 
                <a href="https://www.aboutads.info/choices" target="_blank" rel="noreferrer"> YourAdChoices</a>.
              </li>
              <li>
                <strong>Cookies:</strong> You can disable cookies in your browser settings, though some features may not work properly.
              </li>
            </ul>

            <h4 className="mt-2 text-md">5. Data Retention</h4>
            <p>
              We retain your information as long as your account is active or as needed to comply with legal obligations. If you wish to delete your data, you can request this at any time.
            </p>

            <h5 className="mt-2 text-md">6. Children's Privacy</h5>
            <p>
              EarnQ is intended for users aged 13 and above. Users under 18 must have parental consent. We do not knowingly collect data from children under 13.
            </p>

            <h4 className="mt-2 text-md">7. Your Rights</h4>
            <ul className="text-xsm">
              <li>You may contact support to view, update, or delete your personal data.</li>
              <li>You may opt out of promotional notifications in your account settings.</li>
              <li>Users can withdraw KYC or request data removal at any time.</li>
            </ul>

            <h5 className="mt-2 text-md">8. How We Protect Your Data</h5>
            <p>
              We use standard encryption and security practices to protect your data. However, no system is 100% secure. Please keep your account login confidential.
            </p>

            <h5 className="mt-2 text-md">9. Changes to This Policy</h5>
            <p>
              We may update this Privacy Policy from time to time. We’ll post any changes here. Continued use of EarnQ means you accept the updated terms.
            </p>

            <h5 className="mt-2 text-md">10. Contact Us</h5>
            <p>
              Have questions or want to manage your data? Contact us at:<br />
              📧 <a href="mailto:support@earnq.in">support@earnq.in</a>
            </p>

            <p className="mt-5 text-muted"><small>Last updated: July 10, 2025.</small></p>
          </div>
        </main>
      </div>
      <AdsButtom />
    </div>
  );
};

export default PrivacyPolicy;
