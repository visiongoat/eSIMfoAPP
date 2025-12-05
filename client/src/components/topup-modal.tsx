import { useState, useMemo, useEffect, useRef } from "react";
import { X, Calendar, Zap, Check, ChevronRight, Info } from "lucide-react";
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
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showUpgradeInfo, setShowUpgradeInfo] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentPackage = esim?.package;
  const countryName = esim?.country?.name || 'eSIM';
  
  const packageData = currentPackage?.data || '2GB';
  const packageValidity = currentPackage?.validity || '30 Days';
  const packagePrice = Number(currentPackage?.price) || 9.99;
  
  const currentDataGB = parseFloat(packageData.replace(/[^0-9.]/g, '')) || 2;
  const currentDays = parseInt(packageValidity.replace(/[^0-9]/g, '')) || 30;

  const currentExpiryDate = esim?.expiresAt ? new Date(esim.expiresAt) : new Date();
  const formattedCurrentExpiry = currentExpiryDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const sampleUpgradePlans: Package[] = [
    { id: 901, countryId: esim?.country?.id || 1, name: '3GB / 15 Days', data: '3GB', validity: '15 Days', price: '12.99', originalPrice: null, isPopular: false, description: 'Perfect for light usage', networkType: '4G/LTE', features: null, smsIncluded: null, voiceIncluded: null },
    { id: 902, countryId: esim?.country?.id || 1, name: '5GB / 30 Days', data: '5GB', validity: '30 Days', price: '19.99', originalPrice: null, isPopular: true, description: 'Best value for travelers', networkType: '4G/LTE', features: null, smsIncluded: null, voiceIncluded: null },
    { id: 903, countryId: esim?.country?.id || 1, name: '10GB / 30 Days', data: '10GB', validity: '30 Days', price: '29.99', originalPrice: null, isPopular: false, description: 'Ideal for moderate usage', networkType: '4G/LTE', features: null, smsIncluded: null, voiceIncluded: null },
    { id: 904, countryId: esim?.country?.id || 1, name: '15GB / 30 Days', data: '15GB', validity: '30 Days', price: '39.99', originalPrice: null, isPopular: false, description: 'Great for heavy usage', networkType: '5G', features: null, smsIncluded: null, voiceIncluded: null },
    { id: 905, countryId: esim?.country?.id || 1, name: '20GB / 30 Days', data: '20GB', validity: '30 Days', price: '49.99', originalPrice: null, isPopular: true, description: 'Power user package', networkType: '5G', features: null, smsIncluded: null, voiceIncluded: null },
    { id: 906, countryId: esim?.country?.id || 1, name: 'Unlimited / 30 Days', data: 'Unlimited', validity: '30 Days', price: '69.99', originalPrice: null, isPopular: false, description: 'No limits, just connect', networkType: '5G', features: null, smsIncluded: null, voiceIncluded: null },
  ];

  const upgradePackages = useMemo(() => {
    const currentGB = currentDataGB;
    const isCurrentUnlimited = packageData.toLowerCase().includes('unlimited');
    
    if (isCurrentUnlimited) {
      return [];
    }
    
    const packagesToFilter = availablePackages.length > 0 ? availablePackages : sampleUpgradePlans;
    
    const regularPackages: Package[] = [];
    const unlimitedPackages: Package[] = [];
    
    packagesToFilter.forEach(pkg => {
      if (!pkg.data) return;
      const pkgGB = parseFloat((pkg.data || '').replace(/[^0-9.]/g, '')) || 0;
      const pkgIsUnlimited = (pkg.data || '').toLowerCase().includes('unlimited');
      
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
  }, [availablePackages, currentDataGB, packageData, sampleUpgradePlans]);

  const calculateNewExpiry = (daysToAdd: number) => {
    const newDate = new Date(currentExpiryDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Keyboard support - Escape to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showUpgradeInfo) {
          setShowUpgradeInfo(false);
        } else {
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showUpgradeInfo, onClose]);

  // Focus trap - keep focus inside modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Touch handlers for swipe to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollElement = scrollRef.current;
    if (scrollElement && scrollElement.scrollTop > 0) {
      return; // Don't start drag if content is scrolled
    }
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
    setIsDragging(false);
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

  const getSelectedPrice = (): number => {
    if (selectedType === 'extend') {
      return packagePrice;
    } else if (selectedUpgradePlan) {
      return Number(selectedUpgradePlan.price) || 0;
    }
    return 0;
  };

  const handleProceed = () => {
    if (selectedType === 'extend') {
      onProceedToCheckout(currentPackage, false);
    } else if (selectedUpgradePlan) {
      onProceedToCheckout(selectedUpgradePlan, true);
    }
  };

  const canProceed = selectedType === 'extend' || (selectedType === 'upgrade' && selectedUpgradePlan);
  const currentPrice = getSelectedPrice();
  const hasValidPrice = currentPrice > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
        style={{ opacity: 1 - (dragY / 300) }}
      />
      
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="topup-modal-title"
        data-testid="topup-modal"
        className="relative w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl"
        style={{ 
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header with integrated drag handle */}
        <div className="px-5 pt-3 pb-3 bg-gradient-to-b from-blue-50/80 to-white/80 dark:from-blue-950/40 dark:to-gray-900/80 backdrop-blur-sm rounded-t-3xl">
          {/* Drag handle */}
          <div className="flex justify-center mb-3">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
              {esim.country?.flagUrl && (
                <div className="relative flex-shrink-0 w-10 h-7">
                  <img 
                    src={esim.country.flagUrl} 
                    alt={esim.country.name}
                    className="w-full h-full object-cover shadow-sm"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 65%, 70% 100%, 0 100%)'
                    }}
                  />
                  <div 
                    className="absolute bottom-0 right-0 w-3 h-2.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.03) 100%)',
                      clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                    }}
                  />
                </div>
              )}
              <div>
                <h2 id="topup-modal-title" className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                  {countryName} <span className="text-sm font-normal text-gray-400 dark:text-gray-500">• {packageData} • {packageValidity}</span>
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Expires: {formattedCurrentExpiry}
                  </p>
                  <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-medium rounded-full">
                    {esim.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close top up modal"
              data-testid="topup-modal-close"
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Soft divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200/60 dark:via-gray-700/60 to-transparent" />

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-3 space-y-2 overscroll-contain">
          {/* Extend Option */}
          <button
            onClick={() => {
              setSelectedType('extend');
              setSelectedUpgradePlan(null);
            }}
            aria-pressed={selectedType === 'extend'}
            data-testid="topup-extend-option"
            className={`w-full p-3 rounded-xl border transition-all duration-200 text-left ${
              selectedType === 'extend'
                ? 'border-blue-400/50 bg-blue-50/50 dark:bg-blue-500/10'
                : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                  selectedType === 'extend'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedType === 'extend' && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Extend Current Plan</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-5.5">
                    +{currentDays} days • Same {packageData}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                €{packagePrice.toFixed(2)}
              </span>
            </div>
          </button>

          {/* Upgrade Option */}
          <div className="relative">
            <button
              onClick={() => setSelectedType('upgrade')}
              aria-pressed={selectedType === 'upgrade'}
              data-testid="topup-upgrade-option"
              className={`w-full p-3 rounded-xl border transition-all duration-200 text-left ${
                selectedType === 'upgrade'
                  ? 'border-green-400/50 bg-green-50/50 dark:bg-green-500/10'
                  : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                    selectedType === 'upgrade'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedType === 'upgrade' && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Upgrade Plan</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal bg-gray-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded">
                        more data
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-5.5">
                      Get more data for {countryName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUpgradeInfo(!showUpgradeInfo);
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Learn more about upgrade"
                  aria-expanded={showUpgradeInfo}
                  data-testid="topup-upgrade-info"
                >
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              </div>
            </button>

            {/* Info Sheet Modal - Bottom sheet over Top Up modal */}
            {showUpgradeInfo && (
              <div 
                className="fixed inset-0 z-[110] flex items-end justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  className="absolute inset-0 bg-black/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUpgradeInfo(false);
                  }}
                />
                <div 
                  className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drag handle */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  </div>
                  
                  <div className="px-5 pb-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-green-500/15 rounded-full flex items-center justify-center">
                          <Zap className="w-5 h-5 text-green-500" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">What is Plan Upgrade?</h4>
                      </div>
                      <button
                        onClick={() => setShowUpgradeInfo(false)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Close info"
                        data-testid="info-modal-close"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    
                    {/* Content */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      Running low on data? Upgrade your current plan to get more data without installing a new eSIM. 
                      Your existing profile stays the same — just with more data added instantly.
                    </p>
                    
                    <ul className="space-y-2.5 mb-5">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-5 h-5 bg-green-500/15 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-green-500" />
                        </div>
                        No new QR code needed
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-5 h-5 bg-green-500/15 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-green-500" />
                        </div>
                        Keep your current phone number
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-5 h-5 bg-green-500/15 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-green-500" />
                        </div>
                        Data added to your balance instantly
                      </li>
                    </ul>
                    
                    <button
                      onClick={() => setShowUpgradeInfo(false)}
                      className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors text-sm"
                      data-testid="info-modal-got-it"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upgrade Plans List */}
          {selectedType === 'upgrade' && (
            <div className="pt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1 py-1">
                Choose your new plan
              </p>
              
              {upgradePackages.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  No upgrade options available
                </div>
              ) : (
                upgradePackages.map((pkg) => {
                  const isSelected = selectedUpgradePlan?.id === pkg.id;
                  const pkgPrice = Number(pkg.price) || 0;
                  
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedUpgradePlan(pkg)}
                      aria-pressed={isSelected}
                      data-testid={`topup-plan-${pkg.id}`}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-lg border transition-all duration-150 ${
                        isSelected
                          ? 'border-green-400/50 bg-green-50/80 dark:bg-green-500/15'
                          : 'border-gray-100/80 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300/80 dark:border-gray-500/50'
                        }`}>
                          {isSelected && (
                            <Check className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                        <span className={`text-sm ${isSelected ? 'font-medium text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {pkg.data} <span className="text-gray-400 dark:text-gray-500">•</span> <span className="text-gray-500 dark:text-gray-400">{pkg.validity}</span>
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        €{pkgPrice.toFixed(2)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer - Glass effect with soft top border */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-5 py-3 space-y-2.5 relative">
          {/* Soft divider */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/40 dark:via-gray-700/40 to-transparent" />
          
          {/* Summary row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>New expiry</span>
            </div>
            <span className={`font-medium ${getSelectedNewExpiry() ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              {getSelectedNewExpiry() || '—'}
            </span>
          </div>

          {/* CTA Button with dynamic price */}
          <button
            onClick={handleProceed}
            disabled={!canProceed}
            aria-label={selectedType === 'upgrade' 
              ? hasValidPrice ? `Upgrade and pay ${currentPrice.toFixed(2)} euros` : 'Select a plan first'
              : `Extend and pay ${currentPrice.toFixed(2)} euros`
            }
            data-testid="topup-cta-button"
            className={`w-full py-3 rounded-xl font-medium text-white flex items-center justify-center space-x-2 transition-all duration-200 ${
              canProceed
                ? selectedType === 'upgrade'
                  ? 'bg-green-500 hover:bg-green-600 active:scale-[0.98]'
                  : 'bg-blue-500 hover:bg-blue-600 active:scale-[0.98]'
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            <span>
              {selectedType === 'upgrade' 
                ? hasValidPrice ? `Upgrade & Pay €${currentPrice.toFixed(2)}` : 'Select a plan'
                : `Extend & Pay €${currentPrice.toFixed(2)}`
              }
            </span>
            {canProceed && <ChevronRight className="w-4 h-4" />}
          </button>

          <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">
            No new eSIM installation required • Same QR code
          </p>
        </div>
      </div>
    </div>
  );
}
