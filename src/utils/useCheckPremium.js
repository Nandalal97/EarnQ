// hooks/useCheckPremium.js
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
import API from '../utils/axios';

export const useCheckPremium = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const userData = decodeToken(token);
    const userId = userData?.id;
    if (!userId) return;

    const fetchUserDatas = async () => {
      try {
        const res = await API.get(`/users/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;
        const now = new Date();
        const expiry = new Date(user.premiumExpiry);

        // ✅ Only check expiry if user isPremium is true
        if (user.isPremium && expiry <= now) {
          await Swal.fire({
            html: `
              <div style="font-size: 3rem; color: #e74c3c;">❗</div>
              <p style="margin-top: 10px;">Your premium has expired. Please subscribe again.</p>
            `,
            iconColor: '#e74c3c',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            width: '300px',
            padding: '1rem',
            background: '#fefefe',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            customClass: {
              popup: 'premium-expired-popup',
              icon: 'custom-swal-icon-size',
            },
          });

          localStorage.removeItem('authToken');
          navigate('/logout');
        }

        // ✅ If user is not premium, do nothing (free user)
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserDatas();
  }, [navigate]);
};
