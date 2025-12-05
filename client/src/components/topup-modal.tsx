import { useState, useMemo } from "react";
import { X, Calendar, Zap, Check, ChevronRight } from "lucide-react";
import type { Esim, Package, Country } from "@shared/schema";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  esim: (Esim & { package?: Package; country?: Country }) | null;
  availablePackages: Package[];
  onProceedToCheckout: (selectedPackage: Package, isUpgrade: boolean) => void;
}

type TopUpType = 'extend' | 'upgrade';

export default function TopUpModal({
  isOpen,
  onClose,
  esim,
  availablePackages,
  onProceedToCheckout
}: TopUpModalProps) {
  const [selectedType, setSelectedType] = useState<TopUpType>('extend');
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<Package | null>(null);

  const currentPackage = esim?.package;
  const currentDataGB = currentPackage?.data ? (parseFloat(currentPackage.data.replace(/[^0-9.]/g, '')) || 0) : 0;
  const currentDays = currentPackage?.validity ? (parseInt(currentPackage.validity.replace(/[^0-9]/g, '')) || 30) : 30;

  const currentExpiryDate = esim?.expiresAt ? new Date(esim.expiresAt) : new Date();
  const formattedCurrentExpiry = currentExpiryDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const upgradePackages = useMemo(() => {
    if (!currentPackage?.data) return [];
    
    const currentGB = currentDataGB;
    const isUnlimited = (currentPackage.data || '').toLowerCase().includes('unlimited');
    
    const regularPackages: Package[] = [];
    const unlimitedPackages: Package[] = [];
    
    availablePackages.forEach(pkg => {
      if (!pkg.data) return;
      const pkgGB = parseFloat((pkg.data || '').replace(/[^0-9.]/g, '')) || 0;
      const pkgIsUnlimited = (pkg.data || '').toLowerCase().includes('unlimited');
      
      if (isUnlimited) {
        return;
      }
      
      if (pkgIsUnlimited) {
        unlimitedPackages.push(pkg);
      } else if (pkgGB > currentGB) {
        regularPackages.push(pkg);
      }
    });
    
    regularPackages.sort((a, b) => {
      const aGB = parseFloat((a.data || '').replace(/[^0-9.]/g, '')) || 0;
      const bGB = parseFloat((b.data || '').replace(/[^0-9.]/g, '')) || 0;
      return aGB - bGB;
    });
    
    return [...regularPackages, ...unlimitedPackages];
  }, [availablePackages, currentDataGB, currentPackage]);

  const calculateNewExpiry = (daysToAdd: number) => {
    const newDate = new Date(currentExpiryDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!isOpen || !esim || !currentPackage) return null;

  const getSelectedNewExpiry = () => {
    if (selectedType === 'extend') {
      return calculateNewExpiry(currentDays);
    } else if (selectedUpgradePlan) {
      const upgradeDays = parseInt((selectedUpgradePlan.validity || '').replace(/[^0-9]/g, '')) || 30;
      return calculateNewExpiry(upgradeDays);
    }
    return null;
  };

  const getSelectedPrice = () => {
    if (selectedType === 'extend') {
      return `€${parseFloat(currentPackage.price.toString()).toFixed(2)}`;
    } else if (selectedUpgradePlan) {
      return `€${parseFloat(selectedUpgradePlan.price.toString()).toFixed(2)}`;
    }
    return '€0.00';
  };

  const handleProceed = () => {
    if (selectedType === 'extend') {
      onProceedToCheckout(currentPackage, false);
    } else if (selectedUpgradePlan) {
      onProceedToCheckout(selectedUpgradePlan, true);
    }
  };

  const canProceed = selectedType === 'extend' || (selectedType === 'upgrade' && selectedUpgradePlan);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {esim.country?.flagUrl && (
                <img 
                  src={esim.country.flagUrl} 
                  alt={esim.country.name}
                  className="w-10 h-7 object-cover rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
                />
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                  {currentPackage.data} - {currentPackage.validity}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Expires: {formattedCurrentExpiry}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
              {esim.status}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <button
            onClick={() => {
              setSelectedType('extend');
              setSelectedUpgradePlan(null);
            }}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedType === 'extend'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                  selectedType === 'extend'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedType === 'extend' && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">Extend Current Plan</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Add {currentDays} more days to your {currentPackage.data} plan
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Same data package
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                €{parseFloat(currentPackage.price.toString()).toFixed(2)}
              </span>
            </div>
          </button>

          <button
            onClick={() => setSelectedType('upgrade')}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedType === 'upgrade'
                ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                selectedType === 'upgrade'
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedType === 'upgrade' && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">Upgrade Plan</span>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-[10px] font-medium rounded-full">
                    More Data
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Get more data for your {esim.country?.name || 'eSIM'}
                </p>
              </div>
            </div>
          </button>

          {selectedType === 'upgrade' && (
            <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-1 mb-2">
                Select a plan to upgrade
              </p>
              
              {upgradePackages.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                  No upgrade options available for this plan
                </div>
              ) : (
                upgradePackages.map((pkg) => {
                  const isUnlimited = (pkg.data || '').toLowerCase().includes('unlimited');
                  const isSelected = selectedUpgradePlan?.id === pkg.id;
                  const isBestValue = pkg.isPopular;
                  
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedUpgradePlan(pkg)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${isSelected ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                            {pkg.data}
                          </span>
                          <span className="text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {pkg.validity}
                          </span>
                          {isBestValue && (
                            <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 text-[9px] font-semibold rounded">
                              Best Value
                            </span>
                          )}
                          {isUnlimited && (
                            <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 text-[9px] font-semibold rounded">
                              Unlimited
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`font-bold ${isSelected ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        €{parseFloat(pkg.price.toString()).toFixed(2)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm px-5 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>New expiry:</span>
            </div>
            <span className={`font-medium ${getSelectedNewExpiry() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              {getSelectedNewExpiry() || 'Select a plan'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Pay securely</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 dark:text-gray-500">Total</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{getSelectedPrice()}</p>
            </div>
          </div>

          <button
            onClick={handleProceed}
            disabled={!canProceed}
            className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center space-x-2 transition-all duration-200 ${
              canProceed
                ? selectedType === 'upgrade'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:scale-[0.98] shadow-lg shadow-green-500/25'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] shadow-lg shadow-blue-500/25'
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            <span>{selectedType === 'upgrade' ? 'Upgrade & Pay' : 'Extend & Pay'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">
            No new eSIM installation required • Same QR code
          </p>
        </div>
      </div>
    </div>
  );
}
