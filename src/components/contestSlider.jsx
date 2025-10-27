import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import homeLanguageData from "../language/home.json";
import { Link, useNavigate } from "react-router-dom";

import API from "../utils/axios";
import { getAuthToken } from "../utils/getAuthToken";

function ContestSlider() {
  const [lang, setLang] = useState("en");
  const [contests, setContests] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, []);

  const trans = homeLanguageData[lang] || homeLanguageData["en"];

  useEffect(() => {
    const getContestGroupData = async () => {
      try {
        const token = getAuthToken();
        const res = await API.get("/contest/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContests(res.data.data);
      } catch (error) {
        console.error("Failed to fetch contest groups:", error);
      }
    };

    getContestGroupData();
  }, []);

  useEffect(() => {
    if (contests.length === 0) return;

    const interval = setInterval(() => {
      const updated = {};
      const now = new Date();

      contests.forEach((contest) => {
        const startTime = new Date(contest.startTime);
        const endTime = new Date(startTime.getTime() + contest.duration * 60000);

        if (now < startTime) {
          const diff = startTime - now;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          updated[contest._id] = {
            text: `${hours.toString().padStart(2, "0")} : ${minutes
              .toString()
              .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`,
            isClosed: false,
            status: "countdown",
          };
        } else if (now >= startTime && now <= endTime) {
          updated[contest._id] = {
            text: "Running",
            isClosed: false,
            status: "running",
          };
        } else {
          updated[contest._id] = {
            text: "Closed",
            isClosed: true,
            status: "closed",
          };
        }
      });

      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [contests]);

  const formatDateTime = useCallback((isoString) => {
    const options = {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(isoString).toLocaleString("en-IN", options);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const languageMap = {
    en: "English",
    hi: "हिंदी",
    bn: "বাংলা",
    mr: "मराठी",
    ta: "தமிழ்",
    te: "తెలుగు",
    gu: "ગુજરાતી",
    kn: "ಕನ್ನಡ",
    or: "ଓଡ଼ିଆ",
    pa: "ਪੰਜਾਬੀ",
  };

  return (
    <div className="contest-card p-0">
      <div className="d-flex justify-content-between pb-2">
        <h5 className="mb-0 text-md color-two">{trans.cotestHeading}</h5>
        <span
          className="text-xxsm seeAll cursor-pointer color-two"
          onClick={() => navigate("/contest")}
        >
          See All
        </span>
      </div>

      <p>{trans.contestSubText}</p>

      <div className="mt-3">
        {contests.length === 0 ? (
          <p className="text-muted text-center mt-4">
            No upcoming contests available.
          </p>
        ) : (
          <Slider {...sliderSettings}>
            {contests.map((contest) => {
              const countdown = countdowns[contest._id];
              const status = countdown?.status;
              const textClass =
                status === "running" ? "text-success" : "text-danger";

              return (
                <div key={contest._id} className="px-1">
                  <div className="quiz-card border-0 p-2 alert alert-primary">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <p className="p-0 m-0">
                          <span className="exam-date">
                            {formatDateTime(contest.startTime)}
                          </span>
                        </p>
                        <p className="p-0 m-0">
                          <span className={`countdown ${textClass}`}>
                            {countdown?.text || "-- : --"}
                          </span>
                        </p>
                      </div>

                      <div className="exmal-question-card">
                        <p className="mb-0 questions-Title">{contest.title}</p>
                        <small className="text-secondary">
                          Language -{" "}
                          {languageMap[contest.language] ||
                            contest.language}
                        </small>
                      </div>

                      <div className="d-flex justify-content-between mt-2 text-muted">
                        <small>
                          <strong>Time :</strong> {contest.duration} min
                        </small>
                        <small>
                          <strong>Ques :</strong> {contest.totalQuestions}
                        </small>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="text-warning d-flex align-items-center">
                          <i className="fas fa-trophy me-1 prize-icon"></i>
                          <small className="text-dark fw-bold">
                            Prize :
                            <strong className="text-dark ms-1 fw-medium">
                              ₹{contest.prizeAmount}
                            </strong>
                          </small>
                        </div>
                        <small>
                          Entry : <strong>₹{contest.entryFee}</strong>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        )}
      </div>
    </div>
  );
}

export default ContestSlider;
