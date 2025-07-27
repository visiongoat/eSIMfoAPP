import { useState } from "react";
import { X, HelpCircle, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: any;
  country: any;
  esimCount: number;
  setEsimCount: (count: number) => void;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  country, 
  esimCount, 
  setEsimCount 
}: CheckoutModalProps) {
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  if (!isOpen) return null;

  // Calculate pricing
  const basePrice = selectedPackage ? parseFloat(selectedPackage.price.replace('€', '')) : 0;
  const total = basePrice * esimCount;

  const paymentMethods = [
    { id: 'apple-pay', name: 'Apple Pay', icon: '🍎' },
    { id: 'card', name: 'Pay with Card', icon: '💳' },
    { id: 'amex', name: 'Pay with AMEX', icon: '💳' },
    { id: 'paypal', name: 'Paypal', icon: '🔵' },
    { id: 'crypto', name: 'Pay with crypto', icon: '₿', subtitle: 'Funds are refunded only to the wallet balance' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      {/* Modal content */}
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
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
          {/* Package Info */}
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

          {/* Pricing */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">€{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Auto-renewal */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">Enable auto-renewal</span>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your subscription will auto-renew in 30 days for €{total.toFixed(2)}
                </p>
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

          {/* Payment Methods or Choose Payment Button */}
          {!showPaymentMethods ? (
            <Button
              onClick={() => setShowPaymentMethods(true)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Choose a payment method
            </Button>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Choose a payment method</h3>
              
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
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
                onClick={() => {/* Handle payment */}}
                disabled={!selectedPayment}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors"
              >
                Choose
              </Button>
            </div>
          )}
        </div>

        {/* Bottom handle bar */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}