import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, CreditCard, Clock, Euro } from 'lucide-react';
import { useLocation } from 'wouter';
import CheckoutModal from '../components/checkout-modal';

export default function BalanceBackup() {
  const [, navigate] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['/api/profile'],
  });

  const amounts = [5, 10, 20, 50, 100];

  const handleTopUp = (amount: number) => {
    setSelectedAmount(amount);
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Balance</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Euro className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Balance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Available for purchases</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                €{profile?.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-gray-100">Top Up</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Add money</div>
            </div>
          </button>

          <button className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-gray-100">History</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">View transactions</div>
            </div>
          </button>
        </div>

        {/* Top Up Amounts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Choose Amount</h3>
          <div className="grid grid-cols-2 gap-3">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleTopUp(amount)}
                className="bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 rounded-lg p-4 text-center transition-colors"
              >
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">€{amount}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Credit Card</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">•••• 1234</div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Default</div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        amount={selectedAmount || 0}
        type="balance"
        showPaymentMethodsDefault={true}
      />
    </div>
  );
}