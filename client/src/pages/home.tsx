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
        ).slice(0, 3);
      case 'regional':
        return countries.filter(country => 
          ['Spain', 'Italy', 'Netherlands', 'Poland', 'Turkey'].includes(country.name)
        ).slice(0, 3);
      case 'global':
        return countries.filter(country => 
          ['Global', 'Europe', 'Asia', 'Americas'].includes(country.name) || 
          ['China', 'India', 'Brazil', 'Australia'].includes(country.name)
        ).slice(0, 3);
      default:
        return countries.slice(0, 3);
    }
  };

  const popularDestinations = getFilteredCountries();

  return (
    <div className="mobile-screen bg-gray-50">
      {/* Personalized Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">TY</span>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-900">Good Night</span>
              <span className="text-lg">👋</span>
            </div>
            <p className="text-sm text-gray-600">Tuğçe Yılmaz</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full bg-gray-100">
            <span className="text-lg">🔔</span>
          </button>
          <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
            ❄️ 30°C
          </div>
        </div>
      </div>

      <div className="pb-4">
        {/* Search Bar */}
        <div 
          className="mx-4 mt-4 mb-4 bg-white rounded-xl p-4 shadow-sm cursor-pointer"
          onClick={() => setLocation('/search')}
        >
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-lg">📍</span>
            <span className="text-gray-500 italic">Find your destination...</span>
          </div>
        </div>

        {/* Summer Travel Promotion Cards */}
        <div className="mb-4">
          <div className="flex space-x-4 px-4 overflow-x-auto">
            <div className="min-w-72 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">Yaz Seyahati</h3>
                <h3 className="font-bold text-lg text-gray-900 mb-1">İndirimi - %20</h3>
                <h3 className="font-bold text-lg text-gray-900 mb-3">İndirim!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Yol gezilerinden uzak kaçışlara</p>
                <p className="text-sm text-gray-600">kadar, verilerinizi karşıladık!</p>
              </div>
              <div className="ml-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
                  <span className="text-4xl">🏝️</span>
                </div>
              </div>
            </div>
            
            <div className="min-w-72 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">Yaz Seyahati</h3>
                <h3 className="font-bold text-lg text-gray-900 mb-1">İndirimi - %30</h3>
                <h3 className="font-bold text-lg text-gray-900 mb-3">İndirim!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Avrupa genelinde</p>
                <p className="text-sm text-gray-600">kadar, verilerinizi karşıladık!</p>
              </div>
              <div className="ml-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                  <span className="text-4xl">✈️</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* eSIM Category Tabs */}
        <div className="px-4 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTab('local')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedTab === 'local'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              <span className="text-lg">📍</span>
              <span>Local</span>
            </button>
            <button
              onClick={() => setSelectedTab('regional')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedTab === 'regional'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              <span className="text-lg">🏢</span>
              <span>Regional</span>
            </button>
            <button
              onClick={() => setSelectedTab('global')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedTab === 'global'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              <span className="text-lg">🌍</span>
              <span>Global</span>
            </button>
          </div>
        </div>

        {/* Location-based eSIM Availability */}
        <div className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-blue-500 text-lg">📍</span>
                <span className="font-semibold text-gray-900">eSIMs available for your location</span>
                <button className="text-gray-400">✕</button>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-blue-500">📍</span>
                <span className="text-sm">Antalya, TR</span>
                <span className="text-sm">•</span>
                <span className="text-sm font-medium">7 packages available</span>
              </div>
              <button 
                onClick={() => setLocation('/packages/1')}
                className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium text-sm"
              >
                View Packages
              </button>
            </div>
          </div>
        </div>

        {/* Available Countries Grid */}
        <div className="px-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Countries</h2>
          <div className="grid grid-cols-2 gap-3">
            {countries.slice(0, 8).map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-3 hover:shadow-md transition-all"
              >
                <div className="w-8 h-6 rounded-sm bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-semibold">
                    {country.code}
                  </span>
                </div>
                <span className="font-medium text-gray-900 text-sm">{country.name}</span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setLocation('/search')}
            className="w-full mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center font-medium text-gray-700"
          >
            Show All 202 Countries
          </button>
        </div>

        {/* Stats Section */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👥</span>
              </div>
              <div className="font-bold text-gray-900">50K+</div>
              <div className="text-xs text-gray-600">Travelers</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="font-bold text-gray-900">Instant</div>
              <div className="text-xs text-gray-600">Activation</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="font-bold text-gray-900">Secure</div>
              <div className="text-xs text-gray-600">Payment</div>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Popular Destinations</h2>
            <button 
              onClick={() => setLocation('/search')}
              className="text-blue-500 text-sm font-medium"
            >
              more +
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* USA Card */}
            <div 
              onClick={() => handleCountrySelect(countries[0])}
              className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-orange-400 to-red-500 relative">
                <div className="absolute top-3 right-3 w-8 h-6 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold">🇺🇸</span>
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1">Amerika Birleşik D...</h3>
                <p className="text-xs text-gray-600 mb-1">1 GB - 50 GB</p>
                <p className="text-xs text-gray-600">0.54 USD/GB'dan başlayan</p>
              </div>
            </div>

            {/* Canada Card */}
            <div 
              onClick={() => handleCountrySelect(countries[1] || countries[0])}
              className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-yellow-400 to-orange-500 relative">
                <div className="absolute top-3 right-3 w-8 h-6 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold">🇨🇦</span>
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1">Kanada</h3>
                <p className="text-xs text-gray-600 mb-1">1 GB - 50 GB</p>
                <p className="text-xs text-gray-600">0.98 USD/GB'dan başlayan</p>
              </div>
            </div>

            {/* UK Card */}
            <div 
              onClick={() => handleCountrySelect(countries[2] || countries[0])}
              className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                <div className="absolute top-3 right-3 w-8 h-6 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold">🇬🇧</span>
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1">İngiltere</h3>
                <p className="text-xs text-gray-600 mb-1">1 GB - 50 GB</p>
                <p className="text-xs text-gray-600">0.75 USD/GB'dan başlayan</p>
              </div>
            </div>

            {/* Japan Card */}
            <div 
              onClick={() => handleCountrySelect(countries[3] || countries[0])}
              className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-pink-400 to-red-500 relative">
                <div className="absolute top-3 right-3 w-8 h-6 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold">🇯🇵</span>
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1">Japonya</h3>
                <p className="text-xs text-gray-600 mb-1">1 GB - 50 GB</p>
                <p className="text-xs text-gray-600">1.25 USD/GB'dan başlayan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
