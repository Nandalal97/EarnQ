import React, { useEffect, useState, useRef } from "react";
import AdsTop from "../components/AdsTop";
import AdsButtom from "../components/AdsButtom";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { getAuthToken } from "../utils/getAuthToken";
import API from "../utils/axios";
import { decodeToken } from "../utils/decodeToken";
import Swal from 'sweetalert2';
import AdsMiddle from "../components/AdsMiddle";
import ContestSlider from "../components/contestSlider";

import RenderRichText from '../components/RenderRichText';
import WinnerToast from "../components/WinnerToast";

function QuizPage({ user }) {
  const location = useLocation();
  const { subject, category } = location.state || {};
  const [lang, setLang] = useState("en");

  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [isPremium, setIsPremium] = useState(false);

  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const [adDelayPassed, setAdDelayPassed] = useState(false);

  useEffect(() => {
    if (showNext) {
      const shouldDelay = (current + 1) % 5 === 0; // ✅ Fix: 5 instead of 2
      if (shouldDelay) {
        setAdDelayPassed(false);
        const timer = setTimeout(() => setAdDelayPassed(true), 3000);
        return () => clearTimeout(timer);
      } else {
        setAdDelayPassed(true);
      }
    }
  }, [showNext, current]);


  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, []);

  const fetchQuestions = async (pageNum) => {
    setLoading(true);
    setErrorMsg(null);

    const token = getAuthToken();

    const userData = decodeToken(token)

    setIsPremium(!!userData?.isPremium);



    if (!token) {
      setErrorMsg("Unauthorized: Token not found.");
      setQuestions([]);
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/questions/filter', {
        params: {
          category,
          subject,
          lang:lang,
          page: pageNum,
          limit: limit
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log(res.data);


      const data = res.data?.questions || [];
      const total = res.data?.totalQuestions || (pageNum * limit);

      if (data.length === 0) {
        setErrorMsg("No questions found for this subject.");
        return;
      }

      const shuffled = data.sort(() => Math.random() - 0.5);

      setQuestions((prev) => {
        const combined = [...prev, ...shuffled];
        return combined.length > total ? combined.slice(0, total) : combined;
      });

      setTotalQuestions(total);
    } catch (err) {
      const msg = err.response?.data?.msg || "Network error or server is down.";
      if (msg === "Invalid or expired token." && err.response?.data?.status === 0) {
        navigate('/logout');
      }
      setErrorMsg(msg);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subject && category) fetchQuestions(page);
  }, [subject, category, page]);

  useEffect(() => {
    if (questions.length === 0 || current >= questions.length) return;

    setTimer(30);
    setSelectedAnswer(null);
    setShowNext(false);
    setExplanation("");

    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t === 1) {
          clearInterval(intervalRef.current);
          setShowNext(true);
          setSelectedAnswer("timeout");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [current, questions]);

  const handleAnswer = (key) => {
    if (selectedAnswer) return;
    clearInterval(intervalRef.current);
    setSelectedAnswer(key);
    setShowNext(true);

    if (key !== questions[current].correct_option) {
      setWrongCount((w) => w + 1);
    }
  };

  const goNext = () => {
    const nextIndex = current + 1;

    if (nextIndex < questions.length) {
      setCurrent(nextIndex);
    } else if (questions.length < totalQuestions) {
      setPage((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
      clearInterval(intervalRef.current);
    }
  };


 const currentQ = questions[current];

// Pick the translation: first the selected language, if empty fallback to English
const selectedTranslation = currentQ?.translations?.[lang];
const enTranslation = currentQ?.translations?.en;

const translated = {
  question:
    selectedTranslation?.question?.trim() || enTranslation?.question || "Question not available.",
  options:
    Object.keys(selectedTranslation?.options || {}).some(k => selectedTranslation.options[k].trim() !== "")
      ? selectedTranslation.options
      : enTranslation?.options || {}, // fallback to English if selected language options are empty
  explanation:
    selectedTranslation?.explanation?.trim() || enTranslation?.explanation || "Explanation not available.",
};


  const handleExplain = () => {
  if (!isPremium) {
    Swal.fire({
      icon: 'info',
      title: 'Premium Required',
      text: 'Upgrade to premium to unlock answer explanations.',
      confirmButtonText: 'Go to Subscription',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      customClass: { popup: 'small-alert' },
    }).then((result) => {
      if (result.isConfirmed) navigate('/subscription');
    });
    return;
  }

   const currentQ = questions[current];

  const fallback = {
    explanation:
      currentQ?.translations?.[lang]?.explanation ||
      currentQ?.translations?.en?.explanation ||
      currentQ?.explanation ||
      "Explanation not available.",
  };

  setExplanation(fallback.explanation);
};


  return (
    <div className="page-wrapper" id="page-wrapper">
    <WinnerToast/>
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <p>Answer the questions carefully and choose the best option. Learn as you go and track your progress.</p>
          <hr />
          {loading && <p>Loading questions...</p>}
          {errorMsg && <div className="alert alert-danger border-0 text-center">{errorMsg}</div>}

          {!loading && !errorMsg && questions.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-sm fw-bold">
                  Q. {quizCompleted ? totalQuestions : current + 1} of {totalQuestions}
                </p>
                {!quizCompleted && (
                  <div className="badge bg-warning text-dark">
                    Time: <span>{timer}</span> sec
                  </div>
                )}
              </div>

              {/* <h6>Wrong Answer :: {wrongCount}</h6> */}

              <div className="question-card mb-4">
                {!quizCompleted ? (
                  <>
                    <h4 className="text-sm"><RenderRichText text={translated?.question} /></h4>

                    <div className="mt-3">
                      {Object.entries(translated?.options || {}).map(([key, value]) => {
                        let btnClass = "btn text-sm btn-outline-primary text-sm w-100 mb-2";
                        if (selectedAnswer) {
                          if (key === currentQ.correct_option) {
                            btnClass = "btn text-sm btn-success w-100 mb-2";
                          } else if (key === selectedAnswer && key !== currentQ.correct_option) {
                            btnClass = "btn text-sm btn-danger w-100 mb-2";
                          } else {
                            btnClass = "btn text-sm btn-outline-secondary w-100 mb-2";
                          }
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
                      })}

                    </div>

                    {showNext &&
                      <>
                        {/* ✅ Inline ad after every 5 questions */}
                        {(current + 1) % 5 === 0 && (
                          <div className="ad-slot my-3 text-center">
                            <AdsMiddle />
                          </div>
                        )}

                        <button
                          className="btn text-sm btn-success mt-3 w-100"
                          onClick={goNext}
                          disabled={!adDelayPassed}
                        >
                          {adDelayPassed ? "Next" : "Please wait..."}
                        </button>
                      </>
                    }

                    {/* {showNext && (
                      
                      <button className="btn btn-success mt-3 w-100" onClick={goNext}>
                        {loading ? "Loading..." : "Next"}
                      </button>
                    )} */}

                    {selectedAnswer && (
                      <>
                        <button className={isPremium ? 'btn-invite bg-one text-sm color-white border-0 mt-2 w-100' : "btn-invite bg-secondary text-sm color-white border-0 mt-2 w-100"} onClick={handleExplain}>
                          Explain Answer
                        </button>
                        {/* {explanation && (
                          <div className="alert alert-secondary mt-2">
                            <strong>Explanation:</strong>
                            <pre style={{ whiteSpace: "pre-wrap" }}>{explanation}</pre>
                          </div>
                        )} */}
                        {explanation && (
                          <div className="alert text-sm alert-secondary mt-2">
                            <strong>Explanation:</strong>
                            <div className="mt-2 text-xsm">
                              <RenderRichText text={explanation} />
                            </div>
                          </div>
                        )}

                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <h5>Completed!</h5>
                    <button
                      className=" border-0 color-white rounded-1 bg-one mt-3 py-0 px-3"
                      onClick={() => {
                        setCurrent(0);
                        setWrongCount(0);
                        setQuizCompleted(false);
                        setPage(1);
                        setQuestions([]);
                        fetchQuestions(1);
                      }}
                    >
                      Restart
                    </button>

                  </div>
                )}
              </div>
            </>
          )}


          <ContestSlider/>
        </main>
      </div>
      <AdsButtom />
    </div>
  );
}

export default QuizPage;
