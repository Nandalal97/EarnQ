import React, { useEffect, useState, useRef } from "react";
import AdsTop from "../components/AdsTop";
import AdsButtom from "../components/AdsButtom";
import { useNavigate } from "react-router-dom";
import homeLanguageData from "../language/home.json";
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";
import API from "../utils/axios";
import RenderRichText from "../components/RenderRichText";
import WinnerToast from "../components/WinnerToast";
import ReferCard from "../components/referCard";

function QuizCoin({ coinRefreshKey, setCoinRefreshKey }) {
  const [coinCount, setCoinCount] = useState(0);
  const [coinDelta, setCoinDelta] = useState(0);
  const [lang, setLang] = useState("en");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [adDelayPassed, setAdDelayPassed] = useState(false);
  const MAX_QUESTIONS = 100;
  const intervalRef = useRef(null);
  const answeredRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, []);

  const trans = homeLanguageData[lang] || homeLanguageData["en"];

  // Fetch questions
  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  useEffect(() => {
    if (showNext) {
      const shouldDelay = (current + 1) % 5 === 0;
      if (shouldDelay) {
        setAdDelayPassed(false);
        const timerId = setTimeout(() => setAdDelayPassed(true), 5000);
        return () => clearTimeout(timerId);
      } else {
        setAdDelayPassed(true);
      }
    }
  }, [showNext, current]);

  const fetchQuestions = async (pageNum) => {
    const token = getAuthToken();
    if (!token) {
      setErrorMsg("Unauthorized: Token not found.");
      return;
    }

    try {
      setLoadingMore(true);
      const res = await API.get(`/questions?random=true&page=${pageNum}&limit=${MAX_QUESTIONS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.questions;
      if (!Array.isArray(data) || data.length === 0) {
        setErrorMsg("No questions found.");
        setLoadingMore(false);
        return;
      }

      // Shuffle questions
      const shuffled = data.sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, MAX_QUESTIONS));
      setLoadingMore(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Network error or server is down.";
      if (msg === "Invalid or expired token.") navigate("/logout");
      setErrorMsg(msg);
      setQuestions([]);
      setLoadingMore(false);
    }
  };

  // Timer per question
  useEffect(() => {
    if (questions.length === 0 || current >= questions.length) return;

    setTimer(30);
    setSelectedAnswer(null);
    setShowNext(false);
    answeredRef.current = false;

    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t === 1) {
          clearInterval(intervalRef.current);
          if (!answeredRef.current) {
            setSelectedAnswer("timeout");
            setSkippedCount((s) => s + 1);
            answeredRef.current = true;
          }
          setShowNext(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [current, questions]);

  const handleAnswer = (option) => {
    if (selectedAnswer) return;
    clearInterval(intervalRef.current);
    setSelectedAnswer(option);
    setShowNext(true);
    answeredRef.current = true;

    if (questions[current]?.correct_option === option) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongCount((w) => w + 1);
    }
  };

  // Update coin count
  useEffect(() => {
    const newCoins = correctCount - Math.floor(wrongCount / 3);
    const diff = newCoins - coinCount;
    let timeoutId;

    if (diff !== 0) {
      setCoinDelta(diff);
      timeoutId = setTimeout(() => setCoinDelta(0), 1500);
    }

    setCoinCount(newCoins >= 0 ? newCoins : 0);
    setCoinRefreshKey(newCoins >= 0 ? newCoins : 0);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [correctCount, wrongCount, coinCount, setCoinRefreshKey]);

  const goNext = () => {
    const nextIndex = current + 1;
    if (nextIndex < MAX_QUESTIONS) {
      setCurrent(nextIndex);
    } else {
      setQuizCompleted(true);
      clearInterval(intervalRef.current);
    }
  };

  const submitCoins = async () => {
    try {
      const token = getAuthToken();
      const userData = decodeToken(token);
      const userId = userData.id;

      await API.post(
        "/quiz/submit-quiz",
        { userId, correct: correctCount, wrong: wrongCount },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setQuizCompleted(true);
      clearInterval(intervalRef.current);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit coins.");
    }
  };

  if (!questions.length && !quizCompleted && !errorMsg)
    return <p className="text-center pt-5">Loading...</p>;

  if (errorMsg) return <p className="text-danger pt-3 text-center">{errorMsg}</p>;

  const question = questions[current] || null;

  // Fallback localized logic
  let localized = null;
  let options = {};
  if (question?.translations) {
    const langData = question.translations[lang];
    if (langData && (langData.question || Object.values(langData.options || {}).some(o => o))) {
      localized = langData;
    } else {
      localized = question.translations["en"];
    }
    options = localized?.options || {};
  }

  const accuracy = ((correctCount / MAX_QUESTIONS) * 100).toFixed(1);

  return (
    <div className="page-wrapper" id="page-wrapper">
      <WinnerToast />
      <AdsTop />
      <div className="content-row">
        <main className="app-container pb-0 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-0">
            {!quizCompleted && (
              <h6>
                {trans.countQuestion}: {current + 1} of {MAX_QUESTIONS}
              </h6>
            )}
            {!quizCompleted && (
              <div className="badge bg-warning text-dark">
                {trans.countTimmer}: <span>{timer}</span> sec
              </div>
            )}
          </div>

          {!quizCompleted && (
            <p className="text-xsm pb-1">
              Correct: {correctCount} | Wrong: {wrongCount} | Skipped: {skippedCount} | &nbsp; 💰 Coins: {coinCount}
              {coinDelta !== 0 && (
                <span
                  className="fw-bold"
                  style={{ marginLeft: 8, color: coinDelta > 0 ? "green" : "red" }}
                >
                  ({coinDelta > 0 ? "+" : ""}
                  {coinDelta})
                </span>
              )}
            </p>
          )}

          <div className="question-card">
            {!quizCompleted ? (
              <>
                <h4 className="text-sm mt-1">
                  <RenderRichText text={localized?.question || "Loading..."} />
                </h4>

                <div className="mt-3 text-xsm" id="options">
                  {Object.entries(options).length > 0 ? (
                    Object.entries(options).map(([key, value]) => {
                      let btnClass = "btn btn-outline-primary w-100 mb-2 text-sm";
                      if (selectedAnswer) {
                        if (key === question.correct_option) btnClass = "btn text-sm btn-success w-100 mb-2";
                        else if (key === selectedAnswer && selectedAnswer !== question.correct_option)
                          btnClass = "btn text-sm btn-danger w-100 mb-2";
                        else btnClass = "btn text-sm btn-outline-secondary w-100 mb-2";
                      }
                      return (
                        <button
                          key={key}
                          className={btnClass}
                          disabled={!!selectedAnswer}
                          onClick={() => handleAnswer(key)}
                        >
                          <RenderRichText text={value} />
                        </button>
                      );
                    })
                  ) : (
                    <p>Loading options...</p>
                  )}
                </div>

                {showNext && current + 1 < MAX_QUESTIONS && (
                  <button className="btn btn-success text-sm mt-3 w-100" onClick={goNext} disabled={!adDelayPassed}>
                    {adDelayPassed ? "Next" : "Please wait..."}
                  </button>
                )}

                {showNext && current + 1 === MAX_QUESTIONS && (
                  <button className="btn btn-primary mt-3 w-100" onClick={submitCoins} disabled={!adDelayPassed}>
                    {adDelayPassed ? "Submit & Save Coins" : "Please wait..."}
                  </button>
                )}
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-lg fw-medium pb-2">🎉 Quiz Completed!</h2>

                <table className="table table-bordered text-start mb-0 text-sm">
                  <tbody>
                    <tr>
                      <th>Total Questions</th>
                      <td>{MAX_QUESTIONS}</td>
                    </tr>
                    <tr>
                      <th>Correct</th>
                      <td>{correctCount}</td>
                    </tr>
                    <tr>
                      <th>Wrong</th>
                      <td>{wrongCount}</td>
                    </tr>
                    <tr>
                      <th>Skipped</th>
                      <td>{skippedCount}</td>
                    </tr>
                    <tr>
                      <th>Accuracy</th>
                      <td>{accuracy}%</td>
                    </tr>
                    <tr>
                      <th>Coins Earned</th>
                      <td>{coinCount}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-3">
                  <span
                    className="btn-invite bg-one color-white cursor-pointer"
                    onClick={() => {
                      setCurrent(0);
                      setWrongCount(0);
                      setCorrectCount(0);
                      setSkippedCount(0);
                      setQuizCompleted(false);
                      setQuestions([]);
                      setPage(1);
                      setCoinCount(0);
                      setCoinRefreshKey(0);
                      fetchQuestions(1);
                    }}
                  >
                    🔁 Retake Quiz
                  </span>
                </div>

                <div className="alert alert-success mt-3 border-0">
                  🎉 Great job! You earned {coinCount} coins in this quiz. Keep practicing to earn more!
                </div>
              </div>
            )}

            {!quizCompleted && (
              <div className="my-2">
                <p className="text-xsm">
                  <strong>Note:</strong> Win 1 coin for every correct answer. But be careful! For every 3 wrong answers, you will lose 1 coin!
                </p>
              </div>
            )}
          </div>

          <ReferCard />
          <AdsButtom />
        </main>
      </div>
    </div>
  );
}

export default QuizCoin;
