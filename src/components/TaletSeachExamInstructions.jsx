import React, { useState } from 'react';

const TalentSearchExamInstructions = ({ contest }) => {
    const [lang, setLang] = useState('en');

    return (
        <div className="text-xsm">

            {/* Language Selector */}
            <div className="text-end mb-2">
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="border form-selects rounded-1">
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="bn">বাংলা</option>
                </select>
            </div>

            {/* English */}
            {lang === 'en' && (
                <div>
                    <h2 className='text-lg'>Contest Instructions:</h2>
                    <ul className="text-start text-xsm">
                        <li><strong>Entry Fee:</strong> You’ve paid ₹{contest.entryFee} to join this contest. Each user is allowed <strong>only one attempt</strong>.</li>

                        <li><strong>Prize:</strong> Top 3 scorer wins <strong>₹5000, ₹3000, ₹2000</strong>. In case of a tie, the participant who completes the exam earlier will be selected as the winner.</li>
                        <li><strong>Language:</strong> There will be questions in English, Hindi and Bengali languages. the language of any question can be changed.</li>

                        <li><strong>Winner Eligibility:</strong> To be eligible for the prize, your score must be at least <strong>80% or higher</strong>. If no one qualifies, no prize will be distributed.</li>

                        <li><strong>Internet Required:</strong> A stable internet connection is required throughout the exam. Disconnections may result in auto-submit. No re-entry or refund will be provided.</li>

                        <li><strong>One-Time Access:</strong> Once the exam starts, it cannot be restarted. Closing the tab, refreshing, or navigating away will end your attempt.</li>

                        <li><strong>Avoid Distractions:</strong> Phone calls, app switches, or incoming notifications may cause your test to auto-submit immediately.</li>

                        <li><strong>Disable Battery Saver:</strong> Please turn off battery optimization or background restrictions to prevent auto-submit issues.</li>

                        <li><strong>Fullscreen Mode Required:</strong> The exam begins in fullscreen. Pressing <b>Esc</b> or exiting fullscreen will auto-submit your test.</li>

                        <li><strong>Tab/Window Monitoring:</strong> Switching tabs, minimizing, or opening new windows will immediately end your exam.</li>

                        <li><strong>Anti-Cheating:</strong> Copy/paste, right-click, and developer tools are disabled. Any such attempt may disqualify you instantly.</li>

                        <li><strong>⏱ Timers:</strong>
                            <ul>
                                <li>Each question may have its own timer.</li>
                                <li>A total exam timer is also enforced.</li>
                                <li>When time runs out, the exam will auto-submit.</li>
                            </ul>
                        </li>

                        <li><strong>Auto-Save:</strong> Your answers are saved in real-time. If the page reloads, your progress resumes — but you cannot restart the test.</li>

                        <li><strong>Question Navigation:</strong>You can go to any question by clicking on the next preview and question number. But once you click on the answer option, you have to choose any one of the options as the answer, you cannot clear the answer. </li>

                        <li><strong>Submission Rules:</strong> You may submit the exam manually, but once submitted, answers cannot be changed or resubmitted.</li>

                        <li><strong>Negetive Mark: </strong>For each wrong answer  will be deducted 0.33 marks.</li>
                        <li><strong>Final Attempt Policy:</strong> Once your exam ends (by submit, timeout, or auto-submit), you cannot attempt again. No support or refunds will be issued.</li>

                        <li><strong>Account Policy:</strong> Only one account per user/device is allowed. Multiple entries from the same device may lead to disqualification.</li>

                        <li><strong>Result & Winner Announcement:</strong> Winners will be notified via app or SMS or email.</li>

                        <li><strong>Legal & Fair Play:</strong> This contest is a <strong>skill-based competition</strong>. Any misuse, fraud, or attempt to manipulate the system may result in ban and disqualification.</li>
                    </ul>

                    <div className="mt-2">
                        <p>Make sure your mobile internet is stable. By starting, you agree to all rules. No retakes, refunds, or exceptions will be allowed.</p>
                    </div>
                </div>
            )}

            {/* Hindi */}
            {lang === 'hi' && (
                <div>
                    <h2 className='text-lg'>प्रतियोगिता निर्देश:</h2>
                    <ul className="text-start text-xsm">
                        <li><strong>एंट्री शुल्क:</strong> आपने इस प्रतियोगिता में भाग लेने के लिए ₹{contest.entryFee} जमा किया है। प्रत्येक प्रतिभागी केवल <strong>एक बार</strong> परीक्षा दे सकता है।</li>
                        <li><strong>पुरस्कार:</strong> शीर्ष 3 स्कोरर जीतेंगे <strong>₹₹5000, ₹3000, ₹2000</strong>. टाई होने पर, जो प्रतिभागी पहले परीक्षा पूरी करता है, वही विजेता होगा।</li>
                        <li><strong>भाषा:</strong>प्रश्न English, हिंदी और Bengali में होंगे तथा किसी भी प्रश्न की भाषा बदली जा सकती है।</li>
                        <li><strong>विजेता पात्रता:</strong> पुरस्कार पाने के लिए आपका स्कोर कम से कम <strong>80%</strong> होना चाहिए। यदि कोई योग्य नहीं है, तो कोई पुरस्कार वितरित नहीं किया जाएगा।</li>
                        <li><strong>इंटरनेट आवश्यक:</strong> परीक्षा के दौरान स्थिर इंटरनेट कनेक्शन होना चाहिए। कनेक्शन कटने पर ऑटो-सबमिट होगा। पुनः प्रवेश या रिफंड नहीं मिलेगा।</li>
                        <li><strong>वन-टाइम एक्सेस:</strong> परीक्षा शुरू होने के बाद इसे दोबारा शुरू नहीं किया जा सकता। पेज बंद या रिफ्रेश करने पर ऑटो-सबमिट होगा।</li>
                        <li><strong>ध्यान भटकाने से बचें:</strong> फोन कॉल, ऐप बदलना या नोटिफिकेशन से परीक्षा ऑटो-सबमिट हो सकती है।</li>
                        <li><strong>फुलस्क्रीन मोड:</strong> परीक्षा फुलस्क्रीन में शुरू होगी। <b>Esc</b> दबाने या फुलस्क्रीन से बाहर जाने पर ऑटो-सबमिट होगा।</li>
                        <li><strong>टैब/विंडो मॉनिटरिंग:</strong> टैब बदलने, मिनिमाइज करने या नई विंडो खोलने पर आपकी परीक्षा तुरंत समाप्त (सबमिट) हो जाएगी।</li>
                        <li><strong>प्रतারণा निषिद्ध:</strong> कॉपी/पेस्ट, राइट-क्लिक और डेवलपर टूल्स पूरी तरह निषिद्ध हैं। कोई भी प्रयास अयोग्यता का कारण बनेगा।</li>
                        <li><strong>⏱ टाइमर:</strong> प्रत्येक प्रश्न का अपना टाइमर हो सकता है और परीक्षा का कुल टाइमर भी लागू होगा। समय समाप्त होने पर ऑटो-सबमिट होगा।</li>
                        <li><strong>ऑटो-सेव:</strong> उत्तर रियल-टाइम में सुरक्षित रहेंगे। पेज रीलोड होने पर भी प्रगति बनी रहेगी, लेकिन परीक्षा पुनः शुरू नहीं की जा सकती।</li>
                        <li><strong>प्रश्न नेविगेशन:</strong> आप अगले (Next), पिछला (Prev) या प्रश्न संख्या क्लिक करके किसी भी प्रश्न पर जा सकते हैं। लेकिन एक बार विकल्प चुनने के बाद, आपको किसी एक विकल्प को उत्तर के रूप में ही चुनना होगा; उत्तर को क्लियर नहीं किया जा सकता।</li>
                        <li><strong>सबमिशन नियम:</strong> आप परीक्षा को मैन्युअली सबमिट कर सकते हैं, लेकिन एक बार सबमिट होने के बाद उत्तर बदलना या पुनः सबमिट करना संभव नहीं है।
                            आपकी परीक्षा समाप्त होने के बाद (सबमिट, समय समाप्त या ऑटो-सबमिट) आप फिर से प्रयास नहीं कर सकते। कोई सहायता या रिफंड नहीं मिलेगा।</li>
                        <li><strong>नेगेटिव मार्क:</strong> प्रत्येक गलत उत्तर के लिए 0.33 अंक काटे जायेंगे।</li>
                        <li><strong>खाता नीति:</strong> प्रत्येक उपयोगकर्ता/डिवाइस के लिए केवल एक खाता अनुमत है। एक ही ID से कई एंट्री अयोग्यता का कारण बन सकती है।</li>
                        <li><strong>परिणाम और विजेता:</strong> विजेताओं को ऐप, SMS या ईमेल के माध्यम से सूचित किया जाएगा।</li>
                        <li><strong>न्याय और ईमानदारी:</strong> यह एक <strong>कौशल आधारित प्रतियोगिता</strong> है। किसी भी दुरुपयोग, धोखाधड़ी या सिस्टम पर प्रभाव डालने का प्रयास पूरी तरह से निषिद्ध है।</li>
                    </ul>
                    <div className="mt-2">
                        <p>सुनिश्चित करें कि आपका मोबाइल इंटरनेट स्थिर है। शुरू करके, आप सभी नियमों का पालन करने के लिए सहमत हैं। कोई पुनः प्रयास, रिफंड या अपवाद स्वीकार नहीं किया जाएगा।</p>
                    </div>
                </div>

            )}

            {/* Bengali */}
            {lang === 'bn' && (
                <div>
                    <h2 className='text-lg'>প্রতিযোগিতা নির্দেশাবলী:</h2>
                    <ul className="text-start text-xsm">
                        <li><strong>এন্ট্রি ফি:</strong> আপনি এই প্রতিযোগিতায় অংশ নেওয়ার জন্য ₹{contest.entryFee} প্রদান করেছেন। প্রত্যেক অংশগ্রহণ কারি কেবল <strong>একবারই</strong> পরীক্ষা দিতে পারবে।</li>
                        <li><strong>পুরস্কার:</strong> শীর্ষ 3 স্কোরার প্রত্যেকে জিতবে <strong>₹₹5000, ₹3000, ₹2000</strong>. টাই হলে, যে অংশগ্রহণকারী আগে পরীক্ষা শেষ করবে, সেই বিজয়ী হবে।</li>
                        <li><strong>ভাষা:</strong>ইংরেজি, হিন্দি, বাংলা ভাষায় প্রশ্ন থাকবে, যেকোনো প্রশ্নের ভাষা পরিবর্তন করা যাবে।</li>
                        <li><strong>উইনার এলিজিবিলিটি:</strong> পুরস্কার পেতে, আপনার স্কোর কমপক্ষে <strong>80%</strong> হতে হবে। কেউ যোগ্য না হলে কোন পুরস্কার বিতরণ হবে না।</li>
                        <li><strong>ইন্টারনেট প্রয়োজন:</strong> পরীক্ষা চলাকালীন স্থিতিশীল ইন্টারনেট প্রয়োজন। সংযোগ বিচ্ছিন্ন হলে অটো সাবমিট  হবে। পুনঃপ্রবেশ বা ফেরত দেওয়া হবে না।</li>
                        <li><strong>ওয়ান-টাইম এক্সেস:</strong> পরীক্ষা শুরু হলে পুনরায় শুরু করা যাবে না। পেজ বন্ধ বা রিফ্রেশ করলে অটো সাবমিট হবে।</li>
                        <li><strong>এভোইড ডিস্ট্রাকশন্স:</strong> ফোন কল, অ্যাপ পরিবর্তন বা নোটিফিকেশন অটো সাবমিট হতে পারে।</li>
                        <li><strong>ফুলস্ক্রিন মোড:</strong> পরীক্ষা ফুলস্ক্রিনে শুরু হবে। <b>Esc</b> করলে বা ফুল স্ক্রিন থেকে বের হলে অটো সাবমিট হবে।</li>
                        <li><strong>ট্যাব/উইন্ডো মনিটরিং:</strong> ট্যাব পরিবর্তন করলে, মিনিমাইজ, অথবা নতুন উইন্ডো খোলার মাধ্যমে আপনার পরীক্ষা অবিলম্বে শেষ(সাবমিট) হয়ে যাবে।</li>
                        <li><strong>প্রতারণা নিষিদ্ধ:</strong> কপি/পেস্ট, রাইট-ক্লিক এবং ডেভেলপার টুলস সম্পূর্ণ বাবে নিষিদ্ধ । যে কোনো চেষ্টা অযোগ্যতার কারণ হবে।</li>
                        <li><strong>⏱ টাইমার:</strong> প্রতিটি প্রশ্নের নিজস্ব টাইমার থাকতে পারে এবং পরীক্ষার সম্পূর্ণ টাইমারও রয়েছে।। সময় শেষ হলে অটো সাবমিট হবে।</li>
                        <li><strong>অটো-সেভ:</strong> উত্তর রিয়েল-টাইমে সংরক্ষিত থাকবে । পেজ রিলোড হলে অগ্রগতি বজায় থাকবে- কিন্তু পরীক্ষা পুনরায় শুরু করা যাবে না।</li>
                        <li><strong>প্রশ্ন নেভিগেশন:</strong> আপনি নেক্সট(next) প্রিভিউ(prev) এবং প্রশ্নের নম্বরে ক্লিক করে যেকোন প্রশ্নে যেতে পারবেন।  কিন্তু একবার  উত্তর অপশনে ক্লিক করলে যেকোন একটি অপশন উত্তর হিসেবে বেছে নিতে হবে, উত্তর ক্লেয়ার করতে পারবেন না।</li>
                        <li><strong>সাবমিশন রুলস:</strong>আপনি পরীক্ষাটি ম্যানুয়ালি সাবমিট করতে পারবেন, কিন্তু একবার সাবমিট করলে উত্তর পরিবর্তন বা রেসাবমিট সম্ভব নয়।
                            আপনার পরীক্ষা শেষ হয়ে গেলে (সাবমিট করলে, সময়সীমা শেষ হয়েগেলে, অথবা অটো সাবমিটের মাধ্যমে), আপনি আর চেষ্টা করতে পারবেন না। কোনও সহায়তা বা ফেরত দেওয়া হবে না।</li>
                        <li><strong>নেগেটিভ মার্ক: </strong> প্রতিটি ভুল উত্তরের জন্য 0.33 নম্বর কাটা হবে।</li>
                        <li><strong>অ্যাকাউন্ট পলিসি:</strong> প্রতিটি ব্যবহারকারী/ডিভাইসের জন্য কেবল একটি অ্যাকাউন্ট অনুমোদিত। একই আইডি থেকে একাধিক এন্ট্রি ডিসকোয়ালিফাই / অযোগ্যতার কারণ হতে পারে।</li>
                        <li><strong>ফলাফল এবং বিজয়ী:</strong> বিজয়ীদের App, SMS বা email  মাধ্যমে জানানো হবে।</li>
                        <li><strong>ন্যায় ও সততা:</strong> এটি একটি <strong>দক্ষতা-ভিত্তিক প্রতিযোগিতা</strong>।যেকোনো অপব্যবহার, প্রতারণা বা সিস্টেমে প্রভাব ফেলার চেষ্টা সম্পূর্ণভাবে নিষিদ্ধ।</li>
                    </ul>
                    <div className="mt-2">
                        <p>আপনার মোবাইল ইন্টারনেট স্থিতিশীল আছে কিনা তা নিশ্চিত করুন। শুরু করার মাধ্যমে, আপনি সমস্ত নিয়ম মেনে নিচ্ছেন। কোনও রিটেক, রিফান্ড বা ব্যতিক্রম অনুমোদিত হবে না।</p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TalentSearchExamInstructions;
