// src/components/AuthFooterLinks.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthFooterLinks = () => {
  return (
    <div className="text-center mt-4 small text-muted">
      <p>
        <Link to="/about-us" className="mx-1">About</Link> | 
        <Link to="/privacyPolicy" className="mx-1">Privacy Policy</Link> | 
        <Link to="/termsConditions" className="mx-1">Terms & Conditions</Link> | 
        <Link to="/refundPolicy" className="mx-1">Refund Policy</Link>|
        <Link to="/contact-us" className="mx-1">contact</Link>
      </p>
    </div>
  );
};

export default AuthFooterLinks;
