import React, { useEffect, useState, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import AdsTop from "../components/AdsTop";
import AdsButtom from "../components/AdsButtom";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import homeLanguageData from "../language/home.json";
import talentSearch from '../assets/talent_search.png'
import { useCheckPremium } from "../utils/useCheckPremium";

import homeBannerImg from "../assets/hom-banner.gif"
import ContestSlider from "../components/contestSlider";
import WinnerToast from "../components/WinnerToast";

import caimage from '../assets/daily-monthly-yearly-currrent-affairs.png'
import RelatedBooks from "../components/relatedBooks";
import ReferCard from "../components/referCard";

function Home() {
    useCheckPremium()
    const [lang, setLang] = useState("en");
    const navigator = useNavigate();
    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "en";
        setLang(storedLang);
    }, []);
    const trans = homeLanguageData[lang] || homeLanguageData["en"];


    const handelCllick = () => {
        navigator('/current-affairs')
    }

    const menuItems = [
        { name: "Quiz", link: "/quiz" , bgColor:'alert-info'},
        { name: "Contest", link: "/contest",bgColor:'alert-primary' },
        { name: "CA", link: "/current-affairs", bgColor:'alert-success' },
        { name: "Practices", link: "/subjects",bgColor:'alert-warning' },
        { name: "Books", link: "/books", bgColor:'alert-info' },
        { name: "Mock Test", link: "/mock-test", bgColor:'alert-danger' },

    ];

    const handleTalentSearchBanner=()=>{
        navigator('/talent')
    }

    return (
        <>
            <div className="page-wrapper" id="page-wrapper">
                <WinnerToast />
                <div className="content-row">
                    <main className="app-container pb-0">

                        {/* <div className="mb-4">
                            <div className="d-flex align-items-center justify-content-between home-top-banner">
                                <div className="flex-grow-1 pe-3">
                                    <h1 className="text-xlg">{trans.homeHeading}</h1>
                                    <p>{trans.homeSubHeading}</p>
                                    <a href="#" className="btn btn-dark mt-3">Join Now</a>
                                </div>


                                <div className="flex-shrink-0">
                                    <img className="img-fluid home-banner-img" src={homeBannerImg} alt="Happy Winner" />
                                </div>

                            </div>
                        </div> */}
                        {/* <img className="" src={talentSearch} alt="" /> */}

                         <div className="features-card mt-0">
                            <div className="cursor-pointer" onClick={handleTalentSearchBanner}>
                                <img className="img-fluid homeSilderBanner rounded" src={talentSearch} alt="talengt Search" />
                            </div>
                        </div>
                        <div className="my-2 mb-4">
                            <div className="row g-2">

                                {menuItems.map((item, indx) => (
                                    <div className="col-4 text-sm col-md-4" key={item.indx}>
                                    <Link to={item.link}>
                                        <div class={`stats-box text-xsm mb-0 py-2 alert border-0 ${item.bgColor}`}>
                                            <div class="fw-semibold text-left cursor-pointer">
                                                <span  className="text-dark"> {item.name} </span>
                                            </div>
                                        </div>
                                        </Link>
                                    </div>
                                ))}

                            </div>
                        </div>

                        <ContestSlider />
                        {/* Curent afffairs Banner */}

                        <div className="features-card mt-0">
                            <div className="cursor-pointer" onClick={handelCllick}>
                                <img className="img-fluid rounded" src={caimage} alt="Current Affairs" />
                            </div>
                        </div>

                        <div className="features-card text-left mt-3">
                            <div>
                                <h5 className="text-md pb-0 mb-0 color-two">{trans.featuresHeading}</h5>
                                <small>{trans.featuresSubHeading}</small>
                            </div>
                            <div className="row g-1 mb-3 mt-2">
                                <div className="col-12 col-md-6 cursor-pointer" onClick={() => navigator('/qa')}>
                                    <div className="alert alert-primary mb-1 border-0">
                                        <div className="fw-semibold text-sm">{trans.qaChartHeadding}</div>
                                        <div className="value text-xxsm">{trans.qaChartSubHeadding}</div>
                                    </div>
                                </div>
                                {/* <div className="col-12 col-md-6 cursor-pointer" onClick={() => navigator('/study-notes')}>
                                <div className="alert alert-success mb-1 border-0">
                                    <div className="fw-semibold">{trans.smartNoteHeading}</div>
                                    <div className="value">{trans.smartNoteSubHeading}</div>
                                </div>
                            </div> */}
                                <div className="col-12 col-md-6 cursor-pointer" onClick={() => navigator('/answer-analysis')}>
                                    <div className="alert alert-danger mb-1 border-0">
                                        <div className="fw-semibold text-sm">{trans.answerAnalysisHeading}</div>
                                        <div className="value text-xxsm">{trans.answerAnalysisSubHeading}</div>
                                    </div>
                                </div>

                                {/* <div className="col-12 col-md-6 cursor-pointer">
                                    <div className="alert alert-warning mb-1 border-0">
                                        <div className="fw-semibold">Interview prep</div>
                                        <div className="value">Prepare for competitive exams</div>
                                    </div>
                                </div> */}

                                {/* <div className="col-12 col-md-6 cursor-pointer">
                                    <div className="alert alert-info mb-1 border-0">
                                        <div className="fw-semibold">{trans.learnByClassHeading}</div>
                                        <div className="value">{trans.learnByClassSubHeading}</div>
                                    </div>
                                </div> */}

                            </div>
                        </div>

                        <div className="mt-2">
                            <RelatedBooks />
                        </div>

                        <div>
                            <ReferCard />
                        </div>
                        <div>
                            <AdsButtom />
                        </div>

                    </main>
                </div>

            </div>
        </>
    );
}

export default Home;
