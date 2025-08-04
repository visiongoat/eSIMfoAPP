import { useState } from "react";
import { useLocation } from "wouter";
import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";

export default function BalanceScreen() {
  const [, setLocation] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');
  
  // Mock current balance
  const currentBalance = 50.00;
  
  // Mock transaction history
  const transactionHistory = [
    { id: 1, amount: 20.00, date: '2024-01-15', method: 'Credit Card', status: 'Completed', type: 'top-up' },
    { id: 2, amount: 50.00, date: '2024-01-10', method: 'PayPal', status: 'Completed', type: 'top-up' },
    { id: 3, amount: 15.00, date: '2024-01-05', method: 'Apple Pay', status: 'Completed', type: 'top-up' },
    { id: 4, amount: 30.00, date: '2024-01-01', method: 'Credit Card', status: 'Completed', type: 'top-up' },
    { id: 5, amount: 25.00, date: '2023-12-28', method: 'Google Pay', status: 'Completed', type: 'top-up' },
  ];
  
  const predefinedAmounts = [5, 10, 20, 50, 100];
  
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowCustomInput(false);
    setCustomAmount("");
  };
  
  const handleOtherSelect = () => {
    setShowCustomInput(true);
    setSelectedAmount(null);
  };
  
  const handleTopUp = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount && amount > 0) {
      const bonus = amount === 100 ? 5 : 0;
      const totalAmount = amount + bonus;
      // Handle top-up logic here
      console.log(`Top up ${amount}€${bonus > 0 ? ` + ${bonus}€ bonus = ${totalAmount}€ total` : ''}`);
    }
  };
  
  const baseAmount = selectedAmount || parseFloat(customAmount) || 0;
  const bonusAmount = baseAmount === 100 ? 5 : 0;
  const finalAmount = baseAmount + bonusAmount;

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="fo Balance"
        showBackButton={true}
        onBackClick={() => setLocation('/profile')}
      />

      <div className="px-4 pt-2 pb-20">
        {/* Current Balance Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-4 mb-4 border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">fo Balance</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                {currentBalance.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('topup')}
            className={`flex-1 py-2 px-1 text-sm font-medium transition-all duration-200 relative ${
              activeTab === 'topup'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Top Up
            {activeTab === 'topup' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-1 text-sm font-medium transition-all duration-200 relative ${
              activeTab === 'history'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            History
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'topup' ? (
          <div>
        {/* Bonus Campaign Banner */}
        <div className="mb-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 dark:text-green-200">Special Offer!</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Top up €100, get €5 bonus</p>
            </div>
            <div className="text-green-600 dark:text-green-400 font-bold">+€5</div>
          </div>
        </div>

        {/* Choose Amount Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Choose Amount</h2>
          
          {/* Predefined Amounts Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`relative py-3 px-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                  selectedAmount === amount
                    ? 'bg-blue-500 dark:bg-blue-600 text-white border-blue-500 dark:border-blue-600 shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
                }`}
              >
                € {amount}
                {amount === 100 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    +€5
                  </div>
                )}
              </button>
            ))}
            
            {/* Other Button */}
            <button
              onClick={handleOtherSelect}
              className={`py-3 px-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                showCustomInput
                  ? 'bg-blue-500 dark:bg-blue-600 text-white border-blue-500 dark:border-blue-600 shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
              }`}
            >
              Other
            </button>
          </div>
          
          {/* Custom Amount Input */}
          {showCustomInput && (
            <div className="mb-3">
              <input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                step="0.01"
              />
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You agree to{' '}
            <button className="text-blue-500 hover:text-blue-600 underline">Terms</button>
            ,{' '}
            <button className="text-blue-500 hover:text-blue-600 underline">Privacy</button>
            ,{' '}
            <button className="text-blue-500 hover:text-blue-600 underline">Purchase Policy</button>
            .
          </p>
        </div>

        {/* Top Up Button */}
        <button
          onClick={handleTopUp}
          disabled={!finalAmount || finalAmount <= 0}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            baseAmount && baseAmount > 0
              ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-[0.98]'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {bonusAmount > 0 ? (
            <span>€ {baseAmount.toFixed(2)} + €{bonusAmount} bonus - Top up Now</span>
          ) : (
            <span>€ {baseAmount.toFixed(2)} - Top up Now</span>
          )}
        </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Transaction History</h2>
            
            {/* Filter Section */}
            <div className="mb-4">
              <select className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Transactions</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
                <option value="365">Last Year</option>
              </select>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {transactionHistory.map((transaction) => (
                <div key={transaction.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          Top-up
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        +€{transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.method}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Export Button */}
            <button className="w-full mt-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              Export Transaction History
            </button>
          </div>
        )}
      </div>

      <TabBar onPlusClick={() => setShowQuickActions(true)} />
      {showQuickActions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" onClick={() => setShowQuickActions(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div></div>
            <div className="px-6 pb-4"><h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quick Actions</h2><p className="text-gray-500 dark:text-gray-400 text-sm">Choose your eSIM category to get started</p></div>
            <div className="px-6 pb-8 space-y-3">
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations?tab=countries'); }} className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Local eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</p></div></div><svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations?tab=regions'); }} className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 rounded-2xl p-4 border border-green-200 dark:border-green-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regional eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</p></div></div><svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations?tab=global'); }} className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Global eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage plans</p></div></div><svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}