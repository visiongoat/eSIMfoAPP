import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { MessageCircle, Plus } from 'lucide-react';
import NavigationBar from '@/components/navigation-bar';

// Continent emoji icons
const continentIcons = {
  europa: '🇪🇺',
  asia: '🌏',
  americas: '🌎',
  africa: '🌍',
  middleEast: '🏛️',
  oceania: '🏝️'
};

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('local');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedEuropaPlan, setSelectedEuropaPlan] = useState(1);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  // Mock data for countries
  const countries = [
    { name: 'Turkey', flag: '🇹🇷', price: '€9.99' },
    { name: 'Germany', flag: '🇩🇪', price: '€12.99' },
    { name: 'Spain', flag: '🇪🇸', price: '€11.99' },
    { name: 'USA', flag: '🇺🇸', price: '€19.99' },
    { name: 'Japan', flag: '🇯🇵', price: '€24.99' },
    { name: 'UAE', flag: '🇦🇪', price: '€16.99' }
  ];

  const profile = null; // Mock profile

  // Placeholder texts for search
  const placeholderTexts = [
    'Search destination...',
    'Find your country',
    'Type Germany, Spain...',
    'Looking for Europe?',
    'USA, Japan, UAE...',
    'Where are you going?'
  ];

  const placeholderText = placeholderTexts[placeholderIndex];

  // Cycle through placeholder texts
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Get user country
  const userCountry = countries[0] || { name: 'Turkey', flag: '🇹🇷', price: '€9.99' };

  // Search functionality
  const searchResults = countries.filter(country =>
    country.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleCountrySelect = (country) => {
    setLocation(`/packages/${country.name.toLowerCase().replace(' ', '-')}`);
  };

  const handleTabChange = (newTab) => {
    if (newTab === selectedTab) return;
    
    setIsTransitioning(true);
    setSelectedContinent(null);
    
    setTimeout(() => {
      setSelectedTab(newTab);
      setIsTransitioning(false);
    }, 150);
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: '🌅' };
    if (hour < 17) return { text: 'Good afternoon', icon: '☀️' };
    return { text: 'Good evening', icon: '🌆' };
  };

  const greeting = getGreeting();

  return (
    <div className="mobile-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen pb-20">
      {/* Navigation Bar */}
      <NavigationBar title="eSIMfo" />
      
      {/* Header with Profile */}
      <div className="max-w-screen-md mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Profile Photo */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {/* Greeting */}
            <div>
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Hello, </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {profile?.name || 'Guest user'}
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-xs">{greeting.icon}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{greeting.text}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Premium + Button */}
            <button
              onClick={() => setShowQuickActions(true)}
              className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg active:shadow-sm transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
            
            {/* Live Chat */}
            <button
              onClick={() => setShowLiveChat(true)}
              className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-md active:shadow-sm transition-all duration-200 active:scale-95 relative"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-screen-md mx-auto px-4 mb-4">
        <div className="relative">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center space-x-3 border border-gray-200 dark:border-gray-700">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            <input
              type="text"
              value={searchQuery}
              placeholder={placeholderText}
              className="text-gray-700 dark:text-gray-300 text-base flex-1 outline-none bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => setShowSearchResults(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
            />
            
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 mt-1 z-50 overflow-hidden">
              {searchResults.map((country, index) => (
                <button
                  key={index}
                  onClick={() => handleCountrySelect(country)}
                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <span className="text-xl">{country.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{country.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">From {country.price}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-screen-md mx-auto px-4 mb-4">
        <div className="flex gap-1 p-1.5 bg-gradient-to-r from-gray-100/80 via-white to-gray-100/80 dark:from-gray-800/80 dark:via-gray-700 dark:to-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-700/40">
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
                  ? `${tab.color} text-white shadow-lg scale-105`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-600/80'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className={`transition-transform duration-300 ${selectedTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {tab.icon}
                </div>
                <span className="font-medium">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-md mx-auto px-4 pb-2 relative overflow-hidden">
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
              {/* Local Country Card */}
              <button 
                onClick={() => handleCountrySelect(userCountry)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{userCountry.flag}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-base">{userCountry.name}</h3>
                      <p className="text-white/70 text-sm">Your current location</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">From {userCountry.price}</div>
                    <div className="text-xs text-white/70">Multiple plans</div>
                  </div>
                </div>
              </button>

              {/* Popular Countries */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Popular Destinations</h3>
                {countries.slice(1, 4).map((country, index) => (
                  <button
                    key={index}
                    onClick={() => handleCountrySelect(country)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 text-left shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:scale-[1.02] w-full"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{country.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{country.name}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">From {country.price}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* More Destinations Button */}
              <button 
                onClick={() => setLocation('/destinations')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-4 text-center transition-colors duration-200 shadow-lg hover:shadow-xl mb-8"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-semibold text-white">More destinations</span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          ) : selectedTab === 'regional' ? (
            <div className="space-y-3">
              {selectedContinent === 'europa' ? (
                <div className="space-y-2">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Europa eSIM Plans</h2>
                  </div>
                  {/* Europa Plans */}
                  {[1, 2, 3, 4].map((plan) => (
                    <button 
                      key={plan}
                      onClick={() => setSelectedEuropaPlan(plan)}
                      className={`w-full p-2.5 rounded-xl border-2 transition-all duration-200 ${
                        selectedEuropaPlan === plan
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02] shadow-md'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="text-left flex-1">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {plan === 1 ? '7 Days' : plan === 2 ? '10 Days' : plan === 3 ? '15 Days' : '30 Days'}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm">
                            {plan === 1 ? '1 GB' : plan === 2 ? '3 GB' : plan === 3 ? '5 GB' : '10 GB'}
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {plan === 1 ? '9.99 €' : plan === 2 ? '15.99 €' : plan === 3 ? '24.99 €' : '39.99 €'}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs">
                            {plan === 1 ? '1.43 €/day' : plan === 2 ? '1.60 €/day' : plan === 3 ? '1.67 €/day' : '1.33 €/day'}
                          </div>
                        </div>
                        <div className="flex justify-end items-center">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCheckoutModal(true);
                            }}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            Buy
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Continent List */}
                  <button 
                    onClick={() => setSelectedContinent('europa')}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{continentIcons.europa}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">Europa</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">30+ countries • From €9.99</p>
                        </div>
                      </div>
                      <span className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</span>
                    </div>
                  </button>
                  
                  {/* Other Continents */}
                  {[
                    { name: 'Asia', icon: continentIcons.asia, countries: '25+', price: '€12.99', bg: 'bg-green-100 dark:bg-green-900' },
                    { name: 'Americas', icon: continentIcons.americas, countries: '20+', price: '€14.99', bg: 'bg-orange-100 dark:bg-orange-900' },
                    { name: 'Africa', icon: continentIcons.africa, countries: '15+', price: '€16.99', bg: 'bg-yellow-100 dark:bg-yellow-900' },
                    { name: 'Middle East', icon: continentIcons.middleEast, countries: '12+', price: '€18.99', bg: 'bg-purple-100 dark:bg-purple-900' },
                    { name: 'Oceania', icon: continentIcons.oceania, countries: '8+', price: '€22.99', bg: 'bg-teal-100 dark:bg-teal-900' }
                  ].map((continent, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${continent.bg} rounded-xl flex items-center justify-center`}>
                            <span className="text-2xl">{continent.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{continent.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{continent.countries} countries • From {continent.price}</p>
                          </div>
                        </div>
                        <span className="text-blue-500 dark:text-blue-400 text-sm font-medium">View</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">200+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-green-600">5min</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Activation</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">24/7</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Support</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simple Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={() => setShowCheckoutModal(false)}>
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            <h2 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">Purchase eSIM</h2>
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>Checkout functionality will be available soon.</p>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QuickActions Modal */}
      {showQuickActions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={() => setShowQuickActions(false)}>
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            <h2 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">Choose Plan Type</h2>
            <div className="space-y-3">
              <button onClick={() => { setShowQuickActions(false); setSelectedTab('local'); }} className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 text-left">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Local eSIMs</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Single country plans</p>
                  </div>
                </div>
              </button>
              
              <button onClick={() => { setShowQuickActions(false); setSelectedTab('regional'); }} className="w-full bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 text-left">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Regional eSIMs</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Multi-country regions</p>
                  </div>
                </div>
              </button>
              
              <button onClick={() => { setShowQuickActions(false); setSelectedTab('global'); }} className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-4 text-left">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Global eSIMs</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {showLiveChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end" onClick={() => setShowLiveChat(false)}>
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-3xl shadow-2xl" style={{ height: '85vh' }} onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-4 text-white rounded-t-3xl bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-white/30 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold">eSIMfo</h1>
                </div>
                <button 
                  onClick={() => setShowLiveChat(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-white/90 text-sm">
                Live Chat • Available 24/7
              </div>
            </div>
            
            <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900" style={{ height: 'calc(85vh - 120px)' }}>
              <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Start a conversation</h3>
                <p className="text-sm mb-6">Our support team is ready to help you 24/7</p>
                <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}