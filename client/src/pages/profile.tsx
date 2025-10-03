import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import EsimfoLogo from "@/components/esimfo-logo";
import { useTheme } from "@/contexts/theme-context";
import type { User } from "@shared/schema";
import { getTravelerLevel, getNextLevel, getLevelProgress, TRAVELER_LEVELS } from "@shared/schema";

export default function ProfileScreen() {
  const [, setLocation] = useLocation();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showInAppSupport, setShowInAppSupport] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [supportMessages, setSupportMessages] = useState([
    {
      id: 1,
      text: 'Hello! Welcome to eSIMfo live support team! 👋',
      isBot: false,
      isSupport: true,
      time: '18:30'
    },
    {
      id: 2,
      text: 'How can we help you? You can choose one of the options below or write directly.',
      isBot: false,
      isSupport: true,
      time: '18:30'
    }
  ]);
  const [swipeY, setSwipeY] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [startY, setStartY] = useState(0);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [languageSearchTerm, setLanguageSearchTerm] = useState('');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR (€)');
  const [currencySearchTerm, setCurrencySearchTerm] = useState('');
  const { data: user } = useQuery<User>({
    queryKey: ["/api/profile"],
  });

  const { theme, toggleTheme } = useTheme();

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (showQuickActions) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      setSwipeY(0);
      setIsSwipeActive(false);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [showQuickActions]);

  // Touch handlers for swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsSwipeActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwipeActive) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    
    if (deltaY > 0) {
      setSwipeY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (swipeY > 100) {
      setShowQuickActions(false);
    } else {
      setSwipeY(0);
    }
    setIsSwipeActive(false);
  };

  // Support message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: supportMessages.length + 1,
      text: currentMessage,
      isBot: false,
      isSupport: false,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setSupportMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Support team response after 1.5 seconds
    setTimeout(() => {
      const response = {
        id: supportMessages.length + 2,
        text: 'Thank you for your message. A support team member will respond to you shortly.',
        isBot: false,
        isSupport: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setSupportMessages(prev => [...prev, response]);
    }, 1500);
  };

  // Handle quick messages
  const handleQuickMessage = (message: string) => {
    const userMessage = {
      id: supportMessages.length + 1,
      text: message,
      isBot: false,
      isSupport: false,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setSupportMessages(prev => [...prev, userMessage]);

    // Support team response after 1.5 seconds
    setTimeout(() => {
      let response = '';
      if (message.includes('eSIM')) {
        response = 'We received your eSIM question. Which country eSIM are you using and what kind of problem are you experiencing?';
      } else if (message.includes('Activation')) {
        response = 'We are ready to help with your activation issue. Could you please share the ICCID number of your eSIM?';
      } else {
        response = 'A support team member will respond to you shortly. Is there anything else I can help with?';
      }
      
      const botResponse = {
        id: supportMessages.length + 2,
        text: response,
        isBot: false,
        isSupport: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setSupportMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  // Currency options
  const currencies = [
    { code: 'EUR', name: 'EUR (€)', symbol: '€', selected: true },
    { code: 'USD', name: 'USD ($)', symbol: '$' },
    { code: 'GBP', name: 'GBP (£)', symbol: '£' },
    { code: 'TRY', name: 'TRY (₺)', symbol: '₺' },
    { code: 'JPY', name: 'JPY (¥)', symbol: '¥' },
    { code: 'CHF', name: 'CHF (CHF)', symbol: 'CHF' },
    { code: 'CAD', name: 'CAD (C$)', symbol: 'C$' },
    { code: 'AUD', name: 'AUD (A$)', symbol: 'A$' },
    { code: 'SEK', name: 'SEK (kr)', symbol: 'kr' },
    { code: 'NOK', name: 'NOK (kr)', symbol: 'kr' },
    { code: 'DKK', name: 'DKK (kr)', symbol: 'kr' },
    { code: 'PLN', name: 'PLN (zł)', symbol: 'zł' },
    { code: 'CZK', name: 'CZK (Kč)', symbol: 'Kč' },
    { code: 'HUF', name: 'HUF (Ft)', symbol: 'Ft' },
    { code: 'RON', name: 'RON (lei)', symbol: 'lei' },
    { code: 'BGN', name: 'BGN (лв)', symbol: 'лв' },
    { code: 'HRK', name: 'HRK (kn)', symbol: 'kn' },
    { code: 'RUB', name: 'RUB (₽)', symbol: '₽' },
    { code: 'UAH', name: 'UAH (₴)', symbol: '₴' },
    { code: 'CNY', name: 'CNY (¥)', symbol: '¥' },
    { code: 'INR', name: 'INR (₹)', symbol: '₹' },
    { code: 'KRW', name: 'KRW (₩)', symbol: '₩' },
    { code: 'SGD', name: 'SGD (S$)', symbol: 'S$' },
    { code: 'HKD', name: 'HKD (HK$)', symbol: 'HK$' },
    { code: 'NZD', name: 'NZD (NZ$)', symbol: 'NZ$' },
    { code: 'ZAR', name: 'ZAR (R)', symbol: 'R' },
    { code: 'BRL', name: 'BRL (R$)', symbol: 'R$' },
    { code: 'MXN', name: 'MXN ($)', symbol: '$' },
    { code: 'AED', name: 'AED (د.إ)', symbol: 'د.إ' },
    { code: 'SAR', name: 'SAR (﷼)', symbol: '﷼' },
  ];

  // Language options
  const languages = [
    { code: 'tr', name: 'Türkçe', selected: true },
    { code: 'ar', name: 'العربية' },
    { code: 'az', name: 'Azərbaycan' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Bahasa Melayu' },
    { code: 'bg', name: 'Български' },
    { code: 'bs', name: 'Bosanski' },
    { code: 'cs', name: 'Čeština' },
    { code: 'da', name: 'Dansk' },
    { code: 'de', name: 'Deutsch' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español (España)' },
    { code: 'es-la', name: 'Español (Latinoamérica)' },
    { code: 'et', name: 'Eesti' },
    { code: 'fa', name: 'فارسی' },
    { code: 'tl', name: 'Filipino' },
    { code: 'fr', name: 'Français' },
    { code: 'hr', name: 'Hrvatski' },
    { code: 'it', name: 'Italiano' },
    { code: 'lv', name: 'Latviešu' },
    { code: 'lt', name: 'Lietuvių' },
    { code: 'hu', name: 'Magyar' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'no', name: 'Norsk' },
    { code: 'pl', name: 'Polski' },
    { code: 'pt', name: 'Português' },
    { code: 'ro', name: 'Română' },
    { code: 'ru', name: 'Русский' },
    { code: 'sk', name: 'Slovenčina' },
    { code: 'sl', name: 'Slovenščina' },
    { code: 'fi', name: 'Suomi' },
    { code: 'sv', name: 'Svenska' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'uk', name: 'Українська' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
  ];

  const profileSections = [
    {
      title: "Account Settings",
      items: [
        { 
          icon: (
            <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          ), 
          label: "Personal Information", 
          hasArrow: true,
          action: "personal-info"
        },
        { 
          icon: (
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          ), 
          label: "Refer & Earn", 
          value: "Invite friends & earn €3",
          hasArrow: true, 
          action: "refer-earn"
        },
        { 
          icon: (
            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          ), 
          label: "fo Balance", 
          hasArrow: true, 
          action: "balance" 
        },
        { 
          icon: (
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          ), 
          label: "Identity verification", 
          hasArrow: true, 
          action: "identity-verification" 
        },
        { 
          icon: (
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
          ), 
          label: "Theme", 
          hasToggle: true, 
          enabled: theme === 'dark' 
        },


      ]
    },
    {
      title: "Support",
      items: [
        { 
          icon: (
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
          ), 
          label: "Language", 
          hasArrow: true,
          action: "language",
          value: selectedLanguage
        },
        { 
          icon: (
            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          ), 
          label: "Currency", 
          hasArrow: true,
          action: "currency",
          value: selectedCurrency
        },

        { 
          icon: (
            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          ), 
          label: "Contact Support", 
          hasArrow: true 
        },
        { 
          icon: (
            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          ), 
          label: "Rate the App", 
          hasArrow: true 
        },
      ]
    },
    {
      title: "About",
      items: [
        { 
          icon: (
            <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          ), 
          label: "Terms of Service", 
          hasArrow: true 
        },
        { 
          icon: (
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          ), 
          label: "Privacy Policy", 
          hasArrow: true 
        },
        { 
          icon: (
            <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          ), 
          label: "About Esimfo", 
          value: "v1.2.3" 
        },
      ]
    }
  ];

  // Filter functions
  const filteredLanguages = languages.filter(language =>
    language.name.toLowerCase().includes(languageSearchTerm.toLowerCase())
  );

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(currencySearchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(currencySearchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Profile"
      />

      <div className="px-4 pt-4">
        {/* Profile Header */}
        <div className="mobile-card p-6 mb-4 text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative" 
               style={{
                 border: '2px solid rgba(59, 130, 246, 0.8)',
                 boxShadow: `
                   0 0 0 1px rgba(59, 130, 246, 0.2),
                   0 0 20px rgba(59, 130, 246, 0.15),
                   0 0 40px rgba(59, 130, 246, 0.1),
                   0 4px 20px rgba(0, 0, 0, 0.3),
                   inset 0 1px 0 rgba(255, 255, 255, 0.3),
                   inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                 `
               }}>
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'text-white text-2xl font-bold';
                  fallback.textContent = user ? getInitials(user.name) : 'JD';
                  target.parentElement!.appendChild(fallback);
                }}
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {user ? getInitials(user.name) : 'JD'}
              </span>
            )}
            {/* Enhanced light reflection effect - matching home page */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white opacity-25 pointer-events-none"></div>
            <div className="absolute top-0 left-1/4 w-1/2 h-1/3 rounded-full bg-white opacity-30 blur-sm pointer-events-none"></div>
            {/* Level Badge - Compact Style */}
            {user && (() => {
              const totalSpent = parseFloat(user.totalSpent || "0");
              const currentLevel = getTravelerLevel(totalSpent);
              return (
                <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border border-white/80 shadow flex items-center justify-center text-xs ${
                  currentLevel.color === 'gray' ? 'bg-gray-500' :
                  currentLevel.color === 'blue' ? 'bg-blue-500' :
                  currentLevel.color === 'purple' ? 'bg-purple-500' :
                  currentLevel.color === 'gold' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}>
                  {currentLevel.emoji}
                </div>
              );
            })()}
          </div>
          <h2 className="text-xl font-bold mb-1">{user?.name || 'John Doe'}</h2>
          <p className="text-sm text-gray-500 mb-4">{user?.email || 'john.doe@email.com'}</p>
          
          {/* Integrated Level Info - Better Separated */}
          {user && (() => {
            const totalSpent = parseFloat(user.totalSpent || "0");
            const currentLevel = getTravelerLevel(totalSpent);
            const nextLevel = getNextLevel(currentLevel.key);
            const progress = getLevelProgress(totalSpent, currentLevel, nextLevel || undefined);
            
            return (
              <>
                {/* Level Line - Clean Spacing */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 align-middle">{currentLevel.emoji}</span>
                    <span className="font-medium">{currentLevel.name}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="font-medium">€{totalSpent.toFixed(0)} / €{nextLevel ? nextLevel.minSpent : totalSpent.toFixed(0)}</span>
                  </div>
                  
                  {nextLevel && (
                    <span className="text-xs text-gray-500">Next: {nextLevel.name}</span>
                  )}
                  
                  {!nextLevel && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">🏆 Max Level</span>
                  )}
                </div>
                
                {/* Progress Bar */}
                {nextLevel && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div 
                      className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                
                {/* View All Levels Link - Right Aligned Under Bar */}
                <div className="text-right mt-2">
                  <button
                    onClick={() => setLocation('/traveler-levels')}
                    className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors"
                    data-testid="button-view-all-levels"
                  >
                    <span>View All Levels</span>
                    <span>›</span>
                  </button>
                </div>
              </>
            );
          })()}
        </div>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mobile-card p-4 mb-4">
            <h3 className="font-semibold mb-3">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className={`flex items-center justify-between py-2 ${
                    ('hasToggle' in item && item.hasToggle && item.label === 'Theme') || ('action' in item) || item.label === 'Contact Support' || item.hasArrow
                      ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg -mx-2 px-2 transition-colors duration-200' 
                      : ''
                  }`}
                  onClick={() => {
                    if ('hasToggle' in item && item.hasToggle && item.label === 'Theme') {
                      toggleTheme();
                    } else if ('action' in item && item.action === 'balance') {
                      setLocation('/balance');
                    } else if ('action' in item && item.action === 'personal-info') {
                      setLocation('/personal-info');
                    } else if ('action' in item && item.action === 'language') {
                      setLanguageSearchTerm('');
                      setShowLanguageModal(true);
                    } else if ('action' in item && item.action === 'currency') {
                      setCurrencySearchTerm('');
                      setShowCurrencyModal(true);
                    } else if ('action' in item && item.action === 'refer-earn') {
                      setLocation('/refer-earn');
                    } else if ('action' in item && item.action === 'identity-verification') {
                      setLocation('/identity-verification');
                    } else if (item.label === 'Contact Support') {
                      setLocation('/contact-support');
                    } else if (item.label === 'Terms of Service') {
                      window.open('https://esimfo.com/terms-conditions', '_blank');
                    } else if (item.label === 'Privacy Policy') {
                      window.open('https://esimfo.com/privacy-policy', '_blank');
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  
                  {'hasToggle' in item && item.hasToggle && item.label === 'Theme' && (
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
                      </div>
                    </div>
                  )}
                  
                  {'hasToggle' in item && item.hasToggle && item.label !== 'Theme' && (
                    <div className="flex items-center space-x-2">
                      <div className={`w-10 h-6 rounded-full relative transition-all duration-200 ${
                        'enabled' in item && item.enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                          'enabled' in item && item.enabled ? 'right-0.5' : 'left-0.5'
                        }`}></div>
                      </div>
                    </div>
                  )}
                  
                  {'value' in item && item.value && (
                    <div className="flex items-center space-x-3">
                      <div className="text-right text-sm text-muted-foreground">
                        {item.value}
                      </div>
                      <span className="text-gray-400">›</span>
                    </div>
                  )}
                  
                  {item.hasArrow && !('value' in item && item.value) && (
                    <span className="text-gray-400">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <button className="w-full py-4 text-red-500 font-medium mb-4">
          Sign Out
        </button>

        {/* esimfo Branding Footer */}
        <div className="text-center py-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500">Version 1.2.3 • Made with ❤️ for travelers</p>
        </div>
      </div>

      <TabBar onPlusClick={() => setShowQuickActions(true)} />

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={() => { setShowLanguageModal(false); setLanguageSearchTerm(''); }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Languages</h2>
              <button 
                onClick={() => { setShowLanguageModal(false); setLanguageSearchTerm(''); }}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search languages..."
                  value={languageSearchTerm}
                  onChange={(e) => setLanguageSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Language List */}
            <div className="flex-1 overflow-y-auto">
              {filteredLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setSelectedLanguage(language.name);
                    setShowLanguageModal(false);
                    setLanguageSearchTerm('');
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 flex items-center justify-between"
                >
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{language.name}</span>
                  {language.selected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={() => { setShowCurrencyModal(false); setCurrencySearchTerm(''); }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Currency</h2>
              <button 
                onClick={() => { setShowCurrencyModal(false); setCurrencySearchTerm(''); }}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search currencies..."
                  value={currencySearchTerm}
                  onChange={(e) => setCurrencySearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Currency List */}
            <div className="flex-1 overflow-y-auto">
              {filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency.name);
                    setShowCurrencyModal(false);
                    setCurrencySearchTerm('');
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 flex items-center justify-between"
                >
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{currency.name}</span>
                  {currency.selected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showQuickActions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" onClick={() => setShowQuickActions(false)}>
          <div 
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateY(${swipeY}px)`,
              transition: isSwipeActive ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div></div>
            <div className="px-6 pb-4"><h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quick Actions</h2><p className="text-gray-500 dark:text-gray-400 text-sm">Choose your eSIM category to get started</p></div>
            <div className="px-6 pb-8 space-y-3">
              <button onClick={() => { setShowQuickActions(false); setLocation('/home?tab=local'); }} className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Local eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</p></div></div><svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
              <button onClick={() => { setShowQuickActions(false); setLocation('/home?tab=regional'); }} className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 rounded-2xl p-4 border border-green-200 dark:border-green-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regional eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</p></div></div><svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
              <button onClick={() => { setShowQuickActions(false); setLocation('/home?tab=global'); }} className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Global eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage plans</p></div></div><svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
            </div>
          </div>
        </div>
      )}

      {/* Support Options Modal - Airalo Style */}
      {showSupportModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" 
          onClick={() => setShowSupportModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4 pt-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">
                Choose your preferred channel to get help from the support team.
              </p>
            </div>

            {/* Support Options - Airalo Style */}
            <div className="bg-gray-50 dark:bg-gray-800 mx-4 mb-3 rounded-xl overflow-hidden">
              {/* In-app Chat */}
              <button 
                onClick={() => {
                  setShowSupportModal(false);
                  setShowInAppSupport(true);
                }}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-900 dark:text-gray-100 font-medium">Chat in the app</span>
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* WhatsApp Support */}
              <button 
                onClick={() => {
                  setShowSupportModal(false);
                  window.open(`https://wa.me/436766440122`, '_blank');
                }}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-gray-900 dark:text-gray-100 font-medium">WhatsApp</span>
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
              </button>
            </div>

            {/* Cancel Button - Airalo Style */}
            <div className="mx-4 mb-4">
              <button 
                onClick={() => setShowSupportModal(false)}
                className="w-full py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Support Screen - eSIMfo Style */}
      {showInAppSupport && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[9999] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">eSIMfo</h1>
            <button
              onClick={() => setShowInAppSupport(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Date Header */}
          <div className="text-center py-3 bg-gray-50 dark:bg-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">27 Eylül 18:30</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-800">
            {supportMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSupport ? 'justify-start' : 'justify-end'}`}
              >
                <div className="flex items-start space-x-2 max-w-xs">
                  {message.isSupport && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div 
                      className={`px-4 py-3 rounded-2xl ${
                        message.isSupport 
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md' 
                          : 'bg-blue-500 text-white rounded-br-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 ${message.isSupport ? 'text-left' : 'text-right'}`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Message Options */}
            {supportMessages.length <= 2 && (
              <div className="flex flex-col space-y-2 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">Quick options:</p>
                <button
                  onClick={() => handleQuickMessage('I need help with my eSIM')}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-900 dark:text-white">I need help with my eSIM</span>
                </button>
                <button
                  onClick={() => handleQuickMessage('Activation problem')}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-900 dark:text-white">Activation problem</span>
                </button>
                <button
                  onClick={() => handleQuickMessage('Talk to support')}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-900 dark:text-white">Talk to support</span>
                </button>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              {/* Attachment Button */}
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Mesaj yazın"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!currentMessage.trim()}
                className={`p-3 rounded-full transition-colors ${
                  currentMessage.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
