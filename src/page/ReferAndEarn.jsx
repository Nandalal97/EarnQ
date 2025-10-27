import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import referLanguage from '../language/referPage.json'
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';

const ReferAndEarn = () => {
    // Language
    const defaultLang = localStorage.getItem('lang') || 'en';
    const [lang, setLang] = useState(defaultLang);
    const trans = referLanguage[lang] || referLanguage['en'];
    const [copied, setCopied] = useState(false);
    const [showReferBox, setShowReferBox] = useState(false);
    const [copiedLink, setCopiedLink] = useState(trans.copyLink);


    const authToken = getAuthToken();
    const userData = decodeToken(authToken);


    console.log('data', userData.referralCode);


    const referralCode = userData.referralCode;

    // const totalReferrals = 50000;
    // const totalCoins = 5012542520;
    // const referCode = 'ABC123';

    const shareLink = `https://earnq.in/signup?ref=${referralCode}`;
    // const shareText = `Hey! Join this awesome app and earn rewards. Use my referral code: ${referralCode}  ${shareLink}`;
    const shareText = `${trans.shareText} ${referralCode} or click Link ${shareLink}`
    const handleCopy = () => {
        navigator.clipboard.writeText(shareText)
            .then(() => {
                setCopiedLink(trans.copied);
                setTimeout(() => setCopiedLink(trans.copyLink), 1500);
                setTimeout(() => setShowReferBox(false), 1800);

            })
            .catch(err => {
                setCopiedLink(trans.copyFailed);
                setTimeout(() => setCopiedLink(trans.copyLink), 1500);
            });

    };
    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };




    return (
        <>
            <div className="page-wrapper">
                <AdsTop />
                <div className="content-row">
                    <main className="app-container">
                        <h5 className="text-center text-md mb-3">
                            <i className="fas fa-gift me-2"></i> {trans.title}
                        </h5>
                        <p className="text-center text-sm mb-1">{trans.yourReferralCode}</p>
                        <div className="position-relative d-flex justify-content-center mb-4">
                            <div className="ref-code text-sm" role="ref-code" onClick={handleCopyCode} >
                                {referralCode} <i className="far fa-copy"></i>
                            </div>
                            {copied && (
                                <div className="position-absolute" style={{ top: '80%', marginTop: '5px' }}>
                                    {trans.copied}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="text-center my-4">
                                <div className="color-white text-sm bg-one btn-invite mb-3 cursor-pointer" onClick={() => setShowReferBox(!showReferBox)}>
                                    <i className="fas fa-share-alt"></i> Refer & Earn
                                </div>


                                {showReferBox && (
                                    <div className="card p-3 pb-1 border-0 mx-auto" style={{ maxWidth: '600px' }}>
                                        <h5 className="mb-2 text-sm">{trans.shareAndEarnTitle}</h5>
                                        <textarea className="form-control text-xsm mb-3" rows="3" readOnly value={shareText}></textarea>
                                        {copiedLink && (
                                            <div className='d-flex justify-content-center'>
                                                <div className="color-white btn-invite bg-two text-sm" onClick={handleCopy}>
                                                    <i className={copiedLink === 'Copied' ? 'fas fa-check-circle' : 'far fa-copy'}></i> {copiedLink}
                                                </div>
                                            </div>
                                        )}

                                        <div className='gap-2 d-flex justify-content-center mt-2'>
                                            <span className='h3 cursor-pointer'><i class="fab fa-whatsapp-square text-success"></i></span>
                                            <span className='h3 cursor-pointer'><i class="fab fa-facebook text-primary"></i></span>
                                            <span className='h3 cursor-pointer'><i class="fab fa-instagram-square text-danger"></i></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div className="row g-2 mb-3">
                        <div className="col-6">
                            <div className="stats-box">
                                <div className="fw-semibold">{trans.refer}</div>
                                <div className="value">{totalReferrals}</div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="stats-box">
                                <div className="fw-semibold">{trans.coinsEarned}</div>
                                <div className="value">{totalCoins}</div>
                            </div>
                        </div>
                    </div> */}
                        

                        <div className="instructions-card">
                            <h6 className='text-sm'>{trans.rulesTitle}:</h6>
                            <ul className="ps-3 text-xsm">
                                {trans.rules.map((rules, index) => (
                                    <li key={index}>{rules}</li>

                                ))}
                                {/* <ul>
                                <li><strong>You</strong> earn <strong>100 Coins</strong>.</li>
                                <li><strong>Your friend</strong> earns an extra <strong>100 Coins</strong> (Total 150).</li>
                            </ul> */}
                            </ul>
                            {/* <ul className="ps-3">
                            <li>Share your referral code or link with others.</li>
                            <li>Your friend gets <strong>50 Coins</strong> instantly on sign-up.</li>
                            <li>After staying active for 10 minutes:</li>
                            <ul>
                                <li><strong>You</strong> earn <strong>100 Coins</strong>.</li>
                                <li><strong>Your friend</strong> earns an extra <strong>100 Coins</strong> (Total 150).</li>
                            </ul>
                        </ul> */}



                            <div className="summary-box">
                                <p>👤 {trans.referralStats.youEarn}</p>
                                <p>🧑‍🤝‍🧑 {trans.referralStats.friendGets}</p>
                            </div>

                            <div className="border-start border-primary ps-3 mt-3">
                                <h6 className='text-sm'><strong>{trans.termsTitle}</strong></h6>
                                <ul className="mt-2 text-xsm">
                                    {trans.terms.map((termslist, index) => {
                                        return <li key={index}>{termslist}</li>;
                                    })}

                                </ul>
                            </div>
                        </div>
                    </main>
                </div>

                <AdsButtom />
            </div>
        </>

    );
};

export default ReferAndEarn;
