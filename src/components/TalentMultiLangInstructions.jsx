import React, { useState } from 'react';

const TalentMultiLangInstructions = () => {
    const [lang, setLang] = useState('en');

    return (
        <div className="text-xsm">

            <div className="">
                <div className="text-end">
                    <select value={lang} onChange={(e) => setLang(e.target.value)} className="border form-selects rounded-1">
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                        <option value="bn">বাংলা</option>
                    </select>
                </div>
            </div>


            {/* English HTML */}
            {lang === 'en' && (
                <>
                    <div class="section">
                        <h1 className="text-sm fw-semibold">Talent Search Exam 2025</h1>
                   <p className="">This is an online MCQ based competitive exam which will have questions from General Knowledge, Science, Mathematics and Current Affairs.</p>
                    </div>

                    <div>
                        <div class="subsection">
                          <h3 className='text-xsm fw-semibold'> Exam Type</h3>
                             <ul className='text-xxsm'>
                                <li>The exam will be entirely Multiple Choice Questions (MCQ) based.</li>
                                <li>Total Questions: 100</li>
                                <li>Marks per Question: 1</li>
                                <li>Total Duration: 60 minutes</li>
                                <li>Negative Marking: -0.33 for each wrong answer</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'>Syllabus / Subjects</h3>
                             <ul className='text-xxsm'>
                                <li><span className='fw-semibold'>General Knowledge:</span> History, Indian Polity, Geography</li>
                                <li><span className='fw-semibold'>Science:</span> Physics, Chemistry, Biology (Basic)</li>
                                <li><span className='fw-semibold'>Mathematics:</span> Arithmetic, Logical Reasoning, Data Interpretation</li>
                                <li><span className='fw-semibold'>Current Affairs:</span> National & International Events</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Exam Mode & Technical Requirements</h3>
                             <ul className='text-xxsm'>
                                <li>The exam will be conducted fully online.</li>
                                <li>Laptop/Desktop/Mobile and Internet connection are required to participate.</li>
                                <li>Camera and microphone access in the browser must be enabled.</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Registration</h3>
                             <ul className='text-xxsm'>
                                {/* <li>Registration Deadline: <span className='fw-semibold'>[DD/MM/YYYY]</span></li> */}
                                <li>Registration Fee: <span className='fw-semibold'>₹100/- (Non-refundable)</span></li>
                                <li>Fee must be paid via online payment.</li>
                                <li>Correct Name, Mobile, Email & Date of Birth must be provided.</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Exam Process</h3>
                             <ul className='text-xxsm'>
                                {/* <li>After successful registration, <span className='fw-semibold'>Login ID & Password</span> will be sent via Email / SMS.</li> */}
                                <li>Questions will be in <span className='fw-semibold'>English, Hindi and Bengali.</span></li>
                                {/* <li>On the exam day, login at the specified link and start the exam at the scheduled time.</li> */}
                                <li>On the exam day, login and start the exam at the scheduled time.</li>
                                <li>If you do not take the exam on the specified schedule, it will not be rescheduled in any way.</li>
                                <li>The exam link will be opened on this page on the day of the exam.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="section">
                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Eligibility</h3>
                             <ul className='text-xxsm'>
                                <li>Participants must be Indian citizens.</li>
                                <li>Minimum educational qualification: Class 10 or equivalent.</li>
                                <li>Minimum age: 16 years.</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Identity Proof</h3>
                             <ul className='text-xxsm'>
                                <li>Winners must provide Aadhaar Card, School Certificate/Secondary Certificate for verify the identity, age and educational qualifications.</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Non-refundable Fee</h3>
                             <ul className='text-xxsm'>
                                <li>Registration fee will not be refunded under any circumstances.</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Fraud / Cheating</h3>
                             <ul className='text-xxsm'>
                                <li>Attempting the exam using multiple devices or tabs will result in immediate cancellation.</li>
                                <li>Using AI, bots, or outside help will lead to disqualification.</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Winner Selection</h3>
                             <ul className='text-xxsm'>
                                <li>Top scorers will be selected based on marks.</li>
                                <li>In case of a tie, the candidate who took less time will be prioritized.</li>
                                <li>The organizers’ decision will be final.</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Prizes</h3>
                             <ul className='text-xxsm'>
                                <li>1st Prize: <span className='fw-bold'>₹5,000/-</span></li>
                                <li>2nd Prize: <span className='fw-bold'>₹3,000/-</span></li>
                                <li>3rd Prize: <span className='fw-bold'>₹2,000/-</span></li>
                                <li>Top 100 participants will receive e-certificates.</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> Other Conditions</h3>
                             <ul className='text-xxsm'>
                                <li>The organizer reserves the right to change rules at any time.</li>
                                <li>For technical issues, the organizer’s decision will be final.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="section">
                        <h2 className='text-xsm fw-semibold'> Preparation Tips (Optional)</h2>
                         <ul className='text-xxsm'>
                            <li>Read NCERT books, recent newspapers, and monthly current affairs magazines.</li>
                            <li>Practice MCQs from previous years’ UPSC,SSC,State Level exams.</li>
                            <li>You can practice on our website as well.</li>
                        </ul>
                    </div>

                </>
            )}

            {/* Hindi HTML */}
            {lang === 'hi' && (
                <>
                    <div class="section">
                        <h1 className="text-sm fw-semibold">टैलेंट सर्च परीक्षा 2025</h1>
                       <p className="mb-3">यह एक ऑनलाइन MCQ आधारित प्रतियोगी परीक्षा है जिसमें सामान्य ज्ञान, विज्ञान, गणित और समसामयिक मामलों से प्रश्न होंगे।</p>
                    </div>

                    <div class="section">
                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> परीक्षा का प्रकार</h3>
                             <ul className='text-xxsm'>
                                <li>परीक्षा पूरी तरह से बहुविकल्पीय (MCQ) प्रश्नों पर आधारित होगी।</li>
                                <li>कुल प्रश्न: 100</li>
                                <li>प्रत्येक प्रश्न का अंक: 1</li>
                                <li>कुल समय: 60 मिनट</li>
                                <li>नकारात्मक अंकन: प्रत्येक गलत उत्तर पर -0.33 अंक</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> पाठ्यक्रम / विषय</h3>
                             <ul className='text-xxsm'>
                                <li><span className='fw-semibold'>सामान्य ज्ञान:</span>  इतिहास, भारतीय राजनीति, भूगोल</li>
                                <li><span className='fw-semibold'>विज्ञान:</span>  भौतिक विज्ञान, रसायन विज्ञान, जीव विज्ञान (मूल बातें)</li>
                                <li><span className='fw-semibold'>गणित:</span>  अंकगणित, तार्किक क्षमता, डेटा व्याख्या</li>
                                <li><span className='fw-semibold'>करंट अफेयर्स:</span>  राष्ट्रीय और अंतर्राष्ट्रीय घटनाएँ</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> परीक्षा मोड और तकनीकी आवश्यकताएँ</h3>
                             <ul className='text-xxsm'>
                                <li>परीक्षा पूरी तरह ऑनलाइन आयोजित की जाएगी।</li>
                                <li>परीक्षा में भाग लेने के लिए लैपटॉप/डेस्कटॉप/मोबाइल और इंटरनेट कनेक्शन आवश्यक है।</li>
                                <li>ब्राउज़र में कैमरा और माइक्रोफ़ोन एक्सेस चालू होना चाहिए।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> पंजीकरण</h3>
                             <ul className='text-xxsm'>
                                {/* <li>पंजीकरण की अंतिम तिथि:<span className='fw-semibold'> [DD/MM/YYYY]</span> </li> */}
                                <li>पंजीकरण शुल्क: <span className='fw-bold'>₹100/- (नॉन-रिफंडेबल)</span> </li>
                                <li>शुल्क ऑनलाइन भुगतान के माध्यम से जमा करना होगा।</li>
                                <li>सही नाम, मोबाइल, ईमेल और जन्म तिथि दर्ज करना अनिवार्य है।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> परीक्षा प्रक्रिया</h3>
                             <ul className='text-xxsm'>
                                {/* <li>सफल पंजीकरण के बाद <span className='fw-semibold'>login ID and password </span> ईमेल / SMS पर भेजा जाएगा।</li> */}
                                <li>प्रश्न <span className='fw-semibold'>English, Hindi and Bengali</span> में होंगे।</li>
                                {/* <li>परीक्षा के दिन निर्दिष्ट लिंक पर लॉगिन करके निर्धारित समय पर परीक्षा शुरू करें।</li> */}
                                <li>परीक्षा के दिन लॉगिन करके निर्धारित समय पर परीक्षा शुरू करें।</li>
                                <li>यदि आप निर्धारित समय पर परीक्षा नहीं देते हैं, तो उसे किसी भी तरह से पुनर्निर्धारित नहीं किया जाएगा।</li>
                                <li>परीक्षा के दिन इस पेज पर परीक्षा लिंक खोल दिया जाएगा।</li>
                            </ul>
                        </div>
                    </div>

                    <div class="section">
                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> पात्रता</h3>
                             <ul className='text-xxsm'>
                                <li>प्रतिभागी भारतीय नागरिक होना चाहिए।</li>
                                <li>न्यूनतम शैक्षणिक योग्यता: कक्षा 10 या समकक्ष।</li>
                                <li>न्यूनतम आयु: 16 वर्ष।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> पहचान प्रमाण</h3>
                             <ul className='text-xxsm'>
                                <li>विजेताओं की पहचान, आयु और शैक्षिक योग्यता सत्यापित करने के लिए आधार कार्ड, स्कूल प्रमाण पत्र/माध्यमिक प्रमाण पत्र आवश्यक हैं।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> शुल्क रिफंड नहीं</h3>
                             <ul className='text-xxsm'>
                                <li>किसी भी स्थिति में पंजीकरण शुल्क वापस नहीं किया जाएगा।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> धोखाधड़ी / नकल</h3>
                             <ul className='text-xxsm'>
                                <li>कई डिवाइस या टैब का उपयोग करके परीक्षा देने का प्रयास तुरंत रद्द कर दिया जाएगा।</li>
                                <li>AI, बोट या किसी और की मदद लेने पर अयोग्यता घोषित की जाएगी।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> विजेता चयन</h3>
                             <ul className='text-xxsm'>
                                <li>शीर्ष अंक प्राप्त करने वालों का चयन स्कोर के आधार पर किया जाएगा।</li>
                                <li>यदि अंकों में समानता हो, तो कम समय में परीक्षा पूरी करने वाले को प्राथमिकता दी जाएगी।</li>
                                <li>आयोजकों का निर्णय अंतिम होगा।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> पुरस्कार</h3>
                             <ul className='text-xxsm'>
                                <li>1st पुरस्कार: <span className='fw-bold'>₹5,000</span> </li>
                                <li>2nd पुरस्कार: <span className='fw-bold'>₹3,000</span> </li>
                                <li>3rd पुरस्कार: <span className='fw-bold'>₹2,000</span> </li>
                                <li>शीर्ष 100 प्रतिभागियों को ई-सर्टिफिकेट दिया जाएगा।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> अन्य शर्तें</h3>
                             <ul className='text-xxsm'>
                                <li>आयोजक किसी भी समय नियम बदलने का अधिकार रखते हैं।</li>
                                <li>तकनीकी समस्याओं के मामले में आयोजक का निर्णय अंतिम होगा।</li>
                            </ul>
                        </div>
                    </div>

                    <div class="section">
                         <h2 className='text-xsm fw-semibold'> तैयारी के सुझाव (वैकल्पिक)</h2>
                         <ul className='text-xxsm'>
                            <li>NCERT किताबें, हाल के समाचार पत्र और मासिक करंट अफेयर्स पत्रिकाएँ पढ़ें।</li>
                            <li>पिछले वर्षों के UPSC,SSC,State Level MCQ से अभ्यास करें।</li>
                            <li>हमारी वेबसाइट पर भी अभ्यास कर सकते हैं।</li>
                        </ul>
                    </div>
                </>


            )}

            {/* Bengali HTML */}
            {lang === 'bn' && (
                <>
                    <div class="section">
                        <h1 className="text-sm fw-semibold">ট্যালেন্ট সার্চ পরীক্ষা ২০২৫</h1>
                        <p className="mb-3">এটি একটি অনলাইন MCQ ভিত্তিক প্রতিযোগিতা পরীক্ষা যেখানে জেনারেল নলেজ, বিজ্ঞান, গণিত ও কারেন্ট অ্যাফেয়ার্স থেকে প্রশ্ন থাকবে।</p>
                    </div>

                    <div class="section">
                    

                        <div>
                            <h3 className='text-xsm fw-semibold'>পরীক্ষার ধরন</h3>
                            <ul className='text-xxsm'>
                                <li>পরীক্ষা সম্পূর্ণ বহুনির্বাচনী (MCQ) প্রশ্নভিত্তিক হবে।</li>
                                <li>মোট প্রশ্ন: ১০০ টি</li>
                                <li>প্রতিটি প্রশ্নের মান: ১ নম্বর</li>
                                <li>মোট সময়: ৬০ মিনিট</li>
                                <li>নেগেটিভ মার্কিং: প্রতিটি ভুল উত্তরে -০.৩৩ নম্বর</li>
                            </ul>
                        </div>

                        <div>
                          <h3 className='text-xsm fw-semibold'> সিলেবাস / বিষয়</h3>
                             <ul className='text-xxsm'>
                                <li><span className='fw-semibold'>সাধারণ জ্ঞান:</span> ইতিহাস, ভারতীয় রাজনীতি, ভূগোল</li>
                                <li><span className='fw-semibold'>বিজ্ঞান:</span> পদার্থবিদ্যা, রসায়ন, জীববিদ্যা (মৌলিক)</li>
                                <li><span className='fw-semibold'>গণিত:</span> অঙ্কশাস্ত্র, যৌক্তিক ক্ষমতা, তথ্য বিশ্লেষণ</li>
                                <li><span className='fw-semibold'>কারেন্ট অ্যাফেয়ার্স:</span> জাতীয় ও আন্তর্জাতিক ঘটনা</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className='text-xsm fw-semibold'>পরীক্ষার ধরন ও প্রযুক্তিগত শর্ত</h3>
                            <ul className='text-xxsm'>
                                <li>পরীক্ষা সম্পূর্ণ অনলাইনে অনুষ্ঠিত হবে।</li>
                                <li>পরীক্ষায় অংশ নিতে ল্যাপটপ/ডেস্কটপ/মোবাইল এবং ইন্টারনেট সংযোগ প্রয়োজন।</li>
                                <li>ব্রাউজারে ক্যামেরা ও মাইক অ্যাক্সেস চালু থাকতে হবে।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                            <h3 className='text-xsm fw-semibold'> রেজিস্ট্রেশন</h3>
                            <ul className='text-xxsm'>
                                {/* <li>রেজিস্ট্রেশনের শেষ তারিখ: <span className='fw-semibold'>[DD/MM/YYYY]</span></li> */}
                                <li>রেজিস্ট্রেশন ফি:<span className='fw-semibold'> ₹100/- (নন-রিফান্ডেবল)</span> </li>
                                <li>ফি অনলাইন পেমেন্টের মাধ্যমে জমা দিতে হবে।</li>
                                <li>সঠিক নাম, মোবাইল, ইমেল ও জন্মতারিখ দিতে হবে।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                           <h3 className='text-xsm fw-semibold'>পরীক্ষা প্রক্রিয়া</h3>
                            <ul className='text-xxsm'>
                                {/* <li>রেজিস্ট্রেশন সফল হলে পরীক্ষার <span className='fw-semibold'>Login ID ও Password</span> ইমেল/ SMS-এ পাঠানো হবে।</li> */}
                                <li>প্রশ্ন <span className='fw-semibold'>ইংরেজি, হিন্দি এবং বাংলা </span>ভাষায় হবে।</li>
                                {/* <li>পরীক্ষার দিনে নির্দিষ্ট লিঙ্কে লগইন করে নির্ধারিত সময়ে পরীক্ষা শুরু করতে হবে।</li> */}
                                <li>পরীক্ষার দিনে লগইন করে নির্ধারিত সময়ে পরীক্ষা শুরু করতে হবে।</li>
                                <li>যদি নির্দিষ্ট সিডিউলে পরীক্ষা না দেন কোনভাবে রিসিডিউল করা হবে না।</li>
                                <li>পরীক্ষার দিন এই পেজে পরীক্ষার লিংক ওপেন করা হবে ।</li>

                            </ul>
                        </div>
                    </div>

                    <div class="section">
                        <div class="subsection">
                             <h3 className='text-xsm fw-semibold'> যোগ্যতা</h3>
                            <ul className='text-xxsm'>
                                <li>অংশগ্রহণকারীকে অবশ্যই ভারতীয় নাগরিক হতে হবে।</li>
                                <li>ন্যূনতম শিক্ষাগত যোগ্যতা: ক্লাস ১০ বা সমমান।</li>
                                <li>ন্যূনতম বয়স: ১৬ বছর।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                             <h3 className='text-xsm fw-semibold'> পরিচয় প্রমাণ</h3>
                            <ul className='text-xxsm'>
                                <li>বিজয়ীদের পরিচয়, বয়স, এডুকেশন কোয়ালিফিকেশন যাচাইয়ের জন্য আধার কার্ড, স্কুল সার্টিফিকেট / মাধ্যমিক সার্টিফিকেট প্রয়োজন।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                             <h3 className='text-xsm fw-semibold'> ফি ফেরতযোগ্য নয়</h3>
                            <ul className='text-xxsm'>
                                <li>কোনো অবস্থাতেই রেজিস্ট্রেশন ফি ফেরত দেওয়া হবে না।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                             <h3 className='text-xsm fw-semibold'> প্রতারণা / নকল</h3>
                          <ul className='text-xxsm'>
                                <li>একাধিক ডিভাইস বা ট্যাব ব্যবহার করে পরীক্ষা দেওয়ার চেষ্টা করলে তাৎক্ষণিক বাতিল হবে।</li>
                                <li>AI/বট বা অন্য কারও সাহায্য নিলে ডিসকোয়ালিফিকেশন হবে।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                             <h3 className='text-xsm fw-semibold'> বিজয়ী নির্বাচন</h3>
                           <ul className='text-xxsm'>
                                <li>স্কোরের ভিত্তিতে শীর্ষস্থানীয়দের নির্বাচন করা হবে।</li>
                                <li>সমান নম্বর হলে কম সময়ে পরীক্ষা সম্পন্নকারী প্রার্থীকে অগ্রাধিকার দেওয়া হবে।</li>
                                <li>আয়োজকদের সিদ্ধান্তই চূড়ান্ত।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                             <h3 className='text-xsm fw-semibold'> পুরস্কার</h3>
                           <ul className='text-xxsm'>
                                <li>১ম পুরস্কার: ₹5,000</li>
                                <li>২য় পুরস্কার: ₹3,000</li>
                                <li>৩য় পুরস্কার: ₹2,000</li>
                                <li>শীর্ষ ১০০ জনকে ই-সার্টিফিকেট প্রদান করা হবে।</li>
                            </ul>
                        </div>

                        <div class="subsection">
                             <h3 className='text-xsm fw-semibold'> অন্যান্য শর্ত</h3>
                           <ul className='text-xxsm'>
                                <li>আয়োজক যে কোনো সময়ে নিয়ম পরিবর্তনের ক্ষমতা রাখে।</li>
                                <li>প্রযুক্তিগত সমস্যার ক্ষেত্রে আয়োজকদের সিদ্ধান্তই চূড়ান্ত।</li>
                            </ul>
                        </div>
                    </div>

                    <div class="section">
                         <h2 className='text-xsm fw-semibold'> প্রস্তুতির টিপস (ঐচ্ছিক)</h2>
                        <ul className='text-xxsm'>
                            <li>NCERT বই, সাম্প্রতিক সংবাদপত্র এবং মাসিক কারেন্ট অ্যাফেয়ার্স ম্যাগাজিন পড়ুন।</li>
                            <li>গত বছরের UPSC,SSC,State Level MCQ থেকে প্র্যাকটিস করুন।</li>
                            <li>আমাদের ওয়েবসাইটেও প্র্যাকটিস করতে পারেন।</li>
                        </ul>
                    </div>
                </>

            )}
        </div>
    );
}
export default TalentMultiLangInstructions;