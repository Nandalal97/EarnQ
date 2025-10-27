import React, { useState, useEffect } from 'react';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import { FaUser } from 'react-icons/fa';
import contactLanguage from '../language/contactPage.json';
import API from '../utils/axios';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';

const ContactHome = () => {
  const defaultLang = localStorage.getItem('lang') || 'en';
  const [lang] = useState(defaultLang);
  const trans = contactLanguage[lang] || contactLanguage['en'];

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    number: '',
    email: '',
    subject: '',
    message: '',
  });

  // Get user ID on mount
  useEffect(() => {
    const authToken = getAuthToken();
    const userData = decodeToken(authToken);
    if (userData?.id) {
      setUserId(userData.id);
      setFormData(prev => ({ ...prev, userId: userData.id }));
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === 'name') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'number') {
      newValue = value.replace(/[^0-9]/g, '');
    }

    setFormData({ ...formData, [name]: newValue });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/contacts/create', formData);
      // console.log('Response:', res.data);
      setSuccessMsg(res.data.msg)
      setFormData({
        userId,
        name: '',
        number: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error:', error?.response?.data || error.message);

      setError(error?.response?.data?.message || 'Something went wrong. Please try again.');

    }
  };

  useEffect(() => {
  if (successMsg || error) {
    const timer = setTimeout(() => {
      setSuccessMsg('');
      setError('');
    }, 4000);
    return () => clearTimeout(timer);
  }
}, [successMsg, error]);


  return (
    <div className="page-wrapper">
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <h3 className="mb-2 text-lg d-flex align-items-center gap-1">
            <FaUser /> <span>{trans.contactTitle}</span>
          </h3>
          <div className="contact-container">
            <p>{trans.contactText}</p>
            <div className="pt-3">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder={trans.contactName}
                      value={formData.name}
                      onChange={handleChange}
             
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="number"
                      className="form-control"
                      maxLength={10}
                      placeholder={trans.contactNumber}
                      value={formData.number}
                      onChange={handleChange}
                    
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder={trans.contactEmail}
                      value={formData.email}
                      onChange={handleChange}
                     
                    />
                  </div>

                  <div className="col-md-12">
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder={trans.contactSubject}
                      value={formData.subject}
                      onChange={handleChange}
                    
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      name="message"
                      className="form-control"
                      rows="2"
                      placeholder={trans.contactMessage}
                      value={formData.message}
                      onChange={handleChange}
                  
                    />
                  </div>

                  <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn-invite color-white bg-one border-0">
                      {trans.contactButton}
                    </button>
                  </div>
                </div>
              </form>

              {successMsg && (
                <p className="alert alert-success mt-2 py-2 text-center border-0">
                  {successMsg}
                </p>
              )}
              {error && (
                <p className="alert alert-danger mt-2 py-2 text-center border-0">
                  {error}
                </p>
              )}
            </div>

            <div className="summary-box alert alert-info border-0 mt-4">
              <p>{trans.contactText2}</p>
              <p>
                <strong>Email:</strong> {trans.conatctMailText}
              </p>
            </div>
          </div>
        </main>
      </div>
      <AdsButtom />
    </div>
  );
};

export default ContactHome;
