import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className={`inline-block w-full ${sizeClasses[size]} p-8 my-8 text-left align-middle transition-all transform glass-card shadow-2xl rounded-3xl relative floating`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-white/20 p-2 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmColor = 'red' }) => {
  const colorClasses = {
    red: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-105',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transform hover:scale-105',
    green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <p className="text-gray-700 text-lg font-medium leading-relaxed">{message}</p>
        
        <div className="flex space-x-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white/50 hover:bg-white/70 rounded-xl transition-all font-semibold border border-gray-200 hover:border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-3 text-white rounded-xl transition-all font-semibold ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
