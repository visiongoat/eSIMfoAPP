import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeemSuccess: (amount: number, bonus: number) => void;
}

export default function RedeemCodeModal({ isOpen, onClose, onRedeemSuccess }: RedeemCodeModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Valid test codes
  const validCodes = {
    'WELCOME10': { amount: 10, bonus: 0, description: '€10 bonus' },
    'BONUS20': { amount: 15, bonus: 5, description: '€15 + €5 bonus' },
    'NEWUSER': { amount: 25, bonus: 10, description: '€25 + €10 bonus' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const upperCode = code.trim().toUpperCase();
    
    if (validCodes[upperCode as keyof typeof validCodes]) {
      const { amount, bonus } = validCodes[upperCode as keyof typeof validCodes];
      onRedeemSuccess(amount, bonus);
      onClose();
      setCode('');
    } else {
      setError('Invalid promo code. Please check and try again.');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Redeem Code</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your promo code
            </label>
            <Input
              id="promo-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code..."
              className="w-full text-center text-lg font-mono tracking-wider uppercase"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Test codes info */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">Test codes:</p>
            <div className="space-y-1">
              <p className="text-xs text-blue-600 dark:text-blue-400">• WELCOME10 - €10 bonus</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">• BONUS20 - €15 + €5 bonus</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">• NEWUSER - €25 + €10 bonus</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? 'Applying...' : 'Redeem'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}