import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CountryCard from "@/components/country-card";
import type { Country, Package } from "@shared/schema";

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('countries');

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
    <div className="mobile-screen bg-white">
      {/* Holafly-inspired Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Hi Traveler!</h1>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>

        {/* Main Question */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Where are you traveling next?</h2>
          
          {/* Search Bar */}
          <div 
            className="bg-gray-100 rounded-2xl p-4 flex items-center space-x-3 cursor-pointer"
            onClick={() => setLocation('/search')}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-500">Search your destination</span>
          </div>
        </div>

        {/* Popular Section - Holafly Style */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Popular</h3>
          
          {/* Circular Icons Row */}
          <div className="flex justify-between mb-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center relative">
                <span className="text-2xl">🌍</span>
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  New
                </div>
              </div>
              <span className="text-sm text-gray-700 font-medium">Monthly plan</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌐</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Global</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🇺🇸</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">United States</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🇪🇺</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Europe</span>
            </div>
          </div>
          
          {/* Toggle Buttons */}
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setSelectedTab('countries')}
              className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                selectedTab === 'countries' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Countries
            </button>
            <button 
              onClick={() => setSelectedTab('regional')}
              className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                selectedTab === 'regional' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Regional plans
            </button>
          </div>
        </div>

        {/* Country Grid - Holafly Style */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            {countries.slice(0, 6).map((country, index) => {
              const flags = ['🇺🇸', '🇲🇦', '🇯🇵', '🇦🇪', '🇲🇽', '🇮🇱'];
              const countryNames = ['United States', 'Morocco', 'Japan', 'United Arab Emirates', 'Mexico', 'Israel'];
              
              return (
                <button
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50">
                      <span className="text-2xl">{flags[index]}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900 text-sm">{countryNames[index]}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
