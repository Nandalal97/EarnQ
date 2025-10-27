import React, { useState, useEffect } from 'react';
import GoogleAd from './GoogleAd'
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';

function AdsButtom() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const user = decodeToken(token);
      setIsPremium(user?.isPremium || false);
    }
  }, []);

  return (
    <>
    {!isPremium && (
      <div className="ads-banner">
        <div className="ad-top">
          <>
            {/* <img src="https://placehold.co/720x90" alt="Top Ad" /> */}
            <GoogleAd adSlot="0987654321" />
          </>
        </div>
      </div>
       )}
    </>
  )
}

export default AdsButtom