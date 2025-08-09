import { useState, useRef, useEffect } from 'react';
import CheckoutModal from './checkout-modal';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUpComplete?: (amount: number, bonus: number) => void;
}

export default function AddMoneyModal({ isOpen, onClose, onTopUpComplete }: AddMoneyModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const quickAmounts = [10, 30, 50, 80];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getSelectedAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount);
    return 0;
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Prevent default to stop background scrolling
    e.preventDefault();
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    
    // Only allow downward dragging
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Close modal if dragged down more than 100px
    if (dragY > 100) {
      onClose();
    }
    
    setDragY(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 animate-slide-up transition-transform duration-200"
        style={{
          transform: `translateY(${dragY}px)`,
          opacity: Math.max(0.5, 1 - dragY / 300)
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 cursor-grab active:cursor-grabbing" />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Add Money</h2>
          <p className="text-gray-600 dark:text-gray-400">Choose amount to add to your balance</p>
        </div>

        {/* Quick Amount Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedAmount === amount
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-bold text-lg">€{amount}</div>
            </button>
          ))}
          
          {/* €100 button with bonus badge */}
          <button
            onClick={() => handleAmountSelect(100)}
            className={`p-4 rounded-2xl border-2 transition-all relative ${
              selectedAmount === 100
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="font-bold text-lg">€100</div>
            {/* Bonus badge in top-right corner */}
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              +€5
            </div>
          </button>
          
          {/* Other/Custom Amount */}
          <div className="relative">
            <input
              type="number"
              placeholder="Other"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className={`w-full p-4 rounded-2xl border-2 text-center font-bold text-lg transition-all ${
                customAmount
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Selected Amount Display */}
        {getSelectedAmount() > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-6 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount to add</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">€{getSelectedAmount().toFixed(2)}</div>
            {getSelectedAmount() >= 100 && (
              <div className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                + €5.00 bonus included
              </div>
            )}
          </div>
        )}

        {/* Top up Button */}
        <button
          disabled={getSelectedAmount() <= 0}
          onClick={() => {
            if (getSelectedAmount() > 0) {
              setShowCheckout(true);
            }
          }}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            getSelectedAmount() > 0
              ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-800 dark:active:bg-blue-800'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          Top up Now
        </button>
        
        {/* Checkout Modal */}
        <CheckoutModal 
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          selectedPackage={{
            name: `€${getSelectedAmount()} Top up`,
            price: `€${getSelectedAmount().toFixed(2)}`
          }}
          country={{
            name: 'Balance Top up',
            flagUrl: ''
          }}
          esimCount={1}
          setEsimCount={() => {}} // Disabled for balance top up
          showPaymentMethodsDefault={true} // Skip to payment methods directly
          hideQuantitySelector={true} // Hide quantity selector for balance top up
          onComplete={() => {
            const selectedAmount = getSelectedAmount();
            const bonus = selectedAmount >= 100 ? 5 : 0;
            
            // Notify parent component about successful top up
            if (onTopUpComplete) {
              onTopUpComplete(selectedAmount, bonus);
            }
            
            setShowCheckout(false);
            onClose();
          }}
        />
      </div>
    </div>
  );
}