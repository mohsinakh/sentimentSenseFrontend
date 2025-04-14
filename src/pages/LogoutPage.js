// src/pages/LogoutPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory

const LogoutPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // useNavigate hook to navigate programmatically

  useEffect(() => {
    const logout = () => {
      // Simulate an API call or any logout action (e.g., remove token)
      localStorage.removeItem('access_token'); // Remove the token from localStorage

      setTimeout(() => {
        setLoading(false); // Set loading to false after 2 seconds (simulate API call duration)
        navigate('/'); // Redirect to home page after logging out
      }, 2000); // Simulate loading time of 2 seconds
    };

    logout(); // Call the logout function
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <div>Logging out...</div> // Show loading message while logging out
      ) : (
        <div>You have been logged out. Redirecting...</div> // Show message after logout
      )}
    </div>
  );
};

export default LogoutPage;
