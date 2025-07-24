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
    <div className="mobile-screen bg-white">
      {/* Clean Minimal Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">esimfo</h1>
            <p className="text-sm text-gray-500 mt-1">Global connectivity made simple</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5l-5-5h5V3h5v14z" />
            </svg>
          </button>
        </div>

        {/* Primary Search - Main CTA */}
        <div 
          className="bg-blue-50 rounded-2xl p-6 mb-8 cursor-pointer border border-blue-100"
          onClick={() => setLocation('/search')}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Need data now?</h3>
              <p className="text-gray-600 text-sm mb-4">Get instant eSIM for 200+ countries</p>
              <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find eSIM</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Categories */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setSelectedTab('local')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedTab === 'local'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Local
              </button>
              <button
                onClick={() => setSelectedTab('regional')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedTab === 'regional'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Regional
              </button>
              <button
                onClick={() => setSelectedTab('global')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedTab === 'global'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Global
              </button>
            </div>
          </div>
        </div>

        {/* Popular Destinations - Clean minimal cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Popular destinations</h2>
          <div className="space-y-3">
            {countries.slice(0, 4).map((country, index) => (
              <button
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between group hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-lg">
                      {index === 0 && '🇺🇸'}
                      {index === 1 && '🇬🇧'} 
                      {index === 2 && '🇩🇪'}
                      {index === 3 && '🇫🇷'}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{country.name}</div>
                    <div className="text-sm text-gray-500">From €{(Math.random() * 2 + 1).toFixed(2)}/GB</div>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setLocation('/search')}
            className="w-full mt-6 bg-gray-50 rounded-2xl p-4 text-center text-gray-600 font-medium hover:bg-gray-100 transition-all"
          >
            View all 200+ countries
          </button>
        </div>

        {/* Quick Actions - Essential only */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setLocation('/my-esims')}
              className="bg-blue-500 rounded-2xl p-6 text-left text-white"
            >
              <div className="mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="font-semibold mb-1">My eSIMs</div>
              <div className="text-sm opacity-90">Manage active plans</div>
            </button>
            
            <button 
              onClick={() => setLocation('/search')}
              className="bg-gray-100 rounded-2xl p-6 text-left"
            >
              <div className="mb-3">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900 mb-1">Browse all</div>
              <div className="text-sm text-gray-600">Find any destination</div>
            </button>
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
