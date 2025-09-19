import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Globe, Cpu, Minus, Plus, ChevronDown, ChevronUp, Share, Check, Info, Network, Smartphone, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";

import NavigationBar from "@/components/navigation-bar";
import CheckoutModal from "@/components/checkout-modal";
import type { Country, Package } from "@shared/schema";

export default function PackagesScreen() {
  const [, params] = useRoute("/packages/:countryId");
  const [, setLocation] = useLocation();
  const countryId = params?.countryId ? parseInt(params.countryId) : null;
  
  // Get the source parameter from URL to determine where user came from
  const urlParams = new URLSearchParams(window.location.search);
  const fromPage = urlParams.get('from') || 'home'; // default to home if not specified
  
  const [selectedTab, setSelectedTab] = useState<'data' | 'data-calls-text'>('data');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(1);
  
  // Device compatibility chip state
  const [deviceCompatibilityAck, setDeviceCompatibilityAck] = useState<boolean>(() => {
    // Check localStorage for acknowledgment with try/catch
    try {
      const saved = localStorage.getItem('device-compatibility-acknowledged');
      return saved === 'true';
    } catch {
      return false; // Fallback if localStorage is unavailable
    }
  });
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Package Details drawer state
  const [packageDetailsOpen, setPackageDetailsOpen] = useState(false);

  // Handle device compatibility acknowledgment
  const handleDeviceCompatibilityAck = () => {
    try {
      localStorage.setItem('device-compatibility-acknowledged', 'true');
    } catch {
      // Silently fail if localStorage is unavailable
    }
    setDeviceCompatibilityAck(true);
    setPopoverOpen(false); // Close popover after acknowledgment
  };
  
  // Update default selection when tab changes
  useEffect(() => {
    if (selectedTab === 'data') {
      setSelectedPackage(1); // First data package
    } else {
      setSelectedPackage(5); // First data/calls/text package
    }
  }, [selectedTab]);
  const [esimCount, setEsimCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    network: true,
    plan: false,
    features: false
  });
  // Currency & Language Settings (copied from home.tsx)
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [showCurrencyLanguageModal, setShowCurrencyLanguageModal] = useState(false);

  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro', region: 'Europe' },
    { code: 'USD', symbol: '$', name: 'US Dollar', region: 'Americas' },
    { code: 'GBP', symbol: '£', name: 'British Pound', region: 'Europe' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', region: 'Europe' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', region: 'Asia' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', region: 'Europe' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', region: 'Americas' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', region: 'Oceania' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', region: 'Europe' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', region: 'Europe' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone', region: 'Europe' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', region: 'Europe' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', region: 'Europe' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', region: 'Europe' },
    { code: 'RON', symbol: 'lei', name: 'Romanian Leu', region: 'Europe' },
    { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', region: 'Europe' },
    { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', region: 'Europe' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', region: 'Europe' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', region: 'Asia' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', region: 'Asia' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', region: 'Asia' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', region: 'Asia' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', region: 'Asia' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', region: 'Asia' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', region: 'Asia' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', region: 'Middle East' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', region: 'Middle East' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', region: 'Africa' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', region: 'Africa' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', region: 'Americas' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso', region: 'Americas' },
  ];

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'TR', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
    { code: 'DE', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    { code: 'FR', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'ES', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'IT', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
    { code: 'PT', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
    { code: 'RU', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
    { code: 'ZH', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
    { code: 'JA', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
    { code: 'KO', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
    { code: 'AR', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  ];

  // Swipe navigation for tab switching
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && selectedTab === 'data-calls-text') {
          // Swipe right: data-calls-text -> data
          setSelectedTab('data');
        } else if (deltaX < 0 && selectedTab === 'data') {
          // Swipe left: data -> data-calls-text
          setSelectedTab('data-calls-text');
        }
      }

      // Reset
      touchStartX.current = 0;
      touchStartY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [selectedTab]);


  const toggleSection = (section: string) => {
    const isCurrentlyExpanded = expandedSections[section];
    
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Auto-scroll for Network, Plan and Features sections when expanding
    if ((section === 'network' || section === 'plan' || section === 'features') && !isCurrentlyExpanded) {
      setTimeout(() => {
        if (section === 'network') {
          // For Network, scroll to show Network content + Plan and Features titles
          const networkElement = document.querySelector(`[data-section="network"]`);
          if (networkElement) {
            networkElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        } else if (section === 'plan') {
          // For Plan, scroll to show both Plan content and Features title
          const planElement = document.querySelector(`[data-section="plan"]`);
          if (planElement) {
            planElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        } else if (section === 'features') {
          // For Features, scroll to show Features content
          const featuresElement = document.querySelector(`[data-section="features"]`);
          if (featuresElement) {
            featuresElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }
      }, 150);
    }
  };

  // Auto scroll when features section opens
  useEffect(() => {
    if (expandedSections.features) {
      // Scroll to bottom to show features content
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight - window.innerHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [expandedSections.features]);



  const { data: country } = useQuery<Country>({
    queryKey: ["/api/countries", countryId],
    enabled: !!countryId,
  });

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/countries", countryId, "packages"],
    enabled: !!countryId,
  });

  // Demo packages - based on the design
  const demoPackages = [
    {
      id: 1,
      duration: "1 GB",
      data: "7 gün",
      price: "€7",
      pricePerDay: "€1.00 /day",
      signalStrength: 5
    },
    {
      id: 2,
      duration: "3 GB",
      data: "15 gün",
      price: "€24",
      pricePerDay: "€1.60 /day",
      signalStrength: 5
    },
    {
      id: 3,
      duration: "5 GB",
      data: "20 gün",
      price: "€33",
      pricePerDay: "€1.65 /day",
      signalStrength: 5
    },
    {
      id: 4,
      duration: "10 GB",
      data: "30 gün",
      price: "€48",
      pricePerDay: "€1.60 /day",
      signalStrength: 5
    }
  ];

  // Data/Calls/Text packages with voice and SMS
  const dataCallsTextPackages = [
    {
      id: 5,
      duration: "1 GB",
      data: "7 gün",
      voice: "100 dk",
      sms: "50 SMS",
      price: "€12",
      pricePerDay: "€1.71 /day",
      signalStrength: 5
    },
    {
      id: 6,
      duration: "3 GB",
      data: "15 gün",
      voice: "200 dk",
      sms: "100 SMS",
      price: "€28",
      pricePerDay: "€1.87 /day",
      signalStrength: 5
    },
    {
      id: 7,
      duration: "5 GB",
      data: "20 gün",
      voice: "300 dk",
      sms: "150 SMS",
      price: "€42",
      pricePerDay: "€2.10 /day",
      signalStrength: 5
    },
    {
      id: 8,
      duration: "10 GB",
      data: "30 gün",
      voice: "500 dk",
      sms: "200 SMS",
      price: "€58",
      pricePerDay: "€1.93 /day",
      signalStrength: 5
    }
  ];

  // Unlimited plans for Germany (demo data)
  const unlimitedPlans = [
    { days: 3, price: 7.60, priceEur: 7.60 },
    { days: 5, price: 11.40, priceEur: 11.40 },
    { days: 7, price: 15.20, priceEur: 15.20 },
    { days: 10, price: 20.80, priceEur: 20.80 },
    { days: 15, price: 30.00, priceEur: 30.00 },
    { days: 30, price: 58.00, priceEur: 58.00 }
  ];

  // State for unlimited plan selection
  const [selectedUnlimitedDays, setSelectedUnlimitedDays] = useState(3);
  const [selectedUnlimitedPlan, setSelectedUnlimitedPlan] = useState(unlimitedPlans[0]);

  // Get unlimited plan price for selected days - moved before useMemo to fix hoisting issue
  const getUnlimitedPrice = (days: number) => {
    const plan = unlimitedPlans.find(p => p.days === days);
    return plan ? plan.priceEur : 0;
  };

  // Helper functions moved before useMemo to fix hoisting issues
  const getCurrencySymbol = (currencyCode: string) => {
    return currencies.find(c => c.code === currencyCode)?.symbol || '€';
  };

  const convertPrice = (euroPrice: string, targetCurrency: string) => {
    // Since we removed rate from currencies, we'll just show the symbol for now
    const numericPrice = parseFloat(euroPrice.replace('€', ''));
    const currency = currencies.find(c => c.code === targetCurrency);
    if (!currency) return euroPrice;
    
    // For demo purposes, just change the symbol (real conversion would need API)
    return `${currency.symbol}${numericPrice.toFixed(2)}`;
  };

  // Derived state for checkout modal - eliminates race conditions
  const selectedPackageForCheckout = useMemo(() => {
    // Handle unlimited package
    if (selectedPackage === 999) {
      const currentDays = selectedUnlimitedDays;
      const basePrice = getUnlimitedPrice(currentDays);
      
      // Extra check to ensure we have valid pricing
      if (!basePrice || basePrice <= 0) {
        console.warn('Invalid unlimited plan price:', basePrice, 'for days:', currentDays);
        return null;
      }
      
      const formattedPrice = convertPrice(`€${basePrice.toFixed(2)}`, selectedCurrency);
      const formattedPricePerDay = convertPrice(`€${(basePrice / currentDays).toFixed(2)}`, selectedCurrency) + " /day";
      
      console.log('Creating unlimited virtual package:', {
        days: currentDays,
        basePrice,
        formattedPrice,
        selectedPackage
      });
      
      return {
        id: 999,
        duration: "Unlimited",
        data: `${currentDays} ${currentDays === 1 ? 'day' : 'days'}`,
        price: formattedPrice || `€${basePrice.toFixed(2)}`, // Fallback to ensure string format
        pricePerDay: formattedPricePerDay || `€${(basePrice / currentDays).toFixed(2)} /day`, // Fallback
        signalStrength: 5
      };
    }
    
    // Handle regular packages
    const dataPackage = demoPackages.find(p => p.id === selectedPackage);
    const comboPackage = dataCallsTextPackages.find(p => p.id === selectedPackage);
    return dataPackage || comboPackage;
  }, [selectedPackage, selectedUnlimitedDays, selectedCurrency]);

  // Check if this country has unlimited plans (multiple countries for testing)
  const unlimitedCountries = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 40, 41, 42, 44, 47, 48, 49, 50, 52, 53, 54, 73]; // Popular countries for testing
  const hasUnlimitedPlans = Number.isFinite(countryId) && unlimitedCountries.includes(Number(countryId));

  const handleBackClick = () => {
    // Navigate back based on where user came from
    if (fromPage === 'destinations') {
      setLocation('/destinations');
    } else {
      // Default to home for any other source (including 'home')
      setLocation('/home');
    }
  };

  const handlePackageSelect = (packageId: number) => {
    setSelectedPackage(packageId);
  };

  const handlePurchase = () => {
    if (!selectedPackage) return;
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setShowCheckoutModal(true);
  };

  const handleUnlimitedPurchase = () => {
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Set unlimited plan as selected package for checkout modal
    const unlimitedPackageId = 999; // Special ID for unlimited
    setSelectedPackage(unlimitedPackageId);
    setSelectedUnlimitedPlan(unlimitedPlans.find(p => p.days === selectedUnlimitedDays)!);
    setShowCheckoutModal(true);
  };


  // Device detection utility
  const detectPlatform = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isApp = window.navigator.userAgent.includes('esimfoApp'); // Custom app identifier
    
    return { isIOS, isAndroid, isApp };
  };

  const generateShareMessage = (countryName: string) => {
    const { isApp } = detectPlatform();
    const baseUrl = window.location.origin;
    
    if (isApp) {
      // App version - redirect to app download since we can't route to specific countries
      return `${countryName} eSIM Plans

Get instant connectivity for your travels!
Download esimfo app for the best eSIM experience:

📱 iOS: https://apps.apple.com/app/esimfo
🤖 Android: https://play.google.com/store/apps/details?id=com.esimfo

Instant activation, no physical SIM needed!`;
    } else {
      // Web version - link to specific country with live content
      const currentPackages = selectedTab === 'data' ? demoPackages : dataCallsTextPackages;
      const packageSummary = currentPackages.slice(0, 4).map(pkg => 
        `${pkg.duration} - ${pkg.data} - ${pkg.price}`
      ).join('\n');
      
      return `${countryName} eSIM Plans

${packageSummary}
...and ${Math.max(0, currentPackages.length - 4)} more plans

Instant activation, no physical SIM needed!
View all plans & buy online:
${baseUrl}/packages/${countryId}`;
    }
  };

  const handleShare = async () => {
    const countryName = country?.name || "eSIM";
    const shareMessage = generateShareMessage(countryName);
    const { isIOS, isAndroid, isApp } = detectPlatform();

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    try {
      // Check if native sharing is available
      if (navigator.share && (isIOS || isApp)) {
        // iOS or App - use native share sheet
        await navigator.share({
          title: `${countryName} eSIM Plans`,
          text: shareMessage,
          url: isApp ? undefined : `${window.location.origin}/packages/${countryId}`
        });
      } else if (isAndroid && !isApp) {
        // Android web - show platform options
        showAndroidShareOptions(shareMessage);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(shareMessage);
        // Show toast notification (you can implement this)
        console.log('Copied to clipboard!');
      }
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareMessage);
        console.log('Copied to clipboard!');
      } catch (clipboardError) {
        console.error('Share failed:', clipboardError);
      }
    }
  };

  const showAndroidShareOptions = (message: string) => {
    // Create a modal for Android sharing options
    const shareModal = document.createElement('div');
    shareModal.className = 'fixed inset-0 bg-black/50 flex items-end z-50';
    shareModal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-6 space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share via</h3>
        <div class="space-y-3">
          <button onclick="shareToWhatsApp('${encodeURIComponent(message)}')" class="w-full flex items-center space-x-3 p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.087"/>
            </svg>
            <span>WhatsApp</span>
          </button>
          <button onclick="shareToTelegram('${encodeURIComponent(message)}')" class="w-full flex items-center space-x-3 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.59c-.12.553-.44.69-.89.43l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.43 4.5-4.07c.2-.17-.04-.27-.31-.1l-5.57 3.5-2.4-.75c-.52-.16-.53-.52.11-.77l9.39-3.61c.43-.16.81.1.67.75z"/>
            </svg>
            <span>Telegram</span>
          </button>
          <button onclick="copyToClipboard('${message.replace(/'/g, "\\'")}'); closeShareModal()" class="w-full flex items-center space-x-3 p-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span>Copy to Clipboard</span>
          </button>
        </div>
        <button onclick="closeShareModal()" class="w-full mt-4 p-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
          Cancel
        </button>
      </div>
    `;

    document.body.appendChild(shareModal);

    // Add event listener to close on backdrop click
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) {
        document.body.removeChild(shareModal);
      }
    });

    // Global functions for share buttons
    (window as any).shareToWhatsApp = (message: string) => {
      window.open(`https://wa.me/?text=${message}`, '_blank');
      document.body.removeChild(shareModal);
    };

    (window as any).shareToTelegram = (message: string) => {
      window.open(`https://t.me/share/url?text=${message}`, '_blank');
      document.body.removeChild(shareModal);
    };

    (window as any).copyToClipboard = (message: string) => {
      navigator.clipboard.writeText(message);
      console.log('Copied to clipboard!');
    };

    (window as any).closeShareModal = () => {
      document.body.removeChild(shareModal);
    };
  };

  if (!countryId) {
    return <div>Invalid country ID</div>;
  }

  return (
    <div ref={containerRef} className="mobile-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white min-h-screen pb-20 animate-slide-in-from-top">
      {/* Custom Header - Optimized size */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button onClick={handleBackClick} className="p-1.5 mr-3">
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <div className="flex items-center">
            {country?.flagUrl && (
              <img 
                src={country.flagUrl} 
                alt={`${country.name} flag`}
                className="w-6 h-5 mr-2.5 rounded-sm object-cover"
              />
            )}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {country?.name || "Loading..."}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95 touch-manipulation"
          >
            <Share className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setShowCurrencyLanguageModal(true)}
            className="text-orange-500 dark:text-orange-400 font-semibold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 px-2.5 py-1.5 rounded-lg transition-colors active:scale-95 touch-manipulation"
          >
            {getCurrencySymbol(selectedCurrency)}, {selectedCurrency}
          </button>
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Tab System */}
        <div className="flex mb-6">
          <button
            onClick={() => setSelectedTab('data')}
            className={`flex-1 py-3 px-2 sm:px-4 rounded-l-lg font-medium transition-colors text-xs sm:text-sm ${
              selectedTab === 'data'
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
          >
            Data ({demoPackages.length})
          </button>
          <button
            onClick={() => setSelectedTab('data-calls-text')}
            className={`flex-1 py-3 px-2 sm:px-4 rounded-r-lg font-medium transition-colors text-xs sm:text-sm ${
              selectedTab === 'data-calls-text'
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
          >
            Data/Voice/SMS ({dataCallsTextPackages.length})
          </button>
        </div>

        {/* Unlimited Plan (Premium) */}
        {hasUnlimitedPlans && (
          <div className="mb-6 relative">
            <div className={`bg-gradient-to-r ${selectedPackage === 999 ? 'from-purple-600 via-blue-600 to-indigo-700' : 'from-purple-500 via-blue-500 to-indigo-600'} p-[2px] rounded-2xl shadow-lg ${selectedPackage === 999 ? 'shadow-xl ring-2 ring-blue-300 dark:ring-blue-600' : ''}`}>
              <div 
                className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${selectedPackage === 999 ? 'bg-blue-50 dark:bg-blue-950/50' : ''}`}
                onClick={() => {
                  setSelectedPackage(999);
                  console.log('🎯 Unlimited plan selected, selectedPackage set to 999');
                }}
                data-testid="card-unlimited"
                role="button"
                aria-pressed={selectedPackage === 999}
              >
                {/* Premium Badge */}
                <div className="absolute -top-2 left-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ⭐ PREMIUM
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 pt-5">
                  {/* Title */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Unlimited
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      High-speed data without limits
                    </p>
                  </div>

                  {/* Price and Day Selector - Same Row */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Left: Price */}
                    <div className="text-left">
                      <div className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-unlimited-price">
                        {convertPrice(`€${getUnlimitedPrice(selectedUnlimitedDays).toFixed(2)}`, selectedCurrency)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400" data-testid="text-unlimited-price-per-day">
                        {convertPrice(`€${(getUnlimitedPrice(selectedUnlimitedDays) / selectedUnlimitedDays).toFixed(2)}`, selectedCurrency)} /day
                      </div>
                    </div>
                    
                    {/* Right: Day Selector */}
                    <div className="flex justify-end">
                      {unlimitedPlans.length === 1 ? (
                        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-600 rounded-xl px-3 py-2">
                          <span className="font-medium text-purple-700 dark:text-purple-300 text-sm">
                            {unlimitedPlans[0].days} days
                          </span>
                        </div>
                      ) : (
                        <Select
                          value={selectedUnlimitedDays.toString()}
                          onValueChange={(value) => {
                            const days = parseInt(value);
                            setSelectedUnlimitedDays(days);
                            setSelectedUnlimitedPlan(unlimitedPlans.find(p => p.days === days)!);
                            // Ensure selectedPackage is set to 999 for unlimited plans
                            setSelectedPackage(999);
                          }}
                        >
                          <SelectTrigger 
                            className="min-w-[100px] w-auto bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300 font-medium text-sm whitespace-nowrap"
                            data-testid="button-unlimited-daypicker"
                          >
                            <SelectValue placeholder={`${selectedUnlimitedDays} days`} />
                          </SelectTrigger>
                          <SelectContent>
                            {unlimitedPlans.map((plan) => (
                              <SelectItem 
                                key={plan.days} 
                                value={plan.days.toString()}
                                data-testid={`option-unlimited-days-${plan.days}`}
                              >
                                {plan.days} days - {convertPrice(`€${plan.priceEur.toFixed(2)}`, selectedCurrency)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  
                  {/* Features and Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">5G Ready</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">Instant Setup</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleUnlimitedPurchase}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-[22px] py-2 rounded-xl transition-all transform hover:scale-105 shadow-md text-sm"
                      data-testid="button-unlimited-purchase"
                    >
                      Get Unlimited
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Package List */}
        <div className="space-y-3 mb-6">
          {selectedTab === 'data' ? (
            // Data Only Packages
            demoPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg.id)}
                className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 scale-[1.02] shadow-md'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-left flex-1">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.duration}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">{pkg.data}</div>
                  </div>
                  <div className="flex-1 flex flex-col items-start justify-center pl-16">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{convertPrice(pkg.price, selectedCurrency)}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">{convertPrice(pkg.pricePerDay.split(' ')[0], selectedCurrency)} /day</div>
                  </div>
                  <div className="flex-1 flex justify-end items-center">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1 rounded-sm ${
                            bar <= pkg.signalStrength
                              ? bar <= 2 ? 'bg-red-500 h-2'
                                : bar <= 3 ? 'bg-yellow-500 h-3'
                                : bar <= 4 ? 'bg-green-500 h-4'
                                : 'bg-green-600 h-5'
                              : 'bg-gray-300 dark:bg-gray-600 h-2'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            // Data/Calls/Text Packages
            dataCallsTextPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg.id)}
                className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 scale-[1.02] shadow-md'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center">
                  {/* Left side - Data & Duration */}
                  <div className="text-left flex-1">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.duration}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">{pkg.data}</div>
                  </div>
                  
                  {/* Middle - Voice & SMS */}
                  <div className="flex-1 flex flex-col items-start justify-center">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-sm text-green-600 dark:text-green-400">📞</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{pkg.voice}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-blue-600 dark:text-blue-400">💬</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{pkg.sms}</span>
                    </div>
                  </div>
                  
                  {/* Right side - Price & Signal */}
                  <div className="flex-1 flex flex-col items-end justify-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{convertPrice(pkg.price, selectedCurrency)}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">{convertPrice(pkg.pricePerDay.split(' ')[0], selectedCurrency)} /day</div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1 rounded-sm ${
                            bar <= pkg.signalStrength
                              ? bar <= 2 ? 'bg-red-500 h-2'
                                : bar <= 3 ? 'bg-yellow-500 h-3'
                                : bar <= 4 ? 'bg-green-500 h-4'
                                : 'bg-green-600 h-5'
                              : 'bg-gray-300 dark:bg-gray-600 h-2'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>


        {/* Bottom spacing for sticky section - adjust for combo packages */}
        <div className={`${selectedTab === 'data-calls-text' ? 'h-32' : 'h-28'}`}></div>
      </div>

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/50 p-4 mx-auto max-w-md">
        {/* Smart Floating Action Chips - Device Compatibility & Package Details */}
        {selectedPackageForCheckout && (
          <div className="mb-3 flex justify-center gap-2">
            {/* Device Compatibility Chip */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  data-testid="button-device-compatibility"
                  aria-label={deviceCompatibilityAck ? "Device compatibility confirmed" : "Check device compatibility for eSIM"}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
                    deviceCompatibilityAck 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 motion-safe:animate-pulse'
                  }`}
                >
                  {deviceCompatibilityAck ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>eSIM Ready ✓</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      <span>eSIM ready?</span>
                    </>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-72 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
                sideOffset={8}
              >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      Device Compatibility
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Please ensure your device supports eSIM and is carrier-unlocked before completing your purchase.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleDeviceCompatibilityAck}
                      size="sm"
                      className="flex-1 text-xs h-8"
                      data-testid="button-confirm-device"
                    >
                      I confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      data-testid="button-learn-more"
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Package Details Chip */}
            <Drawer open={packageDetailsOpen} onOpenChange={setPackageDetailsOpen}>
              <DrawerTrigger asChild>
                <button
                  data-testid="button-package-details"
                  aria-label="View package details"
                  className="inline-flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Package Details</span>
                </button>
              </DrawerTrigger>
              
              <DrawerContent className="max-h-[75vh] w-full p-0 overflow-hidden">
                <DrawerHeader className="text-left">
                  <DrawerTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Technical Specifications
                  </DrawerTitle>
                  <DrawerDescription className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Complete information about your selected eSIM package
                  </DrawerDescription>
                </DrawerHeader>
                
                <div className="px-4 pb-3 space-y-4 sm:space-y-6">
                  {/* Selected Package Overview - Professional */}
                  <div className="p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {country?.flagUrl && (
                          <img 
                            src={country.flagUrl} 
                            alt={`${country.name} flag`}
                            className="w-12 h-8 rounded-sm object-cover"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {String(selectedPackageForCheckout?.data)} • {selectedPackageForCheckout?.duration}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Selected eSIM Package
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-900 dark:text-white">
                          {selectedPackageForCheckout?.price}
                        </div>
                        {'pricePerDay' in (selectedPackageForCheckout || {}) && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {(selectedPackageForCheckout as any).pricePerDay}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Network & Plan Information - Professional Design */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      Network & Plan Information
                    </h4>
                    
                    <div className="grid gap-2 sm:gap-3">
                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Provider</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">T-Mobile • Verizon</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Plan Category</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
                          {('voice' in (selectedPackageForCheckout || {}) && 'sms' in (selectedPackageForCheckout || {})) ? 'Data + Voice + SMS' : 'Data Only'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Network Technology</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">5G/LTE/3G</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Activation Method</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">QR Code Scan</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">eKYC Verification</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-red-600 dark:text-red-400">Not Required</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Roaming Support</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-blue-600 dark:text-blue-400">Yes</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">TOP-UP Option</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">Available</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Hotspot</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-green-600 dark:text-green-400">Yes</span>
                      </div>

                    </div>
                  </div>
                  
                  {/* Close button */}
                  <div className="pt-4">
                    <DrawerClose asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        data-testid="button-close-package-details"
                      >
                        Close
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}
        
        {/* Selected Package Details */}
        {selectedPackageForCheckout && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {country?.flagUrl && (
                  <img 
                    src={country.flagUrl} 
                    alt={`${country.name} flag`}
                    className="w-6 h-4 rounded-sm object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedPackageForCheckout.duration}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className="w-1 rounded-sm bg-green-500"
                          style={{ height: `${4 + bar * 2}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>
                      {String(selectedPackageForCheckout.data)}
                    </div>
                    {/* Show voice and SMS for combo packages */}
                    {('voice' in selectedPackageForCheckout && 'sms' in selectedPackageForCheckout && 
                      selectedPackageForCheckout.voice && selectedPackageForCheckout.sms) && (
                      <div className="flex items-center space-x-3 -mt-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-green-600 dark:text-green-400">📞</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {(selectedPackageForCheckout as any).voice}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-blue-600 dark:text-blue-400">💬</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {(selectedPackageForCheckout as any).sms}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedPackageForCheckout.price}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {'pricePerDay' in selectedPackageForCheckout ? selectedPackageForCheckout.pricePerDay : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          disabled={!selectedPackage || isProcessing}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex-1 text-center">
                <span>Checkout</span>
              </div>
              <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}
        </Button>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        selectedPackage={selectedPackageForCheckout}
        country={country}
        esimCount={esimCount}
        setEsimCount={setEsimCount}
        onComplete={async () => {
          try {
            console.log("Purchase completion started...");
            const response = await fetch("/api/purchase", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                packageId: selectedPackage,
                paymentMethod: "card"
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log("Purchase successful, navigating to QR page:", data);
              setShowCheckoutModal(false);
              setLocation(`/qr/${data.esim.id}`);
            } else {
              console.error("Purchase failed:", response.statusText);
            }
          } catch (error) {
            console.error("Purchase error:", error);
          }
        }}
      />

      {/* Currency & Language Settings Modal (copied from home.tsx) */}
      {showCurrencyLanguageModal && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCurrencyLanguageModal(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose your preferences</p>
              </div>
              <button 
                onClick={() => setShowCurrencyLanguageModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Currency Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Currency
                </label>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {['Europe', 'Americas', 'Asia', 'Middle East', 'Africa', 'Oceania'].map(region => {
                    const regionCurrencies = currencies.filter(c => c.region === region);
                    if (regionCurrencies.length === 0) return null;
                    
                    return (
                      <optgroup key={region} label={region}>
                        {regionCurrencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              {/* Language Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                  </svg>
                  Language
                </label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.flag} {language.nativeName} ({language.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {currencies.find(c => c.code === selectedCurrency)?.symbol} {selectedCurrency}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {languages.find(l => l.code === selectedLanguage)?.nativeName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCurrencyLanguageModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCurrencyLanguageModal(false)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
