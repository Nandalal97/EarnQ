import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function DeviceCheck() {
  const [isMobile, setIsMobile] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    // Detect mobile device
    const ua = navigator.userAgent;
    const mobileCheck = /Mobile|iPhone|Android|BlackBerry|IEMobile|Kindle|Opera Mini/i.test(ua);
    setIsMobile(mobileCheck);

    // Check if warning was already closed in this session
    const warningClosed = sessionStorage.getItem('deviceWarningClosed');
    if (warningClosed === 'true') {
      setShowWarning(false);
    }
  }, []);

  const handleClose = () => {
    setShowWarning(false);
    sessionStorage.setItem('deviceWarningClosed', 'true'); // Persist for this session
  };

  if (!isMobile && showWarning) {
    return (
      <div
        className="alert alert-warning alert-dismissible fade show text-center mb-0 py-2"
        role="alert"
      >
        <p className="mb-0 small">
          📱 For the best experience, please use this app on a <strong>mobile device</strong>.
        </p>
        <button
          type="button"
          className="btn-close py-2"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </div>
    );
  }

  return <>{/* Your actual mobile content goes here */}</>;
}

export default DeviceCheck;
