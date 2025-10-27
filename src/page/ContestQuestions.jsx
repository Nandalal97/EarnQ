import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/axios';

import RenderRichText from '../components/RenderRichText';

import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import MultiLangContestInstructions from '../components/MultiLangContestInstructions';

const ExamPage = () => {
  const [questions, setQuestions] = useState([]);
  const [contestId, setContestId] = useState(null);
  const [current, setCurrent] = useState(() => JSON.parse(localStorage.getItem('exam-current')) || 0);
  const [selectedOptions, setSelectedOptions] = useState(() => JSON.parse(localStorage.getItem('exam-selectedOptions')) || {});
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const intervalRef = useRef(null);
  const selectedRef = useRef(selectedOptions);
  const location = useLocation();
  const contest = location.state?.contest;
  const navigate = useNavigate()

  useEffect(() => {
    if (contest?._id) setContestId(contest._id);

    if (!contest?._id) {
      navigate('/contest');
    }
  }, [contest]);
  // check submission
  useEffect(() => {
    const checkSubmissionStatus = async () => {
      try {
        const token = getAuthToken();
        const userData = decodeToken(token);
        const res = await API.get(`/contest/userContestData?contestId=${contest._id}&userId=${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // console.log(res.data.data.isSubmit);
        if (res.data.data.isSubmit === true) {
          Swal.fire({ title: 'Already Submitted!', text: 'You have already submitted this contest.', icon: 'info', customClass: { popup: 'small-alert' }, backdrop: true, allowOutsideClick: false });
          navigate('/contest');
        }
      } catch (err) {
        console.error('Error checking submission status:', err);
      }
    };
    if (contest?._id) {
      checkSubmissionStatus();
    }
  }, [contest]);

  useEffect(() => {
    if (!contestId) return;

    const fetchQuestions = async () => {
      try {

        const res = await API.get(`/contest/questionSet/${contest.questionSetId}/questions?page=1&limit=1000`);
        const data = res.data.data;
        setQuestions(data);

        const savedTotal = JSON.parse(localStorage.getItem('exam-totalTimeLeft'));
        if (!savedTotal) {
          const totalInSeconds = (contest.duration && contest.duration > 0 ? contest.duration : 30) * 60;

          setTotalTimeLeft(totalInSeconds);
        } else {
          setTotalTimeLeft(savedTotal);
        }

      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };
    fetchQuestions();
  }, [contestId]);

  useEffect(() => {
    selectedRef.current = selectedOptions;
    localStorage.setItem('exam-selectedOptions', JSON.stringify(selectedOptions));
    localStorage.setItem('exam-totalTimeLeft', JSON.stringify(totalTimeLeft));
    localStorage.setItem('exam-current', JSON.stringify(current));
  }, [selectedOptions, totalTimeLeft, current]);

  useEffect(() => {
    if (!started || isSubmitted || questions.length === 0) return;
    intervalRef.current = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleSubmit(selectedRef.current, 'timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [started, isSubmitted, questions]);

  useEffect(() => {
    if (!started || isSubmitted) return;
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        handleSubmit(selectedRef.current, 'fullscreen-exit');
      }
    };
    document.addEventListener('fullscreenchange', exitHandler);
    return () => document.removeEventListener('fullscreenchange', exitHandler);
  }, [started, isSubmitted]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && started && !isSubmitted) {
        handleSubmit(selectedRef.current, 'tab');
      }
    };
    const blockInspect = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
      }
    };
    const blockContextMenu = (e) => e.preventDefault();
    const blockCopyPaste = (e) => e.preventDefault();
    document.addEventListener('keydown', blockInspect);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('copy', blockCopyPaste);
    document.addEventListener('cut', blockCopyPaste);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('keydown', blockInspect);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('copy', blockCopyPaste);
      document.removeEventListener('cut', blockCopyPaste);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isSubmitted, started]);

  const handleStartExam = async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      setStarted(true);
    } catch (err) {
      Swal.fire('Error', 'Fullscreen not supported or denied', 'error');
    }
  };

  const handleOptionSelect = (index) => {
    setSelectedOptions(prev => ({ ...prev, [current]: index }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handlePageClick = (index) => {
    setCurrent(index);
  };
  const hasSubmittedRef = useRef(false);

  const handleSubmit = async (finalAnswers = selectedOptions, reason = 'manual') => {
    if (hasSubmittedRef.current) return; // 🛑 Prevent second call
    hasSubmittedRef.current = true;
    let correct = 0, wrong = 0, skipped = 0;
    questions.forEach((q, i) => {
      const ans = finalAnswers[i];
      if (ans === undefined || ans === null) skipped++;
      else if (ans === q.correctAnswer) correct++;
      else wrong++;
    });
    const answered = correct + wrong;
    const score = correct - wrong * 0.33;

    // console.log('contest id', contest._id);

    const token = getAuthToken();
    const userData = decodeToken(token);

    // console.log(userData.id);

    try {
      const res = await API.post('/contest/submit', {
        userId: userData.id,
        contestId: contest._id,
        totalAnswer: answered,
        correct: correct,
        wrong: wrong,
        skipped: skipped,
        score: score,
        answers: selectedOptions
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


    } catch (error) {
      console.log(error);

    }

    setIsSubmitted(true);

    setResult({ correct, wrong, skipped, answered, score: score.toFixed(2) });
    localStorage.removeItem('exam-selectedOptions');
    localStorage.removeItem('exam-totalTimeLeft');
    localStorage.removeItem('exam-current');
    clearInterval(intervalRef.current);
    document.exitFullscreen?.();
    const msg = reason === 'tab' ? 'Tab switch detected. Exam submitted.'
      : reason === 'timeout' ? 'Time over. Exam auto-submitted.'
        : reason === 'fullscreen-exit' ? 'Fullscreen exited. Exam submitted.'
          : 'Exam submitted successfully.';
    Swal.fire({ title: 'Submitted!', text: msg, icon: 'info', customClass: { popup: 'small-alert' }, backdrop: true, allowOutsideClick: false });
  };

  const confirmSubmit = () => {
    Swal.fire({
      title: 'Submit Contest?',
      text: 'Once submitted, you cannot change answers or rejoin.',
      icon: 'warning',
      iconColor: '#f39c12',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: '✅ Yes, Submit',
      cancelButtonText: '❌ Cancel',

      customClass: {
        popup: 'small-alert'
      },
      backdrop: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) handleSubmit();
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/contest');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  const handleBackBtn = () => {
    navigate('/contest');
  }

  // 🧭 Handle hiding topbar/bottom bar when fullscreen active
  useEffect(() => {
    const toggleBars = () => {
      if (document.fullscreenElement) {
        document.body.classList.add("exam-fullscreen");
      } else {
        document.body.classList.remove("exam-fullscreen");
      }
    };

    document.addEventListener("fullscreenchange", toggleBars);

    // Also handle initial mount or exam end
    toggleBars();

    return () => document.removeEventListener("fullscreenchange", toggleBars);
  }, []);


  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container">
          <div className="exam-container">
            {!started ? (
              <>
                <MultiLangContestInstructions contest={contest} />
                <div className='mt-3'>
                  <span className="exam-joinBtn py-2 cursor-pointer" onClick={handleStartExam}>
                    I’m Ready, Start Contest
                  </span>
                </div>
              </>
            ) : isSubmitted ? (
              <>
                <div className="quiz-card mt-3">
                  <div className="card-body">
                    <div className="text-center border-0 exam-result">
                      🎉 <strong className='text-lg text-success'>Your exam has been submitted successfully.</strong>
                      <p className='pt-2'>You cannot retake this contest. Results will be announced soon. Winners will be notified via the app or registered email/SMS </p>

                      <table className="table pt-2">
                        <thead>
                          {/* <tr><th colSpan={2}>Result</th></tr> */}
                        </thead>
                        <tbody>
                          <tr><td>Answered</td><td><strong>{result.answered}</strong> / {questions.length}</td></tr>
                          {/* <tr><td>Correct</td><td><strong>{result.correct}</strong></td></tr> */}
                          {/* <tr><td>Wrong</td><td><strong>{result.wrong}</strong></td></tr> */}
                          <tr><td>Skipped</td><td><strong>{result.skipped}</strong></td></tr>
                          {/* <tr><td>Score</td><td><strong>{result.score}</strong></td></tr> */}
                        </tbody>
                      </table>
                      <strong>Thank you for participating!</strong>
                    </div>
                  </div>

                  <span className='text-sm cursor-pointer' onClick={handleBackBtn}><i class="bi bi-arrow-left-short"></i> Back</span>
                </div>
              </>
            ) : (
              <>
                <div className='row'>
                  <div className="col-9 col-md-9">
                    <h6>{contest.title}</h6>
                  </div>
                  <div className="col-3 col-md-3">
                    <div className="text-end text-xsm">
                      ⏱<strong className='text-danger'>{Math.floor(totalTimeLeft / 60)}:{String(totalTimeLeft % 60).padStart(2, '0')}</strong>
                    </div>

                  </div>

                </div>

                <div className="quiz-card mt-3">
                  <div className="card-body">
                    {/* <h5>Q{current + 1}. {questions[current]?.questionText}</h5> */}
                    <h5 className='text-sm'>Q{current + 1}. <RenderRichText text={questions[current]?.questionText || ''} /></h5>
                    {questions[current]?.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(i)}
                        className={`btn text-xxsm w-100 mb-2 text-start ${selectedOptions[current] === i ? 'btn-primary' : 'btn-outline-secondary'}`}
                      >
                        <RenderRichText text={opt} />
                      </button>
                    ))}
                    <div className="d-flex justify-content-between mt-3">
                      <button className="btn btn-secondary btn-sm" onClick={handlePrev} disabled={current === 0}>⬅ Prev</button>
                      {current === questions.length - 1 ? (
                        <button className="btn btn-danger btn-sm" onClick={confirmSubmit}>Submit</button>
                      ) : (
                        <button className="btn btn-success btn-sm" onClick={handleNext}>Next ➡</button>
                      )}
                    </div>
                    <div className="mt-4">
                      {questions.map((_, i) => {
                        const isCurrent = current === i;
                        const answered = selectedOptions[i] !== undefined;
                        const btnClass = isCurrent
                          ? 'btn-primary'
                          : answered
                            ? 'btn-success'
                            : 'btn-outline-secondary';

                        return (
                          <button
                            key={i}
                            onClick={() => handlePageClick(i)}
                            className={`btn ${btnClass} me-1 pagination-btn`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>

                <div className="alert alert-warning text-center mt-2 text-xxsm border-0">
                  <span><strong>Note:</strong> Contest in progress. Don’t switch tabs or closing page or exit fullscreen — it will auto-submit and exit the contest.</span>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamPage;