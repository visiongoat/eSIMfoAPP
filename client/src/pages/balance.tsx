import { useState } from "react";
import { useLocation } from "wouter";
import NavigationBar from "@/components/navigation-bar";

export default function BalanceScreen() {
  const [, setLocation] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Mock current balance
  const currentBalance = 50.00;
  
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
      // Handle top-up logic here
      console.log(`Top up ${amount}€`);
    }
  };
  
  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="fo Balance"
        showBackButton={true}
        onBackClick={() => setLocation('/profile')}
      />

      <div className="px-4 pt-4">
        {/* Current Balance Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-6 mb-6 border border-yellow-200 dark:border-yellow-700">
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

        {/* Choose Amount Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Choose Amount</h2>
          
          {/* Predefined Amounts Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all duration-200 ${
                  selectedAmount === amount
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                }`}
              >
                € {amount}
              </button>
            ))}
            
            {/* Other Button */}
            <button
              onClick={handleOtherSelect}
              className={`py-4 px-4 rounded-xl border-2 font-semibold transition-all duration-200 ${
                showCustomInput
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              }`}
            >
              Other
            </button>
          </div>
          
          {/* Custom Amount Input */}
          {showCustomInput && (
            <div className="mb-4">
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
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You agree to{' '}
            <button className="text-blue-500 hover:text-blue-600 underline">
              Terms of Service
            </button>
            ,{' '}
            <button className="text-blue-500 hover:text-blue-600 underline">
              Privacy Policy
            </button>
            ,{' '}
            <button className="text-blue-500 hover:text-blue-600 underline">
              Purchase Policy
            </button>
            .
          </p>
        </div>

        {/* Top Up Button */}
        <button
          onClick={handleTopUp}
          disabled={!finalAmount || finalAmount <= 0}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
            finalAmount && finalAmount > 0
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg hover:shadow-xl active:scale-[0.98]'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          € {finalAmount.toFixed(2)} - Top up Now
        </button>
      </div>
    </div>
  );
}