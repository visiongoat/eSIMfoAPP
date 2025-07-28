import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Globe, MapPin, Navigation, X } from "lucide-react";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import europaIcon from "@assets/europamap.png";
import asiaIcon from "@assets/asiamap.png";
import americasIcon from "@assets/americasmaps.png";
import africaIcon from "@assets/africacontinentmap.png";
import middleEastIcon from "@assets/middleeastcontinentmap.png";
import oceaniaIcon from "@assets/oceaniacontinentmap.png";
import type { Country } from "@shared/schema";

export default function DestinationsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<'countries' | 'regions' | 'global'>('countries');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // URL parametresini kontrol et ve tab'ı ayarla
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['countries', 'regions', 'global'].includes(tabParam)) {
      setSelectedTab(tabParam as 'countries' | 'regions' | 'global');
    }
  }, []);

  // Scroll listener for sticky search bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Adjust threshold as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [, setLocation] = useLocation();
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

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
        if (deltaX > 0) {
          // Swipe right: move to previous tab
          if (selectedTab === 'global') {
            setSelectedTab('regions');
          } else if (selectedTab === 'regions') {
            setSelectedTab('countries');
          }
        } else if (deltaX < 0) {
          // Swipe left: move to next tab
          if (selectedTab === 'countries') {
            setSelectedTab('regions');
          } else if (selectedTab === 'regions') {
            setSelectedTab('global');
          }
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

  // Scroll to top when component mounts
  useEffect(() => {
    // Force immediate scroll reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Additional reset for mobile devices
    const mobileContainer = document.querySelector('.mobile-container');
    if (mobileContainer) {
      mobileContainer.scrollTop = 0;
    }
  }, []);

  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
  });

  const handleCountrySelect = (country: Country) => {
    setLocation(`/packages/${country.id}`);
  };

  // Clear search and reset states
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle country selection with cleanup
  const selectCountry = (country: Country) => {
    handleCountrySelect(country);
    clearSearch();
  };

  // Get minimum price for a country from real packages
  const getMinPrice = (countryId: number) => {
    // Static price mapping based on our seeded packages
    const priceMap: { [key: number]: string } = {
      6: "11.90",  // France
      7: "8.90",   // Germany  
      8: "6.90",   // Japan
      9: "5.90",   // Turkey
      11: "4.50"   // United States
    };
    
    // Return mapped price or default price based on country characteristics
    if (priceMap[countryId]) {
      return priceMap[countryId];
    }
    
    // Generate consistent price based on country ID (not random)
    const basePrice = ((countryId * 7) % 40) / 10 + 0.99;
    return basePrice.toFixed(2);
  };

  // Enhanced search results with plan info
  const getEnhancedSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const results = countries.filter(country => 
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Show max 5 results
    
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



  // Enhanced search and filter functionality
  const getFilteredData = () => {
    let filteredData = [...countries];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab-based categorization
    if (selectedTab === 'countries') {
      // Show individual countries
      filteredData = filteredData;
    } else if (selectedTab === 'regions') {
      // Return empty array for regions - UI will handle the display directly
      return [];
    } else if (selectedTab === 'global') {
      // Global packages
      const globalPackages = [
        {
          id: 'global-world',
          name: 'Global Package',
          countryCount: 147,
          price: '€24.99',
          icon: '🌐',
          description: 'No limits - pay only for the data you use. Global coverage'
        },
        {
          id: 'business-global',
          name: 'Business Travel Points',
          countryCount: 43,
          price: '€18.50',
          icon: '💼',
          description: 'USA Global'
        },
        {
          id: 'usa-global',
          name: 'USA Global',
          countryCount: 40,
          price: '€15.99',
          icon: '🇺🇸',
          description: 'America and allied countries'
        },
        {
          id: 'africa-europe',
          name: 'Africa & Europe',
          countryCount: 57,
          price: '€12.80',
          icon: '🌍',
          description: 'Cross-continental coverage'
        }
      ];
      return globalPackages.filter(pkg =>
        searchQuery ? pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );
    }

    return filteredData;
  };

  const filteredData = getFilteredData();

  // Alphabet filter groups for countries
  const alphabetFilterGroups = [
    { label: 'All', value: 'all' },
    { label: 'A-D', value: 'A-D' },
    { label: 'E-K', value: 'E-K' },
    { label: 'L-Q', value: 'L-Q' },
    { label: 'R-Z', value: 'R-Z' }
  ];

  const getAlphabetFilteredCountries = () => {
    if (selectedFilter === 'all') return filteredData;
    
    const firstLetter = (country: any) => country.name?.charAt(0).toUpperCase();
    
    switch (selectedFilter) {
      case 'A-D':
        return filteredData.filter((country: any) => {
          const letter = firstLetter(country);
          return letter >= 'A' && letter <= 'D';
        });
      case 'E-K':
        return filteredData.filter((country: any) => {
          const letter = firstLetter(country);
          return letter >= 'E' && letter <= 'K';
        });
      case 'L-Q':
        return filteredData.filter((country: any) => {
          const letter = firstLetter(country);
          return letter >= 'L' && letter <= 'Q';
        });
      case 'R-Z':
        return filteredData.filter((country: any) => {
          const letter = firstLetter(country);
          return letter >= 'R' && letter <= 'Z';
        });
      default:
        return filteredData;
    }
  };

  const finalFilteredData = selectedTab === 'countries' ? getAlphabetFilteredCountries() : filteredData;

  return (
    <div ref={containerRef} className="mobile-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" style={{ scrollBehavior: 'auto' }}>
      <NavigationBar 
        title="Buy eSIM fo"
        showBack={false}
      />

      <div className="px-4 pt-0.5">
        {/* Search Bar - Becomes fixed when scrolled */}
        <div 
          ref={searchBarRef}
          className={`${
            isScrolled 
              ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' 
              : 'relative z-10 mb-6'
          } bg-gradient-to-br from-gray-50/95 via-white/95 to-gray-100/95 dark:bg-gradient-to-br dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? '' : '-mx-4'} px-4`}
        >
        <div className="max-w-md mx-auto py-2">
          <div className="bg-gradient-to-r from-white via-gray-50 to-white dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl p-4 flex items-center space-x-3 hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:via-white hover:to-blue-50 dark:hover:from-gray-750 dark:hover:via-gray-700 dark:hover:to-gray-750 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 focus-within:scale-[1.02] transition-all duration-300 border border-gray-200 dark:border-gray-700 group backdrop-blur-sm">
            {/* Enhanced Animated Search Icon */}
            <div className="relative flex-shrink-0">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-300" />
              {/* Search pulse effect */}
              <div className="absolute inset-0 w-5 h-5 rounded-full bg-blue-500/20 scale-0 group-focus-within:scale-150 group-focus-within:opacity-0 transition-all duration-500"></div>
            </div>

            {/* Enhanced Search Input */}
            <input
              type="text"
              placeholder={placeholderText || "Search destinations..."}
              value={searchQuery}
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
                if (e.key === 'Escape') {
                  e.preventDefault();
                  clearSearch();
                  (e.target as HTMLInputElement).blur();
                }
                if (e.key === 'Enter' && searchResults.length > 0) {
                  e.preventDefault();
                  selectCountry(searchResults[0]);
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base font-medium group-focus-within:placeholder-blue-400 transition-all duration-300 touch-manipulation"
            />

            {/* Search Actions */}
            <div className="flex items-center space-x-2">
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              
              {/* Keyboard shortcut hint - ESC Badge */}
              <div className="hidden group-focus-within:flex items-center space-x-1 animate-fadeIn">
                <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded border font-mono">ESC</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Search Results Container - Position relative for absolute positioning */}
        <div className={`relative ${isScrolled ? 'pt-20' : ''}`}>
          {/* Mobile Search Results with swipe-friendly touch targets */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-[9999] overflow-hidden">
              {searchResults.map((country: any, index: number) => {
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
                    onClick={() => selectCountry(country)}
                    className="w-full px-4 py-3.5 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 text-left transition-all duration-200 active:bg-blue-50 dark:active:bg-blue-900/20 active:scale-[0.98] group touch-manipulation"
                  >
                    {/* Premium Flag Container */}
                    <div className="relative">
                      <div className="w-11 h-11 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-600 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                        <span className="text-xl filter drop-shadow-sm">{getFlagEmoji(country.code)}</span>
                      </div>
                      {/* Signal indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {country.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{country.planCount} eSIMs</span>
                        {country.hasFullPlan && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                            📞 Full Plan
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modern Pill-Style Tabs - Exact Match from Home */}
        <div className="flex gap-1 p-1.5 bg-gradient-to-r from-gray-100/80 via-white to-gray-100/80 dark:from-gray-800/80 dark:via-gray-700 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-700/40 mb-6">
          {[
            { 
              id: 'countries', 
              label: 'Countries', 
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              color: 'bg-blue-500'
            },
            { 
              id: 'regions', 
              label: 'Regions', 
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
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform relative group ${
                selectedTab === tab.id
                  ? `${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-500/30 scale-105`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:shadow-md hover:scale-102 active:scale-95'
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



        {/* Enhanced Alphabet Filter (only for countries) */}
        {selectedTab === 'countries' && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {alphabetFilterGroups.map((group, index) => (
                <button
                  key={group.value}
                  onClick={() => setSelectedFilter(group.value)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 animate-fadeInUp ${
                    selectedFilter === group.value
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-300 hover:via-gray-200 hover:to-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-600 dark:hover:via-gray-500 dark:hover:to-gray-600 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Content Area */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index} 
                className="mobile-card bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 p-4 animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  {/* Flag skeleton with enhanced shimmer */}
                  <div className="relative w-10 h-7 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {/* Country name skeleton */}
                    <div className="relative h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md w-32 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${index * 150}ms` }}></div>
                    </div>
                    
                    {/* Price skeleton */}
                    <div className="relative h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-20 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${index * 200}ms` }}></div>
                    </div>
                  </div>
                  
                  {/* Chevron skeleton */}
                  <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-2">
            {selectedTab === 'countries' ? (
              // Premium Countries List with Stagger Animation
              finalFilteredData.map((country: any, index: number) => (
                <button
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="mobile-card bg-gradient-to-br from-white via-blue-50/20 to-gray-50/40 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-750/30 dark:to-gray-800 py-2 px-4 w-full text-left hover:bg-gradient-to-br hover:from-blue-50/60 hover:via-white hover:to-purple-50/30 dark:hover:bg-gradient-to-r dark:hover:from-gray-700/70 dark:hover:via-gray-600/70 dark:hover:to-gray-700/70 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] group animate-fadeInUp border border-transparent hover:border-blue-500/20 dark:hover:border-blue-400/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Enhanced Flag Container */}
                      <div className="relative">
                        <img 
                          src={country.flagUrl} 
                          alt={`${country.name} flag`} 
                          className="w-10 h-7 rounded-md object-cover shadow-sm ring-1 ring-gray-200 dark:ring-gray-600" 
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-transparent to-white/10"></div>
                      </div>
                      
                      {/* Country Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-base tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {country.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            From €{getMinPrice(country.id)}
                          </p>
                          {/* Premium Badge for Popular Countries */}
                          {(['United States', 'France', 'China', 'Spain', 'Italy', 'Turkey', 'United Kingdom', 'Germany', 'Mexico', 'Thailand', 'Hong Kong', 'Malaysia', 'Greece', 'Canada', 'South Korea', 'Japan', 'Singapore', 'Aruba', 'Afghanistan', 'Anguilla'].includes(country.name)) && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Chevron */}
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))
            ) : selectedTab === 'regions' ? (
              // Regional Continents - Premium Cards with Animations
              <div className="space-y-3 mb-2">
                {/* Europa */}
                <div className="continent-card continent-europa rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-0 touch-feedback cursor-pointer">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="continent-icon w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                        <img 
                          src={europaIcon} 
                          alt="Europa"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Europa</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">30+ countries • From €9.99</p>
                      </div>
                    </div>
                    <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
                  </div>
                </div>
                
                {/* Asia */}
                <div className="continent-card continent-asia rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-1 touch-feedback cursor-pointer">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="continent-icon w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                        <img 
                          src={asiaIcon} 
                          alt="Asia"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Asia</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">25+ countries • From €12.99</p>
                      </div>
                    </div>
                    <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
                  </div>
                </div>
                
                {/* Americas */}
                <div className="continent-card continent-americas rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-2 touch-feedback cursor-pointer">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="continent-icon w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                        <img 
                          src={americasIcon} 
                          alt="Americas"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Americas</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">35+ countries • From €7.99</p>
                      </div>
                    </div>
                    <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
                  </div>
                </div>

                {/* Africa */}
                <div className="continent-card continent-africa rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-3 touch-feedback cursor-pointer">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="continent-icon w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
                        <img 
                          src={africaIcon} 
                          alt="Africa"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Africa</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">50+ countries • From €5.99</p>
                      </div>
                    </div>
                    <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
                  </div>
                </div>

                {/* Middle East */}
                <div className="continent-card continent-middle-east rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-4 touch-feedback cursor-pointer">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="continent-icon w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                        <img 
                          src={middleEastIcon} 
                          alt="Middle East"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Middle East</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">12+ countries • From €16.99</p>
                      </div>
                    </div>
                    <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
                  </div>
                </div>

                {/* Oceania */}
                <div className="continent-card continent-oceania rounded-xl p-4 shadow-sm animate-stagger-fade stagger-delay-5 touch-feedback cursor-pointer">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="continent-icon w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-xl flex items-center justify-center">
                        <img 
                          src={oceaniaIcon} 
                          alt="Oceania"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Oceania</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">6+ countries • From €18.99</p>
                      </div>
                    </div>
                    <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</button>
                  </div>
                </div>
              </div>
            ) : (
              // Global Packages List
              finalFilteredData.map((globalPkg: any) => (
                <button
                  key={globalPkg.id}
                  onClick={() => {/* Handle global package selection */}}
                  className="mobile-card p-4 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-xl">
                        {globalPkg.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{globalPkg.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{globalPkg.countryCount} countries</p>
                      </div>
                    </div>
                    <span className="text-gray-400 dark:text-gray-500">›</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <TabBar onPlusClick={() => setShowQuickActions(true)} />

      {/* Quick Actions Modal - Same as Home */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" 
          onClick={() => setShowQuickActions(false)}
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
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 10000 }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quick Actions</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Choose your eSIM category to get started</p>
            </div>

            {/* Action Items */}
            <div className="px-6 pb-8 space-y-3">
              {/* Local eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setSelectedTab('countries');
                }}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Local eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Regional eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setSelectedTab('regions');
                }}
                className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 rounded-2xl p-4 border border-green-200 dark:border-green-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regional eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Global eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setSelectedTab('global');
                }}
                className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Global eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage plans</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}