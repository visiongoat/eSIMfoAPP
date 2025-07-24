import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CountryCard from "@/components/country-card";
import type { Country, Package } from "@shared/schema";

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('local');

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
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 px-4 py-4 border-b border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">e</span>
            </div>
            <span className="font-bold text-xl text-gray-900">simfo</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5l-5-5h5V3h5v14z" />
              </svg>
            </button>
            <button 
              onClick={() => setLocation('/my-esims')}
              className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Compact Search */}
        <div 
          className="bg-gray-100 rounded-xl p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => setLocation('/search')}
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-gray-500 text-sm">Search countries...</span>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
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

        {/* Category Tabs - 3 tabs in 2 rows */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              onClick={() => setSelectedTab('local')}
              className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                selectedTab === 'local' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 shadow-sm'
              }`}
            >
              Local eSIMs
            </button>
            <button 
              onClick={() => setSelectedTab('regional')}
              className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                selectedTab === 'regional' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 shadow-sm'
              }`}
            >
              Regional eSIMs
            </button>
          </div>
          <button 
            onClick={() => setSelectedTab('global')}
            className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              selectedTab === 'global' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 shadow-sm'
            }`}
          >
            Global eSIMs
          </button>
        </div>

        {/* Main Content Grid */}
        {selectedTab === 'local' ? (
          <div className="space-y-4">
            {/* Featured Country */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">🇺🇸</span>
                    <div>
                      <h3 className="font-bold text-lg">United States</h3>
                      <p className="text-blue-100 text-sm">Most popular local destination</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>From $4.99</span>
                    <span>•</span>
                    <span>15+ plans</span>
                  </div>
                  <button 
                    onClick={() => handleCountrySelect(countries[0])}
                    className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
                  >
                    View Plans
                  </button>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold mb-2">
                    HOT
                  </div>
                </div>
              </div>
            </div>

            {/* Local Country Grid */}
            <div className="grid grid-cols-2 gap-3">
              {countries.slice(1, 9).map((country, index) => {
                const flags = ['🇬🇧', '🇩🇪', '🇫🇷', '🇯🇵', '🇪🇸', '🇮🇹', '🇨🇦', '🇦🇺'];
                const prices = ['$3.99', '$2.99', '$4.49', '$5.99', '$3.49', '$3.99', '$4.99', '$5.49'];
                
                return (
                  <button
                    key={country.id}
                    onClick={() => handleCountrySelect(country)}
                    className="bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-all hover:scale-105"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{flags[index]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">{country.name}</div>
                        <div className="text-xs text-gray-500">From {prices[index]}</div>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      {Math.floor(Math.random() * 10) + 3} plans
                    </div>
                  </button>
                );
              })}
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
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
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
    </div>
  );
}