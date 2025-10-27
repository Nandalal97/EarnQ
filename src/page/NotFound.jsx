// src/page/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center bg-light">
      <h3 className="fw-bold text-danger mb-0">404</h3>
      <h5 className="mb-2">Oops! Page not found</h5>
      <p className="text-muted mb-2">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className="text-xsm">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
