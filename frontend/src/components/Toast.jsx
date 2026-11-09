import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />;
      case 'danger':
        return <AlertCircle size={18} style={{ color: 'var(--danger)' }} />;
      case 'info':
      default:
        return <Info size={18} style={{ color: 'var(--accent-cyan)' }} />;
    }
  };

  return (
    <div className="toast-container" aria-live="polite">
      <div className={`toast toast-${type}`}>
        {renderIcon()}
        <span style={{ flex: 1 }}>{message}</span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
          }}
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

