import React, { useEffect, useState, useRef } from "react";
import AdsTop from "../components/AdsTop";
import AdsButtom from "../components/AdsButtom";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/axios";
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";
import Swal from "sweetalert2";
import AdsMiddle from "../components/AdsMiddle";
import ContestSlider from "../components/contestSlider";
import RenderRichText from "../components/RenderRichText";
import WinnerToast from "../components/WinnerToast";

function QuizPage() {
  const location = useLocation();
  const { subject, category } = location.state || {};
  const [lang, setLang] = useState("en");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showNext, setShowNext] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [adDelayPassed, setAdDelayPassed] = useState(false);

  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const token = getAuthToken();
  const userData = decodeToken(token);
  const userId = userData?.id;

  // Load language
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, []);

  // Timer per question
  useEffect(() => {
    if (!questions.length || quizCompleted) return;

    setTimer(30);
    setShowNext(false);
    setExplanation("");

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t === 1) {
          clearInterval(intervalRef.current);
          setShowNext(true);
          setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: "timeout" }));
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [currentIndex, questions, quizCompleted]);

  // Ad delay for every 5th question
  useEffect(() => {
    if (showNext) {
      const shouldDelay = (currentIndex + 1) % 5 === 0;
      if (shouldDelay) {
        setAdDelayPassed(false);
        const timer = setTimeout(() => setAdDelayPassed(true), 3000);
        return () => clearTimeout(timer);
      } else {
        setAdDelayPassed(true);
      }
    }
  }, [showNext, currentIndex]);

  // Fetch all questions once (from backend cache)
  const fetchAllQuestions = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.get("/questions/filter", {
        params: { category, subject, lang, action: "start", userId, random: true },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data?.success) {
        const allQuestions = res.data.allQuestions || [];
        if (!allQuestions.length) {
          setErrorMsg("No questions found.");
        } else {
          setQuestions(allQuestions);
          setCurrentIndex(0);
          setQuizCompleted(false);
        }
      } else {
        setErrorMsg(res.data?.message || "No questions found.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Server/network error";
      if (msg === "Invalid or expired token.") navigate("/logout");
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (subject && category) fetchAllQuestions();
    setIsPremium(!!userData?.isPremium);
  }, [subject, category]);

  const handleAnswer = (key) => {
    if (selectedAnswers[currentIndex]) return;
    clearInterval(intervalRef.current);

    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: key }));
    setShowNext(true);
    if (key !== questions[currentIndex]?.correct_option) setWrongCount((w) => w + 1);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const restartQuiz = () => {
    setQuizCompleted(false);
    setWrongCount(0);
    setSelectedAnswers({});
    setExplanation("");
    fetchAllQuestions();
  };

  const handleExplain = () => {
    if (!isPremium) {
      Swal.fire({
        icon: "info",
        title: "Premium Required",
        text: "Upgrade to premium to unlock answer explanations.",
        confirmButtonText: "Go to Subscription",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        customClass: {
          popup: 'small-alert',
          confirmButton: 'my-swal-confirm',// Custom class for confirm button
          cancelButton: 'my-swal-cancel'   // Custom class for cancel button
        },

        buttonsStyling: false // Set to false to fully use your own styles
      }).then((result) => {
        if (result.isConfirmed) navigate("/subscription");
      });
      return;
    }

    const selectedTranslation = questions[currentIndex]?.translations?.[lang];
    const enTranslation = questions[currentIndex]?.translations?.en;
    const fallback =
      selectedTranslation?.explanation || enTranslation?.explanation || "Explanation not available.";
    setExplanation(fallback);
  };

  const currentQ = questions[currentIndex];
  const selectedTranslation = currentQ?.translations?.[lang] || {};
  const enTranslation = currentQ?.translations?.en || {};
  const translated = {
    question: selectedTranslation.question?.trim() || enTranslation.question || "Question not available.",
    options:
      Object.keys(selectedTranslation?.options || {}).some(
        (k) => selectedTranslation.options[k].trim() !== ""
      )
        ? selectedTranslation.options
        : enTranslation?.options || {},
  };

  return (
    <div className="page-wrapper" id="page-wrapper">
      <WinnerToast />
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <p>Answer the questions carefully and choose the best option. Learn as you go and track your progress.</p>
          <hr />

          {loading && <p>Loading questions...</p>}
          {errorMsg && <div className="alert border-0 text-xsm alert-danger text-center">{errorMsg}</div>}

          {!loading && !errorMsg && (
            <>


              {currentQ && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="text-sm fw-bold">
                      Q. {quizCompleted ? questions.length : currentIndex + 1} of {questions.length}
                    </p>
                    {!quizCompleted && (
                      <div className="badge bg-warning text-dark">
                        Time: <span>{timer}</span> sec
                      </div>
                    )}
                  </div>

                  <div className="question-card mb-4">
                    {!quizCompleted ? (
                      <>
                        <h4 className="text-sm">
                          <RenderRichText text={translated.question} />
                        </h4>

                        <div className="mt-3">
                          {Object.entries(translated.options).map(([key, value]) => {
                            const userAns = selectedAnswers[currentIndex];
                            let btnClass = "btn text-sm btn-outline-primary w-100 mb-2";

                            if (userAns) {
                              if (key === currentQ.correct_option) btnClass = "btn btn-success w-100 mb-2";
                              else if (key === userAns) btnClass = "btn btn-danger w-100 mb-2";
                              else btnClass = "btn btn-outline-secondary w-100 mb-2";
                            }

                            return (
                              <button
                                key={key}
                                className={btnClass}
                                disabled={!!userAns}
                                onClick={() => handleAnswer(key)}
                              >
                                <RenderRichText text={value} />
                              </button>
                            );
                          })}
                        </div>

                        {showNext && (
                          <>
                            {(currentIndex + 1) % 5 === 0 && (
                              <div className="ad-slot my-3 text-center">
                                <AdsMiddle />
                              </div>
                            )}
                            <div className="d-flex gap-2 mt-3">
                              <button
                                className="btn btn-success w-100 text-sm"
                                onClick={goNext}
                                disabled={!adDelayPassed}
                              >
                                {adDelayPassed ? "Next" : "Please wait..."}
                              </button>
                            </div>
                          </>
                        )}

                        {selectedAnswers[currentIndex] && (
                          <>
                            <button
                              className={
                                isPremium
                                  ? "btn-invite bg-one text-sm color-white border-0 mt-2 w-100"
                                  : "btn-invite bg-secondary text-sm color-white border-0 mt-2 w-100"
                              }
                              onClick={handleExplain}
                            >
                              Explain Answer
                            </button>

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
                          className="border-0 color-white rounded-1 bg-one mt-3 py-0 px-3"
                          onClick={restartQuiz}
                        >
                          Restart
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}


            </>
          )}
          <ContestSlider />
        </main>
      </div>
      <AdsButtom />
    </div>
  );
}

export default QuizPage;
