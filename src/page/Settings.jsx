import React, { useState, useEffect } from 'react';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import settingLanguage from '../language/settingPage.json';
import API from '../utils/axios'; // make sure axios instance is setup
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';

const Settings = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const trans = settingLanguage[lang] || settingLanguage['en'];

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLang(selectedLang);
    localStorage.setItem('lang', selectedLang);
    window.location.reload();
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit password change
  const handleSave = async () => {
    setError("");
    setSuccessMsg("");

    const { oldPassword, newPassword, confirmPassword } = formData;

    // Basic validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken(); 
     const user= decodeToken(token);
     const userId=user.id;

      const res = await API.put(`/user/change-password/${userId}`, {
        oldPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg(res.data.msg);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to change password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Add inside component
useEffect(() => {
  if (error || successMsg) {
    const timer = setTimeout(() => {
      setError("");
      setSuccessMsg("");
    }, 3000); // 4 seconds
    return () => clearTimeout(timer);
  }
}, [error, successMsg]);


  return (
    <>
      <div className="page-wrapper">
        <AdsTop />
        <div className="content-row">
          <main className="app-container">
            {/* <h3 className="mb-2 text-md text-center gap-1"><span>{trans.settingTitle}</span></h3> */}

            <div className="contact-container">
              <div className='pt-2 mt-0 summary-box'>
                <h3 className="mb-2 text-md d-flex align-items-center gap-1"><span>{trans.passChangeTitle}</span></h3>

                

                <form>
                  <div className="row g-3">
                    <div className="col-md-12">
                      <input
                        type="password"
                        className="form-control text-sm"
                        placeholder={trans.passChangeCurrentPass}
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="password"
                        className="form-control text-sm"
                        placeholder={trans.passChangeNewPass}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="password"
                        className="form-control text-sm"
                        placeholder={trans.passChangeConfirmPass}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 text-center mt-4">
                      <div
                        className={`btn-invite text-sm color-white bg-one cursor-pointer ${loading ? "disabled" : ""}`}
                        onClick={handleSave}
                      >
                        {loading ? "Saving..." : "Save"}
                      </div>
                    </div>
                  </div>
                </form>
                {error && <p className="text-danger pt-2">{error}</p>}
                {successMsg && <p className="text-success pt-2">{successMsg}</p>}
              </div>
            </div>

            <div className="changeLanguage mt-5">
              <div className="row">
                <div className="col-6">
                  <h5 className='text-md'>{trans.languageSetting}</h5>
                </div>
                <div className="col-6 text-end text-sm">
                  <select value={lang} onChange={handleLanguageChange}>
                    {trans.languageList.map((languages, index) => (
                      <option key={index} value={languages.code}>{languages.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </main>
        </div>
        <AdsButtom />
      </div>
    </>
  );
};

export default Settings;
