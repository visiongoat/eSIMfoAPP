import { useState, useRef, useEffect } from 'react';
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import texturePattern from '@/assets/texture-pattern.jpeg';
// Using a placeholder for profile image since the original asset may not exist
// import profileImage from "@assets/IMG_5282_1753389516466.jpeg";
import AddMoneyModal from '@/components/add-money-modal';
import RedeemCodeModal from '@/components/redeem-code-modal';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';
import TabBar from '@/components/tab-bar';
import MobileContainer from '@/components/mobile-container';
import type { User } from "@shared/schema";

export default function Balance1Screen() {
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isRedeemCodeModalOpen, setIsRedeemCodeModalOpen] = useState(false);
  const [balance, setBalance] = useState(75.92);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [isBalanceAnimating, setIsBalanceAnimating] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showInAppSupport, setShowInAppSupport] = useState(false);
  const [location, setLocation] = useLocation();
  
  // Get user profile data for avatar
  const { data: profile } = useQuery<User>({
    queryKey: ["/api/profile"],
  });
  
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 1. Sophisticated Blue Gradient Header - includes status bar */}
      <div className="relative overflow-hidden">
        {/* Base blue background with dark mode support */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 dark:from-blue-800 dark:via-blue-900 dark:to-slate-900"></div>
        
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
              <div className="w-12 h-12 rounded-full mr-4 shadow-lg overflow-hidden border-2 border-orange-400 dark:border-orange-500 shadow-orange-400/50 dark:shadow-orange-500/50">
                <img 
                  src={profile?.avatar || "/attached_assets/profilfoto.jpg"} 
                  alt="Profile Photo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg" style={{display: 'none'}}>
                  {profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JD'}
                </div>
              </div>
              <div className="leading-tight">
                <div className="text-white/90 dark:text-white/95 text-base font-medium">Welcome back,</div>
                <div className="text-white dark:text-white text-xl font-bold tracking-tight">John Doe!</div>
              </div>
            </div>
          </div>

          {/* 2. Elegant Balance Display */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <span className="text-white/80 dark:text-white/90 text-base font-medium">Balance</span>
              <div className="w-1 h-1 bg-white/60 dark:bg-white/70 rounded-full mx-3"></div>
              <span className="text-white/80 dark:text-white/90 text-base font-medium">EUR</span>
              <svg className="w-4 h-4 text-white/60 dark:text-white/70 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className={`text-white dark:text-white text-6xl font-black tracking-tighter leading-none transition-all duration-200 ${isBalanceAnimating ? 'balance-animate' : ''}`}>€{displayValue.toFixed(2)}</div>
          </div>
          
          {/* 3. Action Buttons - smaller and left aligned */}
          <div className="flex justify-start space-x-6">
            <button 
              onClick={() => setIsAddMoneyModalOpen(true)}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 bg-white/15 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20 dark:border-white/30 transition-all duration-200 group-hover:bg-white/30 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 group-active:bg-white/40">
                <svg className="w-5 h-5 text-white dark:text-white transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-white/90 dark:text-white/95 text-xs font-medium transition-all duration-200 group-hover:text-white group-hover:font-semibold">Add money</span>
            </button>
            
            <button 
              onClick={() => setLocation('/destinations')}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 bg-white/15 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20 dark:border-white/30 transition-all duration-200 group-hover:bg-white/30 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 group-active:bg-white/40">
                <svg className="w-5 h-5 text-white dark:text-white transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white/90 dark:text-white/95 text-xs font-medium transition-all duration-200 group-hover:text-white group-hover:font-semibold">Buy eSIM</span>
            </button>
            
            <button 
              onClick={() => setIsRedeemCodeModalOpen(true)}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 bg-white/15 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20 dark:border-white/30 transition-all duration-200 group-hover:bg-white/30 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 group-active:bg-white/40">
                <svg className="w-5 h-5 text-white dark:text-white transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <span className="text-white/90 dark:text-white/95 text-xs font-medium transition-all duration-200 group-hover:text-white group-hover:font-semibold">Redeem Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content area with rounded top corners */}
      <div className="bg-gray-50 dark:bg-gray-900 -mt-6 rounded-t-3xl relative z-20 pt-6 px-4 pb-5">
        {/* Transaction History */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Transaction History</h3>
          
          {/* Transaction List */}
          <div className="space-y-3">
            {/* Redeem Code Top-up */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Redeem Code • WELCOME10</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jan 9, 2025 • 20:15</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-orange-600 dark:text-orange-400">+€10.00</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Promo bonus</p>
              </div>
            </div>

            {/* Balance Top-up */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Balance Top-up</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jan 8, 2025 • 14:25</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400">+€105.00</p>
                <p className="text-xs text-green-600 dark:text-green-400">+€5 bonus</p>
              </div>
            </div>

            {/* eSIM Purchase */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Turkey eSIM • 5GB</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jan 7, 2025 • 09:15</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600 dark:text-red-400">-€12.50</p>
              </div>
            </div>

            {/* Balance Top-up */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Balance Top-up</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jan 5, 2025 • 16:42</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400">+€30.00</p>
              </div>
            </div>

            {/* eSIM Purchase */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Europe eSIM • 10GB</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jan 3, 2025 • 11:30</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600 dark:text-red-400">-€25.00</p>
              </div>
            </div>

            {/* Balance Top-up */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Balance Top-up</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dec 28, 2024 • 10:15</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400">+€50.00</p>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <button 
            onClick={() => setLocation('/transactions')}
            className="w-full mt-4 py-3 text-blue-600 dark:text-blue-400 font-medium text-center border border-blue-200 dark:border-blue-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
          >
            View All Transactions
          </button>
        </div>
      </div>

      {/* Add Money Modal */}
      <AddMoneyModal 
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        onTopUpComplete={handleTopUpComplete}
      />
      </div>
      
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

      {/* Add Money Modal */}
      <AddMoneyModal 
        isOpen={isAddMoneyModalOpen} 
        onClose={() => setIsAddMoneyModalOpen(false)}
        onTopUpComplete={handleTopUpComplete}
      />

      {/* Redeem Code Modal */}
      <RedeemCodeModal 
        isOpen={isRedeemCodeModalOpen} 
        onClose={() => setIsRedeemCodeModalOpen(false)}
        onRedeemSuccess={handleTopUpComplete}
      />

      {/* Bottom Navigation */}
      <TabBar 
        onPlusClick={() => setShowQuickActions(true)}
        onShopClick={() => setLocation('/home')}
      />
    </MobileContainer>
  );
}