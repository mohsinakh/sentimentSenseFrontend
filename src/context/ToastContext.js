import React, { createContext, useState, useContext } from 'react';
import ToastNotification from '../pages/ToastNotification';

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: '',
    type: '', // Success, Error, etc.
    visible: false,
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ message: '', type: '', visible: false });
    }, 2000); // Toast disappears after 1 seconds
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && <ToastNotification message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};
