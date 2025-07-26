import { useState } from "react";
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

  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
  });

  const handleCountrySelect = (country: Country) => {
    setLocation(`/packages/${country.id}`);
  };

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
          name: 'Avrupa',
          countryCount: 33,
          price: '€0.89',
          icon: '🌍',
          countries: ['Germany', 'France', 'Spain', 'Italy']
        },
        {
          id: 'balkans',
          name: 'Balkanlar',
          countryCount: 12,
          price: '€1.20',
          icon: '🏔️',
          countries: ['Turkey', 'Greece', 'Bulgaria']
        },
        {
          id: 'asia-pacific',
          name: 'Asya Pasifik',
          countryCount: 15,
          price: '€2.40',
          icon: '🌏',
          countries: ['Japan', 'South Korea', 'Australia']
        },
        {
          id: 'southeast-asia',
          name: 'Güneydoğu Asya',
          countryCount: 7,
          price: '€1.80',
          icon: '🏝️',
          countries: ['Thailand', 'Vietnam', 'Indonesia']
        },
        {
          id: 'middle-east',
          name: 'Orta Asya',
          countryCount: 6,
          price: '€3.20',
          icon: '🕌',
          countries: ['UAE', 'Saudi Arabia', 'Qatar']
        },
        {
          id: 'north-america',
          name: 'Kuzey Amerika',
          countryCount: 3,
          price: '€4.50',
          icon: '🍁',
          countries: ['USA', 'Canada', 'Mexico']
        },
        {
          id: 'south-america',
          name: 'Güney Amerika',
          countryCount: 12,
          price: '€5.80',
          icon: '🌎',
          countries: ['Brazil', 'Argentina', 'Chile']
        },
        {
          id: 'middle-east-africa',
          name: 'Orta Doğu',
          countryCount: 8,
          price: '€2.90',
          icon: '🐪',
          countries: ['Egypt', 'Jordan', 'Lebanon']
        },
        {
          id: 'caribbean',
          name: 'Karayipler',
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
          name: 'Küresel Paket',
          countryCount: 147,
          price: '€24.99',
          icon: '🌐',
          description: 'Sınırlama yok - sadece kullandığınız veriler için ödeme yapın. Küresel kapsama'
        },
        {
          id: 'business-global',
          name: 'İş Seyahat Noktaları',
          countryCount: 43,
          price: '€18.50',
          icon: '💼',
          description: 'ABD Küresel'
        },
        {
          id: 'usa-global',
          name: 'ABD Küresel',
          countryCount: 40,
          price: '€15.99',
          icon: '🇺🇸',
          description: 'Amerika ve müttefik ülkeler'
        },
        {
          id: 'africa-europe',
          name: 'Afrika ve Avrupa',
          countryCount: 57,
          price: '€12.80',
          icon: '🌍',
          description: 'Kıtalar arası kapsama'
        }
      ];
      return globalPackages.filter(pkg =>
        searchQuery ? pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );
    }

    return filteredData;
  };

  const filteredData = getFilteredData();

  // Alphabet filter for countries
  const alphabetFilters = [
    'Tümü', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  const getAlphabetFilteredCountries = () => {
    if (selectedFilter === 'all' || selectedFilter === 'Tümü') return filteredData;
    return filteredData.filter((country: any) =>
      country.name && country.name.charAt(0).toUpperCase() === selectedFilter
    );
  };

  const finalFilteredData = selectedTab === 'countries' ? getAlphabetFilteredCountries() : filteredData;

  return (
    <div className="mobile-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar 
        title="eSIM satın al"
        showBack={true}
      />

      <div className="px-4 pt-4 pb-20">
        {/* Search Bar */}
        <div className="mobile-card p-3 mb-4 bg-gray-800 dark:bg-gray-700 border-0">
          <div className="flex items-center space-x-3">
            <Search className="text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Gideceğiniz varış noktasını arayın"
              className="flex-1 bg-transparent text-gray-300 dark:text-gray-200 text-base outline-none placeholder-gray-400 dark:placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex mb-4 bg-gray-700 dark:bg-gray-800 rounded-xl p-1">
          {[
            { key: 'countries', label: 'Ülkeler', icon: MapPin },
            { key: 'regions', label: 'Bölgeler', icon: Globe },
            { key: 'global', label: 'Küresel', icon: Navigation }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                selectedTab === tab.key
                  ? 'bg-gray-500 dark:bg-gray-600 text-white'
                  : 'text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* International eSIM Banner */}
        <div className="mobile-card p-4 mb-4 bg-gray-800 dark:bg-gray-700 border-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-gray-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white dark:text-gray-100">Uluslararası eSIM</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Sınırlama yok - sadece kullandığınız veriler için ödeme yapın. Küresel kapsama
              </p>
            </div>
          </div>
        </div>

        {/* Alphabet Filter (only for countries) */}
        {selectedTab === 'countries' && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {alphabetFilters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedFilter(letter === 'Tümü' ? 'all' : letter)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    (selectedFilter === letter || (selectedFilter === 'all' && letter === 'Tümü'))
                      ? 'bg-gray-600 dark:bg-gray-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="mobile-card p-4">
                <div className="flex items-center space-x-3">
                  <div className="skeleton w-10 h-10 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="skeleton w-32 h-4 rounded mb-2"></div>
                    <div className="skeleton w-20 h-3 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {selectedTab === 'countries' ? (
              // Countries List
              finalFilteredData.map((country: any) => (
                <button
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  className="mobile-card p-4 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={country.flagUrl} 
                        alt={`${country.name} flag`} 
                        className="w-8 h-6 rounded object-cover" 
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{country.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">From €{(Math.random() * 5 + 0.5).toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 dark:text-gray-500">›</span>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">{region.countryCount} ülke</p>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">{globalPkg.countryCount} ülke</p>
                      </div>
                    </div>
                    <span className="text-gray-400 dark:text-gray-500">›</span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Popular Section (only for countries) */}
        {selectedTab === 'countries' && !searchQuery && selectedFilter === 'all' && (
          <>
            <div className="mt-8 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Popüler</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Türkiye', flag: '🇹🇷', price: '€1.20' },
                { name: 'Amerika Birleşik Devletleri', flag: '🇺🇸', price: '€4.50' },
                { name: 'Birleşik Krallık', flag: '🇬🇧', price: '€2.80' },
                { name: 'Japonya', flag: '🇯🇵', price: '€3.20' },
                { name: 'Tayland', flag: '🇹🇭', price: '€1.80' },
                { name: 'Mısır', flag: '🇪🇬', price: '€2.40' },
                { name: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', price: '€3.60' },
                { name: 'Çin', flag: '🇨🇳', price: '€2.90' }
              ].map((country, index) => (
                <button
                  key={index}
                  onClick={() => {/* Handle popular country selection */}}
                  className="mobile-card p-4 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{country.name}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 dark:text-gray-500">›</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tüm Ülkeler</h2>
            </div>
          </>
        )}
      </div>

      <TabBar />
    </div>
  );
}