import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));
  const { showToast } = useToast();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Please log in to access this page.', 'warning');
      setRedirect(true);
    }
  }, [isAuthenticated, showToast]);

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
