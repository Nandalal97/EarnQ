// Answer Analysis Page using ChatGPT, Bootstrap, and React Icons
import React, { useState, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';

function AnswerAnalysis() {
  const MAX_QUESTIONS_PER_MONTH = 20;
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(MAX_QUESTIONS_PER_MONTH);
  useEffect(() => {
    const used = parseInt(localStorage.getItem('usedAnalysis') || '0', 10);
    setRemainingQuestions(MAX_QUESTIONS_PER_MONTH - used);
  }, []);
  const handleAnalyze = () => {
    if (!question.trim() || !userAnswer.trim() || remainingQuestions <= 0) return;
    const used = parseInt(localStorage.getItem('usedAnalysis') || '0', 10);
    localStorage.setItem('usedAnalysis', (used + 1).toString());
    setRemainingQuestions(MAX_QUESTIONS_PER_MONTH - (used + 1));
    setShowAnalysis(true);
    setAnalysis('Analyzing...');
    // Simulated ChatGPT API call
    setTimeout(() => {
      setAnalysis(`Analysis of your answer to: "${question}"

    Your Answer: "${userAnswer}"

    ChatGPT's Feedback:
    - This is a simulated analysis.
    - In real use, integrate OpenAI API to get intelligent feedback and improvement tips.`);
        }, 2000);
    };

  return (
    <>
      <div className="page-wrapper">
        <AdsTop />
        <div className="content-row">
          <main className="app-container">
            <div className='d-flex justify-content-between'>
              <h5 className="m2-4 text-lg">Answer Analysis</h5>
              <p className='text-sm fw-bold color-two'>Left: {remainingQuestions}</p>
            </div>
            <p>You can ask up to 20 questions per month. Use them wisely to improve your learning!</p>

            <div className="mb-3 mt-2">
              <textarea
                className="form-control"
                rows="2"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here"
              ></textarea>
            </div>

            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer here"
              ></textarea>
            </div>

            <button
              className="btn btn-primary mb-4"
              onClick={handleAnalyze}
              disabled={remainingQuestions <= 0}
            >
              <FaRobot className="me-2" />
              Analyze with ChatGPT
            </button>

            {showAnalysis && (
              <div className="card">
                <div className="card-body p-0">
                  <textarea
                    className="form-control"
                    rows="10"
                    value={analysis}
                    readOnly
                  ></textarea>
                </div>
              </div>
            )}
          </main>
        </div>
        <AdsButtom />
      </div>
    </>
  );
}

export default AnswerAnalysis;
