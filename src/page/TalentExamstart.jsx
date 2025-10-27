import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../utils/axios";

function TalentExamstart() {
  const location = useLocation();
  const navigate = useNavigate();

  const [contest, setContest] = useState(location.state?.contest || null);
  const [slotId, setSlotId] = useState(location.state?.slotId || null);
  const [bookingId, setBookingId] = useState(location.state?.bookingId || null);
  const [startTime, setStartTime] = useState(location.state?.startTime || null);
  const [endTime, setEndTime] = useState(location.state?.endTime || null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [language, setLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({}); // ✅ Ref to always store latest answers
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const questionsCacheRef = useRef({});
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [examCheckDone, setExamCheckDone] = useState(false);

  const [examTaken, setExamTaken] = useState(false);
  useEffect(() => {
    if (!contest) {
      navigate('/404');
      return;
    }
    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);

    // ❌ if before start or after end → 404
    if (now < startDate || now > endDate) {
      navigate('/404');
    }
  }, [contest, navigate]);

  useEffect(() => {
    const checkExamTaken = async () => {
      if (!bookingId) {
        setExamCheckDone(true);
        return;
      }
      try {
        const res = await API.get(`/talent/exam/check?bookingId=${bookingId}`);
        if (res.data.examTaken) {
          setExamTaken(true);
          document.exitFullscreen?.();
          window.onbeforeunload = null;
          setSubmitted(true);
          setQuestions([]);
          setRemainingTime(null);

          setTimeout(() => {
            alert("⚠️ You have already taken this exam!");
            navigate("/talent");
          }, 100);
        }
      } catch (err) {
        console.error("Error checking exam status:", err);
      } finally {
        setExamCheckDone(true); // ✅ mark check complete
      }
    };

    checkExamTaken();
  }, [bookingId, navigate]);





  // Keep ref updated
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Fullscreen setup + auto-submit on exit
  const handleSubmitRef = useRef();

  handleSubmitRef.current = async (auto = false) => {
    if (submitted) return;
    if (!bookingId) return alert("Cannot submit: missing booking ID");
    if (!questions.length) return alert("Cannot submit: questions not loaded");

    setSubmitted(true);

    const allAnswers = questions.map((q) => {
      const ans = answersRef.current[q._id] || {};
      return {
        questionId: q._id,
        selectedOptionIndex:
          ans.answer !== undefined && ans.answer !== null ? ans.answer : null,
        textAnswer: ans.textAnswer || "",
      };
    });

    const payload = { bookingId, answers: allAnswers };

    try {
      const res = await API.post("/talent/exam/submit", payload);
      if (res.data.success) {
        if (auto) setAutoSubmitted(true);
        localStorage.removeItem("talentExamState");

        const resultData = {
          contest,
          totalQuestions: questions.length,
          summary: (() => {
            const all = Object.values(answersRef.current);
            let attended = 0,
              markReview = 0,
              skipped = 0;
            all.forEach((a) => {
              if (a?.review) markReview++;
              else if (a?.answer != null) attended++;
              else if (a?.viewed && a?.answer == null && !a?.review) skipped++;
            });
            const notVisited = questions.length - Object.keys(answersRef.current).length;
            return { attended, skipped, markReview, notVisited };
          })(),
          autoSubmitted: auto,
          attemptedCount: res.data.attemptedCount,
          skippedCount: res.data.skippedCount,
        };
        navigate("/talent/result", { state: resultData });
      } else {
        alert(res.data.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error submitting exam:", err.response?.data || err);
      alert(err.response?.data?.message || "Server Error while submitting exam.");
    }
  };

  // Fullscreen + tab detection
  useEffect(() => {
    const enterFullScreen = () => {
      if (!examCheckDone) return;
      if (examTaken) return;
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && !submitted) {
        alert("Full-screen exited! Your exam will be auto-submitted.");
        handleSubmitRef.current(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !submitted) {
        alert("You switched tab! Your exam will be auto-submitted.");
        handleSubmitRef.current(true);
      }
    };

    enterFullScreen();
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [submitted, examCheckDone, examTaken]);

  // Restore saved state
  useEffect(() => {
    if (!location.state) {
      const saved = localStorage.getItem("talentExamState");
      if (saved) {
        const { contest: savedContest, slotId: savedSlotId } = JSON.parse(saved);
        setContest(savedContest);
        setSlotId(savedSlotId);
      } else {
        navigate("/404");
      }
    } else {
      localStorage.setItem(
        "talentExamState",
        JSON.stringify({
          contest: location.state.contest,
          slotId: location.state.slotId,
        })
      );
      setContest(location.state.contest);
      setSlotId(location.state.slotId);
    }
  }, [location.state, navigate]);

  // Load questions
  useEffect(() => {
    if (!examCheckDone) return;
    if (examTaken) return;
    if (!contest || !slotId) return;

    const fetchQuestions = async () => {
      if (questionsCacheRef.current[language]) {
        setQuestions(questionsCacheRef.current[language]);
        return;
      }
      try {
        const res = await API.get("/talent/questions", {
          params: { contestId: contest._id, slotId, lang: language, page: 1, limit: 200 },
        });
        questionsCacheRef.current[language] = res.data.questions;
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [contest, slotId, language, examCheckDone, examTaken]);

  // Timer setup
  useEffect(() => {
    if (!examCheckDone) return;
    if (examTaken) return;
    if (!startTime || !endTime || submitted) return;
    if (!bookingId || questions.length === 0) return;

    const parseTime = (timeStr) => {
      const today = new Date();
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      const date = new Date(today);
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      return date;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);
    if (end < start) end.setDate(end.getDate() + 1);

    
    const updateTimer = () => {
      const now = new Date();
      const remaining = end - now;

      if (remaining <= 0) {
        setRemainingTime(0);
        clearInterval(timer);
        alert("⏰ Time’s up! Your exam has been auto-submitted.");
        if (bookingId && questions.length > 0) handleSubmitRef.current(true);
        else console.error("Cannot auto-submit: data not ready");
        return;
      }

      setRemainingTime(remaining);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [startTime, endTime, submitted, bookingId, questions, examCheckDone, examTaken]);

  if (examTaken) {
    return (
      <div className="page-wrapper text-center py-5">
        <h5 className="text-danger">⚠️ You have already taken this exam!</h5>
      </div>
    );
  }

  if (!contest) return null;
  if (!questions.length) return <div>Loading questions...</div>;

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentPage - 1];

  const formatTime = (ms) => {
    if (ms === null) return "--:--";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Answer handling
  const handleAnswer = (idx) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: { ...prev[currentQuestion._id], answer: idx, review: false },
    }));
  };

  const handleMarkReview = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: { ...prev[currentQuestion._id], review: !prev[currentQuestion._id]?.review },
    }));
  };

  const handleClear = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: { ...prev[currentQuestion._id], answer: null, review: false },
    }));
  };

  const handleNext = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        ...prev[currentQuestion._id],
        viewed: prev[currentQuestion._id]?.answer == null ? true : prev[currentQuestion._id]?.viewed,
      },
    }));
    if (currentPage < totalQuestions) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        ...prev[currentQuestion._id],
        viewed: prev[currentQuestion._id]?.answer == null ? true : prev[currentQuestion._id]?.viewed,
      },
    }));
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getButtonColor = (qId) => {
    const a = answers[qId];
    if (!a) return { backgroundColor: "#dededeff", color: "#000000" };
    if (a.review) return { backgroundColor: "#e8b21fff", color: "#ffffff" };
    if (a.answer != null) return { backgroundColor: "#28a745", color: "#ffffff" };
    if (a.answer == null && a.viewed) return { backgroundColor: "#dc3545", color: "#ffffff" };
    return { backgroundColor: "#ffffff", color: "#000000" };
  };

  const summary = (() => {
    const all = Object.values(answers);
    let attended = 0,
      markReview = 0,
      skipped = 0;
    all.forEach((a) => {
      if (a?.review) markReview++;
      else if (a?.answer != null) attended++;
      else if (a?.viewed && a?.answer == null && !a?.review) skipped++;
    });
    const notVisited = totalQuestions - Object.keys(answers).length;
    return { attended, skipped, markReview, notVisited };
  })();

  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container">
          <div className="exam-section">

            <>
              <div className="contestDetails">
                <div className="d-flex justify-content-between align-items-center">
                  <h6>{contest.title}</h6>
                
                  <div className="text-center mb-3">
                  <select
                    className="w-auto form-select form-select-sm"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="bn">বাংলা</option>
                  </select>
                </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <p>
                    <span className="fw-semibold">Dur: </span>
                    {contest.duration} Min.
                  </p>
                  <p>
                      <span className="text-danger fw-semibold">Time Left: {formatTime(remainingTime)}</span>
                  </p>
                </div>

                <hr className="py-1 my-2 mb-1" />
                
              </div>

              <div className="question-box mb-3">
                <h5 className="text-sm">
                  Q{currentPage}: {currentQuestion.questionText}
                </h5>
                <div className="options mt-2 d-grid gap-1 text-xxsm">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      className={`btn btn-outline-primary text-xsm text-start ${answers[currentQuestion._id]?.answer === idx ? "active" : ""
                        }`}
                      onClick={() => handleAnswer(idx)}
                    >
                      {opt.optionText}
                    </button>
                  ))}
                </div>
              </div>

              <div className="controls mb-2">
                <div className="d-flex justify-content-between mt-2">
                  <button className="btn btn-secondary me-2 text-xxsm"
                    onClick={handlePrev} disabled={currentPage === 1}><i className="fas fa-arrow-left"></i>  Prev
                  </button>

                  <button className="btn btn-primary me-2 text-xxsm"
                    onClick={handleNext} disabled={currentPage === totalQuestions}> Next <i className="fas fa-arrow-right"></i></button>

                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div>
                    <button className="btn btn-warning me-2 text-xxsm" onClick={handleMarkReview}>
                     <i className="fas fa-flag"></i> {answers[currentQuestion._id]?.review ? "Unmark Review" : "Mark Review"}
                    </button>
                    <button className="btn btn-danger me-2 text-xxsm" onClick={handleClear}>
                     <i className="fas fa-times-circle"></i> Clear
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-success text-xxsm"
                      onClick={() => handleSubmitRef.current(false)}
                    >
                     <i className="fas fa-check"></i> Submit
                    </button>
                  </div>

                </div>

                {/* {currentPage < totalQuestions ? (
                    <button className="btn btn-primary text-xxsm" onClick={handleNext}>
                      Next<i className="fas fa-arrow-right"></i>
                    </button>
                  ) : (
                    <button className="btn btn-success text-xxsm" onClick={() => handleSubmitRef.current(false)}>Submit</button>

                  )} */}


              </div>

              <div className="question-palette d-flex mb-3">
                {questions.map((q, idx) => (
                  <button
                    key={q._id}
                    className="btn btn-sm me-1 mb-1"
                    style={{ ...getButtonColor(q._id) }}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </>

            <div className="alert alert-warning text-center mt-2 text-xxsm border-0">
              <span><strong>Note:</strong> Contest in progress. Don’t switch tabs or closing page or exit fullscreen — it will auto-submit and exit the contest.</span>
            </div>

          </div>

        </main>
      </div>

      <style jsx>{`
        .options button.active {
          background-color: #4caf50;
          color: #fff;
          border: 1px solid #4caf50;
        }
      `}</style>
    </div>
  );
}

export default TalentExamstart;
