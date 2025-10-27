import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useMatch, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './App.css';

import TopMenuBar from './components/TopMenuBar';
import ButtomNav from './components/ButtomNav';
import InternetChack from './components/InternetChack';
import AdsBanner from './components/AdsBanner';
import Home from './page/Home';
import ReferAndEarn from './page/ReferAndEarn';
import AdsButtom from './components/AdsButtom';
import About from './page/About';
import PrivacyPolicy from './page/PrivacyPolicy';
import TermsAndConditions from './page/TermsAndConditions';
import ProfilePage from './page/ProfilePage';
import Contact from './page/Contact';
import Settings from './page/Settings';
import BalancePage from './page/BalancePage';
import QAChat from './page/QAChat';
import AnswerAnalysis from './page/AnswerAnalysis';
import DeviceCheck from './components/DeviceCheck';
import SignUp from './page/SignUp';
import LogIn from './page/LogIn';
import SubjectList from './page/SubjectList';
import QuizPage from './page/QuizPage';
import FeedbackModal from './components/Feedback';
import Subcription from './page/Subcription';
import Billing from './page/Billing';
import Invoice from './page/Invoice';
import PaymentStatus from './page/PaymentStatus';
import RefundPolicy from './page/RefundPolicy';
import BookReader from './page/BookReader';
import BookList from './page/BookList';
import VideoListPage from './page/VideoListPage';
import VideoPlayer from './components/VideoPlayer';
import VideoDetail from './components/VideoDetails';
import ProtectedRoute from './utils/ProtectedRoute';
import Logout from './page/Logout';
import GuestRoute from './utils/GuestRoute';
import UpcomingContest from './page/UpcomingContest';
import ExamPage from './page/ContestQuestions';
import BookingStatus from './page/BookingStatus';
import QuizCoin from './page/QuizCoin';
import AboutHome from './page/AboutHome';
import PrivacyPolicyHome from './page/PrivacyPolicyHome';
import TermsAndConditionsHome from './page/TermsAndConditionsHome';
import ContactHome from './page/ContactHome';
import RefundPolicyHome from './page/RefundPolicyHome';
import VerifyEmail from './page/VerifyEmail';
import CheckSession from './utils/CheckSession';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import BookDetails from './page/BookDetails';
import CartPage from './page/CartPage';
import BookPurchases from './page/BookPurchases';
import AntiInspect from './components/AntiCheatGuard';
import DevToolsProtector from './components/useDevtoolsGuard';
import BookOrderStatus from './page/bookOrder-status';
import LandingPage from './page/LandingPage';
import CurrentAffairceNews from './page/currentAffairceNews';
import CurrentAffairsMcq from './page/CurrentAffairsMcq';
import CurrentAffairs from './page/CurrentAffairs';
import PwaInstaller from './components/PwaInstaller';
import ContestLeaderboard from './page/ContestLeaderboard';
import ContestList from './page/ContestListForUse';
import UpdatePrompt from './components/UpdatePrompt';
import MockTest from './page/MockTest';
import MockExamDashboard from './page/MockExamDashboard';
import TalentSearch from './page/TalentSearch';
import TalentPaymentStatus from './page/talentPaymentStatus';
import NotFound from './page/NotFound';
import TalentExamInstruction from './page/TalentExamInstruction';
import TalentExamstart from './page/TalentExamstart';
import TalentResult from './page/TalentResult';

function AppContent() {
  const location = useLocation();
  const [coinRefreshKey, setCoinRefreshKey] = useState(0);
  // List of routes where nav should be hidden
  const hideNavRoutes = [
    '/login',
    '/signup',
    '/about-us',
    '/privacyPolicy',
    '/termsConditions',
    '/contact-us',
    '/refundPolicy',
    '/verify-email',
    '/forgot-password',
    '/talent/exam'
  ];

  // const shouldHideNav = hideNavRoutes.includes(location.pathname);

  // Feedback modal logic
  const [showModal, setShowModal] = useState(false);

  // const isResetPassword = useMatch('/reset-password/:token');

  // const shouldHideNav = hideNavRoutes.includes(location.pathname) || isResetPassword;

  const isResetPassword = Boolean(useMatch('/reset-password/:token'));
  const is404 = location.pathname === '/404';
  const shouldHideNav =
    hideNavRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/reset-password') ||
    isResetPassword || is404;


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const feedbackGiven = localStorage.getItem('feedbackGiven') === 'true';
    let interval;

    if (isLoggedIn && !feedbackGiven) {
      interval = setInterval(() => {
        setShowModal(true);
      }, 600000); // 10 min
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showModal) {
      const autoClose = setTimeout(() => {
        setShowModal(false);
      }, 60000); // 1 min
      return () => clearTimeout(autoClose);
    }
  }, [showModal]);

  return (
    <>
      <InternetChack />
      <DeviceCheck />
      <CheckSession />
      <PwaInstaller />
      <UpdatePrompt />
      <AntiInspect/>
      <DevToolsProtector/>
      <FeedbackModal show={showModal} handleClose={() => setShowModal(false)} />
      {!shouldHideNav && <TopMenuBar coinRefreshKey={coinRefreshKey} />}
      <Routes>

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/subjects/:subjectName" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />

        {/* Always-public pages (no nav when not logged in) */}
        <Route path="/about-us" element={<AboutHome />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicyHome />} />
        <Route path="/termsConditions" element={<TermsAndConditionsHome />} />
        <Route path="/refundPolicy" element={<RefundPolicyHome />} />
        <Route path="/contact-us" element={<ContactHome />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Rest of your protected/public routes */}
        <Route path="/refer" element={<ProtectedRoute><ReferAndEarn /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
        <Route path="/refund-policy" element={<ProtectedRoute><RefundPolicy /></ProtectedRoute>} />
        <Route path="/terms-conditions" element={<ProtectedRoute><TermsAndConditions /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><BalancePage /></ProtectedRoute>} />
        <Route path="/qa" element={<ProtectedRoute> <QAChat coinRefreshKey={coinRefreshKey} setCoinRefreshKey={setCoinRefreshKey} /></ProtectedRoute>} />
        <Route path="/answer-analysis" element={<ProtectedRoute><AnswerAnalysis coinRefreshKey={coinRefreshKey} setCoinRefreshKey={setCoinRefreshKey} /></ProtectedRoute>} />

        <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><LogIn /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />
        <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><SubjectList /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subcription /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
        <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
        <Route path="/bookOrder-Status" element={<ProtectedRoute><BookOrderStatus /></ProtectedRoute>} />

        {/* books */}
        <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/my-order" element={<ProtectedRoute><BookPurchases /></ProtectedRoute>} />
        <Route path="/book/:bookName" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
        <Route path="/book/read/:bookTitle" element={<ProtectedRoute><BookReader /></ProtectedRoute>} />

        {/* Video Section */}
        <Route path="/videos" element={<ProtectedRoute><VideoListPage /></ProtectedRoute>} />
        <Route path="/video" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
        <Route path="/video/:class/:title" element={<ProtectedRoute><VideoDetail /></ProtectedRoute>} />

        {/* contest */}
        <Route path="/contest" element={<ProtectedRoute><UpcomingContest /></ProtectedRoute>} />
          <Route path="/contest/winners" element={<ProtectedRoute><ContestLeaderboard /></ProtectedRoute>} />
        <Route path="/contests-list" element={<ProtectedRoute><ContestList /></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/bookingStatus" element={<ProtectedRoute><BookingStatus /></ProtectedRoute>} />

        <Route path="/quiz" element={<ProtectedRoute><QuizCoin coinRefreshKey={coinRefreshKey} setCoinRefreshKey={setCoinRefreshKey} /></ProtectedRoute>} />
        <Route path="/current-affairs-mcq" element={<ProtectedRoute><CurrentAffairsMcq /></ProtectedRoute>} />
        <Route path="/daily-current-affairs" element={<ProtectedRoute><CurrentAffairceNews /></ProtectedRoute>} />
        <Route path="/current-affairs" element={<ProtectedRoute><CurrentAffairs /></ProtectedRoute>} />

        <Route path="/mock-test" element={<ProtectedRoute><MockTest /></ProtectedRoute>} />
        <Route path="/mock-test/questions" element={<ProtectedRoute><MockExamDashboard /></ProtectedRoute>} />
        <Route path="/talent" element={<ProtectedRoute><TalentSearch /></ProtectedRoute>} />
        <Route path="/talent/exam/instruction" element={<ProtectedRoute><TalentExamInstruction /></ProtectedRoute>} />
        <Route path="/talent/exam" element={<ProtectedRoute><TalentExamstart /></ProtectedRoute>} />
        <Route path="/talent/result" element={<ProtectedRoute><TalentResult /></ProtectedRoute>} />
        <Route path="/talent/payment" element={<ProtectedRoute><TalentPaymentStatus /></ProtectedRoute>} />


        {/* 404 page */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {!shouldHideNav && <AdsBanner />}
      {!shouldHideNav && <ButtomNav />}
    </>
  );
}

function App() {

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
