import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Globe, Cpu, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import NavigationBar from "@/components/navigation-bar";
import type { Country, Package } from "@shared/schema";

export default function PackagesScreen() {
  const [, params] = useRoute("/packages/:countryId");
  const [, setLocation] = useLocation();
  const countryId = params?.countryId ? parseInt(params.countryId) : null;
  
  const [selectedTab, setSelectedTab] = useState<'data' | 'data-calls-text'>('data');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [esimCount, setEsimCount] = useState(1);

  const { data: country } = useQuery<Country>({
    queryKey: ["/api/countries", countryId],
    enabled: !!countryId,
  });

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/countries", countryId, "packages"],
    enabled: !!countryId,
  });

  // Demo packages - based on the design
  const demoPackages = [
    {
      id: 1,
      duration: "1 day",
      data: "∞ GB",
      price: "€7",
      pricePerDay: "€7 /day",
      discount: null,
      isSelected: true
    },
    {
      id: 2,
      duration: "7 days",
      data: "∞ GB",
      price: "€24",
      pricePerDay: "€3.43 /day",
      discount: "-51%"
    },
    {
      id: 3,
      duration: "15 days",
      data: "∞ GB",
      price: "€33",
      pricePerDay: "€2.20 /day",
      discount: "-69%"
    },
    {
      id: 4,
      duration: "30 days",
      data: "∞ GB",
      price: "€48",
      pricePerDay: "€1.60 /day",
      discount: "-77%"
    }
  ];

  const handleBackClick = () => {
    setLocation("/destinations");
  };

  const handlePackageSelect = (packageId: number) => {
    setSelectedPackage(packageId);
  };

  const handlePurchase = () => {
    if (selectedPackage) {
      setLocation(`/purchase/${selectedPackage}`);
    }
  };

  if (!countryId) {
    return <div>Invalid country ID</div>;
  }

  return (
    <div className="mobile-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      {/* Custom Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={handleBackClick} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-lg font-semibold text-center flex-1 text-gray-900 dark:text-white">
          {country?.name || "Loading..."}
        </h1>
        <div className="text-orange-500 dark:text-orange-400 font-semibold">€, EUR</div>
      </div>

      <div className="px-4">
        {/* Tab System */}
        <div className="flex mb-6">
          <button
            onClick={() => setSelectedTab('data')}
            className={`flex-1 py-3 px-4 rounded-l-lg font-medium transition-colors ${
              selectedTab === 'data'
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            Data
          </button>
          <button
            onClick={() => setSelectedTab('data-calls-text')}
            className={`flex-1 py-3 px-4 rounded-r-lg font-medium transition-colors ${
              selectedTab === 'data-calls-text'
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            Data / Calls / Text
          </button>
        </div>

        {/* Package List */}
        <div className="space-y-3 mb-6">
          {demoPackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg.id)}
              className={`w-full p-3 rounded-xl border-2 transition-all ${
                selectedPackage === pkg.id || pkg.isSelected
                  ? 'border-orange-500 bg-orange-50 dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center">
                <div className="text-left flex-1">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{pkg.duration}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">{pkg.data}</div>
                </div>
                <div className="flex-1 flex flex-col items-start justify-center pl-16">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{pkg.price}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">{pkg.pricePerDay}</div>
                </div>
                <div className="flex-1 flex justify-end items-center">
                  {pkg.discount && (
                    <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                      {pkg.discount}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Plan Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Plan details</h3>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Countries and network operators</div>
                  <div className="text-gray-900 dark:text-white font-medium">1 country</div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 dark:text-gray-500 rotate-180" />
            </div>

            <div className="flex items-center space-x-3">
              <Cpu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Plan type</div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {selectedTab === 'data' ? 'Data only' : 'Data + Calls + Text'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Plan activation</div>
                <div className="text-gray-900 dark:text-white font-medium">Instant activation or delayed for 365 days</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-4 h-3 border-2 border-gray-500 dark:border-gray-400 rounded-sm"></div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Balance top-up</div>
                <div className="text-gray-900 dark:text-white font-medium">Available</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Hotspot</div>
                <div className="text-gray-900 dark:text-white font-medium">Depends on operator</div>
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium flex items-center">
                  Speed limitation 
                  <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center ml-1">
                    <span className="text-white text-xs">?</span>
                  </div>
                </div>
                <div className="text-gray-900 dark:text-white font-medium text-sm">Some network providers may reduce speed as part of their Fair Usage Policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing for sticky section */}
        <div className="h-32"></div>
      </div>

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 mx-auto max-w-md">
        {/* eSIM Count Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">Choose eSIM quantity</div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setEsimCount(Math.max(1, esimCount - 1))}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{esimCount}</span>
            <button
              onClick={() => setEsimCount(esimCount + 1)}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          disabled={!selectedPackage}
          className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-lg rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Payment — €48
        </Button>
      </div>
    </div>
  );
}
