import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Globe, Cpu, Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    network: true,
    plan: false,
    features: false
  });


  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };



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
      <div className="flex items-center justify-between px-4 py-2">
        <button onClick={handleBackClick} className="p-1">
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
        <div className="flex items-center justify-center flex-1">
          {country?.flagUrl && (
            <img 
              src={country.flagUrl} 
              alt={`${country.name} flag`}
              className="w-5 h-4 mr-2 rounded-sm object-cover"
            />
          )}
          <h1 className="text-base font-medium text-gray-900 dark:text-white">
            {country?.name || "Loading..."}
          </h1>
        </div>
        <div className="text-orange-500 dark:text-orange-400 font-medium text-sm">€, EUR</div>
      </div>

      <div className="px-4">
        {/* Tab System */}
        <div className="flex mb-6">
          <button
            onClick={() => setSelectedTab('data')}
            className={`flex-1 py-3 px-4 rounded-l-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              selectedTab === 'data'
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <span>Data</span>
            <span className="bg-gray-300 dark:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {demoPackages.length}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab('data-calls-text')}
            className={`flex-1 py-3 px-4 rounded-r-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              selectedTab === 'data-calls-text'
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <span>Data / Calls / Text</span>
            <span className="bg-gray-300 dark:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              0
            </span>
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
          
          {/* Quick Facts */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <div className="w-6 h-6 mx-auto mb-1 text-green-600 dark:text-green-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="text-xs text-green-700 dark:text-green-300 font-medium">LTE Ready</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
              <div className="w-6 h-6 mx-auto mb-1 text-blue-600 dark:text-blue-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">No eKYC</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
              <div className="w-6 h-6 mx-auto mb-1 text-purple-600 dark:text-purple-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">US IP</div>
            </div>
          </div>

          {/* Network Section */}
          <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl ${expandedSections.network ? 'p-4 mb-3' : 'p-2 mb-2'}`}>
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors p-2 -m-2"
              onClick={() => toggleSection('network')}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Network</span>
              </div>
              {expandedSections.network ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
            {expandedSections.network && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Provider</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">T-Mobile • Verizon</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Technology</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">LTE Ready</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">IP Routing</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Local US IP</span>
                </div>
              </div>
            )}
          </div>

          {/* Plan Section */}
          <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl ${expandedSections.plan ? 'p-4 mb-3' : 'p-2 mb-2'}`}>
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors p-2 -m-2"
              onClick={() => toggleSection('plan')}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Plan</span>
              </div>
              {expandedSections.plan ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
            {expandedSections.plan && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Category</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Data Only</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">eSIM Package</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Roaming</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Yes</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl ${expandedSections.features ? 'p-4' : 'p-2'}`}>
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors p-2 -m-2"
              onClick={() => toggleSection('features')}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Features</span>
              </div>
              {expandedSections.features ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
            {expandedSections.features && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">eKYC Required</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">No</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Top-up</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Available</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">APN</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">internet</span>
                </div>
              </div>
            )}
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
