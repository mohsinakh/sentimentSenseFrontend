import React from 'react';
import './css/ToastNotification.css';

const ToastNotification = ({ message, type, position = 'top-right', duration = 200, customStyles = {} }) => {
  let bgColor;
  let icon;

  switch (type) {
    case 'success':
      bgColor = '#4caf50';
      icon = '✔';
      break;
    case 'error':
      bgColor = '#f44336';
      icon = '✖';
      break;
    case 'info':
      bgColor = '#2196f3';
      icon = 'ℹ';
      break;
    case 'warning':
      bgColor = '#ff9800';
      icon = '⚠';
      break;
    case 'neutral':
      bgColor = '#9e9e9e';
      icon = '○';
      break;
    case 'primary':
      bgColor = '#3f51b5';
      icon = '★';
      break;
    default:
      bgColor = '#4caf50';
      icon = '✔';
  }

  const positionStyles = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  };

  return (
    <div
      className="toast-notification"
      style={{
        backgroundColor: bgColor,
        ...positionStyles[position],
        ...customStyles,
      }}
    >
      <span className="toast-icon" style={{ marginRight: '10px' }}>{icon}</span>
      <p>{message}</p>
    </div>
  );
};

export default ToastNotification;