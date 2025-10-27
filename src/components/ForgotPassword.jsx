// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import API from "../utils/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMessage("");
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "Password reset link sent to your email.");
      setEmail("");

      setTimeout(() => {
        navigate("/login");
      }, 5000);
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
                <h3 className="mb-2 text-lg text-center gap-1">Forgot Password</h3>
                <p className="pb-2">
                  Enter your registered email address and we’ll send you a password reset link.
                </p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="mt-2">
                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="btn-invite color-white bg-one cursor-pointer border-0"
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
                {message && (
                  <p className="text-lg pt-2 text-center text-success">{message}</p>
                )}
                {errMessage && (
                  <p className="text-lg pt-2 text-center text-danger">{errMessage}</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
