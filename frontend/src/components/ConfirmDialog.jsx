import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
  if (!isOpen) return null;

  const colors = {
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning',
      button: 'bg-warning hover:bg-warning/80',
      icon: 'text-warning'
    },
    danger: {
      bg: 'bg-danger/10',
      border: 'border-danger',
      button: 'bg-danger hover:bg-dangerHover',
      icon: 'text-danger'
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success',
      button: 'bg-success hover:bg-success/80',
      icon: 'text-success'
    }
  };

  const color = colors[type] || colors.warning;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl border border-border w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-text transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`${color.bg} border ${color.border} rounded-lg p-4 mb-4`}>
            <p className="text-text">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-background hover:bg-border text-text rounded-lg font-medium transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-3 ${color.button} text-white rounded-lg font-medium transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
