import { useState, useEffect, useRef } from "react";
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
  const [selectedPackage, setSelectedPackage] = useState<number | null>(1);
  
  // Update default selection when tab changes
  useEffect(() => {
    if (selectedTab === 'data') {
      setSelectedPackage(1); // First data package
    } else {
      setSelectedPackage(5); // First data/calls/text package
    }
  }, [selectedTab]);
  const [esimCount, setEsimCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    network: true,
    plan: false,
    features: false
  });

  // Swipe navigation for tab switching
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && selectedTab === 'data-calls-text') {
          // Swipe right: data-calls-text -> data
          setSelectedTab('data');
        } else if (deltaX < 0 && selectedTab === 'data') {
          // Swipe left: data -> data-calls-text
          setSelectedTab('data-calls-text');
        }
      }

      // Reset
      touchStartX.current = 0;
      touchStartY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [selectedTab]);


  const toggleSection = (section: string) => {
    const isCurrentlyExpanded = expandedSections[section];
    
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Auto-scroll for Network, Plan and Features sections when expanding
    if ((section === 'network' || section === 'plan' || section === 'features') && !isCurrentlyExpanded) {
      setTimeout(() => {
        if (section === 'network') {
          // For Network, scroll to show Network content + Plan and Features titles
          const networkElement = document.querySelector(`[data-section="network"]`);
          if (networkElement) {
            networkElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        } else if (section === 'plan') {
          // For Plan, scroll to show both Plan content and Features title
          const planElement = document.querySelector(`[data-section="plan"]`);
          if (planElement) {
            planElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        } else if (section === 'features') {
          // For Features, scroll to show Features content
          const featuresElement = document.querySelector(`[data-section="features"]`);
          if (featuresElement) {
            featuresElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }
      }, 150);
    }
  };

  // Auto scroll when features section opens
  useEffect(() => {
    if (expandedSections.features) {
      // Scroll to bottom to show features content
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight - window.innerHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [expandedSections.features]);



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
      duration: "1 GB",
      data: "7 gün",
      price: "€7",
      pricePerDay: "€1.00 /day",
      signalStrength: 5
    },
    {
      id: 2,
      duration: "3 GB",
      data: "15 gün",
      price: "€24",
      pricePerDay: "€1.60 /day",
      signalStrength: 5
    },
    {
      id: 3,
      duration: "5 GB",
      data: "20 gün",
      price: "€33",
      pricePerDay: "€1.65 /day",
      signalStrength: 5
    },
    {
      id: 4,
      duration: "10 GB",
      data: "30 gün",
      price: "€48",
      pricePerDay: "€1.60 /day",
      signalStrength: 5
    }
  ];

  // Data/Calls/Text packages with voice and SMS
  const dataCallsTextPackages = [
    {
      id: 5,
      duration: "1 GB",
      data: "7 gün",
      voice: "100 dk",
      sms: "50 SMS",
      price: "€12",
      pricePerDay: "€1.71 /day",
      signalStrength: 5
    },
    {
      id: 6,
      duration: "3 GB",
      data: "15 gün",
      voice: "200 dk",
      sms: "100 SMS",
      price: "€28",
      pricePerDay: "€1.87 /day",
      signalStrength: 5
    },
    {
      id: 7,
      duration: "5 GB",
      data: "20 gün",
      voice: "300 dk",
      sms: "150 SMS",
      price: "€42",
      pricePerDay: "€2.10 /day",
      signalStrength: 5
    },
    {
      id: 8,
      duration: "10 GB",
      data: "30 gün",
      voice: "500 dk",
      sms: "200 SMS",
      price: "€58",
      pricePerDay: "€1.93 /day",
      signalStrength: 5
    }
  ];

  const handleBackClick = () => {
    setLocation("/destinations");
  };

  const handlePackageSelect = (packageId: number) => {
    setSelectedPackage(packageId);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    setIsProcessing(true);
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setLocation(`/purchase/${selectedPackage}`);
  };

  if (!countryId) {
    return <div>Invalid country ID</div>;
  }

  return (
    <div ref={containerRef} className="mobile-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white min-h-screen pb-20">
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

      <div className="px-4 mt-4">
        {/* Tab System */}
        <div className="flex mb-6">
          <button
            onClick={() => setSelectedTab('data')}
            className={`flex-1 py-3 px-4 rounded-l-lg font-medium transition-colors ${
              selectedTab === 'data'
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
          >
            Data ({demoPackages.length})
          </button>
          <button
            onClick={() => setSelectedTab('data-calls-text')}
            className={`flex-1 py-3 px-4 rounded-r-lg font-medium transition-colors ${
              selectedTab === 'data-calls-text'
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
          >
            Data / Calls / Text ({dataCallsTextPackages.length})
          </button>
        </div>

        {/* Package List */}
        <div className="space-y-3 mb-6">
          {selectedTab === 'data' ? (
            // Data Only Packages
            demoPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg.id)}
                className={`w-full p-3 rounded-xl border-2 transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500'
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
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1 rounded-sm ${
                            bar <= pkg.signalStrength
                              ? bar <= 2 ? 'bg-red-500 h-2'
                                : bar <= 3 ? 'bg-yellow-500 h-3'
                                : bar <= 4 ? 'bg-green-500 h-4'
                                : 'bg-green-600 h-5'
                              : 'bg-gray-300 dark:bg-gray-600 h-2'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            // Data/Calls/Text Packages
            dataCallsTextPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg.id)}
                className={`w-full p-3 rounded-xl border-2 transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  {/* Left side - Data & Duration */}
                  <div className="text-left flex-1">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{pkg.duration}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">{pkg.data}</div>
                  </div>
                  
                  {/* Middle - Voice & SMS */}
                  <div className="flex-1 flex flex-col items-start justify-center">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-sm text-green-600 dark:text-green-400">📞</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{pkg.voice}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-blue-600 dark:text-blue-400">💬</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{pkg.sms}</span>
                    </div>
                  </div>
                  
                  {/* Right side - Price & Signal */}
                  <div className="flex-1 flex flex-col items-end justify-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.price}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">{pkg.pricePerDay}</div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1 rounded-sm ${
                            bar <= pkg.signalStrength
                              ? bar <= 2 ? 'bg-red-500 h-2'
                                : bar <= 3 ? 'bg-yellow-500 h-3'
                                : bar <= 4 ? 'bg-green-500 h-4'
                                : 'bg-green-600 h-5'
                              : 'bg-gray-300 dark:bg-gray-600 h-2'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Plan Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Plan details</h3>
          
          {/* Quick Facts */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-0.5 w-6 h-6 mx-auto mb-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className="w-1 rounded-sm bg-green-600 dark:bg-green-400"
                    style={{ height: `${8 + bar * 2}px` }}
                  />
                ))}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300 font-medium">LTE Ready</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
              <div className="w-6 h-6 mx-auto mb-1 text-blue-600 dark:text-blue-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
                </svg>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">No eKYC</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
              <div className="w-6 h-6 mx-auto mb-1 text-purple-600 dark:text-purple-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                </svg>
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">1</div>
            </div>
          </div>

          {/* Network Section */}
          <div data-section="network" className={`bg-gray-50 dark:bg-gray-800 rounded-xl ${expandedSections.network ? 'p-4 mb-3' : 'p-2 mb-2'}`}>
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
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Provider</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">T-Mobile • Verizon</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Technology</span>
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">LTE Ready</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">IP Routing</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Local US IP</span>
                </div>
              </div>
            )}
          </div>

          {/* Plan Section */}
          <div data-section="plan" className={`bg-gray-50 dark:bg-gray-800 rounded-xl ${expandedSections.plan ? 'p-4 mb-3' : 'p-2 mb-2'}`}>
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
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Category</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Data Only</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Type</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">eSIM Package</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Roaming</span>
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
          <div data-section="features" className={`bg-gray-50 dark:bg-gray-800 rounded-xl ${expandedSections.features ? 'p-4' : 'p-2'}`}>
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
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm0 4c-1.48 0-2.75-.81-3.45-2H6.88c.3.78.76 1.47 1.32 2.02L12 21.5l3.8-3.98c.56-.55 1.02-1.24 1.32-2.02H13.45c-.7 1.19-1.97 2-3.45 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">eKYC Required</span>
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">No</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Top-up</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Available</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">APN</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">internet</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacing for sticky section - adjust for combo packages */}
        <div className={`${selectedTab === 'data-calls-text' ? 'h-16' : 'h-12'}`}></div>
      </div>

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/50 p-4 mx-auto max-w-md">
        {/* Selected Package Details */}
        {selectedPackage && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {country?.flagUrl && (
                  <img 
                    src={country.flagUrl} 
                    alt={`${country.name} flag`}
                    className="w-6 h-4 rounded-sm object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {(() => {
                        const dataPackage = demoPackages.find(p => p.id === selectedPackage);
                        const comboPackage = dataCallsTextPackages.find(p => p.id === selectedPackage);
                        return dataPackage?.duration || comboPackage?.duration;
                      })()}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className="w-1 rounded-sm bg-green-500"
                          style={{ height: `${4 + bar * 2}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>
                      {(() => {
                        const dataPackage = demoPackages.find(p => p.id === selectedPackage);
                        const comboPackage = dataCallsTextPackages.find(p => p.id === selectedPackage);
                        return dataPackage?.data || comboPackage?.data;
                      })()}
                    </div>
                    {/* Show voice and SMS for combo packages */}
                    {dataCallsTextPackages.find(p => p.id === selectedPackage) && (
                      <div className="flex items-center space-x-3 -mt-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-green-600 dark:text-green-400">📞</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {dataCallsTextPackages.find(p => p.id === selectedPackage)?.voice}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-blue-600 dark:text-blue-400">💬</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {dataCallsTextPackages.find(p => p.id === selectedPackage)?.sms}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {(() => {
                    const dataPackage = demoPackages.find(p => p.id === selectedPackage);
                    const comboPackage = dataCallsTextPackages.find(p => p.id === selectedPackage);
                    return dataPackage?.price || comboPackage?.price;
                  })()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {(() => {
                    const dataPackage = demoPackages.find(p => p.id === selectedPackage);
                    const comboPackage = dataCallsTextPackages.find(p => p.id === selectedPackage);
                    return dataPackage?.pricePerDay || comboPackage?.pricePerDay;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          disabled={!selectedPackage || isProcessing}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              Checkout
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
