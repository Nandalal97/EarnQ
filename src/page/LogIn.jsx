import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import API from '../utils/axios';
import loginImg from '../assets/login-img.png';
import AuthFooterLinks from "../components/AuthFooterLinks";

const LogIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load stored email/password on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberEmail');
    const storedPassword = localStorage.getItem('rememberPassword');
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRemember(true);
    }
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberChange = (e) => {
    const checked = e.target.checked;
    setRemember(checked);
    if (!checked) {
      localStorage.removeItem('rememberEmail');
      localStorage.removeItem('rememberPassword');
    }
  };

  const validateEmail = (email) => {
    // Basic email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show error if email or password is empty
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post(
        '/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const result = response.data;

      if (result.status === 1 && result.access_token) {
        localStorage.setItem('authToken', result.access_token);
        localStorage.setItem('lang', result.user.language);

        // Store email/password if remember is checked
        if (remember) {
          localStorage.setItem('rememberEmail', email);
          localStorage.setItem('rememberPassword', password);
        }

        setError('');
        navigate('/');
      } else {
        setError(result.msg || 'Login failed. Please try again.');
      }
    } catch (err) {
      const backendMsg = err?.response?.data?.msg || 'Login error. Please try again.';
      setError(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  const handaleForgotPasswordLink = () => {
    navigate('/forgot-password');
  };

  const handaleSignUpLink = () => {
    navigate('/signup');
  };

  setTimeout(() => {
          setError('');
        }, 7000);

  return (
    <div className="login-container">
      <div className="loginSection">
        <div className="login-form">
          <img src={loginImg} alt="Login Banner" />

          <div className="form-input mt-3">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-input">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-eye" onClick={togglePassword}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="form-options mt-1">
            <label className="d-flex align-items-center">
              <input
                type="checkbox"
                className="me-1"
                checked={remember}
                onChange={handleRememberChange}
              /> Remember me
            </label>
            <span className="cursor-pointer" onClick={handaleForgotPasswordLink}>
              Forgot password?
            </span>
          </div>

          <div
            className="btn-invite bg-one border-0 color-white text-center"
            onClick={!loading ? handleSubmit : null}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <span className={`btn-invite bg-one ${loading ? 'opacity-50' : ''}`}>
              {loading ? 'Logging in...' : 'Log In'}
            </span>
          </div>

          {error && (
            <div className="alert alert-danger border-0 mt-2 py-2 mb-0 text-center">
              {error}
            </div>
          )}

          <div className="form-signup pt-2">
            Don’t have an account?{' '}
            <span className="cursor-pointer" onClick={handaleSignUpLink}>
              Sign Up
            </span>
          </div>

          <AuthFooterLinks />
        </div>
      </div>
    </div>
  );
};

export default LogIn;
