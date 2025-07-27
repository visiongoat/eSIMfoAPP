import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Globe, Cpu, Minus, Plus, ChevronDown, ChevronUp, Info } from "lucide-react";
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
    plan: true,
    features: true
  });
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const Tooltip = ({ text, id }: { text: string; id: string }) => (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
        onClick={() => setShowTooltip(showTooltip === id ? null : id)}
        className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center ml-1 hover:bg-gray-500 dark:hover:bg-gray-400 transition-colors"
      >
        <Info className="w-2.5 h-2.5 text-white" />
      </button>
      {showTooltip === id && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      )}
    </div>
  );

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
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-3">
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 -m-2 p-2 rounded-lg transition-colors"
              onClick={() => toggleSection('network')}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Network</span>
                <Tooltip text="Information about network providers and technology" id="network-info" />
              </div>
              {expandedSections.network ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
            {expandedSections.network && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Provider</span>
                    <Tooltip text="Main network operators in United States" id="provider-info" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">T-Mobile • Verizon</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Technology</span>
                    <Tooltip text="4G LTE network with 5G compatibility" id="tech-info" />
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">LTE Ready</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">IP Routing</span>
                    <Tooltip text="You'll get a US-based IP address" id="ip-info" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Local US IP</span>
                </div>
              </div>
            )}
          </div>

          {/* Plan Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-3">
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 -m-2 p-2 rounded-lg transition-colors"
              onClick={() => toggleSection('plan')}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Plan</span>
                <Tooltip text="Details about your eSIM plan configuration" id="plan-info" />
              </div>
              {expandedSections.plan ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
            {expandedSections.plan && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Category</span>
                    <Tooltip text="Data only plan - no voice or SMS" id="category-info" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Data Only</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Type</span>
                    <Tooltip text="Digital eSIM profile for compatible devices" id="type-info" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">eSIM Package</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Roaming</span>
                    <Tooltip text="Works internationally without extra charges" id="roaming-info" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Yes</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div 
              className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 -m-2 p-2 rounded-lg transition-colors"
              onClick={() => toggleSection('features')}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Features</span>
                <Tooltip text="Additional features and configuration details" id="features-info" />
              </div>
              {expandedSections.features ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
            {expandedSections.features && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">eKYC Required</span>
                    <Tooltip text="No identity verification needed for activation" id="ekyc-info" />
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">No</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Top-up</span>
                    <Tooltip text="Add more data when you run out" id="topup-info" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Available</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">APN</span>
                    <Tooltip text="Access Point Name for internet connection" id="apn-info" />
                  </div>
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
