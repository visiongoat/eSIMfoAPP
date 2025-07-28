import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import EsimCard from "@/components/esim-card";
import EsimfoLogo from "@/components/esimfo-logo";
import type { Esim, Package, Country } from "@shared/schema";

export default function MyEsimsScreen() {
  const [, setLocation] = useLocation();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedEsim, setSelectedEsim] = useState<Esim | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const { data: esims = [], isLoading } = useQuery<(Esim & { package?: Package; country?: Country })[]>({
    queryKey: ["/api/esims"],
  });

  const handleViewQR = (esim: Esim) => {
    setLocation(`/qr/${esim.id}`);
  };

  const handleReorder = (esim: Esim & { package?: Package; country?: Country }) => {
    if (esim.package) {
      setLocation(`/packages/${esim.package.countryId}`);
    }
  };

  const activeEsims = esims.filter(esim => esim.status === 'Active');
  const recentEsims = esims.filter(esim => esim.status !== 'Active');

  // Calculate statistics with better data visualization
  const totalEsims = esims.length;
  const countriesVisited = new Set(esims.map(esim => esim.country?.name)).size;
  const totalDataUsed = esims.reduce((sum, esim) => {
    return sum + (parseFloat(esim.dataUsed || '0') / 1000); // Convert MB to GB
  }, 0);
  const totalSaved = 156; // Static for demo

  // Data usage notifications (80% threshold) - only check once
  useEffect(() => {
    if (esims.length === 0) return;
    
    const newNotifications: string[] = [];
    esims.filter(esim => esim.status === 'Active').forEach(esim => {
      const used = parseFloat(esim.dataUsed || '0');
      const total = parseFloat(esim.package?.data?.replace('GB', '') || '0') * 1000; // Convert to MB
      if (used / total >= 0.8 && used / total < 1) {
        newNotifications.push(`eSIM data ${Math.round((used/total)*100)}% used`);
      }
    });
    
    if (notifications.length !== newNotifications.length) {
      setNotifications(newNotifications);
    }
  }, [esims.length]);

  // Share eSIM functionality
  const handleShareEsim = (esim: Esim) => {
    setSelectedEsim(esim);
    setShowShareModal(true);
  };

  const shareEsimDetails = async () => {
    if (!selectedEsim) return;
    
    const shareData = {
      title: `eSIM Details`,
      text: `eSIM Status: ${selectedEsim.status}\nData Used: ${selectedEsim.dataUsed}MB`,
      url: `${window.location.origin}/qr/${selectedEsim.id}`
    };

    if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('eSIM details copied to clipboard!');
    }
    setShowShareModal(false);
  };

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="My eSIMs"
        rightButton={
          <button 
            onClick={() => setLocation('/search')}
            className="text-primary font-medium"
          >
            + Add
          </button>
        }
      />

      <div className="px-4 pt-4">
        {/* Data Usage Notifications */}
        {notifications.length > 0 && (
          <div className="mb-4 space-y-2">
            {notifications.map((notification, index) => (
              <div key={index} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <p className="text-orange-800 dark:text-orange-200 text-sm font-medium">{notification}</p>
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mobile-card p-4">
                <div className="skeleton w-full h-20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Active eSIMs */}
            {activeEsims.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-3">Active eSIMs</h2>
                {activeEsims.map((esim) => (
                  <EsimCard
                    key={esim.id}
                    esim={esim}
                    onViewQR={handleViewQR}
                    onShare={handleShareEsim}
                  />
                ))}
              </div>
            )}

            {/* Recent eSIMs */}
            {recentEsims.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-3">Recent eSIMs</h2>
                <div className="space-y-3">
                  {recentEsims.map((esim) => (
                    <EsimCard
                      key={esim.id}
                      esim={esim}
                      onReorder={handleReorder}
                      onShare={handleShareEsim}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Usage Statistics with Progress Bars */}
            <div className="mobile-card p-4 mb-4">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Usage Overview</h3>
              <div className="space-y-4">
                {/* Compact Stats Row */}
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalEsims}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">eSIMs</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{countriesVisited}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Countries</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalDataUsed.toFixed(0)}GB</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Used</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">€{totalSaved}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Saved</p>
                  </div>
                </div>

                {/* Data Usage Progress for Active eSIMs */}
                {activeEsims.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Data Usage</h4>
                    {activeEsims.slice(0, 2).map((esim) => {
                      const used = parseFloat(esim.dataUsed || '0');
                      const total = parseFloat(esim.package?.data?.replace('GB', '') || '0') * 1000;
                      const percentage = total > 0 ? (used / total) * 100 : 0;
                      
                      return (
                        <div key={esim.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400">eSIM #{esim.id}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{(used/1000).toFixed(1)}GB</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                percentage >= 80 ? 'bg-red-500' : 
                                percentage >= 60 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Multiple eSIM Management - Only show if user has multiple eSIMs */}
            {activeEsims.length > 1 && (
              <div className="mobile-card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Multi-eSIM Control</h3>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                    {activeEsims.length} Active
                  </span>
                </div>
                <div className="space-y-2">
                  {activeEsims.map((esim) => (
                    <div key={esim.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">eSIM #{esim.id}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">• Primary</span>
                      </div>
                      <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        Manage
                      </button>
                    </div>
                  ))}
                  <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 border-dashed rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Auto-switching enabled • Data from cheapest • Calls from primary
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {esims.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No eSIMs Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by purchasing your first eSIM
                </p>
                <button 
                  onClick={() => setLocation('/search')}
                  className="button-primary px-8"
                >
                  Browse eSIMs
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <TabBar onPlusClick={() => setShowQuickActions(true)} />

      {/* Quick Actions Modal */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" 
          onClick={() => setShowQuickActions(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            <div className="px-6 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quick Actions</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Choose your eSIM category to get started</p>
            </div>
            <div className="px-6 pb-8 space-y-3">
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations?tab=countries'); }} className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 transition-all duration-200 group active:scale-[0.98]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Local eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations?tab=regions'); }} className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 rounded-2xl p-4 border border-green-200 dark:border-green-700 transition-all duration-200 group active:scale-[0.98]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regional eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations?tab=global'); }} className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 transition-all duration-200 group active:scale-[0.98]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Global eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage plans</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedEsim && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-6 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share eSIM</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">eSIM #{selectedEsim.id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status: {selectedEsim.status}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data Used: {selectedEsim.dataUsed}MB • QR Code & Setup Details
              </p>
            </div>
            
            <button
              onClick={shareEsimDetails}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Share eSIM Details
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Shares QR code link and usage information
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
