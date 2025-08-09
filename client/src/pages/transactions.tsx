import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Transactions() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<'all' | 'topups' | 'purchases'>('all');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For other browsers
  }, []);

  // Extended transaction data
  const transactions = [
    {
      id: 0,
      type: 'redeem',
      title: 'Redeem Code • WELCOME10',
      amount: 10.00,
      date: 'Jan 9, 2025',
      time: '20:15',
      status: 'completed'
    },
    {
      id: 1,
      type: 'topup',
      title: 'Balance Top-up',
      amount: 105.00,
      bonus: 5.00,
      date: 'Jan 8, 2025',
      time: '14:25',
      status: 'completed'
    },
    {
      id: 2,
      type: 'purchase',
      title: 'Turkey eSIM • 5GB',
      amount: -12.50,
      date: 'Jan 7, 2025',
      time: '09:15',
      status: 'completed'
    },
    {
      id: 3,
      type: 'topup',
      title: 'Balance Top-up',
      amount: 30.00,
      date: 'Jan 5, 2025',
      time: '16:42',
      status: 'completed'
    },
    {
      id: 4,
      type: 'purchase',
      title: 'Europe eSIM • 10GB',
      amount: -25.00,
      date: 'Jan 3, 2025',
      time: '11:30',
      status: 'completed'
    },
    {
      id: 5,
      type: 'topup',
      title: 'Balance Top-up',
      amount: 50.00,
      date: 'Dec 28, 2024',
      time: '10:15',
      status: 'completed'
    },
    {
      id: 6,
      type: 'purchase',
      title: 'USA eSIM • 3GB',
      amount: -15.75,
      date: 'Dec 25, 2024',
      time: '19:30',
      status: 'completed'
    },
    {
      id: 7,
      type: 'topup',
      title: 'Balance Top-up',
      amount: 100.00,
      bonus: 5.00,
      date: 'Dec 20, 2024',
      time: '14:22',
      status: 'completed'
    },
    {
      id: 8,
      type: 'purchase',
      title: 'Asia eSIM • 8GB',
      amount: -22.90,
      date: 'Dec 18, 2024',
      time: '08:45',
      status: 'completed'
    },
    {
      id: 9,
      type: 'topup',
      title: 'Balance Top-up',
      amount: 25.00,
      date: 'Dec 15, 2024',
      time: '13:10',
      status: 'completed'
    },
    {
      id: 10,
      type: 'purchase',
      title: 'Global eSIM • 20GB',
      amount: -45.00,
      date: 'Dec 12, 2024',
      time: '16:25',
      status: 'completed'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'topups') return transaction.type === 'topup' || transaction.type === 'redeem';
    if (filter === 'purchases') return transaction.type === 'purchase';
    return true;
  });

  const getTransactionIcon = (type: string) => {
    if (type === 'redeem') {
      return (
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
      );
    }
    if (type === 'topup') {
      return (
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setLocation('/balance')}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Transactions</h1>
          <div className="w-10" />
        </div>

        {/* Filter Tabs */}
        <div className="flex px-4 pb-4">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('topups')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'topups'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Top-ups
            </button>
            <button
              onClick={() => setFilter('purchases')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'purchases'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Purchases
            </button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4 pb-20">
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.date} • {transaction.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'redeem'
                    ? 'text-orange-600 dark:text-orange-400'
                    : transaction.amount > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
                </p>
                {transaction.bonus && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +€{transaction.bonus.toFixed(2)} bonus
                  </p>
                )}
                {transaction.type === 'redeem' && (
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Promo bonus
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <button className="w-full mt-6 py-3 text-blue-600 dark:text-blue-400 font-medium text-center border border-blue-200 dark:border-blue-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
          Load More Transactions
        </button>
      </div>
    </div>
  );
}