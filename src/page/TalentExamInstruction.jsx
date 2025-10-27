import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import TalentSearchExamInstructions from '../components/TaletSeachExamInstructions';

function TalentExamInstruction() {
  const location = useLocation();
  const navigate = useNavigate();
  const contest = location.state;
  const userData = decodeToken(getAuthToken());
  const userId = userData?.id;
  const [statusMsg, setStatusMsg] = useState("Checking eligibility...");
  const [countdown, setCountdown] = useState(null);
  const [slotId, setSlotId] = useState();
  const [startTime, setStartTime] = useState();
  const [bookingId, setBookingId] = useState();
  const [endTime, setEndTime] = useState();
  const [canStartExam, setCanStartExam] = useState(false);
  const [eligible, setEligible] = useState(false); // slot exists or not

  const [examTaken, setExamTaken] = useState(false); 

  useEffect(() => {
    if (!contest) return;

    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);

    if (now < startDate || now > endDate) navigate('/404');
  }, [contest, navigate]);


  useEffect(() => {
    let interval;

    const checkEligibility = async () => {
      try {
        const res = await API.get(`/talent/eligibility/${userId}`);
        if (res.data.status !== 'ok') {
          setStatusMsg(res.data.message || "You are not eligible for this contest.");
          setEligible(false);
          return;
        }
        setSlotId(res.data.slotId)
        setStartTime(res.data.startTime)
        setEndTime(res.data.endTime)
        setBookingId(res.data.bookingId)
        setEligible(true); // slot exists
        
        const { canStartIn, startTime, endTime } = res.data;

        if (canStartIn > 0) {
          setStatusMsg(`⏰ Exam will start soon (${startTime})`);

          // countdown timer for instruction page
          let remaining = canStartIn; // in seconds
          interval = setInterval(() => {
            if (remaining <= 0) {
              clearInterval(interval);
              setCountdown(null);
              setCanStartExam(true);
              setStatusMsg(`✅ Your exam is ongoing (${startTime} – ${endTime})`);
            } else {
              const mins = Math.floor(remaining / 60);
              const secs = remaining % 60;
              setCountdown(`${mins}m ${secs}s`);

              // enable start button 1 min before
              // if (remaining <= 60) setCanStartExam(true);
            }
            remaining -= 1;
          }, 1000);
        } else {
          // slot active → can start immediately
          setCanStartExam(true);
          setCountdown(null);
          setStatusMsg(`✅ Your exam is ongoing (${startTime} – ${endTime})`);
        }

         // ✅ Check if exam already taken
        const checkTakenRes = await API.get(`/talent/exam/check?bookingId=${res.data.bookingId}`);
        if (checkTakenRes.data.examTaken) {
          setExamTaken(true);
          setStatusMsg("⚠️ You have already taken this exam.");
          setCanStartExam(false); // disable start button
          return;
        }



      } catch (error) {
        console.error("Eligibility check failed:", error);
        setStatusMsg("You are not eligible for this contest.");
        setEligible(false);
      }
    };

    if (userId) checkEligibility();
    return () => clearInterval(interval);
  }, [userId]);

  if (!contest) return null;

  // no slot → show status message only
  if (!eligible) {
    return (
      <div className="page-wrapper text-center py-5">
        <h5 className='text-danger text-sm'>{statusMsg}</h5>
      </div>
    );
  }


  const handleExamStartBtn = async () => {
    if (examTaken) return alert("You have already taken this exam!");

    try {
      navigate("/talent/exam", { state: { contest, bookingId, slotId, startTime, endTime } });
    } catch (err) {
      console.error("Error starting exam:", err);
      alert("Something went wrong while starting the exam.");
    }
  };

  // ✅ slot exists → show instruction page with countdown
  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container">
          <div className="contestDetails">
            <div className='d-flex justify-content-between'>
              <h6>{contest.title}</h6>
              {countdown && <span className='text-danger'>{countdown}</span>}
            </div>

            <div className='d-flex justify-content-between align-items-center'>
              <p><span className='fw-semibold'>Dur: </span>{contest.duration} Min.</p>
              <p><span className='fw-semibold'>Total Ques:</span> 100</p>
            </div>
            <hr className='py-1 m2-2 mb-1' />
            <div>
              <TalentSearchExamInstructions contest={contest} />
            </div>
          </div>

        
          <button
  className={`btn btn-sm mt-3 text-xsm rounded pb-1 ${!canStartExam || examTaken ? "btn-secondary" : "btn-success"}`}
  disabled={!canStartExam || examTaken}
  onClick={handleExamStartBtn}
>
  Start Exam
</button>


        </main>
      </div>
    </div>
  );
}

export default TalentExamInstruction;
