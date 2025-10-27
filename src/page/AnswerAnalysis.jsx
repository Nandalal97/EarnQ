import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSpinner, FaRobot } from 'react-icons/fa';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import API from '../utils/axios';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import UserCoins from '../components/userCoins';
import { Link } from 'react-router-dom';
import chartTanslation from "../language/chartGpt.json";
function AnswerAnalysis({ coinRefreshKey, setCoinRefreshKey }) {
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [totalCoins, setTotalCoins] = useState(0);
  const [showLowCoinWarning, setShowLowCoinWarning] = useState(false);
  const [userId, setUserId] = useState(null);
  const [inputLength, setInputLength] = useState(0);
  const [outputLength, setOutputLength] = useState(0);
  const [error, setError] = useState('');

  const [lang, setLang] = useState("en");
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, []);
  const trans = chartTanslation[lang] || chartTanslation["en"];

  const MIN_REQUIRED_COINS = 250;

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    const userdata = decodeToken(token);
    if (!userdata?.id) return;
    setUserId(userdata.id);
    fetchUserCoins(userdata.id);
  }, []);

  const fetchUserCoins = async (id) => {
    try {
      const res = await API.get(`/user/coins/${id}`);
      const total = (res.data.quizCoins || 0) + (res.data.premiumCoins || 0);
      setTotalCoins(total);
    } catch (err) {
      console.error('Error fetching user coins:', err.message);
    }
  };

  const handleAnalyze = async () => {
    setShowLowCoinWarning(false);
    setError('');
    if (!question.trim() || !userAnswer.trim() || !userId) return;

    if (totalCoins < MIN_REQUIRED_COINS) {
      setShowLowCoinWarning(true);
      setAnalysis('You do not have enough coins.');
      return;
    }

    const inputCount = question.trim().length + userAnswer.trim().length;
    const lang = localStorage.getItem('lang') || 'en';

    setLoading(true);
    setShowAnalysis(true);
    setAnalysis('Analyzing your answer...');
    setInputLength(0);
    setOutputLength(0);

    try {
      const response = await API.post('/ai/analyze-answer', {
        question,
        userAnswer,
        language: lang,
      });

      const aiAnswer = response.data?.analysis || 'No explanation available.';
      const outputCount = aiAnswer.trim().length;
      const totalUsed = inputCount + outputCount;
      const coinCost = Math.ceil(totalUsed / 3);

      if (totalCoins < coinCost) {
        setShowLowCoinWarning(true);
        setAnalysis('You do not have enough coins.');
        setLoading(false);
        return;
      }

      setInputLength(inputCount);
      setOutputLength(outputCount);
      setAnalysis(aiAnswer);

      await API.post('/user/coins/reduce', { userId, coins: coinCost });
      setTotalCoins((prev) => prev - coinCost);
      setCoinRefreshKey((prev) => prev + 1);
    } catch (err) {
      setAnalysis('');
      setError('Failed to analyze. Try again.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="page-wrapper">
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="m2-4 text-md">{trans.answerAnalysis}</h5>
            <p className="text-sm fw-bold color-two">Coins: <UserCoins refreshKey={coinRefreshKey} /></p>
          </div>

          {(showLowCoinWarning || totalCoins < MIN_REQUIRED_COINS) && (
            <div className="alert alert-warning py-2 text-sm">
              {trans.msg1}{' '}
              <strong>
                <Link to="/subscription" className="text-decoration-underline text-dark">
                  Upgrade to Premium
                </Link>
              </strong>{' '}or{' '}
              <strong>
                <Link to="/subscription" className="text-decoration-underline text-dark">
                  Buy Coins
                </Link>
              </strong>{' '} {trans.msg2}
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 text-sm">
              {error}
            </div>
          )}

          <p className="text-sm mb-2">
            {trans.analysisSubtext}
          </p>

          <div className="mb-2 mt-2">
            <label className="form-label">{trans.yourQuestions}</label>
            <textarea
              className="form-control chartAnswer"
              rows="2"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={trans.yourQuestionPlaceholder}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{trans.yourAnswwr}</label>
            <textarea
              className="form-control chartAnswer"
              rows="5"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={trans.yourAnswerPlaceholder}
              disabled={loading}
            />
          </div>

          <span className="bg-one text-xsm cursor-pointer btn-invite color-white border-0 align-center justify-content-center d-flex mb-4" onClick={handleAnalyze}
            disabled={loading || totalCoins < MIN_REQUIRED_COINS || !question || !userAnswer}
          >
            {loading ? <FaSpinner className="fa-spin me-2 mt-1" /> : <FaRobot className="me-2 mt-1" />}
            Analyze Answer
          </span>

          {showAnalysis && (
            <div className="card">
              <div className="card-body p-0">
                <textarea
                  className="form-control chartAnswer"
                  rows="10"
                  value={analysis}
                  readOnly
                ></textarea>
              </div>
            </div>
          )}

          {(inputLength > 0 || outputLength > 0) && (
            <div className="mt-2">
              <small className="text-danger">
                Input: <strong>{inputLength}</strong> | Output: <strong>{outputLength}</strong> | Total: <strong>{inputLength + outputLength}</strong> → Coins Used: <strong>{Math.ceil((inputLength + outputLength) / 3)}</strong>
              </small>
            </div>
          )}

          <div className="my-2">
            <p className="text-xsm pb-2">
              <span>
                {trans.languageGuide}
              </span>
            </p>
            <h5 className="text-md">{trans.coinUsesHeading} :</h5>
            <ul className="text-xsm">
              {trans.instruction.map((lists, index) => (
                <li key={index}>{lists}</li>

              ))}
            </ul>
            <p className="text-xsm text-muted">
              <strong>Note:</strong> {trans.analisisNote}
            </p>
          </div>
          <div>
            <AdsButtom />
          </div>
        </main>
      </div>

    </div>
  );
}

export default AnswerAnalysis;