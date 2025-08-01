import { useLocation } from "wouter";

interface NavigationBarProps {
  title: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showCurrency?: boolean;
  selectedCurrency?: string;
  onCurrencyClick?: () => void;
}

export default function NavigationBar({ 
  title, 
  leftButton, 
  rightButton, 
  showBack = false,
  onBack,
  showCurrency = false,
  selectedCurrency = 'EUR',
  onCurrencyClick
}: NavigationBarProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currencies = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'Fr',
      'TRY': '₺'
    };
    return currencies[currencyCode as keyof typeof currencies] || '€';
  };

  return (
    <div className="navigation-bar">
      <div className="flex items-center">
        {showBack ? (
          <button 
            onClick={handleBack}
            className="text-primary font-medium"
          >
            ← Back
          </button>
        ) : (
          leftButton || <div className="w-16"></div>
        )}
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center">
        {showCurrency && onCurrencyClick ? (
          <button
            onClick={onCurrencyClick}
            className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors active:scale-95"
          >
            <span>{getCurrencySymbol(selectedCurrency)}</span>
            <span>{selectedCurrency}</span>
          </button>
        ) : (
          rightButton || <div className="w-16"></div>
        )}
      </div>
    </div>
  );
}
