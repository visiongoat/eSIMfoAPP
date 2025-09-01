import React, { memo, useCallback } from 'react';
import { useLocation } from "wouter";

interface NavigationBarProps {
  title: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  showBack?: boolean;
  showBackButton?: boolean; // Add this for compatibility
  onBack?: () => void;
  onBackClick?: () => void; // Add this for compatibility
  showCurrency?: boolean;
  selectedCurrency?: string;
  onCurrencyClick?: () => void;
}

const NavigationBar = memo(function NavigationBar({ 
  title, 
  leftButton, 
  rightButton, 
  showBack = false,
  showBackButton = false,
  onBack,
  onBackClick,
  showCurrency = false,
  selectedCurrency = 'EUR',
  onCurrencyClick
}: NavigationBarProps) {
  const [, setLocation] = useLocation();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  }, [onBack, onBackClick]);

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
        {(showBack || showBackButton) ? (
          <button 
            onClick={handleBack}
            className="text-blue-500 dark:text-blue-400 flex items-center space-x-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
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
});

export default NavigationBar;
