import React, { useState, useEffect } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import API from '../utils/axios';
import AuthFooterLinks from '../components/AuthFooterLinks';

const SignUp = () => {
  const [deviceId, setDeviceId] = useState('');
  const [errorMassege, setErrorMassege] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    pin_code: '',
    state: '',
    language: '',
    password: '',
    deviceId: '',
    referredBy: ''
  });

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
      setFormData(prev => ({ ...prev, deviceId: result.visitorId }));

      // Read referral code from URL if present
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      if (refCode) {
        setFormData(prev => ({ ...prev, referredBy: refCode }));
      }
    };
    loadFingerprint();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.pin_code) newErrors.pin_code = 'Pincode is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.state) newErrors.address = 'Address is required';
    if (!formData.language) newErrors.language = 'Language is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/register', formData);
      setVerificationMessage(response.data.msg || 'Registration successful!');
      setFormSubmitted(true);
    } catch (error) {
      // alert(error?.response?.data?.msg || 'Something went wrong');
      setErrorMassege(error?.response?.data?.msg || 'Something went wrong')
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container">
          <div className="signUp-section">
            <div>

              {!formSubmitted ? (
                <form onSubmit={handleSignup}>
                  <h4 className="mb-4 text-center text-primary"><FaUserPlus /> Sign Up</h4>
                  <div className="row g-3">
                    {/* First Name */}
                    <div className="col-md-4">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                        value={formData.first_name}
                        onChange={(e) => handleChange('first_name', e.target.value.replace(/[^a-zA-Z ]/g, ''))}
                      />
                      {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                    </div>

                    {/* Middle Name */}
                    <div className="col-md-4">
                      <label className="form-label">Middle Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.middle_name}
                        onChange={(e) => handleChange('middle_name', e.target.value.replace(/[^a-zA-Z ]/g, ''))}
                      />
                    </div>

                    {/* Last Name */}
                    <div className="col-md-4">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.last_name}
                        onChange={(e) => handleChange('last_name', e.target.value.replace(/[^a-zA-Z ]/g, ''))}
                      />
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                        maxLength={10}
                        value={formData.phone_number}
                        onChange={(e) => handleChange('phone_number', e.target.value.replace(/\D/g, ''))}
                      />
                      {errors.phone_number && <div className="text-danger">{errors.phone_number}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                      {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>

                    {/* DOB */}
                    <div className="col-md-6">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                        value={formData.dob}
                        onChange={(e) => handleChange('dob', e.target.value)}
                      />
                      {errors.dob && <div className="text-danger">{errors.dob}</div>}
                    </div>

                    {/* Gender */}
                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select
                        className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <div className="text-danger">{errors.gender}</div>}
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea
                         className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        rows="2"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                      />
                    </div>
                    {errors.address && <div className="text-danger">{errors.address}</div>}
                    {/* Pincode */}
                    <div className="col-md-6">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className={`form-control ${errors.pin_code ? 'is-invalid' : ''}`}
                        maxLength={6}
                        value={formData.pin_code}
                        onChange={(e) => handleChange('pin_code', e.target.value.replace(/\D/g, ''))}
                      />
                      {errors.pin_code && <div className="text-danger">{errors.pin_code}</div>}
                    </div>

                    {/* State */}
                    <div className="col-md-6">
                      <label className="form-label">State</label>
                      <select
                        className={`form-select ${errors.state ? 'is-invalid' : ''}`}
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                      >
                        <option value="">Choose...</option>
                        <option value="AP">Andhra Pradesh</option>
                        <option value="AR">Arunachal Pradesh</option>
                        <option value="AS">Assam</option>
                        <option value="BR">Bihar</option>
                        <option value="CH">Chandigarh</option>
                        <option value="CT">Chhattisgarh</option>
                        <option value="GA">Goa</option>
                        <option value="GJ">Gujarat</option>
                        <option value="HR">Haryana</option>
                        <option value="HP">Himachal Pradesh</option>
                        <option value="JH">Jharkhand</option>
                        <option value="KA">Karnataka</option>
                        <option value="KL">Kerala</option>
                        <option value="MP">Madhya Pradesh</option>
                        <option value="MH">Maharashtra</option>
                        <option value="MN">Manipur</option>
                        <option value="ML">Meghalaya</option>
                        <option value="MZ">Mizoram</option>
                        <option value="NL">Nagaland</option>
                        <option value="OR">Odisha</option>
                        <option value="PY">Puducherry</option>
                        <option value="PB">Punjab</option>
                        <option value="RJ">Rajasthan</option>
                        <option value="SK">Sikkim</option>
                        <option value="TN">Tamil Nadu</option>
                        <option value="TS">Telangana</option>
                        <option value="TR">Tripura</option>
                        <option value="UP">Uttar Pradesh</option>
                        <option value="UK">Uttarakhand</option>
                        <option value="WB">West Bengal</option>
                        <option value="AN">Andaman and Nicobar</option>
                        <option value="CH">Chandigarh</option>
                        <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="DL">Delhi</option>
                        <option value="JK">Jammu and Kashmir</option>
                        <option value="LA">Ladakh</option>
                        <option value="LD">Lakshadweep</option>

                      </select>
                      {errors.state && <div className="text-danger">{errors.state}</div>}
                    </div>

                    {/* Language */}
                    <div className="col-6">
                      <label className="form-label">Language</label>
                      <select
                        className={`form-select ${errors.language ? 'is-invalid' : ''}`}
                        value={formData.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                      >
                        <option value="">Select Language</option>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="bn">Bengali</option>
                        <option value="mr">Marathi</option>
                        <option value="pa">Punjabi</option>
                        <option value="gu">Gujarati</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="kn">Kannada</option>
                        <option value="or">Odia</option>
                      </select>
                      {errors.language && <div className="text-danger">{errors.language}</div>}
                    </div>

                    {/* Password */}
                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                      />
                      {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    {/* Referred Code */}
                    <div className="col-md-6">
                      <label className="form-label">Referred Code (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.referredBy}
                        onChange={(e) => handleChange('referredBy', e.target.value)}
                      />
                    </div>

                    {/* Submit */}
                    <div className="d-grid text-center">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : 'Sign Up'}
                      </button>
                    </div>

                    {errorMassege && (
                      <span className='alert alert-danger border-0 text-center mb-0'>{errorMassege}</span>
                    )}

                    <div>


                    </div>

                    <p className="text-center mt-3">
                      Already have an account? <a href="/login" className="text-decoration-none">Log In</a>
                    </p>
                  </div>
                </form>
              ) : (
                <div className="alert alert-success text-center border-0 mt-5">
                  <h5 className='text-sm'>{verificationMessage}</h5>
                  <p>After verification, you can <a href="/login">log in here</a>.</p>
                </div>
              )}

            </div>
            <div className='authfooter'>
              <AuthFooterLinks />
            </div>

          </div>



        </main>
      </div>
    </div>

  );
};

export default SignUp;
