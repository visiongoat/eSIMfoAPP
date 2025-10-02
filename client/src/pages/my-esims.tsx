import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import EsimCard from "@/components/esim-card";
import EsimfoLogo from "@/components/esimfo-logo";
import CheckoutModal from "@/components/checkout-modal";
import type { Esim, Package, Country } from "@shared/schema";

type FilterType = 'all' | 'active' | 'expired' | 'ready';

export default function MyEsimsScreen() {
  const [, setLocation] = useLocation();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showInAppSupport, setShowInAppSupport] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedEsim, setSelectedEsim] = useState<Esim | null>(null);
  const [showTopUpCheckout, setShowTopUpCheckout] = useState(false);
  const [topUpEsimCount, setTopUpEsimCount] = useState(1);
  const [showEsimDetailModal, setShowEsimDetailModal] = useState(false);
  const [selectedEsimForDetail, setSelectedEsimForDetail] = useState<(Esim & { package?: Package; country?: Country }) | null>(null);

  // Support Modal swipe state
  const [quickActionsStartY, setQuickActionsStartY] = useState<number>(0);
  const [quickActionsCurrentY, setQuickActionsCurrentY] = useState<number>(0);
  const [isQuickActionsDragging, setIsQuickActionsDragging] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterType>('active');

  // Animation state for modal opening and closing
  const [modalAnimationKey, setModalAnimationKey] = useState(0);
  const [isModalExiting, setIsModalExiting] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Prevent body scroll when quick actions modal is open
  useEffect(() => {
    if (showQuickActions) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showQuickActions]);

  const { data: esims = [], isLoading } = useQuery<(Esim & { package?: Package; country?: Country })[]>({
    queryKey: ["/api/esims"],
  });

  // Memoized filtered eSIMs based on selected filter and sort by ID descending (newest first)
  const filteredEsims = useMemo(() => {
    let filtered;
    switch (filter) {
      case 'active':
        filtered = esims.filter(esim => esim.status === 'Active');
        break;
      case 'expired':
        filtered = esims.filter(esim => esim.status === 'Expired');
        break;
      case 'ready':
        filtered = esims.filter(esim => esim.status === 'Ready');
        break;
      default:
        filtered = esims;
    }
    // Sort by ID descending (newest purchases first)
    return filtered.sort((a, b) => b.id - a.id);
  }, [esims, filter]);

  const handleViewQR = (esim: Esim) => {
    setLocation(`/qr/${esim.id}`);
  };

  const handleReorder = (esim: Esim & { package?: Package; country?: Country }) => {
    if (esim.package) {
      setLocation(`/packages/${esim.package.countryId}`);
    }
  };

  const handleEsimCardClick = (esim: Esim & { package?: Package; country?: Country }) => {
    // If eSIM is Ready, navigate to QR page directly
    if (esim.status === 'Ready') {
      setLocation(`/qr/${esim.id}`);
      return;
    }
    
    // For other statuses, show the detail modal
    setSelectedEsimForDetail(esim);
    setShowEsimDetailModal(true);
    setModalAnimationKey(prev => prev + 1); // Trigger fresh animation
  };

  // Quick Actions Modal Touch Handlers
  const handleQuickActionsTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setQuickActionsStartY(touch.clientY);
    setQuickActionsCurrentY(touch.clientY);
    setIsQuickActionsDragging(true);
  };

  const handleQuickActionsTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isQuickActionsDragging) return;
    
    const touch = e.touches[0];
    setQuickActionsCurrentY(touch.clientY);
  };

  const handleQuickActionsTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isQuickActionsDragging) return;
    
    const deltaY = quickActionsCurrentY - quickActionsStartY;
    const threshold = 100; // pixels
    
    if (deltaY > threshold) {
      setShowQuickActions(false);
    }
    
    setIsQuickActionsDragging(false);
    setQuickActionsStartY(0);
    setQuickActionsCurrentY(0);
  };
  
  // Touch/swipe state for modal navigation
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'entering-left' | 'entering-right' | null>(null);

  // Close modal with exit animation
  const closeModal = () => {
    setIsModalExiting(true);
    setTimeout(() => {
      setShowEsimDetailModal(false);
      setSelectedEsimForDetail(null);
      setIsModalExiting(false);
    }, 300);
  };

  // Navigate to next/previous eSIM with Apple-style slide animations
  const navigateToNextEsim = () => {
    if (!selectedEsimForDetail || isTransitioning) return;
    
    const currentIndex = filteredEsims.findIndex(esim => esim.id === selectedEsimForDetail.id);
    const nextIndex = (currentIndex + 1) % filteredEsims.length;
    
    setIsTransitioning(true);
    setSlideDirection('left');
    
    setTimeout(() => {
      setSelectedEsimForDetail(filteredEsims[nextIndex]);
      setModalAnimationKey(prev => prev + 1);
      setSlideDirection('entering-right');
      
      setTimeout(() => {
        setSlideDirection(null);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 16);
    }, 300);
  };

  const navigateToPrevEsim = () => {
    if (!selectedEsimForDetail || isTransitioning) return;
    
    const currentIndex = filteredEsims.findIndex(esim => esim.id === selectedEsimForDetail.id);
    const prevIndex = currentIndex === 0 ? filteredEsims.length - 1 : currentIndex - 1;
    
    setIsTransitioning(true);
    setSlideDirection('right');
    
    setTimeout(() => {
      setSelectedEsimForDetail(filteredEsims[prevIndex]);
      setModalAnimationKey(prev => prev + 1);
      setSlideDirection('entering-left');
      
      setTimeout(() => {
        setSlideDirection(null);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 16);
    }, 300);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    
    setTouchEnd({ x: currentX, y: currentY });
    
    // Calculate horizontal movement for real-time feedback
    const deltaX = currentX - touchStart.x;
    const deltaY = Math.abs(currentY - touchStart.y);
    
    // Only apply horizontal movement if it's primarily horizontal swipe
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      const maxMovement = 50; // Maximum card movement in pixels
      const movement = Math.max(-maxMovement, Math.min(maxMovement, deltaX * 0.3));
      
      if (movement > 15) {
        setSwipeDirection('right');
      } else if (movement < -15) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection(null);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = Math.abs(touchEnd.y - touchStart.y);
    
    // Only trigger if horizontal swipe is dominant and sufficient
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        navigateToPrevEsim();
      } else {
        // Swipe left - go to next
        navigateToNextEsim();
      }
    }
    
    // Reset touch states and swipe feedback
    setTouchStart(null);
    setTouchEnd(null);
    setSwipeDirection(null);
  };

  // Keyboard navigation and body scroll lock
  useEffect(() => {
    if (!showEsimDetailModal) return;
    
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px'; // Prevent layout shift
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPrevEsim();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToNextEsim();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup: restore body scroll when modal closes
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showEsimDetailModal, selectedEsimForDetail, filteredEsims]);

  const activeEsims = esims.filter(esim => esim.status === 'Active');
  const expiredEsims = esims.filter(esim => esim.status === 'Expired');
  const readyEsims = esims.filter(esim => esim.status === 'Ready');

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
            onClick={() => setLocation('/home')}
            className="text-primary font-medium"
          >
            + Add
          </button>
        }
      />

      <div className="px-4 pt-4">
        {/* Dashboard Stats - Premium Visual Design */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Travel Journey Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm4.64-4.36a.5.5 0 01.72 0L12 12.28l4.64-4.64a.5.5 0 01.72.72L12.72 13a.5.5 0 01-.72 0L7.36 8.36a.5.5 0 010-.72z"/>
                  </svg>
                </div>
                <span className="text-white/90 text-xs font-semibold">Journey</span>
              </div>
              <p className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">{totalEsims}</p>
              <p className="text-white/80 text-xs font-medium leading-tight">Total Plans</p>
            </div>
          </div>

          {/* World Explorer Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="text-white/90 text-xs font-semibold">Explorer</span>
              </div>
              <p className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">{countriesVisited}</p>
              <p className="text-white/80 text-xs font-medium leading-tight">Countries</p>
            </div>
          </div>

          {/* Data Consumption Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <span className="text-white/90 text-xs font-semibold">Usage</span>
              </div>
              <p className="text-3xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                {totalDataUsed.toFixed(0)}<span className="text-lg font-semibold text-white/80">GB</span>
              </p>
              <p className="text-white/80 text-xs font-medium leading-tight">Data Used</p>
            </div>
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
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    {filter === 'all' ? 'My eSIMs' : 
                     filter === 'active' ? 'Active eSIMs' :
                     filter === 'expired' ? 'Expired eSIMs' :
                     filter === 'ready' ? 'Ready eSIMs' : 'My eSIMs'}
                  </h2>
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
                      onClick={() => setFilter('ready')}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        filter === 'ready'
                          ? 'bg-blue-600 dark:bg-blue-500 text-white font-medium'
                          : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                      }`}
                    >
                      {readyEsims.length} ready
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

      {/* Get Support Modal - Airalo Style */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" 
          onClick={() => setShowQuickActions(false)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 9999
          }}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleQuickActionsTouchStart}
            onTouchMove={handleQuickActionsTouchMove}
            onTouchEnd={handleQuickActionsTouchEnd}
            style={{ zIndex: 10000 }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4 pt-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">
                Choose your preferred channel to get help from the support team.
              </p>
            </div>

            {/* Support Options - Airalo Style */}
            <div className="bg-gray-50 dark:bg-gray-800 mx-4 mb-3 rounded-xl overflow-hidden">
              {/* In-app Chat */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setShowInAppSupport(true);
                }}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-900 dark:text-gray-100 font-medium">Chat in the app</span>
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* WhatsApp Support */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  window.open(`https://wa.me/436766440122`, '_blank');
                }}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-gray-900 dark:text-gray-100 font-medium">WhatsApp</span>
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
              </button>
            </div>

            {/* Cancel Button - Airalo Style */}
            <div className="mx-4 mb-4">
              <button 
                onClick={() => setShowQuickActions(false)}
                className="w-full py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Support Screen - eSIMfo Style */}
      {showInAppSupport && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[9999] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">eSIMfo</h1>
            <button
              onClick={() => setShowInAppSupport(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Live Chat Support</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect with our support team for instant assistance with your eSIM queries.
              </p>
              <button
                onClick={() => {
                  setShowInAppSupport(false);
                  window.open(`https://wa.me/436766440122`, '_blank');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* eSIM Detail Modal - Enhanced Animations */}
      {showEsimDetailModal && selectedEsimForDetail && (
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 ${
            isModalExiting ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'
          }`}
          onClick={closeModal}
        >
          <div 
            key={`modal-${selectedEsimForDetail?.id}-${modalAnimationKey}`}
            className={`bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm border border-gray-200 dark:border-gray-700 material-card-elevated overflow-hidden ${
              swipeDirection === 'left' ? 'transform -translate-x-4 transition-transform duration-200 ease-out' : 
              swipeDirection === 'right' ? 'transform translate-x-4 transition-transform duration-200 ease-out' : 
              slideDirection === 'left' ? 'transform -translate-x-full transition-transform duration-300 ease-out' :
              slideDirection === 'right' ? 'transform translate-x-full transition-transform duration-300 ease-out' :
              slideDirection === 'entering-left' ? 'transform -translate-x-full transition-none' :
              slideDirection === 'entering-right' ? 'transform translate-x-full transition-none' :
              'transform translate-x-0 transition-transform duration-300 ease-out'
            }`}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              animation: isTransitioning 
                ? 'none'
                : (isModalExiting 
                  ? 'modalExit 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
                  : 'none')
            }}
          >
            
            {/* Header */}
            <div className="relative p-5 pb-3 border-b border-gray-100 dark:border-gray-800">
              
              {/* Navigation indicators */}
              {filteredEsims.length > 1 && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {filteredEsims.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        selectedEsimForDetail?.id === filteredEsims[index].id
                          ? 'bg-blue-500 dark:bg-blue-400'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-3 pr-10">
                <img 
                  src={selectedEsimForDetail.country?.flagUrl || 'https://flagcdn.com/w320/tr.png'} 
                  alt={selectedEsimForDetail.country?.name} 
                  className="w-10 h-7 rounded object-cover border border-gray-200 dark:border-gray-600" 
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {selectedEsimForDetail.country?.name} eSIM
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      selectedEsimForDetail.status === 'Active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : selectedEsimForDetail.status === 'Expired'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {selectedEsimForDetail.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedEsimForDetail.package?.name}
                  </p>
                </div>
              </div>
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Premium Data & Days Charts Side by Side */}
              <div className="grid grid-cols-2 gap-6">
                {/* Data Usage Circle - Enhanced */}
                <div className="text-center relative">
                  {(() => {
                    const totalGB = parseFloat(selectedEsimForDetail.package?.data?.replace('GB', '') || '5');
                    const total = totalGB * 1000; // Convert GB to MB
                    const used = parseFloat(selectedEsimForDetail.dataUsed || '0');
                    const percentage = Math.min((used / total) * 100, 100);
                    const radius = 32;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (percentage / 100) * circumference;
                    
                    return (
                      <div className="relative mx-auto w-28 h-28 mb-3">
                        {/* Glow Background */}
                        <div 
                          className="absolute inset-0 rounded-full animate-pulse opacity-30"
                          style={{
                            background: `radial-gradient(circle, ${percentage > 80 ? 'rgba(239, 68, 68, 0.3)' : percentage > 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'} 0%, transparent 70%)`,
                            filter: 'blur(15px)'
                          }}
                        ></div>
                        
                        <svg className="w-28 h-28 transform -rotate-90 relative z-10" viewBox="0 0 72 72">
                          <defs>
                            <linearGradient id={`dataGradient-${selectedEsimForDetail.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={percentage > 80 ? "#ef4444" : percentage > 60 ? "#f59e0b" : "#10b981"} />
                              <stop offset="50%" stopColor={percentage > 80 ? "#dc2626" : percentage > 60 ? "#d97706" : "#059669"} />
                              <stop offset="100%" stopColor={percentage > 80 ? "#b91c1c" : percentage > 60 ? "#b45309" : "#047857"} />
                            </linearGradient>
                            <filter id={`dataShadow-${selectedEsimForDetail.id}`}>
                              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={percentage > 80 ? "#ef4444" : percentage > 60 ? "#f59e0b" : "#10b981"} floodOpacity="0.4"/>
                            </filter>
                          </defs>
                          
                          {/* Background Circle */}
                          <circle
                            cx="36" cy="36" r={radius}
                            stroke="rgba(156, 163, 175, 0.2)"
                            strokeWidth="4"
                            fill="transparent"
                          />
                          
                          {/* Progress Circle */}
                          <circle
                            cx="36" cy="36" r={radius}
                            stroke={`url(#dataGradient-${selectedEsimForDetail.id})`}
                            strokeWidth="6"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference * 0.97} ${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-2000 ease-out"
                            filter={`url(#dataShadow-${selectedEsimForDetail.id})`}
                            key={`data-${modalAnimationKey}`}
                            style={{ 
                              '--circumference': `${circumference}px`,
                              '--target-offset': `${strokeDashoffset}px`,
                              strokeDashoffset: circumference,
                              animation: `fillProgress 2s ease-out 0.3s forwards`
                            } as React.CSSProperties}
                          />
                          

                        </svg>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className={`text-xl font-black bg-gradient-to-br ${percentage > 80 ? 'from-red-500 to-red-700' : percentage > 60 ? 'from-amber-500 to-orange-600' : 'from-emerald-500 to-green-600'} bg-clip-text text-transparent`}>
                            {Math.round(percentage)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                            {used.toFixed(0)}MB
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Data Used</div>
                </div>

                {/* Days Remaining Circle - Enhanced */}
                <div className="text-center relative">
                  {(() => {
                    const totalDays = parseInt(selectedEsimForDetail.package?.validity?.split(' ')[0] || '30');
                    const daysUsed = Math.min(Math.floor(totalDays * 0.4), totalDays); // Mock: 40% used
                    const daysRemaining = totalDays - daysUsed;
                    const daysPercentage = (daysUsed / totalDays) * 100;
                    const radius = 32;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (daysPercentage / 100) * circumference;
                    
                    return (
                      <div className="relative mx-auto w-28 h-28 mb-3">
                        {/* Glow Background */}
                        <div 
                          className="absolute inset-0 rounded-full animate-pulse opacity-30"
                          style={{
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                            filter: 'blur(15px)'
                          }}
                        ></div>
                        
                        <svg className="w-28 h-28 transform -rotate-90 relative z-10" viewBox="0 0 72 72">
                          <defs>
                            <linearGradient id={`daysGradient-${selectedEsimForDetail.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="50%" stopColor="#2563eb" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                            <filter id={`daysShadow-${selectedEsimForDetail.id}`}>
                              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#3b82f6" floodOpacity="0.4"/>
                            </filter>
                          </defs>
                          
                          {/* Background Circle */}
                          <circle
                            cx="36" cy="36" r={radius}
                            stroke="rgba(156, 163, 175, 0.2)"
                            strokeWidth="4"
                            fill="transparent"
                          />
                          
                          {/* Progress Circle */}
                          <circle
                            cx="36" cy="36" r={radius}
                            stroke={`url(#daysGradient-${selectedEsimForDetail.id})`}
                            strokeWidth="6"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference * 0.97} ${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-2000 ease-out"
                            filter={`url(#daysShadow-${selectedEsimForDetail.id})`}
                            key={`days-${modalAnimationKey}`}
                            style={{ 
                              '--circumference': `${circumference}px`,
                              '--target-offset': `${strokeDashoffset}px`,
                              strokeDashoffset: circumference,
                              animation: `fillProgress 2s ease-out 0.5s forwards`
                            } as React.CSSProperties}
                          />
                          

                          
                          {/* Clock Icon in Center */}
                          <g transform="translate(36,36)" className="text-blue-600 dark:text-blue-400" opacity="0.05">
                            <circle r="12" fill="currentColor"/>
                            <path d="M0,-8 L0,-4 L4,-4" stroke="#3b82f6" strokeWidth="1" fill="none" strokeLinecap="round"/>
                          </g>
                        </svg>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-xl font-black bg-gradient-to-br from-blue-500 to-blue-700 bg-clip-text text-transparent">
                            {daysRemaining}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                            days
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Days Left</div>
                </div>
              </div>



              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {(() => {
                  const totalGB = parseFloat(selectedEsimForDetail.package?.data?.replace('GB', '') || '5');
                  const total = totalGB * 1000;
                  const used = parseFloat(selectedEsimForDetail.dataUsed || '0');
                  const totalDays = parseInt(selectedEsimForDetail.package?.validity?.split(' ')[0] || '30');
                  
                  return (
                    <>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {(total - used).toFixed(0)}MB
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {totalDays}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Days Total</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {(used / Math.max(1, Math.floor(totalDays * 0.3))).toFixed(0)}MB
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Avg/Day</div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* SMS and Voice Usage for Full Plans - Linear Progress Bars */}
              {(selectedEsimForDetail.package?.smsIncluded || selectedEsimForDetail.package?.voiceIncluded) && (
                <div className="space-y-3 mt-4">
                  {/* SMS Usage */}
                  {selectedEsimForDetail.package?.smsIncluded && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {selectedEsimForDetail.smsUsed || 0} / {selectedEsimForDetail.package.smsIncluded} SMS
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round(((selectedEsimForDetail.smsUsed || 0) / selectedEsimForDetail.package.smsIncluded) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 transition-all duration-500"
                          style={{ width: `${Math.min(((selectedEsimForDetail.smsUsed || 0) / selectedEsimForDetail.package.smsIncluded) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Voice Usage */}
                  {selectedEsimForDetail.package?.voiceIncluded && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {selectedEsimForDetail.voiceUsed || 0} / {selectedEsimForDetail.package.voiceIncluded} min
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round(((selectedEsimForDetail.voiceUsed || 0) / selectedEsimForDetail.package.voiceIncluded) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
                          style={{ width: `${Math.min(((selectedEsimForDetail.voiceUsed || 0) / selectedEsimForDetail.package.voiceIncluded) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    closeModal();
                    handleViewQR(selectedEsimForDetail);
                  }}
                  className="flex items-center justify-center space-x-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span>QR Code</span>
                </button>
                
                <button
                  onClick={() => {
                    // Close detail modal first, then open checkout
                    setShowEsimDetailModal(false);
                    setShowTopUpCheckout(true);
                  }}
                  className="flex items-center justify-center space-x-2 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors text-sm"
                  data-testid="button-topup-esim"
                >
                  <Plus className="w-4 h-4" />
                  <span>Top Up</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Checkout Modal */}
      {showTopUpCheckout && selectedEsimForDetail && selectedEsimForDetail.package && (
        <CheckoutModal
          isOpen={showTopUpCheckout}
          onClose={() => {
            setShowTopUpCheckout(false);
            // Reopen detail modal when checkout is closed
            setShowEsimDetailModal(true);
          }}
          selectedPackage={{
            ...selectedEsimForDetail.package,
            duration: selectedEsimForDetail.package.validity,
            price: selectedEsimForDetail.package.price.toString()
          }}
          country={selectedEsimForDetail.country}
          esimCount={topUpEsimCount}
          setEsimCount={setTopUpEsimCount}
          onComplete={() => {
            setShowTopUpCheckout(false);
            // Close both modals after successful purchase
            closeModal();
            // Could add success toast here
          }}
          hideQuantitySelector={true}
        />
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
