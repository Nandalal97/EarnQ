// utils/GuestRoute.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from './getAuthToken';

const GuestRoute = ({ children }) => {
  const token = getAuthToken();

    const navigate = useNavigate();
    useEffect(() => {
   
   if (token) {
      navigate('/');
      return;
    }
    });

  // Otherwise allow access to guest page
  return children;
};

export default GuestRoute;
