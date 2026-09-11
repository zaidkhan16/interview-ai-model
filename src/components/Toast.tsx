import React, { useEffect } from 'react';
import type { ToastMessage } from '../types/auth';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="toast-icon success" size={18} />;
      case 'error':
        return <AlertTriangle className="toast-icon error" size={18} />;
      case 'info':
      default:
        return <Info className="toast-icon info" size={18} />;
    }
  };

  return (
    <div className={`toast-card toast-${toast.type} animate-slide-in`}>
      <div className="toast-icon-wrapper">{getIcon()}</div>
      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        {toast.description && <div className="toast-desc">{toast.description}</div>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="toast-close-btn"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};
