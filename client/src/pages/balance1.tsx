import { useState, useRef, useEffect } from 'react';
import { useLocation } from "wouter";
import texturePattern from '@/assets/texture-pattern.jpeg';
import AddMoneyModal from '@/components/add-money-modal';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';
import TabBar from '@/components/tab-bar';
import MobileContainer from '@/components/mobile-container';

export default function Balance1Screen() {
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [balance, setBalance] = useState(75.92);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [isBalanceAnimating, setIsBalanceAnimating] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [location, setLocation] = useLocation();
  
  // Touch/swipe states for quick actions modal
  const [quickActionsStartY, setQuickActionsStartY] = useState<number>(0);
  const [quickActionsCurrentY, setQuickActionsCurrentY] = useState<number>(0);
  const [isQuickActionsDragging, setIsQuickActionsDragging] = useState<boolean>(false);
  const quickActionsModalRef = useRef<HTMLDivElement>(null);
  
  const { displayValue } = useAnimatedCounter({
    targetValue: balance,
    duration: 1500,
    startAnimation: animationTrigger
  });

  const handleTopUpComplete = (amount: number, bonus: number = 0) => {
    const newBalance = balance + amount + bonus;
    setBalance(newBalance);
    setAnimationTrigger(true);
    setIsBalanceAnimating(true);
    
    // Reset animation trigger after animation completes
    setTimeout(() => {
      setAnimationTrigger(false);
      setIsBalanceAnimating(false);
    }, 1600);
  };

  // Quick Actions modal touch handlers
  const handleQuickActionsModalTouchStart = (e: React.TouchEvent) => {
    setQuickActionsStartY(e.touches[0].clientY);
    setIsQuickActionsDragging(false);
  };

  const handleQuickActionsModalTouchMove = (e: React.TouchEvent) => {
    if (!isQuickActionsDragging) {
      setIsQuickActionsDragging(true);
    }
    setQuickActionsCurrentY(e.touches[0].clientY);
    
    const deltaY = e.touches[0].clientY - quickActionsStartY;
    if (deltaY > 0 && quickActionsModalRef.current) {
      quickActionsModalRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleQuickActionsModalTouchEnd = () => {
    if (isQuickActionsDragging) {
      const deltaY = quickActionsCurrentY - quickActionsStartY;
      if (deltaY > 100) {
        setShowQuickActions(false);
      }
      
      if (quickActionsModalRef.current) {
        quickActionsModalRef.current.style.transform = 'translateY(0px)';
      }
    }
    setIsQuickActionsDragging(false);
  };

  // Body scroll lock effect
  useEffect(() => {
    if (showQuickActions) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [showQuickActions]);
  return (
    <MobileContainer>
      <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Sophisticated Blue Gradient Header - includes status bar */}
      <div className="relative overflow-hidden">
        {/* Base blue background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"></div>
        
        {/* Animated Background image pattern */}
        <div 
          className="absolute inset-0 opacity-75"
          style={{
            backgroundImage: `url(${texturePattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'multiply',
            animation: 'textureFloat 6s ease-in-out infinite'
          }}
        ></div>
        
        <div className={`relative z-10 px-6 pt-8 pb-16 ${isBalanceAnimating ? 'balance-container-animate' : ''}`}>
          {/* Welcome Message - Professional Typography */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
              </div>
              <div className="leading-tight">
                <div className="text-white/90 text-base font-medium">Welcome back,</div>
                <div className="text-white text-xl font-bold tracking-tight">Cassie!</div>
              </div>
            </div>
          </div>

          {/* 2. Elegant Balance Display */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <span className="text-white/80 text-base font-medium">Balance</span>
              <div className="w-1 h-1 bg-white/60 rounded-full mx-3"></div>
              <span className="text-white/80 text-base font-medium">EUR</span>
              <svg className="w-4 h-4 text-white/60 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className={`text-white text-6xl font-black tracking-tighter leading-none transition-all duration-200 ${isBalanceAnimating ? 'balance-animate' : ''}`}>€{displayValue.toFixed(2)}</div>
          </div>
          
          {/* 3. Action Buttons - smaller and left aligned */}
          <div className="flex justify-start space-x-6">
            <button 
              onClick={() => setIsAddMoneyModalOpen(true)}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20 transition-all duration-200 group-hover:bg-white/30 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 group-active:bg-white/40">
                <svg className="w-5 h-5 text-white transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium transition-all duration-200 group-hover:text-white group-hover:font-semibold">Add money</span>
            </button>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium">Buy eSIM</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium">History</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content area with rounded top corners */}
      <div className="bg-gray-50 -mt-6 rounded-t-3xl relative z-20 pt-6 px-4">
        <p className="text-gray-600">Buraya sonraki adımları ekleyeceğiz...</p>
      </div>

      {/* Add Money Modal */}
      <AddMoneyModal 
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        onTopUpComplete={handleTopUpComplete}
      />
      </div>
      
      {/* Quick Actions Modal */}
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
            ref={quickActionsModalRef}
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleQuickActionsModalTouchStart}
            onTouchMove={handleQuickActionsModalTouchMove}
            onTouchEnd={handleQuickActionsModalTouchEnd}
            style={{ zIndex: 10000 }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quick Actions</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Choose your eSIM category to get started</p>
            </div>

            {/* Action Items */}
            <div className="px-6 pb-8 space-y-3">
              {/* Local eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/destinations?tab=countries');
                }}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">Local eSIMs</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Regional eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/destinations?tab=regional');
                }}
                className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 rounded-2xl p-4 border border-green-200 dark:border-green-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">Regional eSIMs</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Global eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/destinations?tab=global');
                }}
                className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">Global eSIMs</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage plans</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <TabBar 
        onPlusClick={() => setShowQuickActions(true)}
        onShopClick={() => {}}
      />
    </MobileContainer>
  );
}