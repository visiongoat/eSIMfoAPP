import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Globe, MapPin, Navigation } from "lucide-react";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import type { Country } from "@shared/schema";

export default function DestinationsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<'countries' | 'regions' | 'global'>('countries');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [, setLocation] = useLocation();
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
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
      // Group by regions - for demo purposes, create regional data
      const regions = [
        {
          id: 'europe',
          name: 'Europe',
          countryCount: 33,
          price: '€0.89',
          icon: '🌍',
          countries: ['Germany', 'France', 'Spain', 'Italy']
        },
        {
          id: 'balkans',
          name: 'Balkans',
          countryCount: 12,
          price: '€1.20',
          icon: '🏔️',
          countries: ['Turkey', 'Greece', 'Bulgaria']
        },
        {
          id: 'asia-pacific',
          name: 'Asia Pacific',
          countryCount: 15,
          price: '€2.40',
          icon: '🌏',
          countries: ['Japan', 'South Korea', 'Australia']
        },
        {
          id: 'southeast-asia',
          name: 'Southeast Asia',
          countryCount: 7,
          price: '€1.80',
          icon: '🏝️',
          countries: ['Thailand', 'Vietnam', 'Indonesia']  
        },
        {
          id: 'middle-asia',
          name: 'Central Asia',
          countryCount: 6,
          price: '€3.20',
          icon: '🕌',
          countries: ['UAE', 'Saudi Arabia', 'Qatar']
        },
        {
          id: 'north-america',
          name: 'North America',
          countryCount: 3,
          price: '€4.50',
          icon: '🍁',
          countries: ['USA', 'Canada', 'Mexico']
        },
        {
          id: 'south-america',
          name: 'South America',
          countryCount: 12,
          price: '€5.80',
          icon: '🌎',
          countries: ['Brazil', 'Argentina', 'Chile']
        },
        {
          id: 'middle-east',
          name: 'Middle East',
          countryCount: 8,
          price: '€2.90',
          icon: '🐪',
          countries: ['Egypt', 'Jordan', 'Lebanon']
        },
        {
          id: 'caribbean',
          name: 'Caribbean',
          countryCount: 14,
          price: '€7.20',
          icon: '🏖️',
          countries: ['Jamaica', 'Bahamas', 'Barbados']
        }
      ];
      return regions.filter(region =>
        searchQuery ? region.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );
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
    <div className="mobile-screen bg-gray-50 dark:bg-gray-900" style={{ scrollBehavior: 'auto' }}>
      <NavigationBar 
        title="Buy eSIM"
        showBack={false}
      />

      <div className="px-4 pt-4 pb-20">
        {/* Premium Search Bar with Advanced Interactions */}
        <div className="relative z-[9999] mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center space-x-3 hover:shadow-lg focus-within:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 focus-within:scale-[1.02] transition-all duration-300 border border-gray-200 dark:border-gray-700 group backdrop-blur-sm">
            {/* Enhanced Animated Search Icon */}
            <div className="relative flex-shrink-0">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all duration-300" />
              {/* Multiple pulse effects */}
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-focus-within:opacity-20 group-focus-within:animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-focus-within:opacity-10 group-focus-within:animate-pulse delay-75"></div>
            </div>

            <input
              type="text"
              value={searchQuery}
              placeholder={searchQuery ? "Type country name..." : placeholderText}
              className="text-gray-900 dark:text-gray-100 text-base flex-1 outline-none bg-transparent placeholder-gray-500 dark:placeholder-gray-400 font-medium tracking-wide"
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
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group/clear"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover/clear:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Keyboard shortcut hint */}
              <div className="hidden group-focus-within:flex items-center space-x-1 animate-fadeIn">
                <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 rounded border font-mono">ESC</kbd>
              </div>
            </div>
          </div>

          {/* Mobile Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 mt-1 z-[9999] overflow-hidden">
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
                    onClick={() => {
                      handleCountrySelect(country);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full px-4 py-3.5 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 text-left transition-all duration-200 active:bg-blue-50 dark:active:bg-blue-900/20 group"
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

        {/* Premium Tab Filters */}
        <div className="flex mb-6 bg-gray-200 dark:bg-gray-700 rounded-xl p-1 shadow-inner">
          {[
            { key: 'countries', label: 'Countries', icon: MapPin },
            { key: 'regions', label: 'Regions', icon: Globe },
            { key: 'global', label: 'Global', icon: Navigation }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`relative flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 transform ${
                selectedTab === tab.key
                  ? 'bg-white dark:bg-gray-500 text-gray-900 dark:text-white shadow-lg scale-[1.02] ring-2 ring-white/50 dark:ring-gray-400/50'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 hover:scale-[1.01]'
              }`}
            >
              <tab.icon className={`w-4 h-4 transition-transform duration-200 ${selectedTab === tab.key ? 'scale-110' : ''}`} />
              <span className="tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>



        {/* Enhanced Alphabet Filter (only for countries) */}
        {selectedTab === 'countries' && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {alphabetFilterGroups.map((group, index) => (
                <button
                  key={group.value}
                  onClick={() => setSelectedFilter(group.value)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 animate-fadeInUp ${
                    selectedFilter === group.value
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">Countries</h2>
          </div>
        )}

        {/* Enhanced Content Area */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index} 
                className="mobile-card p-4 animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  {/* Flag skeleton with shimmer */}
                  <div className="relative w-10 h-7 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {/* Country name skeleton */}
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-32 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${index * 150}ms` }}></div>
                    </div>
                    
                    {/* Price skeleton */}
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${index * 200}ms` }}></div>
                    </div>
                  </div>
                  
                  {/* Chevron skeleton */}
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {selectedTab === 'countries' ? (
              // Premium Countries List with Stagger Animation
              finalFilteredData.map((country: any, index: number) => (
                <button
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="mobile-card p-4 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/70 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] group animate-fadeInUp border border-transparent hover:border-blue-500/20 dark:hover:border-blue-400/20"
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
              // Regions List
              finalFilteredData.map((region: any) => (
                <button
                  key={region.id}
                  onClick={() => {/* Handle region selection */}}
                  className="mobile-card p-4 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-xl">
                        {region.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{region.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{region.countryCount} countries</p>
                      </div>
                    </div>
                    <span className="text-gray-400 dark:text-gray-500">›</span>
                  </div>
                </button>
              ))
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

      <TabBar />
    </div>
  );
}