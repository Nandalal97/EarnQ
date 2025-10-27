import React, { useEffect, useState } from 'react';

function IPChecker() {
  const [ip, setIp] = useState('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="text-center mt-5">
      <h4>Your IP Address:</h4>
      <p>{ip || 'Loading...'}</p>
    </div>
  );
}

export default IPChecker;
