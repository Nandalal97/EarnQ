import React, { useEffect, useRef, useState } from 'react';
import API from '../utils/axios';
import { useNavigate } from 'react-router-dom';

function CheckSession({ interval = 30000}) { // default 30s
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // State for custom alert modal
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  // Function to stop any scheduled check
  const stopCheck = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const checkSession = async () => {
    try {
      const response = await API.get('/auth/check-session');

      if (response.data.status === true) {
        // Session valid, stop further checks
        stopCheck();
        return;
      }

      if (response.data.status === false) {
        // Session expired, logout
        console.log('Session expired:', response.data.msg);
        setAlertMsg(response.data.msg || 'Session Expired. Please Login Again');
        setShowAlert(true);
        localStorage.removeItem('authToken');
        stopCheck();
        return;
      }

    } catch (err) {
      console.error('API error:', err.response?.data || err);

      // If API says session invalid
      if (err.response?.data?.status === false) {
        setAlertMsg(err.response?.data?.msg || 'Session Expired. Please Login Again');
        setShowAlert(true);
        localStorage.removeItem('authToken');
        stopCheck();
        return;
      }

      if (err.response?.data?.msg === 'Invalid token or session expired') {
        setAlertMsg('Session Expired. Please Login Again');
        setShowAlert(true);
        localStorage.removeItem('authToken');
        stopCheck();
        return;
      }
    }

    // Schedule next check if still mounted
    timeoutRef.current = setTimeout(checkSession, interval);
  };

  useEffect(() => {
    checkSession();

    // Listen to localStorage events to sync logout across tabs
    const handleStorageEvent = (event) => {
      if (event.key === 'authToken' && !event.newValue) {
        stopCheck();
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      stopCheck();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [navigate, interval]);

  // Handle alert confirmation
  const handleAlertClose = () => {
    setShowAlert(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {showAlert && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p style={styles.p}>{alertMsg}</p>
            <button style={styles.button} onClick={handleAlertClose}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}

// Inline styles for modal
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '13px 20px',
    borderRadius: '3px',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  p:{
        fontSize: '12px',
        // color:"red",
  },
  button: {
    marginTop: '10px',
    padding: '2px 15px',
    border: 'none',
    fontSize: '12px',
    backgroundColor: '#460adeff',
    color: '#fff',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default CheckSession;
