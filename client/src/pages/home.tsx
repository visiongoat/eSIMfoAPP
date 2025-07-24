import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import StatusBar from "@/components/status-bar";
import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import CountryCard from "@/components/country-card";
import type { Country, Package } from "@shared/schema";

export default function HomeScreen() {
  const [, setLocation] = useLocation();

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

  const popularDestinations = countries.slice(0, 3);

  return (
    <div className="mobile-screen">
      <StatusBar />
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

        {/* Popular Destinations */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Popular Destinations</h2>
            <button 
              onClick={() => setLocation('/search')}
              className="text-primary text-sm font-medium"
            >
              See All
            </button>
          </div>
          
          <div className="space-y-2">
            {popularDestinations.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                onSelect={handleCountrySelect}
                showPrice={true}
                price="€0.94"
              />
            ))}
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
