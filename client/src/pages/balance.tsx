import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import CheckoutModal from '../components/checkout-modal';

export default function BalanceScreen() {
  const [, navigate] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['/api/profile'],
  });

  // Mock transaction history
  const transactionHistory = [
    { id: 1, amount: 20.00, date: '2024-01-15', method: 'Credit Card', status: 'Completed', type: 'top-up' },
    { id: 2, amount: 50.00, date: '2024-01-10', method: 'PayPal', status: 'Completed', type: 'top-up' },
    { id: 3, amount: 15.00, date: '2024-01-05', method: 'Apple Pay', status: 'Completed', type: 'top-up' },
    { id: 4, amount: 30.00, date: '2024-01-01', method: 'Credit Card', status: 'Completed', type: 'top-up' },
  ];

  const handleTopUp = () => {
    if (selectedAmount && selectedAmount > 0) {
      setShowCheckout(true);
    }
  };

  const createBalancePackage = () => {
    if (!selectedAmount) return null;
    
    return {
      id: 'balance-topup',
      name: `Balance Top-up €${selectedAmount.toFixed(2)}`,
      price: `€${selectedAmount.toFixed(2)}`,
      data: 'Instant balance credit',
      validity: 'Immediate',
      type: 'topup' as const
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/profile')}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">fo Balance</h1>
        </div>
      </div>

      <div className="px-4 pt-6">
        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">fo Balance</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {profile?.balance?.toFixed(2) || '50.00'} €
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('topup')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'topup'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Top Up
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'topup' ? (
          <div className="pb-24">
            {/* Special Offer */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4 mb-6 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
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

            {/* Choose Amount */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Choose Amount</h2>
              
              {/* Amount Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[5, 10, 20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`relative py-4 px-4 rounded-2xl border-2 font-semibold transition-all duration-200 ${
                      selectedAmount === amount
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    € {amount}
                    {amount === 100 && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        +€5
                      </div>
                    )}
                  </button>
                ))}
                
                <button
                  onClick={() => setSelectedAmount(0)}
                  className={`py-4 px-4 rounded-2xl border-2 font-semibold transition-all duration-200 ${
                    selectedAmount === 0
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  Other
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                You agree to{' '}
                <span className="text-blue-500 underline">Terms</span>
                ,{' '}
                <span className="text-blue-500 underline">Privacy</span>
                ,{' '}
                <span className="text-blue-500 underline">Purchase Policy</span>
                .
              </p>
            </div>

            {/* Top Up Button */}
            <div className="fixed bottom-20 left-4 right-4">
              <button
                onClick={handleTopUp}
                disabled={!selectedAmount || selectedAmount <= 0}
                className={`w-full py-4 rounded-2xl font-semibold transition-all duration-200 ${
                  selectedAmount && selectedAmount > 0
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedAmount === 100 ? (
                  `€ ${selectedAmount} + €5 bonus - Top up Now`
                ) : selectedAmount && selectedAmount > 0 ? (
                  `€ ${selectedAmount} - Top up Now`
                ) : (
                  'Select amount to continue'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Transaction History</h2>
            
            {transactionHistory.map((transaction) => (
              <div key={transaction.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Top Up</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">+€{transaction.amount.toFixed(2)}</div>
                    <div className="text-sm text-green-600 dark:text-green-400">{transaction.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        selectedPackage={createBalancePackage()}
        amount={selectedAmount || 0}
        type="balance"
        showPaymentMethodsDefault={true}
      />
    </div>
  );
}