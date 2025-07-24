import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CountryCard from "@/components/country-card";
import EsimfoLogo from "@/components/esimfo-logo";
import type { Country, Package } from "@shared/schema";

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('local');
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showLiveChat) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showLiveChat]);

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
      { name: 'Turkey', code: 'TR', flag: '🇹🇷', price: '$2.99' },
      { name: 'Germany', code: 'DE', flag: '🇩🇪', price: '$3.49' },
      { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', price: '$3.99' },
      { name: 'France', code: 'FR', flag: '🇫🇷', price: '$4.49' },
      { name: 'Spain', code: 'ES', flag: '🇪🇸', price: '$3.49' }
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

  return (
    <div className="mobile-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      {/* Compact Header with Search */}
      <div className="relative bg-white/80 backdrop-blur-sm sticky top-0 z-10 px-4 py-4 border-b border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <EsimfoLogo size="lg" />
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => setShowLiveChat(true)}
              className="text-white px-4 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg active:shadow-sm transition-all duration-200 active:scale-95"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Support</span>
                {/* Active status indicator */}
                <div className="w-2 h-2 rounded-full animate-pulse border border-white" style={{ backgroundColor: '#22C55E' }}></div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Search Bar with Typewriter Effect */}
        <div 
          className="bg-white rounded-xl p-4 flex items-center space-x-3 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 mb-4"
          onClick={() => setLocation('/search')}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-gray-600 text-base flex-1">
            {placeholderText}
            <span className="animate-pulse text-blue-500 ml-1">|</span>
          </span>
        </div>

        {/* Modern Pill-Style Tabs - Moved up */}
        <div className="mb-4">
          <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
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
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                  selectedTab === tab.id
                    ? `${tab.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="pb-20 space-y-6" style={{ paddingLeft: '17px', paddingRight: '17px' }}>
        {selectedTab === 'local' ? (
          <div className="space-y-4">
            {/* User's Local Country - Compact */}
            <button 
              onClick={() => handleCountrySelect(countries[0])}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{userCountry.flag}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-base">{userCountry.name}</h3>
                    <p className="text-blue-100 text-xs">Your current location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">From {userCountry.price}</div>
                  </div>
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                    LOCAL
                  </div>
                </div>
              </div>
            </button>

            {/* Popular Local Countries - 20 countries grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'United States', flag: '🇺🇸', price: '$4.99' },
                { name: 'France', flag: '🇫🇷', price: '$3.49' },
                { name: 'China', flag: '🇨🇳', price: '$5.99' },
                { name: 'Spain', flag: '🇪🇸', price: '$3.49' },
                { name: 'Italy', flag: '🇮🇹', price: '$3.99' },
                { name: 'Turkey', flag: '🇹🇷', price: '$2.99' },
                { name: 'United Kingdom', flag: '🇬🇧', price: '$3.99' },
                { name: 'Germany', flag: '🇩🇪', price: '$3.49' },
                { name: 'Mexico', flag: '🇲🇽', price: '$4.49' },
                { name: 'Thailand', flag: '🇹🇭', price: '$3.99' },
                { name: 'Hong Kong', flag: '🇭🇰', price: '$5.49' },
                { name: 'Malaysia', flag: '🇲🇾', price: '$4.99' },
                { name: 'Greece', flag: '🇬🇷', price: '$3.99' },
                { name: 'Canada', flag: '🇨🇦', price: '$4.99' },
                { name: 'South Korea', flag: '🇰🇷', price: '$5.99' },
                { name: 'Japan', flag: '🇯🇵', price: '$5.99' },
                { name: 'Singapore', flag: '🇸🇬', price: '$5.49' },
                { name: 'Aruba', flag: '🇦🇼', price: '$6.99' },
                { name: 'Afghanistan', flag: '🇦🇫', price: '$7.99' },
                { name: 'Anguilla', flag: '🇦🇮', price: '$8.99' }
              ].map((country, index) => (
                <button
                  key={index}
                  onClick={() => handleCountrySelect(countries[0])}
                  className="bg-white rounded-xl p-3 text-left shadow-sm hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{country.flag}</span>
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-4 text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] mb-4 relative overflow-hidden group"
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

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
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
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setLocation('/search')}
            className="bg-gray-100 rounded-xl p-4 text-left hover:bg-gray-200 transition-colors"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-medium text-gray-900 text-sm">Browse All</div>
            <div className="text-xs text-gray-600">200+ destinations</div>
          </button>
          
          <button 
            onClick={() => setLocation('/my-esims')}
            className="bg-blue-50 rounded-xl p-4 text-left hover:bg-blue-100 transition-colors"
          >
            <div className="text-2xl mb-2">📱</div>
            <div className="font-medium text-gray-900 text-sm">My eSIMs</div>
            <div className="text-xs text-gray-600">Manage plans</div>
          </button>
        </div>
        </div>

      <TabBar />

      {/* Live Chat Modal - Slides up from bottom */}
      {showLiveChat && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ touchAction: 'none' }}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowLiveChat(false)}
            onTouchMove={(e) => e.preventDefault()}
            style={{
              opacity: isDragging && currentY > startY ? Math.max(0.1, 0.5 - (currentY - startY) / 800) : 0.5
            }}
          />
          
          {/* Modal Content */}
          <div 
            className="relative w-full bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 h-[85vh] flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: isDragging && currentY > startY ? `translateY(${Math.max(0, currentY - startY)}px)` : 'translateY(0)',
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              opacity: isDragging && currentY > startY ? Math.max(0.3, 1 - (currentY - startY) / 400) : 1
            }}
          >
            {/* Header - eSIMfo Style */}
            <div className="px-4 py-4 text-white rounded-t-3xl relative" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)' }}>
              {/* Drag Handle */}
              <div className="flex justify-center absolute top-2 left-0 right-0">
                <div className="w-12 h-1 bg-white/30 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between mb-3">
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
            <div 
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Welcome Message from Bot */}
              <div className="bg-gray-50 rounded-2xl p-3 shadow-sm max-w-[85%]">
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
              <div className="space-y-2">
                <button className="w-full bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-left border border-gray-100">
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

                <button className="w-full bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-left border border-gray-100">
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
            <div className="px-4 pb-6 pt-4 border-t border-gray-100">
              <div className="bg-gray-50 rounded-full shadow-sm border border-gray-200 flex items-center px-4 py-3">
                <input
                  type="text"
                  placeholder="Send us a message"
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
                <button className="ml-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#3B82F6' }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}