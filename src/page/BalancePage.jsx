import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCoins, FaMoneyBillWave } from "react-icons/fa";
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import balanceTrans from '../language/balance.json';

import API from '../utils/axios';
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";
import axios from 'axios';

const BalancePage = () => {
    const defaultLang = localStorage.getItem('lang') || 'en';
    const [lang] = useState(defaultLang);
    const trans = balanceTrans[lang] || balanceTrans['en'];

    const [totalEarn, setTotalEarn] = useState(0);
    const [withdrawn, setWithdrawn] = useState(0);
    const [refers, setRefers] = useState(0);
    const [availableFoWithdraw, setAvailableFoWithdraw] = useState(0);
    const [showWithdrawForm, setShowWithdrawForm] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState("");
    const [upi, setUpi] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [bankName, setBankName] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    const [errors, setErrors] = useState({});
    const [errorField, setErrorField] = useState();
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [withdrawHistory, setWithdrawHistory] = useState([]);

    const authToken = getAuthToken();
    const usersData = decodeToken(authToken);
    const userId = usersData?.id;

    const fetchReferralSummary = async () => {
        try {
            const res = await API.get(`/referral/summary/${userId}`);
            const data = res.data;
            setTotalEarn(data.totalReferralEarnings);
            setWithdrawn(data.totalWithdrawn);
            setAvailableFoWithdraw(data.availableToWithdraw);
            setWithdrawHistory(data.withdrawalHistory);
            setRefers(data.totalReferrals);
        } catch (err) {
            console.error("Failed to fetch referral summary", err);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchReferralSummary();
        }
    }, [userId]);

    const validateFields = () => {
        const newErrors = {};
        if (!phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }
        if (!paymentMethod) newErrors.paymentMethod = "Please select a payment method";
        if (paymentMethod === "upi" && !upi) newErrors.upi = "UPI ID is required";
        if (paymentMethod === "bank") {
            if (!accountNumber) newErrors.accountNumber = "Account number is required";
            if (!ifscCode) newErrors.ifscCode = "IFSC code is required";
            if (!bankName) newErrors.bankName = "Bank name is required";
        }
        if (!fullName) newErrors.fullName = "Full name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleWithdrawRequest = async (e) => {
        e.preventDefault();
        if (availableFoWithdraw < 500 || loading) {
            alert("Minimum withdrawal amount is ₹500.");
            return;
        }

        if (!validateFields()) return;

        setLoading(true);

        const payload = {
            userId,
            amount: availableFoWithdraw,
            paymentMethod,
            fullName,
            phoneNumber: phone
        };

        if (paymentMethod === "upi") {
            payload.upiId = upi.trim();
        } else if (paymentMethod === "bank") {
            payload.accountNumber = accountNumber.trim();
            payload.ifscCode = ifscCode.trim();
            payload.bankName = bankName.trim();
        }

        try {
            const response = await API.post(`/referral/withdraw`, payload);
            console.log('Withdrawal response:', response.data?.msg || 'Success');
            setErrorField();

            setUpi("");
            setAccountNumber("");
            setIfscCode("");
            setBankName("");
            setFullName("");
            setPhone("");
            setErrors({});
            setSuccessMessage("Withdrawal request submitted successfully!");

            await fetchReferralSummary();

            setLoading(false);
            setTimeout(() => {
                setSuccessMessage("");
                setShowWithdrawForm(false);
            }, 2000);
        } catch (error) {
            console.error('Error while withdrawing:', error.response?.data);
            setErrorField(error.response?.data?.msg || "Something went wrong");
            setLoading(false);
        }
    };

    const maskUpi = (upi) => {
        const [id, domain] = upi.split("@");
        if (!id || !domain) return "********@upi";
        const visibleStart = id.slice(0, 2);
        const visibleEnd = id.slice(-2);
        return `${visibleStart}********${visibleEnd}@${domain}`;
    };

    const maskAccount = (accNum) => {
        if (!accNum || accNum.length < 6) return "****";
        const first2 = accNum.slice(0, 2);
        const last4 = accNum.slice(-4);
        const maskedLength = Math.max(accNum.length - 6, 4);
        return `${first2}${"*".repeat(maskedLength)}${last4}`;
    };

    return (
        <div className="page-wrapper">
            <AdsTop />

            <div className="content-row">
                <main className="app-container">
                    <div className="balance-container">
                        {/* <h4 className="text-center text-md mb-4">{trans.balanceTitle}</h4> */}

                        {/* Summary */}
                        <div className="row g-2 mb-2 text-white">
                            <div className="col-6 col-md-4">
                                <div className="alert alert-primary border-0 d-flex align-items-center gap-2 p-3 m-0">
                                    <FaCoins />
                                    <div>
                                        <small className="fw-semibold">{trans.Refers}</small>
                                        <h5 className="mb-0 text-sm">{refers}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-4">
                                <div className="alert alert-primary border-0 d-flex align-items-center gap-2 p-3 m-0">
                                    <FaCoins />
                                    <div>
                                        <small className="fw-semibold">{trans.Earning}</small>
                                        <h5 className="text-sm mb-0">{totalEarn}</h5>
                                     
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="alert alert-success border-0 d-flex align-items-center gap-2 p-3 m-0">
                                    <FaMoneyBillWave />
                                    <div>
                                        <small className="fw-semibold">{trans.Withdrawn}</small>
                                        <h5 className="text-sm mb-0">₹{withdrawn}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Available and Button */}
                        <div className="border-0 alert alert-info d-flex justify-content-between align-items-center mt-3 mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <FaCoins className="text-success" />
                                <div>
                                    <div className="fw-bold">{availableFoWithdraw}</div>
                                    <small>{trans.Withdrawable}</small>
                                </div>
                            </div>
                            <button
                                className="btn btn-outline-primary text-xsm"
                                onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                                disabled={loading || availableFoWithdraw < 500}
                            >
                                {loading ? "Processing..." : showWithdrawForm ? "Close" : "Withdraw"}
                            </button>
                        </div>

                        {/* Withdraw Form */}
                        {showWithdrawForm && (
                            <form onSubmit={handleWithdrawRequest} className="mb-4 text-sm">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <input type="text" className="form-control" value={availableFoWithdraw} readOnly disabled />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className={`form-control text-sm ${errors.phone ? 'border border-danger' : ''}`}
                                            placeholder="Phone Number"
                                            value={phone}
                                            maxLength={10}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value)) setPhone(value);
                                            }}
                                        />
                                        {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                    </div>
                                    <div className="col-md-6">
                                        <select
                                            className={`form-select ${errors.paymentMethod ? 'border border-danger' : ''}`}
                                            value={paymentMethod}
                                            onChange={(e) => {
                                                const method = e.target.value;
                                                setPaymentMethod(method);
                                                if (method === "upi") {
                                                    setAccountNumber("");
                                                    setIfscCode("");
                                                    setBankName("");
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        accountNumber: "",
                                                        ifscCode: "",
                                                        bankName: ""
                                                    }));
                                                } else if (method === "bank") {
                                                    setUpi("");
                                                    setErrors(prev => ({ ...prev, upi: "" }));
                                                }
                                            }}
                                        >
                                            <option value="">Choose Payment Method</option>
                                            <option value="upi">UPI</option>
                                            <option value="bank">Bank</option>
                                        </select>
                                        {errors.paymentMethod && <small className="text-danger">{errors.paymentMethod}</small>}
                                    </div>
                                    {paymentMethod === "upi" && (
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className={`form-control text-sm ${errors.upi ? 'border border-danger' : ''}`}
                                                placeholder="UPI ID"
                                                value={upi}
                                                onChange={(e) => setUpi(e.target.value)}
                                            />
                                            {errors.upi && <small className="text-danger">{errors.upi}</small>}
                                        </div>
                                    )}
                                    {paymentMethod === "bank" && (
                                        <>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.accountNumber ? 'border border-danger' : ''}`}
                                                    placeholder="Account Number"
                                                    value={accountNumber}
                                                    onChange={(e) => setAccountNumber(e.target.value)}
                                                    
                                                />
                                                {errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.bankName ? 'border border-danger' : ''}`}
                                                    placeholder="Bank Name"
                                                    value={bankName}
                                                    onChange={(e) => setBankName(e.target.value)}
                                                />
                                                {errors.bankName && <small className="text-danger">{errors.bankName}</small>}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.ifscCode ? 'border border-danger' : ''}`}
                                                    placeholder="IFSC Code"
                                                    value={ifscCode}
                                                    onChange={(e) => setIfscCode(e.target.value)}
                                                />
                                                {errors.ifscCode && <small className="text-danger">{errors.ifscCode}</small>}
                                            </div>
                                        </>
                                    )}
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.fullName ? 'border border-danger' : ''}`}
                                            placeholder="Full Name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                        {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                                    </div>
                                </div>

                                <button className="btn btn-primary mt-3 text-xsm" type="submit" disabled={loading}>
                                    {loading ? 'Processing...' : 'Withdraw'}
                                </button>

                                {errorField && (
                                    <div className="col-12">
                                        <small className="text-danger">{errorField}</small>
                                    </div>
                                )}
                            </form>
                        )}

                        {successMessage && (
                            <div className="alert text-xsm alert-success border-0 text-center">{successMessage}</div>
                        )}

                        {/* Rules */}
                        <div className="alert alert-warning border-0">
                            <h6 className="text-sm">{trans.WithdrawnInstrauction}</h6>
                            <ul className="mb-0 text-xsm">
                                {trans.withdranRules.map((rules, index) => (
                                    <li key={index}>{rules}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Withdraw History */}
                        <div>
                            <h4 className="text-md text-muted">{trans.recentWithdraw}</h4>

                            {withdrawHistory.length === 0 ? (
                                <p className="text-muted text-xsm">No withdrawal history found.</p>
                            ) : (
                                withdrawHistory.map((data, index) => {
                                    const requestedAt = data.requestedAt ? new Date(data.requestedAt).toISOString().split("T")[0] : "-";
                                    const approvedAt = data.approvedAt ? new Date(data.approvedAt).toISOString().split("T")[0] : "-";
                                    const completedAt = data.completedAt ? new Date(data.completedAt).toISOString().split("T")[0] : "-";

                                    return (
                                        <div key={index} className="transaction-card p-2 mb-3 d-flex">
                                            <div className="icon-circle me-3 bg-light">
                                                <i className="fas fa-shopping-cart"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <h6 className="mb-0 text-sm">
                                                            {data.paymentMethod === "upi" && data.upiId
                                                                ? `${maskUpi(data.upiId)} (upi)`
                                                                : data.paymentMethod === "bank" && data.accountNumber
                                                                    ? `${maskAccount(data.accountNumber)} (a/c no)`
                                                                    : "N/A"}
                                                        </h6>
                                                        <span className="text-muted text-xxsm">{requestedAt}</span>
                                                        {data.status === "approved" && <span className="text-muted text-xxsm px-2">{approvedAt}</span>}
                                                        {data.status === "completed" && <span className="text-muted text-xxsm px-2">{completedAt}</span>}
                                                    </div>
                                                    <div className="text-end">
                                                        <h6 className={data.status === 'pending' ? "text-secondary m-0" : "text-success m-0"}>₹{data.amount.toFixed(2)}</h6>
                                                        <p className={data.status === 'pending' ? "text-secondary text-xxsm" : "color-two text-xxsm"}>
                                                            {data.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <AdsButtom />
        </div>
    );
};

export default BalancePage;
