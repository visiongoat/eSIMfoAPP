import { useState, useRef, useEffect } from "react";
import { X, HelpCircle, Minus, Plus, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoRenewalInfoModal } from "./auto-renewal-info-modal";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: any;
  country: any;
  esimCount: number;
  setEsimCount: (count: number) => void;
  onComplete?: () => void;
  showPaymentMethodsDefault?: boolean;
  hideQuantitySelector?: boolean;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  country, 
  esimCount, 
  setEsimCount,
  onComplete,
  showPaymentMethodsDefault = false,
  hideQuantitySelector = false
}: CheckoutModalProps) {
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [showPaymentMethods, setShowPaymentMethods] = useState(showPaymentMethodsDefault);
  const [showAutoRenewalInfo, setShowAutoRenewalInfo] = useState(false);
  
  // Touch/swipe states for modal dismissal
  const [startY, setStartY] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;


  // Calculate pricing
  const basePrice = selectedPackage ? parseFloat(selectedPackage.price.replace('€', '')) : 0;
  const total = basePrice * esimCount;
  
  // Calculate bonus for balance top up
  const isBalanceTopUp = hideQuantitySelector;
  const bonus = isBalanceTopUp && basePrice >= 100 ? 5 : 0;
  const finalTotal = total + bonus;

  const paymentMethods = [
    { id: 'apple-pay', name: 'Apple Pay', icon: '🍎' },
    { id: 'card', name: 'Pay with Card', icon: '💳' },
    { id: 'amex', name: 'Pay with AMEX', icon: '💳' },
    { id: 'paypal', name: 'Paypal', icon: '🔵' },
    { id: 'crypto', name: 'Pay with crypto', icon: '₿', subtitle: 'Funds are refunded only to the wallet balance' }
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Touch event handlers for swipe-down dismissal
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow swipe if modal is not scrolled
    if (modalRef.current && modalRef.current.scrollTop > 0) {
      return;
    }
    
    const touch = e.touches[0];
    setStartY(touch.clientY);
    setCurrentY(touch.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    
    setCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY) and prevent default scrolling
    if (deltaY > 0) {
      e.preventDefault(); // Prevent body scroll only during downward drag
      
      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        modalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaY = currentY - startY;
    
    // If swiped down more than 100px, close modal
    if (deltaY > 100 && modalRef.current) {
      // Animate out
      modalRef.current.style.transform = 'translateY(100%)';
      modalRef.current.style.opacity = '0';
      setTimeout(onClose, 200); // Wait for animation to complete
    } else if (modalRef.current) {
      // Snap back to original position
      modalRef.current.style.transform = 'translateY(0)';
      modalRef.current.style.opacity = '1';
    }
    
    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
      onClick={handleBackdropClick}
    >
      {/* Modal content */}
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto transition-all duration-200 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        {/* Swipe Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Device Compatibility Notice */}
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              Please ensure your device supports eSIM and is carrier-unlocked before completing your purchase.
            </p>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Package Info - Hide entire section for balance top up */}
          {!hideQuantitySelector && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {country?.flagUrl && (
                  <img 
                    src={country.flagUrl} 
                    alt={`${country.name} flag`}
                    className="w-8 h-6 rounded-sm object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{country?.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedPackage?.duration} • {selectedPackage?.data}
                    {selectedPackage?.voice && selectedPackage?.sms && (
                      <span className="text-xs text-gray-500 dark:text-gray-500 opacity-75">
                        {' • '}{selectedPackage.voice} • {selectedPackage.sms}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quantity selector */}
              <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setEsimCount(Math.max(1, esimCount - 1))}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  disabled={esimCount <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
                  {esimCount}
                </span>
                <button
                  onClick={() => setEsimCount(esimCount + 1)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="space-y-3">
            {isBalanceTopUp && bonus > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Top up amount</span>
                  <span className="text-sm text-gray-900 dark:text-white">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 dark:text-green-400">Bonus</span>
                  <span className="text-sm text-green-600 dark:text-green-400">+€{bonus.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
            
            {/* Standard total for non-bonus scenarios */}
            {!(isBalanceTopUp && bonus > 0) && (
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">€{total.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Auto-renewal - Only show when payment methods are not shown */}
          {!showPaymentMethods && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">Enable auto-renewal</span>
                    <HelpCircle 
                      className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" 
                      onClick={() => setShowAutoRenewalInfo(true)}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Auto-renew in 30 days for €{total.toFixed(2)}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRenewal}
                    onChange={(e) => setAutoRenewal(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Payment Methods or Choose Payment Button */}
          {!showPaymentMethods ? (
            <Button
              onClick={() => setShowPaymentMethods(true)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-between"
            >
              <div className="flex-1 text-center">Choose a payment method</div>
              <Lock className="w-4 h-4 opacity-50" />
            </Button>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Choose a payment method</h3>
              
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedPayment(method.id);
                      // Automatically start payment processing when method is selected
                      setTimeout(() => {
                        if (onComplete) {
                          onComplete();
                        } else {
                          onClose();
                        }
                      }, 1500);
                    }}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-xl border-2 transition-all ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{method.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">{method.name}</div>
                        {method.subtitle && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">{method.subtitle}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {method.id === 'apple-pay' && <span className="text-black font-bold">Pay</span>}
                      {method.id === 'card' && (
                        <div className="flex space-x-1">
                          <span className="text-blue-600 text-xs">VISA</span>
                          <span className="text-red-600 text-xs">●●</span>
                        </div>
                      )}
                      {method.id === 'amex' && (
                        <div className="flex space-x-1">
                          <span className="text-blue-600 text-xs">AMEX</span>
                          <span className="text-orange-600 text-xs">●●</span>
                          <span className="text-blue-600 text-xs">VISA</span>
                        </div>
                      )}
                      {method.id === 'paypal' && <span className="text-blue-600 font-bold">PayPal</span>}
                      {method.id === 'crypto' && <span className="text-orange-600 font-bold">αlphαρο</span>}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => {
                  // This should not be needed - payment starts automatically when method is selected
                }}
                disabled={!selectedPayment}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors"
              >
                {selectedPayment ? 'Processing...' : 'Select payment method above'}
              </Button>
            </div>
          )}
        </div>

        {/* Bottom handle bar */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Auto Renewal Info Modal */}
      <AutoRenewalInfoModal 
        isOpen={showAutoRenewalInfo} 
        onClose={() => setShowAutoRenewalInfo(false)} 
      />
    </div>
  );
}