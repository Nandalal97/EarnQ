import React, { useState, useEffect } from 'react';
import GoogleAd from './GoogleAd'
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
function AdsBanner() {
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
      <div>
        <aside className="side-ad-left">
          {/* <img src="https://placehold.co/160x600" alt="Ad Left" /> */}
         
          {!isPremium && window.innerWidth > 768 && <GoogleAd adSlot="0987654321" />}
        </aside>
        <aside className="side-ad-right">
          {/* <img src="https://placehold.co/160x600" alt="Ad Right" /> */}
         
          {!isPremium && window.innerWidth > 768 && <GoogleAd adSlot="1122334856" />}
        </aside>
      </div>
    </>
  )
}

export default AdsBanner