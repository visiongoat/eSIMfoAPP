import React from 'react';
import { X } from 'lucide-react';

interface AutoRenewalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoRenewalInfoModal: React.FC<AutoRenewalInfoModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 flex justify-end items-center">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-8 pt-4">
        {/* Hero Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                    fill="currentColor" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Stay connected with auto-renewal
          </h1>
        </div>

        {/* Perfect for section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Auto-renewal is perfect for</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M14 6V4h-4v2c0 .55-.45 1-1 1s-1-.45-1-1V4H6C4.89 4 4 4.89 4 6v2h16V6c0-1.11-.89-2-2-2h-2v2c0 .55-.45 1-1 1s-1-.45-1-1z"/>
                  <path d="M4 20c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V10H4v10z"/>
                </svg>
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Business trips</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM10 6a2 2 0 0 1 4 0v1h-4V6zm2 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                </svg>
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Extended trips</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                </svg>
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Remote work</div>
            </div>
          </div>
        </div>

        {/* Benefits section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Enjoy these benefits</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L20 8l-8 8z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Seamless activation</h3>
                <p className="text-gray-600 dark:text-gray-400">No need to purchase a new eSIM each time, your current plan automatically extends</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Priority support</h3>
                <p className="text-gray-600 dark:text-gray-400">Your requests receive priority handling in our support system</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Fast refund</h3>
                <p className="text-gray-600 dark:text-gray-400">If it doesn't work - your refund request gets prioritized</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Enhanced security</h3>
                <p className="text-gray-600 dark:text-gray-400">Your connection gets upgraded security features and monitoring</p>
              </div>
            </div>
          </div>
        </div>

        {/* More info */}
        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">More about auto-renewal</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Cancel info */}
        <div className="text-center mb-8">
          <p className="text-gray-500 dark:text-gray-400">Cancel anytime</p>
        </div>

        {/* Action button */}
        <div className="px-6">
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl transition-colors hover:bg-gray-800 dark:hover:bg-gray-100 text-lg shadow-lg"
          >
            Great!
          </button>
        </div>
      </div>
    </div>
  );
};