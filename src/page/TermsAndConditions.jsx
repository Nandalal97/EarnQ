import React from "react";
import AdsTop from "../components/AdsTop";
import AdsButtom from "../components/AdsButtom";
import { FaEnvelope } from "react-icons/fa";

function TermsAndConditions() {
  return (
    <div className="page-wrapper">
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <div className="term-container">
            <h1 className="header-three text-center mb-3">Terms & Conditions</h1>

            <p>
              Welcome to <strong>EarnQ</strong>, an educational quiz platform built to promote learning through fun challenges and rewards. By registering or using EarnQ, you agree to these terms. If you do not agree, please do not use the platform.
            </p>

            <h2 className="mt-2 text-md">1. Overview</h2>
            <p>
              EarnQ is a knowledge-based app where users engage in quizzes and contests, earn virtual coins called <strong>QuizCoins</strong>, and access premium tools powered by AI. Users may also qualify for rewards, including bonus coins, contest prizes, and referral bonuses under specific conditions.
            </p>

            <h3 className="mt-2 text-md">2. Signup Bonus</h3>
            <p>
              New users receive a ₹100 welcome bonus upon registration. This bonus is stored in the user’s EarnQ wallet and may be used for contest entries or withdrawn upon meeting platform conditions and completing KYC verification.
            </p>

            <h4 className="mt-2 text-md">3. Quiz& Coin Rules</h4>
            <ul className="text-xsm">
              <li>You earn <strong>+1 QuizCoin</strong> for every correct quiz answer.</li>
              <li>You lose <strong>-1 QuizCoin</strong> for every 3 wrong answers.</li>
              <li>Coins are not withdrawable- can be used for premium features like instant AI answers, analysis, and explanations.</li>
            </ul>

            <h4 className="mt-2 text-md">4. Contests & Prizes</h4>
            <p>Want to earn bigger prizes? Join our paid contests:</p>
            <ul className="text-xsm">
              <li>Contests require an entry fee (e.g., ₹50) to participate.</li>
              <li>Top scorers may receive real cash rewards (e.g., ₹500 or more.), credited to their EarnQ wallet.</li>
              <li>EarnQ reserves the right to review entries for fairness and accuracy before confirming prizes.</li>
            </ul>

            <h4 className="mt-2 text-md">5. Premium Membership</h4>
            <p>Upgrade to Premium to unlock the best of EarnQ:</p>
            <ul className="text-xsm">
              <li>Premium users receive <strong>30,000 QuizCoins/month</strong> during their subscription period.</li>
              <li>These coins unlock premium features like advanced question analytics, instant AI responses, and answer explanations.</li>
              <li>Premium members also enjoy an ad-free experience and additional quiz features.</li>
            </ul>

            <h4 className="mt-2 text-md">6. Referral Program</h4>
            <p>Love EarnQ? Invite your friends!</p>
            <ul className="text-xsm">
              <li>Refer friends using your unique referral code.</li>
              <li>Earn a <strong>5% QuizCoin bonus</strong> of their first subscription amount (after successful purchase and fraud check).</li>
              <li>Referral bonuses are subject to system verification and anti-abuse rules.</li>
            </ul>

            <h4 className="mt-2 text-md">7. Withdrawals</h4>
            <ul className="text-xsm">
              <li>You can withdraw eligible earnings (like signup bonuses, referral bonuses, contest prizes) via:
              <ul className="text-xsm">
                <li> Bank transfer</li>
                <li>UPI</li>
              </ul>
              </li>
              <li>Minimum withdrawal amount is ₹500.</li>
              <li>KYC verification may be required for security and fraud prevention.</li>
              <li>QuizCoins are not withdrawable and are only for in-app feature usage.</li>
            </ul>

            <h5 className="mt-2 text-md">8. Fair Use Rules</h5>
            <p>To keep EarnQ fair and fun, users must:</p>
            <ul className="text-xsm">
              <li>Do not use bots, scripts, or automation to interact with the app.</li>
              <li>Do not create multiple or fake accounts to exploit rewards.</li>
              <li>Do not share offensive or inappropriate content on the platform.</li>
            </ul>

            <p>Violating these rules may lead to suspension or permanent account ban.</p>

            <h5 className="mt-2 text-md">9. Ads & Data Usage</h5>
            <p>
              EarnQ displays ads from third-party providers like Google AdSense. These ads may use cookies and tracking tools to personalize the user experience. By using EarnQ, you consent to our <a href="/privacy-policy">Privacy Policy</a> and cookie use.
            </p>

            <h6 className="mt-2 text-md">10. Account Termination</h6>
            <p>
              We may suspend or delete accounts found violating our policies. All rewards, coins, and balances will be forfeited in such cases.
            </p>

            <h6 className="mt-2 text-md">11. Disclaimer</h6>
            <p>
              QuizCoins are virtual in nature and do not represent actual currency. EarnQ rewards are based on performance and 
              eligibility, and we do not guarantee any fixed income or payout. EarnQ is not a money-earning app but a learning-first platform with rewards as a bonus.
              
            </p>

            <h6 className="mt-2 text-md">12. Updates to Terms</h6>
            <p>
              Terms may change over time. Continued use after changes implies acceptance of the revised terms. System integrity is maintained through continuous monitoring and policy updates.
            </p>

            <h6 className="mt-2 text-md">13. Contact</h6>
            <p>
              If you have any questions, email us at: <br />
              <FaEnvelope /> <a href="mailto:support@earnq.in">support@earnq.in</a>
            </p>

            <p className="text-muted mt-2">
              <small>By using EarnQ, you agree to abide by these Terms & Conditions. Your participation indicates consent and understanding of all the above policies.</small>
            </p>
            <p className="text-muted"><small>Last updated: July 10, 2025</small></p>
          </div>
        </main>
      </div>
      <AdsButtom />
    </div>
  );
}

export default TermsAndConditions;
