import React from 'react';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';

const BlacklistWarning = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl border-2 border-danger w-full max-w-md mx-4 overflow-hidden">
        {/* Danger Header */}
        <div className="bg-danger p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert size={32} className="text-white" />
              <h2 className="text-2xl font-bold text-white">ACTION DENIED</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="bg-danger/10 p-4 rounded-full">
              <AlertTriangle size={48} className="text-danger" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-text">Account Blacklisted</h3>
            <p className="text-gray-300">
              This applicant account has been blacklisted and cannot be edited.
            </p>
            <p className="text-sm text-gray-400 pt-2">
              Security measures prevent any modifications to blacklisted accounts to
              maintain data integrity and audit compliance.
            </p>
          </div>

          {/* Restrictions List */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <h4 className="font-semibold text-text mb-3 text-sm">Restrictions Applied:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-danger mt-0.5">✗</span>
                <span>Control number cannot be modified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger mt-0.5">✗</span>
                <span>Personal information editing is blocked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger mt-0.5">✗</span>
                <span>Backend API enforces these restrictions</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-danger hover:bg-dangerHover text-white rounded-lg font-medium transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlacklistWarning;
