import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import TabBar from '../components/tab-bar';

// Mock user data
const profile = { name: 'John Doe', email: 'john@example.com' };
const userEsims = [
  { id: 1, country: 'Turkey', status: 'Active', data: '5GB', expires: '15 days' },
  { id: 2, country: 'Spain', status: 'Active', data: '3GB', expires: '7 days' }
];

// Europa Regional Plans Data
const europaPlans = [
  {
    id: 'europa-basic',
    name: 'Europa Basic',
    data: '1GB',
    validity: '7 days',
    price: 14.99,
    originalPrice: 29.99,
    discount: 50,
    coverage: '30 countries',
    network: '4G/LTE',
    features: ['No eKYC', 'Instant activation', 'Voice & SMS'],
    signal: 4,
    isPopular: false
  },
  {
    id: 'europa-standard', 
    name: 'Europa Standard',
    data: '3GB',
    validity: '15 days',
    price: 24.99,
    originalPrice: 49.99,
    discount: 50,
    coverage: '30 countries',
    network: '4G/LTE/5G',
    features: ['No eKYC', 'Instant activation', 'Voice & SMS', '5G Ready'],
    signal: 5,
    isPopular: true
  },
  {
    id: 'europa-premium',
    name: 'Europa Premium', 
    data: '5GB',
    validity: '20 days',
    price: 39.99,
    originalPrice: 79.99,
    discount: 50,
    coverage: '30 countries',
    network: '4G/LTE/5G',
    features: ['No eKYC', 'Instant activation', 'Voice & SMS', '5G Ready', 'Hotspot'],
    signal: 5,
    isPopular: false
  },
  {
    id: 'europa-unlimited',
    name: 'Europa Unlimited',
    data: '10GB',
    validity: '30 days', 
    price: 69.99,
    originalPrice: 139.99,
    discount: 50,
    coverage: '30 countries',
    network: '4G/LTE/5G',
    features: ['No eKYC', 'Instant activation', 'Voice & SMS', '5G Ready', 'Hotspot', 'Fair usage'],
    signal: 5,
    isPopular: false
  }
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('local');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  // Regional tab - Continent selection or plan display
  const renderRegionalContent = () => {
    if (selectedContinent === 'europa') {
      return (
        <div className="space-y-4">
          {/* Back Button */}
          <button 
            onClick={() => setSelectedContinent(null)}
            className="flex items-center space-x-2 text-blue-500 font-medium mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to continents</span>
          </button>

          {/* Europa Plans */}
          <div className="grid gap-4">
            {europaPlans.map((plan) => (
              <div 
                key={plan.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{plan.name}</h3>
                    {plan.isPopular && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold">
                        POPULAR
                      </span>
                    )}
                  </div>
                  {/* Signal Strength */}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-1 h-3 rounded-sm ${
                          i < plan.signal ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Main Info */}
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">DATA</p>
                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{plan.data}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">VALIDITY</p>
                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{plan.validity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">PRICE</p>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">${plan.price}</span>
                      {plan.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through">${plan.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coverage & Network */}
                <div className="flex items-center justify-between mb-3 text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 dark:text-gray-400">
                      📍 {plan.coverage}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      📶 {plan.network}
                    </span>
                  </div>
                  {plan.discount > 0 && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
                      -{plan.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Buy Button */}
                <button 
                  onClick={() => setLocation(`/packages/europa/${plan.id}`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  BUY NOW - ${plan.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Continent selection screen
    return (
      <div className="grid gap-4">
        {/* Europa */}
        <button 
          onClick={() => setSelectedContinent('europa')}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🇪🇺</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Europa</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">30 countries • 4 plans</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Other continents (placeholder) */}
        <button className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left opacity-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌏</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Asia</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Coming soon</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="safe-area-top bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">eSIMfo</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Global connectivity</p>
            </div>
            <button className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 6h5v5H4V6zM15 6h5v5h-5V6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-screen-md mx-auto px-4 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-screen-md mx-auto px-4 mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button 
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'local'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Local
          </button>
          <button 
            onClick={() => {
              setActiveTab('regional');
              setSelectedContinent(null);
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'regional'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Regional
          </button>
          <button 
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'global'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Global
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-md mx-auto px-4 pb-24">
        {activeTab === 'local' && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Local eSIM plans coming soon</p>
          </div>
        )}

        {activeTab === 'regional' && renderRegionalContent()}

        {activeTab === 'global' && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Global eSIM plans coming soon</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="max-w-screen-md mx-auto px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setLocation('/destinations')}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700 rounded-xl p-4 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">🔍</div>
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">202+</div>
            </div>
            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Browse All</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">All destinations</div>
          </button>
          
          <button 
            onClick={() => profile ? setLocation('/my-esims') : setLocation('/profile')}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">📱</div>
              {profile && (
                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {userEsims.length}
                </div>
              )}
            </div>
            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
              {profile ? 'My eSIMs' : 'Sign In'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {profile ? `${userEsims.length} active plans` : 'Access your eSIMs'}
            </div>
          </button>
        </div>
      </div>

      <TabBar />
    </div>
  );
}