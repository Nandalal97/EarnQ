import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";
import API from "../utils/axios";

const MockExamDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mockTestId } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [allQuestions, setAllQuestions] = useState({});
  const [questionData, setQuestionData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [paletteStatus, setPaletteStatus] = useState([]);
  const [language, setLanguage] = useState("en");
  const [totalTime, setTotalTime] = useState(3600);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);

  const [canAttempt, setCanAttempt] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const [attemptMessage, setAttemptMessage] = useState("");
  const [title, setTitle] = useState("en");

  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({});
  const [isReady, setIsReady] = useState(false);

  const authToken = getAuthToken();
  const userData = decodeToken(authToken);
  const userId = userData?.id;

  // Set default language and start time
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLanguage(storedLang);
    setStartTime(new Date().toISOString());
  }, []);

  // Check attempts
  useEffect(() => {
    const checkAttempts = async () => {
      try {
        const res = await API.get("mocktests/checkAttempts", {
          params: { mockTestId, userId },
        });
        if (res.data.success) {
          setRemainingAttempts(res.data.remaining);
          const canAttemptNow = res.data.remaining > 0;
          setCanAttempt(canAttemptNow);
          setAttemptMessage(
            canAttemptNow
              ? ""
              : "⚠️ You have reached the maximum attempt limit. You cannot attempt this mock test again."
          );
        }
      } catch (err) {
        console.error(err);
        setCanAttempt(false);
        setAttemptMessage("Error checking attempts.");
      } finally {
        setIsReady(true);
      }
    };
    if (mockTestId && userId) checkAttempts();
  }, [mockTestId, userId]);

  // Fetch questions by language
  const fetchQuestionsByLanguage = async (lang) => {
    if (allQuestions[lang]?.length) {
      setQuestionData(allQuestions[lang][currentQuestion]);
      // setTitle(allQuestions[lang][currentQuestion]?.title || title);
      return;
    }

    setLoading(true);
    try {
      const res = await API.get("/mocktests/questionSet", {
        params: { mockTestId, userId, limit: 200, lang },
      });

      if (res.data?.questions?.length) {
        setAllQuestions((prev) => ({
          ...prev,
          [lang]: res.data.questions,
        }));

        setQuestionData(res.data.questions[currentQuestion] || null);
           if (lang === "en") setTitle(res.data.title || "");
        setQuestionsCount(res.data.totalQuestions);
        setPaletteStatus(Array(res.data.totalQuestions).fill("notVisited"));
        setTotalTime(res.data.duration * 60);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch default language on mount
  useEffect(() => {
    if (isReady && mockTestId) fetchQuestionsByLanguage(language);
  }, [isReady, mockTestId]);

  // Update question when language changes
  useEffect(() => {
    if (isReady && mockTestId) fetchQuestionsByLanguage(language);
  }, [language]);

  // Update current question
  useEffect(() => {
    if (allQuestions[language]?.[currentQuestion]) {
      setQuestionData(allQuestions[language][currentQuestion]);
    }
  }, [currentQuestion, language, allQuestions]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTotalTime((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (totalTime === 0 && !showResult) handleSubmit();
  }, [totalTime, showResult]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  const handleOptionSelect = (opt) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: opt }));
    setPaletteStatus((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = "attempted";
      return copy;
    });
  };

  const handleNext = () => setCurrentQuestion((prev) => Math.min(prev + 1, questionsCount - 1));
  const handlePrev = () => setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  const handleMark = () => {
    setPaletteStatus((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = "marked";
      return copy;
    });
  };
  const handleClear = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion];
      return copy;
    });
    setPaletteStatus((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = "notVisited";
      return copy;
    });
  };

  const saveAnswer = () => {
    setPaletteStatus((prev) => {
      const copy = [...prev];
      const selected = answers[currentQuestion];
      if (selected) copy[currentQuestion] = "attempted";
      else if (copy[currentQuestion] !== "marked") copy[currentQuestion] = "visitedNotAnswered";
      return copy;
    });
  };

  const handleSubmit = async () => {
    saveAnswer();
    const endTime = new Date().toISOString();

    try {
      const payload = {
        mockTestId,
        userId,
        startTime,
        endTime,
        answers: Array.from({ length: questionsCount }).map((_, qIdx) => {
          const question = allQuestions[language]?.[qIdx] || {};
          let status = paletteStatus[qIdx] || "notVisited";
          if (status === "visitedNotAnswered" || status === "notVisited") status = "notAttempted";

          return {
            questionId: question._id || null,
            selectedOption: answers[qIdx] || null,
            correctOption: question.correctOption || null,
            status,
          };
        }),
      };

      const res = await API.post("/mocktests/submitExam", payload);
      if (res.data.success) {
        const submitted = payload.answers;
        setResultData({
          attemptedCount: submitted.filter((a) => a.status === "attempted").length,
          notAttemptedCount: submitted.filter((a) => a.status === "notAttempted").length,
          markedCount: submitted.filter((a) => a.status === "marked").length,
          rightCount: submitted.filter((a) => a.selectedOption && a.selectedOption === a.correctOption).length,
          wrongCount: submitted.filter((a) => a.selectedOption && a.selectedOption !== a.correctOption).length,
        });
        setShowResult(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container">
          <div className="mockText-dashboard">
            {/* Result */}
            {showResult && resultData && (
              <div className="result-summary">
                <h5 className="text-sm mb-1">Exam Summary</h5>
                <p>Here’s a quick summary of your performance – attempted, skipped, marked, correct, and wrong answers are shown below in detail.</p>
                <table className="table table-sm table-striped mb-2 mt-2">
                  <tbody className="text-xxsm">
                    <tr><td>Attempted</td><td>{resultData.attemptedCount}</td></tr>
                    <tr><td>No Attempted</td><td>{resultData.notAttemptedCount}</td></tr>
                    <tr><td>Marked for Review</td><td>{resultData.markedCount}</td></tr>
                    <tr><td>Right Answers</td><td>{resultData.rightCount}</td></tr>
                    <tr><td>Wrong Answers</td><td>{resultData.wrongCount}</td></tr>
                  </tbody>
                </table>
                <span className="btn-invite color-two cursor-pointer" onClick={() => navigate(-1)}>Back</span>
              </div>
            )}

            {/* Exam Questions */}
            {!showResult && canAttempt && questionData && (
              <>
                <div className="row g-2 d-flex align-items-center">
                  <div className="col-12 col-md-7"><h5 className="text-md">{title}</h5></div>
                  <div className="col-6 col-md-3 text-md-center">
                    <p className="timer text-danger fw-medium text-xsm"><i className="fas fa-clock"></i> {formatTime(totalTime)}</p>
                  </div>
                  <div className="col-6 col-md-2 text-center">
                    <select className="form-select form-select-sm" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option value="en">English</option>
                      <option value="hi">हिन्दी</option>
                      <option value="bn">বাংলা</option>
                    </select>
                  </div>
                </div>
                <hr className="my-1" />

                <div className="row g-1 mb-2">
                  <div className="col-12">
                    <div className="card-body">
                      <h5 className="text-sm mb-0">{currentQuestion + 1}. {questionData.questionText}</h5>
                      <div className="options mt-1 text-xsm">
                        {questionData.options.map((opt) => (
                          <label key={opt.optionId} className="d-block">
                            <input type="radio" name="option" checked={answers[currentQuestion] === opt.optionId} onChange={() => handleOptionSelect(opt.optionId)} /> {opt.text}
                          </label>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        <button className="btn btn-sm bg-secondary text-white" onClick={handlePrev} disabled={currentQuestion === 0}><i className="fas fa-arrow-left"></i> Prev</button>
                        <button className="btn btn-sm bg-primary text-white" onClick={handleNext} disabled={currentQuestion === questionsCount - 1}>Next <i className="fas fa-arrow-right"></i></button>
                      </div>

                      <div className="row mt-2 d-flex justify-content-between">
                        <div className="col-6">
                          <button className="btn btn-sm btn-warning me-1 text-xxsm" onClick={handleMark}><i className="fas fa-flag"></i> Mark for Review</button>
                          <button className="mt-1 mt-md-0 btn btn-sm btn-danger text-xxsm" onClick={handleClear}><i className="fas fa-times-circle"></i> Clear Answer</button>
                        </div>
                        <div className="col-6 text-end">
                          <button className="btn btn-sm btn-success text-xxsm" onClick={handleSubmit}><i className="fas fa-check"></i> Submit Exam</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card-body">
                      <h6>Question Palette</h6>
                      <div className="question-palette d-flex flex-wrap gap-1">
                        {paletteStatus.map((status, idx) => {
                          let btnClass = "notVisited";
                          if (status === "attempted") btnClass = "btn-success";
                          else if (status === "visitedNotAnswered") btnClass = "btn-danger";
                          else if (status === "marked") btnClass = "btn-warning";

                          return (
                            <button key={idx} className={`btn btn-sm ${btnClass}`} style={idx === currentQuestion ? { border: "1px solid #0b8a3aff" } : {}} onClick={() => setCurrentQuestion(idx)}>
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!loading && !canAttempt && (
              <div className="alert alert-warning border-0 text-xxsm text-center mt-3">{attemptMessage}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MockExamDashboard;
