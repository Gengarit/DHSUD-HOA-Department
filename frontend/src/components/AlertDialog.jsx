import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const AlertDialog = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const configs = {
    success: {
      bg: 'bg-success/10',
      border: 'border-success',
      icon: CheckCircle,
      iconColor: 'text-success',
      button: 'bg-success hover:bg-success/80'
    },
    error: {
      bg: 'bg-danger/10',
      border: 'border-danger',
      icon: AlertCircle,
      iconColor: 'text-danger',
      button: 'bg-danger hover:bg-dangerHover'
    },
    info: {
      bg: 'bg-accent/10',
      border: 'border-accent',
      icon: Info,
      iconColor: 'text-accent',
      button: 'bg-accent hover:bg-accentHover'
    }
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

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
          <div className={`${config.bg} border ${config.border} rounded-lg p-4 mb-4`}>
            <div className="flex items-start gap-3">
              <Icon className={config.iconColor} size={24} />
              {typeof message === 'string' ? (
                <p className="text-text flex-1 whitespace-pre-wrap">{message}</p>
              ) : (
                <div className="text-text flex-1">{message}</div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className={`w-full px-4 py-3 ${config.button} text-white rounded-lg font-medium transition-colors`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
