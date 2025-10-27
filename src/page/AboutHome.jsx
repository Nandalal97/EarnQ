import React from "react";
import AdsTop from "../components/AdsTop";
import AdsButtom from "../components/AdsButtom";

const AboutHome = () => {
    return (
        <div className="page-wrapper">
           
            <div className="content-row">
                <main className="app-container">
                    <div className="about-container">
                        <h1 className="header-three text-center">About Us</h1>

                        <p><strong>Welcome to EarnQ –</strong> one of India’s most trusted quiz platforms where learning meets rewards through MCQs, contests, and interactive challenges.</p>

                        <p>
                            At <strong>EarnQ</strong>, we believe knowledge should be <strong>engaging and rewarding</strong>. Our platform is built for students, quiz enthusiasts, and lifelong learners who love gaining knowledge in a fun and interactive way — and get rewarded for it.
                        </p>

                        <p>
                            Whether you're preparing for school, competitive exams, or just want to test yourself, EarnQ offers a unique experience that combines learning with points, contests, and smart features — all in one place.
                        </p>

                        <h2 className="mt-4 text-md">Our Mission</h2>
                        <p>
                            We aim to create a motivating and enriching learning environment where users are encouraged to gain knowledge and are rewarded for their time and effort.
                        </p>

                        <h3 className="mt-4 text-md">What We Offer</h3>
                        <ul className="text-xsm">
                            <li><strong>MCQ Practice</strong> – Thousands of questions across subjects and levels.</li>
                            <li><strong>Doubt Solving</strong> – Ask your own questions and get instant answers using AI.</li>
                            <li><strong>Answer Analysis</strong> – Understand strengths and weaknesses with detailed reports.</li>
                            <li><strong>MCQ Explanations</strong> – Learn deeply through answer-wise explanations.</li>
                            <li><strong>Video Tutorials</strong> – Learn from expert video lessons by educators.</li>
                            <li><strong>Current Affairs</strong> – Stay updated with daily and monthly MCQs.</li>
                            <li><strong>Premium Access</strong> – Unlock advanced tools, deeper insights, and 30,000 coins monthly.</li>
                            <li><strong>Coins & Rewards</strong> – Earn Coins through quizzes and referrals, and use them for features or redemption.</li>
                            <li><strong>Refer & Earn</strong> – Invite friends and earn when they subscribe.</li>
                        </ul>

                        <h3 className="mt-4 text-md">What Makes Us Unique?</h3>
                        <ul className="text-xsm">
                            <li>Daily quizzes to sharpen your skills.</li>
                            <li>AI-powered instant doubt solving and performance analysis.</li>
                            <li>Coins for correct answers and contest prizes.</li>
                            <li>Referral system to earn while inviting friends.</li>
                            <li>Expert-backed video learning support.</li>
                            <li>Rewards for consistent learning and top contest performance.</li>
                        </ul>

                        <h3 className="mt-4 text-md">Who Can Join?</h3>
                        <ul className="text-xsm">
                            <li>Students in classes 6–12.</li>
                            <li>Aspirants preparing for competitive exams.</li>
                            <li>General knowledge enthusiasts.</li>
                            <li>Anyone who enjoys learning and interactive quizzes.</li>
                        </ul>

                        <h3 className="mt-4 text-md">Our Commitment</h3>
                        <p>
                            EarnQ is built with fairness, security, and transparency at its core. We conduct verification checks to prevent misuse and make sure genuine users enjoy seamless quiz and reward experiences.
                        </p>

                        <h4 className="mt-4 text-md">Future Goals</h4>
                        <p>
                            We’re working on more exciting features like leaderboards, tournaments, and gamified learning tools. Our goal is to keep learning simple, fun, and meaningful.
                        </p>

                        <p className="mt-4 text-xxsm text-muted">
                            <strong>Note:</strong> EarnQ is not a gambling or get-rich app. Rewards are based on user knowledge, participation, and fair play. Coins are earned and used for features, contests, or eligible redemptions after verification.
                        </p>
                    </div>
                </main>
            </div>
           
        </div>
    );
};

export default AboutHome;
