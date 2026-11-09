import React from 'react';

export const Toast = ({ type = 'info', title, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'ri-checkbox-circle-fill';
      case 'error':
        return 'ri-error-warning-fill';
      case 'warning':
        return 'ri-alert-fill';
      default:
        return 'ri-information-fill';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <i className={`toast-icon ${getIcon()}`}></i>
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        <div className="toast-message">{message}</div>
      </div>
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Close message">
          <i className="ri-close-line"></i>
        </button>
      )}
    </div>
  );
};

export const ToastContainer = ({ toasts = [], removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
