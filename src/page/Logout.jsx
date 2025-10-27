// page/Logout.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from '../assets/success.gif'
import API from '../utils/axios';

const Logout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Logging you out...');

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await API.get('/auth/logout', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          withCredentials: true
        });
        // console.log('Logout response:', response.data); // ✅ log full response
        setMessage(response.data.msg || 'Logged out successfully');
      } catch (error) {
        console.log('Logout error:', error.response?.data || error.message); // ✅ log error
        setMessage(
          error.response?.data?.msg || 'Error during logout. You may already be logged out.'
        );
      }

      // ✅ Clear client-side tokens and session
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      localStorage.removeItem('authToken');
      localStorage.removeItem('userLoggedIn');
      sessionStorage.clear();

      // ✅ Redirect to login after delay
      setTimeout(() => navigate('/login'), 1500);
    };

    logout();
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">

      <p className='fw-bold text-success'><img src={image} alt="logout success" width={30} /> <span className='fw-normal text-success'>{message}</span></p>
    </div>
  );
};

export default Logout;
