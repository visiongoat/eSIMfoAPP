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

        {/* Package Information */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Package Information</h3>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.592 4.142a1 1 0 01-.514 1.051L4.5 9.5a10.003 10.003 0 006 6l1.471-1.717a1 1 0 011.051-.514l4.142.592A1 1 0 0118 15.153V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">Network Provider</div>
              </div>
              <div className="text-gray-900 dark:text-white font-medium">T-Mobile • Verizon</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">Network Technology</div>
              </div>
              <div className="text-green-600 dark:text-green-400 font-medium">LTE Ready</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">Plan Category</div>
              </div>
              <div className="text-gray-900 dark:text-white font-medium">Data Only</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">Package Type</div>
              </div>
              <div className="text-gray-900 dark:text-white font-medium">eSIM Package</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">Roaming Support</div>
              </div>
              <div className="text-gray-900 dark:text-white font-medium">Yes</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">IP Routing</div>
              </div>
              <div className="text-gray-900 dark:text-white font-medium">Local United States IP</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">eKYC Verification</div>
              </div>
              <div className="text-gray-900 dark:text-white font-medium">Not Required</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">APN Value</div>
              </div>
              <div className="text-gray-900 dark:text-white font-medium">internet</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-gray-500 dark:text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">Top-up Option</div>
              </div>
              <div className="text-gray-900 dark:text-white font-medium">Available</div>
            </div>
          </div>
        </div>

        {/* Validity Policy */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Validity Policy</h3>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-4">
            <div className="text-green-800 dark:text-green-200 font-medium">Valid for 7 days from activation</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
            <div className="text-blue-800 dark:text-blue-200 text-sm">
              The validity period starts when the eSIM connects to a mobile network in its coverage area. If you install the eSIM outside of the coverage area, you can connect to a network when you arrive.
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
