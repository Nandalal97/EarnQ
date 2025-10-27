import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import API from '../utils/axios';
import UserCoins from '../components/userCoins';
import { Link } from 'react-router-dom';
import chartTranslation from "../language/chartGpt.json";


function QAChat({ coinRefreshKey, setCoinRefreshKey }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('Will answer here...');
  const [loading, setLoading] = useState(false);
  const [totalCoins, setTotalCoins] = useState(0);
  const [showLowCoinWarning, setShowLowCoinWarning] = useState(false);
  const [inputLength, setInputLength] = useState(0);
  const [outputLength, setOutputLength] = useState(0);
  const [userId, setUserId] = useState(null);

  const [lang, setLang] = useState("en");
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, []);

  const trans = chartTranslation[lang] || chartTranslation["en"];
  useEffect(() => {
  const trans = chartTranslation[lang] || chartTranslation["en"];
  setAnswer(trans.youraskAnswerPlaceholder);
}, [lang]);
 
  


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

  const handleAsk = async () => {
    setShowLowCoinWarning(false);
    if (!question.trim() || !userId) return;

    if (totalCoins < MIN_REQUIRED_COINS) {
      setShowLowCoinWarning(true);
      setAnswer('You do not have enough coins to ask a question.');
      return;
    }

    const lang = localStorage.getItem('lang') || 'en';
    setLoading(true);
    setAnswer('Loading answer...');
    setInputLength(0);
    setOutputLength(0);

    try {
      const chatRes = await API.post('/ai/ask-gpt', { prompt: question, language: lang });
      const aiAnswer = chatRes.data?.answer || '';
      const inputCount = question.trim().length;
      const outputCount = aiAnswer.trim().length;
      const totalChars = inputCount + outputCount;
      const totalCost = Math.ceil(totalChars / 3);

      setInputLength(inputCount);
      setOutputLength(outputCount);

      if (totalCoins < totalCost) {
        setShowLowCoinWarning(true);
        setAnswer('You do not have enough coins for this response.');
        setLoading(false);
        return;
      }

      await API.post('/user/coins/reduce', { userId, coins: totalCost });
      setTotalCoins((prev) => prev - totalCost);
      setCoinRefreshKey((prev) => prev + 1);
      setAnswer(aiAnswer);
    } catch (err) {
      setAnswer('Failed to get answer. Try again.');
      console.error('Error:', err);
    }

    setLoading(false);
  };


  return (
    <div className="page-wrapper">
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <div className="d-flex justify-content-between">
            <h5 className="m2-4 text-md">{trans.askQuestion}</h5>
            <p className="text-sm fw-bold color-two">Coins: <UserCoins refreshKey={coinRefreshKey} /></p>
          </div>
          <div className="pb-3">
            <p>
              {trans.askSubtext}
            </p>
          </div>

          {(showLowCoinWarning || totalCoins < MIN_REQUIRED_COINS) && (
            <div className="alert alert-warning py-2 text-sm">
            {trans.msg1}{' '}
              <strong>
                <Link to="/subscription" className="text-decoration-underline text-dark">
                  Upgrade to Premium
                </Link>
              </strong>{' '}
              or{' '}
              <strong>
                <Link to="/subscription" className="text-decoration-underline text-dark">
                  Buy Coins
                </Link>
              </strong>{' '}
             {trans.msg2}
            </div>
          )}

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={trans.yourQuestionPlaceholder}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
            />
            <button
              className="color-white bg-one border-0 px-3"
              onClick={handleAsk}
              disabled={loading || totalCoins < MIN_REQUIRED_COINS}
            >
              {loading ? <FaSpinner className="fa-spin" /> : <FaPaperPlane />}
            </button>
          </div>

          <div className="card">
            <div className="card-body p-0 text-sm">
              <textarea className="form-control text-sm chartAnswer" rows="10" value={answer} readOnly></textarea>
            </div>
          </div>

          {(inputLength > 0 || outputLength > 0) && (
            <div className="mt-2">
              <small className="text-danger">
                Input: <strong>{inputLength}</strong> | Answer: <strong>{outputLength}</strong> | Total: <strong>{inputLength + outputLength}</strong> → Coins Used: <strong>{Math.ceil((inputLength + outputLength) / 3)}</strong>
              </small>
            </div>
          )}

          <div className="my-2">
            <p className="text-xsm pb-2">
              <span>
                {trans.languageGuide}
              </span>
            </p>
            <h5 className="text-md">{trans.coinUsesHeading}:</h5>
            <ul className="text-xsm">
              {trans.instruction.map((item, index) => (
                <li key={index}>{item}</li>
              ))}

            </ul>
            <p className="text-xsm text-muted">
              <strong>Note:</strong> {trans.askNote}
            </p>
          </div>
        </main>
      </div>
      <AdsButtom />
    </div>
  );
}

export default QAChat;
