import React, { useEffect, useState } from 'react'
import homeLanguageData from "../language/home.json";
import { useNavigate } from 'react-router-dom';



function ReferCard() {
const navigator = useNavigate();
    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "en";
        setLang(storedLang);
    }, []);
    const [lang, setLang] = useState("en");
    const trans = homeLanguageData[lang] || homeLanguageData["en"];
    return (
        <>
            <div className="refer-card text-sm bg-one color-white mt-4">
                <div className="row">
                    <div className="col-12 col-md-8">
                        <h5 className="text-sm">{trans.referHeading}</h5>
                        <p>{trans.referSubHeading}</p>
                    </div>
                    <div className="col-12 col-md-4 text-md-end pt-2">
                        <button className="alert alert-light text-primary mb-0 text-xxsm" onClick={() => navigator('/refer')}>{trans.referButtonText}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReferCard