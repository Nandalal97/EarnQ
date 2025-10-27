import React from 'react'
import homeImge from '../assets/home-img.png'
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";
function LandingPage() {
    return (
        <>

           <Helmet>
                <title>EarnQ – Learn Karo, Earn Karo | Quizzes, Contests, eBooks & Earn Online</title>
                <meta
                    name="description"
                    content="EarnQ – Gamified online learning! Practice MCQs, access eBooks, AI Q&A, and Join contests, earn rewards. Learn Karo, Earn Karo real cash, unlock premium features and grow your knowledge today!"
                />
                <meta
                    name="keywords"
                    content="EarnQ, Learn Karo Earn Karo, Online Learning, MCQ Practice, Contests, eBooks, Video Classes, AI Q&A, Earn Online, Referral Program"
                />
                <meta name="author" content="EarnQ" />

                {/* Open Graph for social sharing */}
                <meta property="og:title" content="EarnQ – Learn Karo, Earn Karo" />
                <meta property="og:description" content="Practice quizzes, join contests, earn coins & cash, access premium courses, and buy eBooks with EarnQ. Learn Karo, Earn Karo!" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://earnq.in" />
                <meta property="og:image" content="https://earnq.in/logo.png" />
            </Helmet>


            <nav className="sticky-top shadow-sm topbar">
                <div className="container">
                    <div className="logo">
                        <Link to={'/'}> <img src={logo} alt="logo" /></Link>
                    </div>
                </div>
            </nav>
            <section className="hero ">
                <div className="container">
                    <div className="row d-flex align-items-center">
                        <div className="col-12 col-md-6">
                            <h1>Learn, Grow & <span className="text-danger">Earn Real Cash</span> with EarnQ!</h1>
                            <p className="lead mt-3 fw-lighter">Welcome to EarnQ, your all-in-one platform for gamified online learning. Practice MCQs,
                                attend interactive video classes, explore NCERT & CBSE-aligned eBooks, and get instant answers through our AI-powered Q&A system</p>
                            <p className="lead mb-4 fw-lighter"> <strong>EarnQ,</strong> online learning designed for students and exam aspirants. Access unlimited MCQs, expert video classes, interactive eBooks,
                                AI-based Q&A, and learning contests. Build confidence, stay motivated, Participate Contest and earn exciting rewards while you learn smarter every day..</p>
                            <div className='d-none d-md-flex justify-content-center flex-column flex-md-row gap-2 mb-3'>
                                <Link to="/signup" className="btn-one color-white bg-two py-2 cursor-pointer">Join Free & Earn Rewards!</Link>
                                <Link to="/home" className="btn-one color-white bg-one py-2 cursor-pointer">Go to Dashboard</Link>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 my-2">

                            <img src={homeImge} className="img-fluid home-mobile-img" alt="EarnQ mcq practice image" />

                        </div>
                        <div className='d-flex d-md-none justify-content-center flex-column flex-md-row gap-2 my-3'>
                            <Link to="/signup" className="btn-one color-white bg-two py-2 cursor-pointer">Join Free & Earn Rewards!</Link>
                            <Link to="/login" className="btn-one color-white bg-one py-2 cursor-pointer">Login to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-padding text-center" id="who-can-join">
                <div className="container">
                    <h3 className="header-title mb-0 fw-bold">Who Can <span className="color-two">Join EarnQ?</span></h3>
                    <p>EarnQ is perfect for all ages learners who want to excel academically and prepare effectively for
                        competitive exams and and gain earning while learning. Whether you are a government exam aspirant, a
                        student following NCERT books or pursuing CBCS curriculum courses, EarnQ offers resources to boost your
                        knowledge and confidence.you can join and benefit from our platform.</p>
                    <div className="row g-2 mt-4">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <i className="fas fa-user-graduate fa-3x mb-3 text-primary"></i>
                                <h5>Students</h5>
                                <p>Build a strong foundation with NCERT and CBSE-aligned study materials, practice MCQs, and
                                    interactive video lessons to boost your academic performance.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <i className="fas fa-briefcase fa-3x mb-3 text-primary"></i>
                                <h5>Government Exam Aspirants</h5>
                                <p>Prepare for SSC, RRB, Banking, State PSC, UPSC and other competitive exams with practice MCQs
                                    with Explain, current affairs, Ebook, Practice Set and Also earn rewards.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <i className="fas fa-lightbulb fa-3x mb-3 text-primary"></i>
                                <h5>Lifelong Learners</h5>
                                <p>Keep your mind sharp, explore new topics, and enjoy a gamified learning experience with real
                                    rewards Money.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-padding alert alert-primary border-0 rounded-0 py-4" id="how-it-works">
                <div className="container text-center pb-3 px-0">
                    <h2 className="header-title fw-bold">How <span className="color-two">EarnQ Works</span></h2>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <i className="fas fa-user-plus fa-3x mb-3 text-primary"></i>
                                <h5 className="text-dark">Sign Up & Explore</h5>
                                <p className="text-dark">Create your free account, explore a wide range of quizzes, eBooks, and
                                    video lessons, and start your learning journey today.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <i className="fas fa-brain fa-3x mb-3 text-primary"></i>
                                <h5>Learn & Practice</h5>
                                <p>Engage in interactive quizzes, contests, and AI-powered Q&A to improve your knowledge and
                                    practical skills effectively.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <i className="fas fa-money-bill-wave fa-3x mb-3 text-primary"></i>
                                <h5>Earn Rewards</h5>
                                <p>Get real cash rewards and unlock premium features as you learn and complete challenges.
                                    Learning has never been more rewarding!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-padding" id="benefits">
                <div className="container text-center">
                    <h2 className="header-title fw-bold"> <span className="color-two">Why Choose</span> EarnQ?</h2>
                    <p className="mb-5">EarnQ combines learning and earning in one platform. Build skills, gain knowledge, and get
                        rewarded for your efforts.</p>
                    <div className="row g-2">
                        <div className="col-md-3">
                            <div className="feature-card">
                                <i className="fas fa-wallet fa-2x mb-2 text-success"></i>
                                <h6>Learn & Earn</h6>
                                <p>Earn real money while learning through quizzes and contests, motivating you to keep growing.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="feature-card">
                                <i className="fas fa-book fa-2x mb-2 text-success"></i>
                                <h6>Comprehensive Resources</h6>
                                <p>Access video classes, eBooks, and practice materials across various topics, curated for
                                    maximum learning.</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="feature-card">
                                <i className="fas fa-lightbulb fa-2x mb-2 text-success"></i>
                                <h6>AI Assistance</h6>
                                <p>Get instant AI-powered answers to your questions and enhance your learning experience
                                    effectively.</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="feature-card">
                                <i className="fas fa-users fa-2x mb-2 text-success"></i>
                                <h6>Community Support</h6>
                                <p>Join a thriving community of learners, exchange knowledge, and grow together with peers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-padding alert alert-primary border-0 rounded-0" id="testimonials">
                <div className="container text-center py-md-4">
                    <h2 className="header-title fw-bold">What Our <span className="color-two">Learners Say</span></h2>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <p>"EarnQ transformed the way I learn online. The quizzes are engaging, and I even earn cash
                                    rewards!"</p>
                                <strong>- Priya S.</strong>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <p>"The AI Q&A feature is amazing! I can clarify doubts instantly and keep learning
                                    efficiently."</p>
                                <strong>- Rajesh K.</strong>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <p>"I love earning rewards while gaining knowledge. EarnQ makes learning fun and profitable."
                                </p>
                                <strong>- Ananya M.</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-padding" id="faq">
                <div className="container">
                    <h2 className="text-center header-title fw-bold">Frequently <span className="color-two">Asked Questions</span></h2>
                    <div className="accordion" id="faqAccordion">

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne">
                                    How do I start learning on EarnQ?
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Sign up, access the courses, participate in quizzes, and earn rewards while learning.
                                    Everything is simple and beginner-friendly.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseTwo">
                                    Can I really earn cash rewards?
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Yes! Earn real cash by completing quizzes, participating in contests, and using the AI Q&A
                                    feature. Withdraw your earnings easily via secure payment options.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree">
                                    Is EarnQ suitable for all age groups?
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Absolutely! EarnQ offers a variety of learning materials suitable for students,
                                    professionals, and lifelong learners.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingFour">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseFour">
                                    Who can join EarnQ?
                                </button>
                            </h2>
                            <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Students following NCERT or CBCS curriculum, competitive exam aspirants, and anyone
                                    interested in interactive learning can join EarnQ.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingFive">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseFive">
                                    Do I need to pay to use EarnQ?
                                </button>
                            </h2>
                            <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Signing up and accessing many learning resources is free. Certain premium courses or contests
                                    may require a subscription.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingSix">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseSix">
                                    Can I use EarnQ on my mobile device?
                                </button>
                            </h2>
                            <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Yes! EarnQ is fully responsive and works seamlessly on smartphones, tablets, and desktops.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingSeven">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseSeven">
                                    How does the AI Q&A feature work?
                                </button>
                            </h2>
                            <div id="collapseSeven" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    AI Q&A provides instant answers to your questions, helping you clarify doubts and learn
                                    efficiently.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingEight">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseEight">
                                    Is my data secure on EarnQ?
                                </button>
                            </h2>
                            <div id="collapseEight" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Yes! EarnQ follows strict privacy policies and secure payment protocols to protect your personal
                                    and financial data.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <footer className="text-white">
                <div className="container">
                    <div className="row text-center text-md-start">
                        <div className="col-md-3 mb-4">
                            <h5 className="mb-3">About Us</h5>
                            <p>EarnQ is a gamified learning platform where you can practice MCQs, watch video lessons, read eBooks, and earn real cash rewards while improving your knowledge.</p>
                        </div>
                        <div className="col-md-3 mb-4">
                            <h5 className="mb-3">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/about-us" className="text-white text-decoration-none">About Us</Link></li>
                                <li><Link to="/privacyPolicy" className="text-white text-decoration-none">Privacy Policy</Link></li>
                                <li><Link to="/termsConditions" className="text-white text-decoration-none">Terms & Conditions</Link></li>
                                <li><Link to="/refundPolicy" className="text-white text-decoration-none">Refund Policy</Link></li>
                                <li><Link to="/contact-us" className="text-white text-decoration-none">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div className="col-md-3 mb-4">
                            <h5 className="mb-3">Contact</h5>
                            <p>Email: <Link to="mailto:support@earnq.in" className="text-white text-decoration-none">support@earnq.in</Link></p>
                        </div>


                        <div className="col-md-3 mb-4">
                            <h5 className="mb-3">Follow Us</h5>
                            <div className="d-flex justify-content-center justify-content-md-start">
                                <Link to="#" className="text-white mx-2"><i className="fab fa-facebook fa-2x"></i></Link>
                                <Link to="#" className="text-white mx-2"><i className="fab fa-twitter fa-2x"></i></Link>
                                <Link to="#" className="text-white mx-2"><i className="fab fa-instagram fa-2x"></i></Link>
                                <Link to="#" className="text-white mx-2"><i className="fab fa-linkedin fa-2x"></i></Link>
                            </div>
                        </div>
                    </div>

                    <hr className="bg-white my-2" />

                    <div className="text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} EarnQ. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default LandingPage