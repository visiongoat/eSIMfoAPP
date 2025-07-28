import React from 'react';
import { X } from 'lucide-react';
import autoRenewalIcon from '@assets/auto-renewal1.png';
import businessTravelsIcon from '@assets/businesstravels.png';
import longJourneysIcon from '@assets/Longjourneys.png';
import remoteWorkIcon from '@assets/Remotework.png';

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
      {/* Header with close button */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 px-4 py-2 flex justify-end">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-7 h-7 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-2">
        {/* Hero Icon */}
        <div className="flex justify-center mb-4">
          <img 
            src={autoRenewalIcon} 
            alt="Auto Renewal"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Stay connected with auto-renewal
          </h1>
        </div>

        {/* Perfect for section */}
        <div className="mb-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 text-center">Auto-renewal is perfect for</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex justify-center mx-auto mb-2">
                  <img 
                    src={businessTravelsIcon} 
                    alt="Business travels"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Business travels</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mx-auto mb-2">
                  <img 
                    src={longJourneysIcon} 
                    alt="Long journeys"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Long journeys</div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mx-auto mb-2">
                  <img 
                    src={remoteWorkIcon} 
                    alt="Remote work"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Remote work</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits section */}
        <div className="mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Enjoy these benefits</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-5">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#f97316" className="flex-shrink-0">
                  <path d="M12 2l-2 4v6l-3 3v7h10v-7l-3-3V6l-2-4z"/>
                  <circle cx="8" cy="8" r="1"/>
                  <circle cx="16" cy="8" r="1"/>
                  <path d="M6 6c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="#f97316" strokeWidth="1"/>
                </svg>
                <div className="flex-1 min-h-[48px] flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">One-time activation</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">No need to set up a new SIM card every time, recharge your current one</p>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#3b82f6" className="flex-shrink-0">
                  <path d="M12 1C8.5 1 5.6 3.4 5.6 6.4v2.7c-1.5.3-2.6 1.6-2.6 3.2v4.4c0 1.8 1.5 3.3 3.3 3.3h1.4v-8.8c0-2.2 1.8-4 4-4s4 1.8 4 4v8.8h1.4c1.8 0 3.3-1.5 3.3-3.3v-4.4c0-1.6-1.1-2.9-2.6-3.2V6.4C18.4 3.4 15.5 1 12 1z"/>
                  <circle cx="7" cy="16" r="1.5" fill="#f97316"/>
                </svg>
                <div className="flex-1 min-h-[48px] flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Priority support</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Your requests will receive priority attention in our ticketing system</p>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#10b981" className="flex-shrink-0">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                <div className="flex-1 min-h-[48px] flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Expedited return</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">If it doesn't work - your refund request will be prioritized</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for sticky button */}
        <div className="h-16"></div>
      </div>

      {/* Sticky bottom section */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-100 dark:border-gray-700">
        {/* Cancel info */}
        <div className="text-center mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Cancel anytime</p>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg transition-colors hover:bg-gray-800 dark:hover:bg-gray-100"
        >
          Great!
        </button>
      </div>
    </div>
  );
};