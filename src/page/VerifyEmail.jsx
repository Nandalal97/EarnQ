import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../utils/axios';

const VerifyEmail = () => {
  const location = useLocation();
  const [message, setMessage] = useState('Verifying email...');
  const [status, setStatus] = useState(null); // null = loading, 1 = success, 0 = error

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    if (!token) {
      setMessage('Invalid or missing verification token.');
      setStatus(0);
      return;
    }

    API.get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        setMessage(res.data.msg);
        setStatus(res.data.status ?? 1);
      })
      .catch((err) => {
        const errMsg = err.response?.data?.msg || 'Verification failed.';
        setMessage(errMsg);
        setStatus(0);
      });
  }, [location]);

  return (
    <div className="container mt-5 text-center">
      <h3>{message}</h3>

      {status === 1 && (
        <>
          <p style={{ color: 'green' }}>Email verified successfully. You can now log in. <Link to="/login" style={{ marginLeft: 5, textDecoration: 'underline' }}>Go to Login</Link></p>
          
        </>
      )}

      {status === 0 && (
        <p style={{ color: 'red' }}>Verification failed or link expired.</p>
      )}
    </div>
  );
};

export default VerifyEmail;
