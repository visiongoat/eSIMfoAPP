import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import StatusBar from "@/components/status-bar";
import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CountryCard from "@/components/country-card";
import type { Country } from "@shared/schema";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: searchQuery ? ["/api/countries/search", { q: searchQuery }] : ["/api/countries"],
    queryFn: searchQuery 
      ? () => fetch(`/api/countries/search?q=${encodeURIComponent(searchQuery)}`).then(res => res.json())
      : undefined,
  });

  const handleCountrySelect = (country: Country) => {
    setLocation(`/packages/${country.id}`);
  };

  const filteredCountries = searchQuery 
    ? countries 
    : countries;

  return (
    <div className="mobile-screen">
      <StatusBar />
      <NavigationBar 
        title="Select Country"
        showBack={true}
      />

      <div className="px-4 pt-4">
        {/* Search Bar */}
        <div className="mobile-card p-3 mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-lg">🔍</span>
            <input 
              type="text"
              placeholder="Search countries..."
              className="flex-1 bg-transparent text-base outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Country List */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="mobile-card p-4">
                <div className="flex items-center space-x-3">
                  <div className="skeleton w-6 h-4 rounded-sm"></div>
                  <div>
                    <div className="skeleton w-24 h-4 rounded mb-1"></div>
                    <div className="skeleton w-16 h-3 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCountries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                onSelect={handleCountrySelect}
                showPrice={true}
                price="€0.94"
              />
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
