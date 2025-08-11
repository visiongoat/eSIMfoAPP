import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import EsimCard from "@/components/esim-card";
import EsimfoLogo from "@/components/esimfo-logo";
import type { Esim, Package, Country } from "@shared/schema";

type FilterType = 'all' | 'active' | 'expired';

export default function MyEsimsScreen() {
  const [, setLocation] = useLocation();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedEsim, setSelectedEsim] = useState<Esim | null>(null);
  const [showEsimDetailModal, setShowEsimDetailModal] = useState(false);
  const [selectedEsimForDetail, setSelectedEsimForDetail] = useState<(Esim & { package?: Package; country?: Country }) | null>(null);

  const [filter, setFilter] = useState<FilterType>('active');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleEsimCardClick = (esim: Esim & { package?: Package; country?: Country }) => {
    setSelectedEsimForDetail(esim);
    setShowEsimDetailModal(true);
  };

  // Filter eSIMs based on selected filter and sort by ID descending (newest first)
  const getFilteredEsims = () => {
    let filtered;
    switch (filter) {
      case 'active':
        filtered = esims.filter(esim => esim.status === 'Active');
        break;
      case 'expired':
        filtered = esims.filter(esim => esim.status === 'Expired');
        break;
      default:
        filtered = esims;
    }
    // Sort by ID descending (newest purchases first)
    return filtered.sort((a, b) => b.id - a.id);
  };

  const filteredEsims = getFilteredEsims();
  const activeEsims = esims.filter(esim => esim.status === 'Active');
  const expiredEsims = esims.filter(esim => esim.status === 'Expired');

  // Calculate statistics with better data visualization
  const totalEsims = esims.length;
  const countriesVisited = new Set(esims.map(esim => esim.country?.name)).size;
  const totalDataUsed = esims.reduce((sum, esim) => {
    return sum + (parseFloat(esim.dataUsed || '0') / 1000); // Convert MB to GB
  }, 0);
  // Remove totalSaved - no calculation logic needed

  // Remove data usage notifications

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
            onClick={() => setLocation('/destinations')}
            className="text-primary font-medium"
          >
            + Add
          </button>
        }
      />

      <div className="px-4 pt-4">
        {/* Dashboard Stats - Clean & Professional */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="mobile-card p-3 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalEsims}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total eSIMs</p>
          </div>
          <div className="mobile-card p-3 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{countriesVisited}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Countries</p>
          </div>
          <div className="mobile-card p-3 text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalDataUsed.toFixed(0)}GB</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Data Used</p>
          </div>
        </div>



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
            {/* Active eSIMs - Dashboard Section */}
            {activeEsims.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Active eSIMs</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        filter === 'all'
                          ? 'bg-gray-600 dark:bg-gray-300 text-white dark:text-gray-900 font-medium'
                          : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('active')}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        filter === 'active'
                          ? 'bg-green-600 dark:bg-green-500 text-white font-medium'
                          : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                      }`}
                    >
                      {activeEsims.length} active
                    </button>
                    <button
                      onClick={() => setFilter('expired')}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        filter === 'expired'
                          ? 'bg-red-600 dark:bg-red-500 text-white font-medium'
                          : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                      }`}
                    >
                      {expiredEsims.length} expired
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredEsims.map((esim) => (
                    <EsimCard
                      key={esim.id}
                      esim={esim}
                      onViewQR={handleViewQR}
                      onShare={handleShareEsim}
                      onClick={handleEsimCardClick}
                    />
                  ))}
                </div>
              </div>
            )}





            {/* Multi-eSIM Status - Dashboard Style */}
            {activeEsims.length > 1 && (
              <div className="mobile-card p-3 mb-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">Multi-eSIM Active</h3>
                  <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                    {activeEsims.length} Active
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ⚡ Auto-switching enabled • 🌐 Optimized routing
                </p>
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

      {/* eSIM Detail Modal - Magnificent Design */}
      {showEsimDetailModal && selectedEsimForDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-[9999] p-4">
          <div 
            className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transform animate-in zoom-in-90 duration-300 relative border border-gray-200 dark:border-gray-700"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.2)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowEsimDetailModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-200 z-10"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with Country */}
            <div className="relative overflow-hidden rounded-t-3xl p-6 pb-4"
                 style={{
                   background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                 }}>
              <div className="flex items-center space-x-4 relative z-10">
                <img 
                  src={selectedEsimForDetail.country?.flagUrl || 'https://flagcdn.com/w320/tr.png'} 
                  alt={`${selectedEsimForDetail.country?.name || 'Turkey'} flag`} 
                  className="w-16 h-12 rounded-xl object-cover border-2 border-white/20 shadow-lg" 
                />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedEsimForDetail.country?.name || 'Turkey'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {selectedEsimForDetail.package?.name || '5GB / 30 Days'} • eSIM #{selectedEsimForDetail.id}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-6 right-16">
                <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  selectedEsimForDetail.status === 'Active' 
                    ? 'bg-green-500 text-white' 
                    : selectedEsimForDetail.status === 'Expired'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {selectedEsimForDetail.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Premium Circular Data Usage Chart */}
              <div className="text-center relative">
                <div className="relative mx-auto w-56 h-56">
                  {(() => {
                    const totalGB = parseFloat(selectedEsimForDetail.package?.data?.replace('GB', '') || '5');
                    const total = totalGB * 1000; // Convert GB to MB
                    const used = parseFloat(selectedEsimForDetail.dataUsed || '0');
                    const percentage = Math.min((used / total) * 100, 100);
                    
                    // Multiple circles for depth effect
                    const radius1 = 96; // Outer ring
                    const radius2 = 80; // Middle ring  
                    const radius3 = 64; // Inner ring
                    
                    const circumference1 = 2 * Math.PI * radius1;
                    const circumference2 = 2 * Math.PI * radius2;
                    const circumference3 = 2 * Math.PI * radius3;
                    
                    const offset1 = circumference1 - (percentage / 100) * circumference1;
                    const offset2 = circumference2 - (percentage / 100) * circumference2;
                    const offset3 = circumference3 - (percentage / 100) * circumference3;
                    
                    return (
                      <>
                        {/* Glow Effect Background */}
                        <div 
                          className="absolute inset-0 rounded-full animate-pulse"
                          style={{
                            background: `radial-gradient(circle, ${percentage > 80 ? 'rgba(239, 68, 68, 0.1)' : percentage > 60 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'} 0%, transparent 70%)`,
                            filter: 'blur(20px)'
                          }}
                        ></div>
                        
                        <svg className="w-56 h-56 transform -rotate-90 relative z-10" viewBox="0 0 224 224">
                          <defs>
                            {/* Main Gradient */}
                            <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={percentage > 80 ? "#ef4444" : percentage > 60 ? "#f59e0b" : "#06b6d4"} />
                              <stop offset="50%" stopColor={percentage > 80 ? "#dc2626" : percentage > 60 ? "#d97706" : "#0891b2"} />
                              <stop offset="100%" stopColor={percentage > 80 ? "#b91c1c" : percentage > 60 ? "#b45309" : "#0e7490"} />
                            </linearGradient>
                            
                            {/* Shadow Gradient */}
                            <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={percentage > 80 ? "rgba(239, 68, 68, 0.3)" : percentage > 60 ? "rgba(245, 158, 11, 0.3)" : "rgba(6, 182, 212, 0.3)"} />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                            
                            {/* Drop Shadow Filter */}
                            <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
                              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={percentage > 80 ? "#ef4444" : percentage > 60 ? "#f59e0b" : "#06b6d4"} floodOpacity="0.3"/>
                            </filter>
                          </defs>
                          
                          {/* Background Circles */}
                          <circle cx="112" cy="112" r={radius1} stroke="rgba(156, 163, 175, 0.2)" strokeWidth="3" fill="transparent" />
                          <circle cx="112" cy="112" r={radius2} stroke="rgba(156, 163, 175, 0.15)" strokeWidth="2" fill="transparent" />
                          <circle cx="112" cy="112" r={radius3} stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1" fill="transparent" />
                          
                          {/* Progress Circles with Staggered Animation */}
                          <circle
                            cx="112" cy="112" r={radius1}
                            stroke="url(#mainGradient)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={circumference1}
                            strokeDashoffset={offset1}
                            className="transition-all duration-1500 ease-out"
                            filter="url(#dropshadow)"
                            style={{ animationDelay: '0ms' }}
                          />
                          
                          <circle
                            cx="112" cy="112" r={radius2}
                            stroke="url(#mainGradient)"
                            strokeWidth="6"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={circumference2}
                            strokeDashoffset={offset2}
                            className="transition-all duration-1500 ease-out"
                            opacity="0.7"
                            style={{ animationDelay: '200ms' }}
                          />
                          
                          <circle
                            cx="112" cy="112" r={radius3}
                            stroke="url(#mainGradient)"
                            strokeWidth="4"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={circumference3}
                            strokeDashoffset={offset3}
                            className="transition-all duration-1500 ease-out"
                            opacity="0.4"
                            style={{ animationDelay: '400ms' }}
                          />
                          
                          {/* Animated Dots */}
                          {percentage > 0 && (
                            <>
                              <circle
                                cx={112 + radius1 * Math.cos((percentage / 100) * 2 * Math.PI - Math.PI/2)}
                                cy={112 + radius1 * Math.sin((percentage / 100) * 2 * Math.PI - Math.PI/2)}
                                r="6"
                                fill="url(#mainGradient)"
                                className="animate-pulse"
                                filter="url(#dropshadow)"
                              />
                            </>
                          )}
                        </svg>
                        
                        {/* Enhanced Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="relative">
                            <div className={`text-5xl font-black bg-gradient-to-br ${percentage > 80 ? 'from-red-500 to-red-700' : percentage > 60 ? 'from-amber-500 to-orange-600' : 'from-cyan-500 to-blue-600'} bg-clip-text text-transparent animate-pulse`}>
                              {Math.round(percentage)}%
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-ping"></div>
                          </div>
                          
                          <div className="mt-2 text-center">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {used.toFixed(0)}MB <span className="text-gray-400">of</span> {total.toFixed(0)}MB
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                              {(total - used).toFixed(0)}MB remaining
                            </div>
                          </div>
                          
                          {/* Status Indicator */}
                          <div className="mt-3 flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {percentage > 80 ? 'High Usage' : percentage > 60 ? 'Medium Usage' : 'Low Usage'}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Days Chart */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Usage Timeline
                </h3>
                
                {(() => {
                  const totalDays = parseInt(selectedEsimForDetail.package?.duration?.split(' ')[0] || '30');
                  const daysUsed = Math.min(Math.floor(Math.random() * totalDays) + 1, totalDays); // Mock data
                  const daysRemaining = totalDays - daysUsed;
                  const dailyUsage = parseFloat(selectedEsimForDetail.dataUsed || '0') / daysUsed;
                  
                  return (
                    <div className="space-y-4">
                      {/* Days Progress */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Days Used</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {daysUsed} / {totalDays} days
                        </span>
                      </div>
                      
                      {/* Days Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${(daysUsed / totalDays) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {daysRemaining}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Days Left</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {dailyUsage.toFixed(0)}MB
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Avg/Day</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowEsimDetailModal(false);
                    handleViewQR(selectedEsimForDetail);
                  }}
                  className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span>View QR</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowEsimDetailModal(false);
                    handleShareEsim(selectedEsimForDetail);
                  }}
                  className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
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
