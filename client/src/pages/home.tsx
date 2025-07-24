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
    <div className="mobile-screen">
      <NavigationBar 
        title="Esimfo"
        rightButton={
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-lg">🔔</span>
          </button>
        }
      />

      <div className="pb-4">
        {/* Current Location Card */}
        <div className="mobile-card mx-4 p-4 mb-4 gradient-bg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Current Location</p>
              <div className="flex items-center mt-1">
                <span className="text-lg mr-2">📍</span>
                <span className="font-semibold">Oslo, Norway</span>
              </div>
              <p className="text-sm opacity-90 mt-1">7 packages available</p>
            </div>
            <button 
              onClick={() => setLocation('/search')}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold"
            >
              View Plans
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div 
          className="mobile-card mx-4 p-3 mb-4 cursor-pointer"
          onClick={() => setLocation('/search')}
        >
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-lg">🔍</span>
            <span className="text-muted-foreground">Search countries...</span>
          </div>
        </div>

        {/* eSIM Category Tabs */}
        <div className="px-4 mb-4">
          <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setSelectedTab('local')}
              className={`flex-1 py-3 px-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedTab === 'local'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Local
            </button>
            <button
              onClick={() => setSelectedTab('regional')}
              className={`flex-1 py-3 px-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedTab === 'regional'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Regional
            </button>
            <button
              onClick={() => setSelectedTab('global')}
              className={`flex-1 py-3 px-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedTab === 'global'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Global
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="flex space-x-3">
            <button 
              onClick={() => handleQuickAction('browse')}
              className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🌍</span>
              </div>
              <p className="font-medium text-sm">Browse Plans</p>
            </button>
            <button 
              onClick={() => handleQuickAction('my-esims')}
              className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📱</span>
              </div>
              <p className="font-medium text-sm">My eSIMs</p>
            </button>
            <button 
              onClick={() => handleQuickAction('qr')}
              className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📄</span>
              </div>
              <p className="font-medium text-sm">QR Codes</p>
            </button>
          </div>
        </div>

        {/* Dynamic Content Based on Selected Tab */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              {selectedTab === 'local' && 'Popular Local Destinations'}
              {selectedTab === 'regional' && 'Regional Coverage'}
              {selectedTab === 'global' && 'Global Plans'}
            </h2>
            <button 
              onClick={() => setLocation('/search')}
              className="text-primary text-sm font-medium"
            >
              See All
            </button>
          </div>
          
          <div className="space-y-2">
            {popularDestinations.length > 0 ? (
              popularDestinations.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  onSelect={handleCountrySelect}
                  showPrice={true}
                  price={
                    selectedTab === 'local' ? "€0.94" : 
                    selectedTab === 'regional' ? "€2.49" : 
                    "€4.99"
                  }
                />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">
                    {selectedTab === 'local' && '🏠'}
                    {selectedTab === 'regional' && '🌍'}
                    {selectedTab === 'global' && '✈️'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  {selectedTab === 'local' && 'Local eSIMs will be available soon'}
                  {selectedTab === 'regional' && 'Regional eSIMs coming soon'}
                  {selectedTab === 'global' && 'Global eSIMs launching soon'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
