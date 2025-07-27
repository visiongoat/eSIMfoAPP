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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <div></div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Hero Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Stay connected with auto-renewal
            </h2>
          </div>

          {/* Perfect for section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Auto-renewal is perfect for</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-lg">💼</span>
                </div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Business trips</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-lg">🚗</span>
                </div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Extended trips</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-lg">💻</span>
                </div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Remote work</div>
              </div>
            </div>
          </div>

          {/* Benefits section */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Enjoy these benefits</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-lg">📶</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Seamless activation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No need to purchase a new eSIM each time, your current plan automatically extends</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-lg">🎧</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Priority support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your requests receive priority handling in our support system</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-lg">💰</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Fast refund</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">If it doesn't work - your refund request gets prioritized</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-lg">🔒</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Enhanced security</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your connection gets upgraded security features and monitoring</p>
                </div>
              </div>
            </div>
          </div>

          {/* More info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <button className="w-full flex items-center justify-between text-left">
              <span className="font-medium text-gray-900 dark:text-white">More about auto-renewal</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Cancel info */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Cancel anytime</p>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl transition-colors hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            Great!
          </button>
        </div>
      </div>
    </div>
  );
};