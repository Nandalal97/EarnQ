// components/UserCoins.jsx
import React, { useEffect, useState } from 'react';
import API from '../utils/axios';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';

function UserCoins({ refreshKey = 0 }) {
  const [totalCoin, setTotalCoin] = useState(0);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const userData = decodeToken(token);
    if (!userData?.id) return;

    const fetchTotalCoin = async () => {
      try {
        const res = await API.get(`user/coins/${userData.id}`);
        setTotalCoin(res.data.totalCoins);
      } catch (error) {
        console.log('Error fetching total coins:', error);
      }
    };

    fetchTotalCoin();
  }, [refreshKey]); // Re-fetch when refreshKey changes

  return <span>{totalCoin}</span>;
}

export default UserCoins;
