import React, { createContext, useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AUTO_LOGOUT_TIME = 400 * 60 * 1000; // 400 minutes in milliseconds

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const naviagte = useNavigate();
  
  const host = process.env.REACT_APP_HOST;  // Fetch API URL from environment variable


  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setToken(null);
    naviagte("/login") // Redirect to login
  }, [naviagte]);

  const login = useCallback((newToken) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  }, []);

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        alert("Your session has expired. You will be logged out.");
        logout();
      }, AUTO_LOGOUT_TIME);

      return () => clearTimeout(timer); // Clear timer on unmount or token change
    }
  }, [token, logout]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('access_token');
      setToken(updatedToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout ,host}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
