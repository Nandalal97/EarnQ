import React, { useState, useEffect } from 'react';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import API from '../utils/axios';
import profileLanguage from '../language/profilePage.json';
import { FaStar, FaMedal, FaUser, FaUserAlt, FaShieldAlt } from 'react-icons/fa';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';

const ProfilePage = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        gender: "",
        address: "",
        pincode: "",
        state: "",
        language: "",
        phone: "",
        email: "",
    });

    const authToken = getAuthToken()
    const userData = decodeToken(authToken)
    // Get userId from localStorage or session
    const userId = userData.id;

    useEffect(() => {
        setIsPremium(!!userData?.isPremium);
    }, []);

    // Language setup
    const defaultLang = localStorage.getItem('lang') || 'en';
    const [lang] = useState(defaultLang);
    const trans = profileLanguage[lang] || profileLanguage['en'];

    // Fetch user data on mount
    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const res = await API.get(`/users/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const user = res.data;

                setFormData({
                    firstName: user.first_name || '',
                    middleName: user.middle_name || '',
                    lastName: user.last_name || '',
                    dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : '',
                    gender: user.gender || '',
                    address: user.address || '',
                    pincode: user.pin_code || '',
                    state: user.state || '',
                    language: user.language || '',
                    phone: user.phone_number || '',
                    email: user.email || '',
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile');
                setLoading(false);
            }
        };

        if (userId) fetchUserData();
        else setError("User not found");
    }, [userId]);

    const handleUpdateUser = async () => {
        try {
            const res = await API.put(`/users/user/edit/${userId}`, {
                first_name: formData.firstName,
                middle_name: formData.middleName,
                last_name: formData.lastName,
                dob: formData.dob,
                gender: formData.gender,
                address: formData.address,
                pin_code: formData.pincode,
                state: formData.state,
                language: formData.language,
            });

            setMessage(res.data.msg);
            setStatus(res.data.status);
        } catch (err) {
            setError(err.response?.data?.msg || "Something went wrong");
        }
    };

    useEffect(() => {
        if (status === 1 || error) {
            const timer = setTimeout(() => {
                setStatus(null);
                setMessage('');
                setError('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [status, error]);

    return (
        <div className="page-wrapper">
            <AdsTop />
            <div className="content-row">
                <main className="app-container">
                    {loading ? (
                        <p className="text-center my-5">Loading profile...</p>
                    ) : (
                        <>
                            <div className="d-flex justify-content-right align-items-center gap-2">
                                {/* <img src="https://placehold.co/80x80" alt="Profile" className="profile-img" /> */}
                                <div>
                                    <h5 className="p-0 m-0">
                                        {formData.firstName} {formData.middleName} {formData.lastName}

                                        {isPremium ? <span className="text-success px-1"><FaMedal /><FaShieldAlt /></span> : <span className="text-secondary px-1"><FaMedal /></span>}
                                    </h5>
                                    <p className="userId">{formData.email}</p>

                                    {/* <p className="text-xlg">
                                        <span className="color-one"><FaStar /></span>
                                        <span className="color-two"><FaMedal /></span>
                                    </p> */}
                                </div>
                            </div>
                            <hr />
                            <div className="form-container">
                                <h3 className="mb-4 text-lg d-flex align-items-center gap-1">
                                    <FaUser /> <span>{trans.profileTitle}</span>
                                </h3>
                                <form>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.firstName}</label>
                                            <input type="text" className="form-control" value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.middleName}</label>
                                            <input type="text" className="form-control" value={formData.middleName}
                                                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.lastName}</label>
                                            <input type="text" className="form-control" value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.dob}</label>
                                            <input type="date" className="form-control" value={formData.dob}
                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">{trans.address}</label>
                                            <textarea className="form-control" rows="2" value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Gender</label>
                                            <select className="form-select" value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.pincode}</label>
                                            <input type="text" className="form-control" value={formData.pincode}
                                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.state}</label>
                                            <select className="form-select" value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}>
                                                {trans.stateName.map((s, index) => (
                                                    <option key={index} value={s.code}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.language}</label>
                                            <select className="form-select" value={formData.language}
                                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
                                                {trans.languageList.map((lang, index) => (
                                                    <option key={index} value={lang.code}>{lang.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.phoneNumber}</label>
                                            <input type="text" className="form-control" value={formData.phone} disabled readOnly />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">{trans.emailId}</label>
                                            <input type="email" className="form-control" value={formData.email} disabled readOnly />
                                        </div>
                                        <div className="col-12 text-center mt-4">
                                            <div className="btn-invite color-white bg-one cursor-pointer" onClick={handleUpdateUser}>
                                                {trans.profileButton}
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                {status === 1 && (
                                    <div className="alert alert-success mt-2 border-0">
                                        <small>{message}</small>
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-warning mt-2 border-0">
                                        <small>{error}</small>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
            <AdsButtom />
        </div>
    );
};

export default ProfilePage;
