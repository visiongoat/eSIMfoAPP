import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import profileImage from "@assets/IMG_5282_1753389516466.jpeg";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CountryCard from "@/components/country-card";

import type { Country, Package } from "@shared/schema";

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('local');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle tab change with smooth animation
  const handleTabChange = (newTab: string) => {
    if (newTab === selectedTab || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Fade out current content, then switch tab
    setTimeout(() => {
      setSelectedTab(newTab);
      // Fade in new content
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const placeholderTexts = [
    'Find your destination',
    'Search a country or city',
    'Type Germany, Spain, or Japan',
    'Looking for Europe plans?',
    'Explore eSIMs for USA, UAE…',
    'Where are you traveling to?',
    'Start typing a country name…',
    'eSIM for 200+ countries'
  ];

  // Typewriter effect for search placeholder
  useEffect(() => {
    let isMounted = true;
    let currentText = '';
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;
    
    const typeWriter = () => {
      if (!isMounted) return;
      
      const fullText = placeholderTexts[placeholderIndex];
      
      if (isDeleting) {
        currentText = currentText.slice(0, -1);
      } else {
        currentText = fullText.slice(0, currentText.length + 1);
      }
      
      setPlaceholderText(currentText);
      
      let typeSpeed = 80;
      
      if (isDeleting) {
        typeSpeed = 40;
      }
      
      if (!isDeleting && currentText === fullText) {
        typeSpeed = 2000; // Pause when complete
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        typeSpeed = 500;
      }
      
      timeoutId = setTimeout(typeWriter, typeSpeed);
    };
    
    timeoutId = setTimeout(typeWriter, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [placeholderIndex]);

  // Prevent body scroll when modal is open + Safari viewport fix
  useEffect(() => {
    if (showLiveChat || showHowItWorks) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Safari-specific viewport fix
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        const modalContent = document.querySelector('.modal-content') as HTMLElement;
        const modalInput = document.querySelector('.modal-input-area') as HTMLElement;
        
        if (modalContent) {
          modalContent.style.height = '70vh';
          modalContent.style.maxHeight = '70vh';
        }
        if (modalInput) {
          modalInput.style.paddingBottom = '3rem';
        }
      }
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showLiveChat, showHowItWorks]);

  // Touch handlers for swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const deltaY = currentY - startY;
    const threshold = 150; // Minimum swipe distance to close
    const velocity = Math.abs(deltaY) / 100; // Simple velocity calculation
    
    // Close if dragged far enough OR if velocity is high enough
    if (deltaY > threshold || (deltaY > 50 && velocity > 0.5)) {
      // Add a smooth closing animation
      setTimeout(() => {
        setShowLiveChat(false);
      }, 100);
    }
    
    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };
  
  // Detect user's country (in real app this would come from IP geolocation)
  const getUserCountry = () => {
    // Simulating different countries based on time for demo
    const countries = [
      { name: 'Turkey', code: 'TR', flag: '🇹🇷', price: '€2.99' },
      { name: 'Germany', code: 'DE', flag: '🇩🇪', price: '€3.49' },
      { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', price: '€3.99' },
      { name: 'France', code: 'FR', flag: '🇫🇷', price: '€4.49' },
      { name: 'Spain', code: 'ES', flag: '🇪🇸', price: '€3.49' }
    ];
    const index = Math.floor(Date.now() / 10000) % countries.length;
    return countries[index];
  };
  
  const userCountry = getUserCountry();

  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
  });

  const { data: popularPackages = [] } = useQuery<(Package & { country?: Country })[]>({
    queryKey: ["/api/packages/popular"],
  });

  const { data: profile } = useQuery<{ name?: string }>({
    queryKey: ['/api/profile']
  });

  // Fetch user's eSIMs to get active count
  const { data: userEsims = [] } = useQuery<any[]>({
    queryKey: ['/api/esims'],
    enabled: !!profile, // Only fetch if user is logged in
  });

  // Time-based greeting function
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning', icon: '🌅' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon', icon: '☀️' };
    } else if (hour >= 17 && hour < 21) {
      return { text: 'Good Evening', icon: '🌆' };
    } else {
      return { text: 'Good Night', icon: '🌙' };
    }
  };

  const greeting = getTimeBasedGreeting();

  const handleCountrySelect = (country: Country) => {
    setLocation(`/packages/${country.id}`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'browse':
        setLocation('/search');
        break;
      case 'my-esims':
        setLocation('/my-esims');
        break;
      case 'qr':
        setLocation('/my-esims');
        break;
    }
  };



  // Filter countries based on selected tab
  const getFilteredCountries = () => {
    switch (selectedTab) {
      case 'local':
        return countries.filter(country => 
          ['United States', 'United Kingdom', 'Germany', 'France', 'Japan'].includes(country.name)
        ).slice(0, 8);
      case 'regional':
        return countries.filter(country => 
          ['Spain', 'Italy', 'Netherlands', 'Poland', 'Turkey'].includes(country.name)
        ).slice(0, 8);
      case 'global':
        return countries.slice(0, 8);
      default:
        return countries.slice(0, 8);
    }
  };

  const popularDestinations = getFilteredCountries();

  // Filter countries based on search query
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    return countries.filter(country => 
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Show max 5 results
  };

  // Enhanced search results with plan info
  const getEnhancedSearchResults = () => {
    const results = getSearchResults();
    return results.map(country => {
      // Add plan information based on country
      let planCount = 3; // Default
      let hasFullPlan = false;
      
      switch(country.name) {
        case 'United States':
          planCount = 13;
          hasFullPlan = true;
          break;
        case 'United Kingdom':
          planCount = 12;
          hasFullPlan = true;
          break;
        case 'Germany':
          planCount = 8;
          break;
        case 'France':
          planCount = 6;
          break;
        case 'Turkey':
          planCount = 5;
          break;
        case 'Spain':
          planCount = 7;
          break;
        case 'Italy':
          planCount = 6;
          break;
        case 'Japan':
          planCount = 9;
          break;
        default:
          planCount = Math.floor(Math.random() * 10) + 3; // 3-12 random
      }
      
      return {
        ...country,
        planCount,
        hasFullPlan
      };
    });
  };

  const searchResults = getEnhancedSearchResults();



  return (
    <div className="mobile-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      {/* Compact Header with Search */}
      <div className="relative sticky top-0 z-10 py-4">
        <div className="max-w-screen-md mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* User Profile Photo */}
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-blue-500">
              {profile?.name ? (
                <img 
                  src={profileImage} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            {/* Hello, Guest/User Text */}
            <div>
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-700">Hello, </span>
                <span className="text-lg font-semibold text-blue-600">
                  {profile?.name || 'Guest user'}
                </span>
              </div>
              {/* Time-based greeting */}
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-xs">{greeting.icon}</span>
                <span className="text-xs text-gray-500 font-medium">{greeting.text}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Currency Display */}
            <div className="flex items-center bg-green-50 border border-green-200 px-2 py-1 rounded-md">
              <span className="text-xs font-semibold text-green-700">€ EUR</span>
            </div>
            
            {/* Compact Live Chat Button */}
            <div>
              <button 
                onClick={() => setShowLiveChat(true)}
                className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-md active:shadow-sm transition-all duration-200 active:scale-95 relative"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                {/* Active status indicator */}
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar with Smart Features - Fixed positioning */}
      <div className="max-w-screen-md mx-auto px-4 mb-4">
        <div className="relative z-[9999]">
          <div className="bg-white rounded-2xl p-4 flex items-center space-x-3 hover:shadow-lg focus-within:shadow-xl focus-within:border-blue-500 focus-within:border-2 focus-within:scale-[1.02] transition-all duration-300 border border-gray-200 group">
            {/* Animated Search Icon */}
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Pulse effect when focused */}
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-focus-within:opacity-20 group-focus-within:animate-ping"></div>
            </div>

            <input
              type="text"
              value={searchQuery}
              placeholder={searchQuery ? "Type country name..." : placeholderText}
              className="text-gray-700 text-base flex-1 outline-none bg-transparent placeholder-gray-500 font-medium"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => {
                setShowSearchResults(searchQuery.length > 0);
              }}
              onBlur={() => {
                setTimeout(() => setShowSearchResults(false), 150);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchResults.length > 0) {
                    handleCountrySelect(searchResults[0]);
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }
                }
                if (e.key === 'Escape') {
                  setSearchQuery('');
                  setShowSearchResults(false);
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />

            {/* Search Actions */}
            <div className="flex items-center space-x-2">
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors group/clear"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover/clear:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Keyboard shortcut hint */}
              <div className="hidden group-focus-within:flex items-center space-x-1 animate-fadeIn">
                <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border font-mono">ESC</kbd>
              </div>
            </div>
          </div>

          {/* Mobile Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-200 mt-1 z-[9999] overflow-hidden" style={{position: 'absolute', zIndex: 99999}}>
              {searchResults.map((country, index) => {
                // Create flag emoji from country code
                const getFlagEmoji = (code: string) => {
                  if (!code || code.length !== 2) return '🌍';
                  const codePoints = code.toUpperCase().split('').map(char => 
                    127397 + char.charCodeAt(0)
                  );
                  return String.fromCodePoint(...codePoints);
                };

                return (
                  <button
                    key={country.id}
                    onClick={() => {
                      handleCountrySelect(country);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full px-4 py-3.5 flex items-center space-x-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left transition-all duration-200 active:bg-blue-50 group"
                  >
                    {/* Premium Flag Container */}
                    <div className="relative">
                      <div className="w-11 h-11 bg-gradient-to-br from-white to-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-200 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                        <span className="text-xl filter drop-shadow-sm">{getFlagEmoji(country.code)}</span>
                      </div>
                      {/* Signal indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {country.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500 font-medium">{country.planCount} eSIMs</span>
                        {country.hasFullPlan && (
                          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                            📞 Full Plan
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modern Pill-Style Tabs - Matched spacing */}
        <div className="max-w-screen-md mx-auto px-4 mb-2">
          <div className="flex gap-1 p-1.5 bg-gradient-to-r from-gray-100/80 via-white to-gray-100/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/40">
            {[
              { 
                id: 'local', 
                label: 'Local', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                color: 'bg-blue-500'
              },
              { 
                id: 'regional', 
                label: 'Regional', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                color: 'bg-green-500'
              },
              { 
                id: 'global', 
                label: 'Global', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: 'bg-purple-500'
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform relative group ${
                  selectedTab === tab.id
                    ? `${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-500/30 scale-105`
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/80 hover:shadow-md hover:scale-102 active:scale-95'
                }`}
                style={{willChange: 'transform'}}
              >
                <div className="flex items-center justify-center space-x-2 relative z-10">
                  <div className={`transition-transform duration-300 ${selectedTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {tab.icon}
                  </div>
                  <span className="tracking-wide">{tab.label}</span>
                </div>
                
                {/* Enhanced effects for active tab */}
                {selectedTab === tab.id && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-xl opacity-80"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 rounded-xl"></div>
                  </>
                )}
                
                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 transition-opacity duration-200 bg-white/20"></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Main Content Grid */}
      <div className="max-w-screen-md mx-auto px-4 pb-2 relative overflow-hidden mt-4">
        <div 
          key={selectedTab}
          className={`transition-all duration-300 ${
            isTransitioning 
              ? 'opacity-40 scale-[0.98]' 
              : 'opacity-100 scale-100'
          }`}
        >
        {selectedTab === 'local' ? (
          <div className="space-y-4">
            {/* User's Local Country - Enhanced with subtle animations */}
            <div className="relative overflow-hidden group">
              <button 
                onClick={() => handleCountrySelect(countries[0])}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 border-none outline-none group relative"
              >
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Flag with subtle hover animation */}
                  <span className="text-2xl transform transition-transform duration-200 group-hover:scale-105">
                    {userCountry.flag}
                  </span>
                  <div className="text-left">
                    <h3 className="font-semibold text-base">{userCountry.name}</h3>
                    <p className="text-white/70 text-xs">Your current location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">From {userCountry.price}</div>
                  </div>
                  {/* Enhanced LOCAL badge */}
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold transform transition-transform duration-200 group-hover:scale-105">
                    LOCAL
                  </div>
                </div>
                </div>
                
                {/* Subtle overlay effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-white rounded-xl"></div>
              </button>
            </div>

            {/* Popular Local Countries - 20 countries grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'United States', flagColors: ['#B22234', '#FFFFFF', '#3C3B6E'], price: '€4.99' },
                { name: 'France', flagColors: ['#0055A4', '#FFFFFF', '#EF4135'], price: '€3.49' },
                { name: 'China', flagColors: ['#DE2910'], price: '€5.99' },
                { name: 'Spain', flagColors: ['#C60B1E', '#FFC400'], price: '€3.49' },
                { name: 'Italy', flagColors: ['#009246', '#FFFFFF', '#CE2B37'], price: '€3.99' },
                { name: 'Turkey', flagColors: ['#E30A17'], price: '€2.99' },
                { name: 'United Kingdom', flagColors: ['#012169', '#FFFFFF', '#C8102E'], price: '€3.99' },
                { name: 'Germany', flagColors: ['#000000', '#DD0000', '#FFCE00'], price: '€3.49' },
                { name: 'Mexico', flagColors: ['#006847', '#FFFFFF', '#CE1126'], price: '€4.49' },
                { name: 'Thailand', flagColors: ['#ED1C24', '#FFFFFF', '#241D4F'], price: '€3.99' },
                { name: 'Hong Kong', flagColors: ['#DE2910'], price: '€5.49' },
                { name: 'Malaysia', flagColors: ['#CC0001', '#FFFFFF', '#010066'], price: '€4.99' },
                { name: 'Greece', flagColors: ['#0D5EAF', '#FFFFFF'], price: '€3.99' },
                { name: 'Canada', flagColors: ['#FF0000', '#FFFFFF'], price: '€4.99' },
                { name: 'South Korea', flagColors: ['#FFFFFF', '#C60C30', '#003478'], price: '€5.99' },
                { name: 'Japan', flagColors: ['#FFFFFF', '#BC002D'], price: '€5.99' },
                { name: 'Singapore', flagColors: ['#ED2939', '#FFFFFF'], price: '€5.49' },
                { name: 'Aruba', flagColors: ['#318CE7', '#FFCE00'], price: '€6.99' },
                { name: 'Afghanistan', flagColors: ['#000000', '#D32011', '#FFFFFF'], price: '€7.99' },
                { name: 'Anguilla', flagColors: ['#012169', '#FFFFFF'], price: '€8.99' }
              ].map((country, index) => (
                <button
                  key={index}
                  onClick={() => handleCountrySelect(countries[0])}
                  className="bg-white rounded-xl p-3 text-left shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-6 rounded-sm overflow-hidden shadow-sm border border-gray-200 flex">
                      {country.flagColors.length === 1 ? (
                        <div className="w-full h-full" style={{ backgroundColor: country.flagColors[0] }}></div>
                      ) : country.flagColors.length === 2 ? (
                        <>
                          <div className="w-1/2 h-full" style={{ backgroundColor: country.flagColors[0] }}></div>
                          <div className="w-1/2 h-full" style={{ backgroundColor: country.flagColors[1] }}></div>
                        </>
                      ) : (
                        <>
                          <div className="w-1/3 h-full" style={{ backgroundColor: country.flagColors[0] }}></div>
                          <div className="w-1/3 h-full" style={{ backgroundColor: country.flagColors[1] }}></div>
                          <div className="w-1/3 h-full" style={{ backgroundColor: country.flagColors[2] }}></div>
                        </>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{country.name}</div>
                      <div className="text-xs text-gray-400">From {country.price}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* More Destinations Button */}
            <button 
              onClick={() => setLocation('/search')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-4 text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] mb-8 relative overflow-hidden group"
            >
              {/* Background shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              
              <div className="relative z-10 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">More destinations</span>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>


          </div>
        ) : selectedTab === 'regional' ? (
          <div className="space-y-3">
            {/* Regional Plans */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🇪🇺</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Europe</h3>
                    <p className="text-xs text-gray-500">30+ countries • From $9.99</p>
                  </div>
                </div>
                <button className="text-blue-500 text-sm font-medium">View</button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🌏</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Asia Pacific</h3>
                    <p className="text-xs text-gray-500">15+ countries • From $12.99</p>
                  </div>
                </div>
                <button className="text-blue-500 text-sm font-medium">View</button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🌎</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Americas</h3>
                    <p className="text-xs text-gray-500">20+ countries • From $11.99</p>
                  </div>
                </div>
                <button className="text-blue-500 text-sm font-medium">View</button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">200+</div>
                <div className="text-xs text-gray-600">Countries</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">5min</div>
                <div className="text-xs text-gray-600">Activation</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">24/7</div>
                <div className="text-xs text-gray-600">Support</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Global Plans */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">🌍</span>
                    <div>
                      <h3 className="font-bold text-lg">Global eSIM</h3>
                      <p className="text-green-100 text-sm">200+ countries coverage</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>From $19.99</span>
                    <span>•</span>
                    <span>5+ plans</span>
                  </div>
                  <button 
                    onClick={() => setLocation('/packages/global')}
                    className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-50 transition-colors"
                  >
                    View Global Plans
                  </button>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold mb-2">
                    BEST VALUE
                  </div>
                </div>
              </div>
            </div>

            {/* Global Plan Options */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">1GB Global</h3>
                      <p className="text-xs text-gray-500">30 days • 200+ countries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$19.99</div>
                    <button className="text-blue-500 text-xs font-medium">Select</button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">📶</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">5GB Global</h3>
                      <p className="text-xs text-gray-500">30 days • 200+ countries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$49.99</div>
                    <button className="text-blue-500 text-xs font-medium">Select</button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">10GB Global</h3>
                      <p className="text-xs text-gray-500">30 days • 200+ countries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$89.99</div>
                    <button className="text-blue-500 text-xs font-medium">Select</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">200+</div>
                <div className="text-xs text-gray-600">Countries</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">5min</div>
                <div className="text-xs text-gray-600">Activation</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">24/7</div>
                <div className="text-xs text-gray-600">Support</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button 
            onClick={() => setLocation('/search')}
            className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 border border-green-200 rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">🔍</div>
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                202+
              </div>
            </div>
            <div className="font-medium text-gray-900 text-sm">Browse All</div>
            <div className="text-xs text-gray-600">All destinations</div>
          </button>
          
          <button 
            onClick={() => profile ? setLocation('/my-esims') : setLocation('/profile')}
            className={`rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              profile 
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">📱</div>
              {profile && (
                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {userEsims.length}
                </div>
              )}
            </div>
            <div className="font-medium text-gray-900 text-sm">
              {profile ? 'My eSIMs' : 'Sign In'}
            </div>
            <div className="text-xs text-gray-600">
              {profile 
                ? `${userEsims.length} ${userEsims.length === 1 ? 'active plan' : 'active plans'}` 
                : 'Access your eSIMs'
              }
            </div>
          </button>
        </div>
        </div>

        {/* Live Chat Modal - Bottom slide-up design */}
        {showLiveChat && (
          <div className="modal-overlay flex items-end" style={{ touchAction: 'none' }}>
            {/* Backdrop */}
            <div 
              className="modal-overlay bg-black/50 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setShowLiveChat(false)}
              style={{ backdropFilter: 'blur(4px)' }}
            />
            
            {/* Modal Content */}
            <div 
              className="modal-content relative w-full bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                zIndex: 10000,
                position: 'relative',
                height: '75vh',
                maxHeight: '75vh',
                minHeight: '60vh'
              }}
            >
              {/* Header - Native app style */}
              <div className="px-4 py-4 text-white rounded-t-3xl relative" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)' }}>
                {/* Drag Handle */}
                <div className="flex justify-center absolute top-2 left-0 right-0">
                  <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-bold">eSIMfo</h1>
                  </div>
                  <button 
                    onClick={() => setShowLiveChat(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center active:bg-white/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Support Team Avatars */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2" style={{ borderColor: '#3B82F6' }}>
                      <span className="text-xs">👩‍💼</span>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2" style={{ borderColor: '#3B82F6' }}>
                      <span className="text-xs">👨‍💼</span>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2" style={{ borderColor: '#3B82F6' }}>
                      <span className="text-xs">👩‍💻</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-medium mb-1">Hi, Welcome to eSIMfo 👋</h2>
                <p className="text-blue-100 text-sm">Our support team is here to help you 24/7</p>
              </div>

              {/* Chat Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Welcome Message from Bot */}
                <div className="bg-gray-50 rounded-2xl p-4 shadow-sm max-w-[85%]">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3B82F6' }}>
                      <span className="text-sm text-white">🎧</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">eSIMfo Support</div>
                      <div className="text-gray-700 text-sm">
                        Hello, adventurer! 🌍✨ At eSIMfo, we're here to make your travel experience epic. How can we assist you today?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100 active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📱</span>
                        <span className="font-medium text-gray-900 text-sm">I want an eSIM</span>
                      </div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3B82F6' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  <button className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100 active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">🛠️</span>
                        <span className="font-medium text-gray-900 text-sm">I already purchased an eSIM</span>
                      </div>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3B82F6' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Message Input - Fixed at bottom */}
              <div 
                className="modal-input-area px-4 pt-4 border-t border-gray-100 flex-shrink-0"
                style={{ paddingBottom: '2.5rem' }}
              >
                <div className="bg-gray-50 rounded-full shadow-sm border border-gray-200 flex items-center px-4 py-3">
                  <input
                    type="text"
                    placeholder="Send us a message"
                    className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                  <button className="ml-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95" style={{ backgroundColor: '#3B82F6' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Modal */}
        {showHowItWorks && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-[9999]" 
            onClick={() => setShowHowItWorks(false)}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              zIndex: 9999
            }}
          >
            <div 
              className="bg-white rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
              style={{ zIndex: 10000 }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">How Does eSIMfo Work?</h2>
                  <button 
                    onClick={() => setShowHowItWorks(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">Get global data connectivity in just a few simple steps</p>
              </div>

              {/* Content */}
              <div className="px-4 py-3 space-y-3">
                {/* Step 1 */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-0.5">Choose Your Destination and Plan</h3>
                    <p className="text-gray-600 text-sm">Select from over 200 countries and pick the plan that suits you best</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-0.5">Set Up Your eSIM</h3>
                    <p className="text-gray-600 text-sm">Scan the QR code to install your eSIM on your phone</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-0.5">Activate Your eSIM</h3>
                    <p className="text-gray-600 text-sm">Turn on your eSIM during your trip and get connected instantly</p>
                  </div>
                </div>

                {/* Get Started Button */}
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setShowHowItWorks(false);
                      setLocation('/search');
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Get Started Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How Does eSIMfo Work - Compact Button */}
      <div className="max-w-screen-md mx-auto px-4 pb-0 pt-1">
        <button 
          onClick={() => setShowHowItWorks(true)}
          className="w-full bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">How Does eSIMfo Work?</h3>
              <p className="text-gray-600 text-sm">Get global data connectivity in just a few simple steps</p>
            </div>
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      <TabBar />
    </div>
  );
}

