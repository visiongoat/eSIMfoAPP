import { useState, useRef, useEffect } from "react";
import { X, HelpCircle, Minus, Plus, Lock, ArrowLeft } from "lucide-react";
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
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardFormData, setCardFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    fullName: '',
    cvv: ''
  });
  
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

  // Card type detection function
  const getCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!cleanNumber) return null;
    
    // Visa: starts with 4
    if (cleanNumber.startsWith('4')) {
      return { type: 'visa', name: 'Visa' };
    }
    
    // Mastercard: starts with 5 or 2221-2720
    if (cleanNumber.startsWith('5') || 
        (cleanNumber.length >= 4 && 
         parseInt(cleanNumber.substring(0, 4)) >= 2221 && 
         parseInt(cleanNumber.substring(0, 4)) <= 2720)) {
      return { type: 'mastercard', name: 'Mastercard' };
    }
    
    // American Express: starts with 34 or 37
    if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) {
      return { type: 'amex', name: 'American Express' };
    }
    
    // Discover: starts with 6
    if (cleanNumber.startsWith('6')) {
      return { type: 'discover', name: 'Discover' };
    }
    
    return null;
  };

  const cardType = getCardType(cardFormData.cardNumber);

  const paymentMethods = [
    { id: 'apple-pay', name: 'Pay', icon: 'apple-pay' },
    { id: 'google-pay', name: 'Pay', icon: 'google-pay' },
    { id: 'paypal', name: 'PayPal', icon: 'paypal' },
    { id: 'card', name: 'Pay with Card', icon: 'card' },
    { id: 'crypto', name: 'Pay with Crypto', icon: 'crypto', subtitle: 'Powered by Coinbase' }
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
          ) : showCardForm ? (
            /* Card Form */
            <div className="space-y-4">
              {/* Header with back button */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowCardForm(false);
                    setSelectedPayment('');
                    setCardFormData({ cardNumber: '', expiryDate: '', fullName: '', cvv: '' });
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Card Details</h3>
              </div>

              {/* Card Form Fields */}
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardFormData.cardNumber}
                      onChange={(e) => {
                        // Format card number with spaces
                        const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                        if (value.replace(/\s/g, '').length <= 16) {
                          setCardFormData(prev => ({ ...prev, cardNumber: value }));
                        }
                      }}
                      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${cardType ? 'pr-16' : ''}`}
                      maxLength={19}
                    />
                    {/* Card Type Logo */}
                    {cardType && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                        {cardType.type === 'visa' && (
                          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                            VISA
                          </div>
                        )}
                        {cardType.type === 'mastercard' && (
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <div className="w-4 h-4 bg-yellow-500 rounded-full -ml-2"></div>
                          </div>
                        )}
                        {cardType.type === 'amex' && (
                          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                            AMEX
                          </div>
                        )}
                        {cardType.type === 'discover' && (
                          <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                            DISC
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardFormData.expiryDate}
                      onChange={(e) => {
                        // Format expiry date MM/YY
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setCardFormData(prev => ({ ...prev, expiryDate: value }));
                      }}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardFormData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          setCardFormData(prev => ({ ...prev, cvv: value }));
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      maxLength={3}
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardFormData.fullName}
                    onChange={(e) => setCardFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Pay Button */}
                <Button
                  onClick={() => {
                    // Process card payment
                    setTimeout(() => {
                      if (onComplete) {
                        onComplete();
                      } else {
                        onClose();
                      }
                    }, 1500);
                  }}
                  disabled={!cardFormData.cardNumber || !cardFormData.expiryDate || !cardFormData.fullName || !cardFormData.cvv}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay €{isBalanceTopUp && bonus > 0 ? finalTotal.toFixed(2) : total.toFixed(2)}</span>
                </Button>

                {/* Security Note */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <Lock className="w-3 h-3" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Choose a payment method</h3>
              
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedPayment(method.id);
                      
                      if (method.id === 'card') {
                        // Show card form for card payments
                        setShowCardForm(true);
                      } else {
                        // Automatically start payment processing for other methods
                        setTimeout(() => {
                          if (onComplete) {
                            onComplete();
                          } else {
                            onClose();
                          }
                        }, 1500);
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                      method.id === 'apple-pay' 
                        ? 'bg-black border-black text-white hover:bg-gray-900 hover:border-gray-900'
                        : method.id === 'google-pay'
                        ? 'bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                        : method.id === 'paypal'
                        ? 'bg-yellow-400 border-yellow-400 text-blue-800 hover:bg-yellow-500 hover:border-yellow-500'
                        : method.id === 'crypto'
                        ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700'
                        : selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className={`flex items-center ${(method.id === 'apple-pay' || method.id === 'google-pay' || method.id === 'paypal' || method.id === 'crypto') ? 'space-x-2' : 'space-x-3'}`}>
                      {/* Real Payment Logos */}
                      <div className={`${(method.id === 'apple-pay' || method.id === 'google-pay' || method.id === 'paypal' || method.id === 'crypto') ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center`}>
                        {method.icon === 'apple-pay' && (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white"/>
                          </svg>
                        )}
                        {method.icon === 'google-pay' && (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        )}
                        {method.icon === 'paypal' && (
                          <svg className="w-16 h-6" viewBox="0 0 124 33" fill="none">
                            <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.786-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.987-1.746zm.927 6.534c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906z" fill="#253B80"/>
                            <path d="M66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317z" fill="#253B80"/>
                            <path d="M75.046 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.786-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.987-1.746zm.927 6.534c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906z" fill="#179BD7"/>
                            <path d="M95.489 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317z" fill="#179BD7"/>
                          </svg>
                        )}
                        {method.icon === 'card' && (
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                            <path d="M2 6C2 4.895 2.895 4 4 4h16c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H4c-1.105 0-2-.895-2-2V6z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M6 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                        {method.icon === 'crypto' && (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white"/>
                            <path d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8c2.051 0 3.918-.772 5.329-2.043l-1.414-1.414C16.772 17.416 15.464 18 14 18h-2c-3.309 0-6-2.691-6-6s2.691-6 6-6h2c1.464 0 2.772.584 3.915 1.457l1.414-1.414C17.918 4.772 16.051 4 14 4h-2z" fill="#0052FF"/>
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        {method.id !== 'paypal' && (
                          <div className={`font-medium ${
                            method.id === 'apple-pay' 
                              ? 'text-white' 
                              : method.id === 'google-pay'
                              ? 'text-gray-900 dark:text-white'
                              : method.id === 'crypto'
                              ? 'text-white'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {method.name}
                          </div>
                        )}
                        {method.subtitle && (
                          <div className={`text-xs ${
                            method.id === 'apple-pay' 
                              ? 'text-gray-300' 
                              : method.id === 'google-pay'
                              ? 'text-gray-600 dark:text-gray-300'
                              : method.id === 'paypal'
                              ? 'text-blue-800'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {method.subtitle}
                          </div>
                        )}
                      </div>
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