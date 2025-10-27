// utils/getAuthToken.js
// export const getAuthToken = () => {
//   const cookies = document.cookie ? document.cookie.split(';') : [];

//   for (const cookie of cookies) {
//     const [key, ...valParts] = cookie.trim().split('=');
//     if (key === 'authToken') {
//       return decodeURIComponent(valParts.join('='));
//     }
//   }

//   return null;
// };


// utils/getAuthToken.js
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};
