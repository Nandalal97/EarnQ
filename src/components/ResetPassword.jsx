// src/components/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../utils/axios";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMessage('')
        setMessage("");
        if (password.length < 8) {
      setErrMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
        try {
            const res = await API.post(`/auth/reset-password/${token}`, { password });
            setMessage(res.data.message || "Password updated successfully.");
            setPassword('');
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setErrMessage(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="page-wrapper">
                <div className="content-row">
                    <main className="app-container2">
                        <div className="forgotPassword">
                            <div className="forgot-box">

                                <h2 className="mb-1 text-lg text-center gap-1">Reset Password</h2>
                                <p className="pb-2 text-center">Please enter your new password below.Use at least 8 characters. </p>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span className="text-xsm text-muted">Ex: Pa$$w0rd!23</span>
                                    
                                    <div className="mt-2">
                                        <button type="submit" disabled={loading} className="btn-invite color-white bg-one cursor-pointer border-0">
                                            {loading ? "Updating..." : "Update Password"}
                                        </button>
                                    </div>

                                </form>
                                {message && <p className="text-sm pt-2 text-center text-success">{message}</p>}
                                <p className="text-sm pt-2 text-center text-danger">{errMessage}</p>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </>

    );
}
