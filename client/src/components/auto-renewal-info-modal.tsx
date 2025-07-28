import React from 'react';
import { X } from 'lucide-react';
import autoRenewalIcon from '@assets/auto-renewal1.png';
import businessTravelsIcon from '@assets/businesstravels.png';
import longJourneysIcon from '@assets/Longjourneys.png';
import remoteWorkIcon from '@assets/Remotework.png';
import oneTimeActivationIcon from '@assets/onetimeactivation.png';
import prioritySupportIcon from '@assets/prioritysupport.png';
import expeditedReturnIcon from '@assets/Expeditedreturn.png';

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
                <img 
                  src={oneTimeActivationIcon} 
                  alt="One-time activation"
                  className="w-12 h-12 object-contain flex-shrink-0"
                />
                <div className="flex-1 min-h-[48px] flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">One-time activation</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">No need to set up a new SIM card every time, recharge your current one</p>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <img 
                  src={prioritySupportIcon} 
                  alt="Priority support"
                  className="w-12 h-12 object-contain flex-shrink-0"
                />
                <div className="flex-1 min-h-[48px] flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Priority support</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Your requests will receive priority attention in our ticketing system</p>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <img 
                  src={expeditedReturnIcon} 
                  alt="Expedited return"
                  className="w-12 h-12 object-contain flex-shrink-0"
                />
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