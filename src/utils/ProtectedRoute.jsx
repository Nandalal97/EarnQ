import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from './getAuthToken';

const decodeJwt = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const authToken = getAuthToken();

    if (!authToken) {
      navigate('/login');
      return;
    }

    const userData = decodeJwt(authToken);
    if (!userData) {
      localStorage.removeItem('authToken');
      navigate('/login');
      return;
    }

    if (userData.isLogin === false) {
      localStorage.removeItem('authToken');
      navigate('/login');
      return;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (userData.premiumExpiry && userData.premiumExpiry < nowInSeconds) {
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userLoggedIn');
      navigate('/login');
      return;
    }

    setCheckingAuth(false);
  }, [navigate]);

  if (checkingAuth) return null; // You can replace this with a loading spinner

  return children;
};

export default ProtectedRoute;
