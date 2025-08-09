import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function BalanceScreen() {
  const [, navigate] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Simple Header */}
      <div className="bg-gray-100 dark:bg-gray-900 px-4 py-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/profile')} className="mr-3">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">fo Balance</h1>
        </div>
      </div>

      <div className="px-4">
        {/* Balance Card - Exact match to example */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 mx-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
                </svg>
              </div>
              <span className="text-base font-medium text-gray-700 dark:text-gray-300">fo Balance</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">50.00 €</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Exact match to example */}
        <div className="flex mb-6 bg-white dark:bg-gray-800 rounded-2xl p-1 mx-2 shadow-sm">
          <button
            onClick={() => setActiveTab('topup')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'topup'
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Top Up
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            History
          </button>
        </div>

        {/* Special Offer - Exact match to example */}
        <div className="bg-green-100 dark:bg-green-900/20 rounded-2xl p-4 mb-6 mx-2 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-green-800 dark:text-green-200">Special Offer!</div>
                <div className="text-sm text-green-700 dark:text-green-300">Top up €100, get €5 bonus</div>
              </div>
            </div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">+€5</div>
          </div>
        </div>

        {/* Choose Amount - Exact match to example */}
        <div className="mb-6 px-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Choose Amount</h2>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setSelectedAmount(5)}
              className={`py-4 px-4 rounded-2xl border font-semibold transition-all duration-200 ${
                selectedAmount === 5
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600'
              }`}
            >
              € 5
            </button>
            <button
              onClick={() => setSelectedAmount(10)}
              className={`py-4 px-4 rounded-2xl border-2 border-blue-500 bg-blue-500 text-white font-semibold transition-all duration-200`}
            >
              € 10
            </button>
            <button
              onClick={() => setSelectedAmount(20)}
              className={`py-4 px-4 rounded-2xl border font-semibold transition-all duration-200 ${
                selectedAmount === 20
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600'
              }`}
            >
              € 20
            </button>
            
            <button
              onClick={() => setSelectedAmount(50)}
              className={`py-4 px-4 rounded-2xl border-2 border-blue-500 bg-blue-500 text-white font-semibold transition-all duration-200`}
            >
              € 50
            </button>
            <button
              onClick={() => setSelectedAmount(100)}
              className={`relative py-4 px-4 rounded-2xl border font-semibold transition-all duration-200 ${
                selectedAmount === 100
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600'
              }`}
            >
              € 100
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                +€5
              </div>
            </button>
            <button
              onClick={() => setSelectedAmount(0)}
              className={`py-4 px-4 rounded-2xl border font-semibold transition-all duration-200 ${
                selectedAmount === 0
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600'
              }`}
            >
              Other
            </button>
          </div>
        </div>

        {/* Top Up Button - Exact match to example */}
        <div className="px-2 pb-8">
          <button
            className="w-full py-4 rounded-2xl bg-blue-500 text-white font-semibold text-lg shadow-lg"
          >
            € 10 - Top up Now
          </button>
        </div>

        {/* Terms - Exact match to example */}
        <div className="px-2 pb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            You agree to <span className="text-blue-500 underline">Terms</span>, <span className="text-blue-500 underline">Privacy</span>, <span className="text-blue-500 underline">Purchase Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}