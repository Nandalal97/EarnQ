// utils/decodeToken.js
export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded); // returns { id, email, etc. }
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
};
