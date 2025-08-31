import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Copy, Share, Users, Gift, Clock, CheckCircle } from "lucide-react";
import type { User } from "@shared/schema";
import TabBar from "@/components/tab-bar";

export default function ReferEarnScreen() {
  const [, setLocation] = useLocation();
  const [showReferralLink, setShowReferralLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'how-it-works' | 'history'>('dashboard');
  
  // Quick Actions modal states - copied from home.tsx
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [quickActionsStartY, setQuickActionsStartY] = useState<number>(0);
  const [quickActionsCurrentY, setQuickActionsCurrentY] = useState<number>(0);
  const [isQuickActionsDragging, setIsQuickActionsDragging] = useState<boolean>(false);
  const quickActionsModalRef = useRef<HTMLDivElement>(null);
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/profile"],
  });

  const { data: referralStats } = useQuery({
    queryKey: ["/api/referrals/stats"],
  });

  const { data: referralHistory = [] } = useQuery({
    queryKey: ["/api/referrals/history"],
  });

  // Use data from API or fallback
  const referralCode = referralStats?.referralCode || 'USER1234';
  const referralLink = `esimfo.com/r/${referralCode}`;
  
  const creditSummary = {
    available: referralStats?.availableCredit || 0,
    pending: referralStats?.pendingCredit || 0,
    used: referralStats?.usedCredit || 0,
    monthlyEarned: referralStats?.monthlyEarned || 0,
    monthlyLimit: referralStats?.monthlyLimit || 30.00
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    // Show success feedback
    setShowReferralLink(true);
    setTimeout(() => setShowReferralLink(false), 2000);
  };

  const handleShare = () => {
    const message = `Get €3 off your first eSIM! Join eSIMfo with my referral link: ${referralLink}`;
    if (navigator.share) {
      navigator.share({
        title: 'Get €3 off your first eSIM',
        text: message,
        url: referralLink
      });
    } else {
      navigator.clipboard.writeText(message);
    }
  };

  // Quick Actions modal swipe handlers - copied from home.tsx
  const handleQuickActionsModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setQuickActionsStartY(touch.clientY);
    setQuickActionsCurrentY(touch.clientY);
    setIsQuickActionsDragging(true);
  };

  const handleQuickActionsModalTouchMove = (e: React.TouchEvent) => {
    if (!isQuickActionsDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - quickActionsStartY;
    
    setQuickActionsCurrentY(touch.clientY);
    
    // Only allow downward swipes (positive deltaY)
    if (deltaY > 0) {
      e.preventDefault(); // Prevent body scroll during drag
      
      if (quickActionsModalRef.current) {
        quickActionsModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        quickActionsModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleQuickActionsModalTouchEnd = (e: React.TouchEvent) => {
    if (!isQuickActionsDragging) return;
    
    const deltaY = quickActionsCurrentY - quickActionsStartY;
    
    // If swiped down more than 80px, close modal
    if (deltaY > 80 && quickActionsModalRef.current) {
      // Animate out
      quickActionsModalRef.current.style.transform = 'translateY(100%)';
      quickActionsModalRef.current.style.opacity = '0';
      setTimeout(() => {
        setShowQuickActions(false);
      }, 200);
    } else if (quickActionsModalRef.current) {
      // Snap back to original position
      quickActionsModalRef.current.style.transform = 'translateY(0)';
      quickActionsModalRef.current.style.opacity = '1';
    }
    
    setIsQuickActionsDragging(false);
    setQuickActionsStartY(0);
    setQuickActionsCurrentY(0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>;
      case 'available':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>;
      case 'used':
        return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Used</span>;
      default:
        return null;
    }
  };

  return (
    <div className="mobile-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow-sm">
        <button onClick={() => setLocation('/profile')} className="p-1.5">
          <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Refer & Earn</h1>
        <div className="w-9"></div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pt-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'how-it-works'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            How it Works
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Get €3 credit. Give €3 credit.</h2>
              <p className="text-orange-100 text-sm">Share your link. Your friend gets €3 off their first plan. You get €3 credit when they buy.</p>
            </div>

            {/* Referral Code & Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Your referral code</p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">{referralCode}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {showReferralLink && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 text-center">
                  <p className="text-green-700 dark:text-green-400 text-sm font-medium">Link copied to clipboard!</p>
                </div>
              )}
            </div>

            {/* Credit Summary */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Available Credits</p>
                    <p className="text-2xl font-bold text-green-600">€{creditSummary.available.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Gift className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-xl font-bold text-yellow-600">€{creditSummary.pending.toFixed(2)}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Used</p>
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-600">€{creditSummary.used.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Monthly Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-900 dark:text-white">Monthly Progress</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  €{creditSummary.monthlyEarned.toFixed(2)} / €{creditSummary.monthlyLimit.toFixed(2)}
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(creditSummary.monthlyEarned / creditSummary.monthlyLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Invite more friends and unlock more credits!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'how-it-works' && (
          <div className="space-y-6">
            {/* Steps */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Share your link</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Send your referral link to friends via WhatsApp, email, or social media.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Friend gets €3 off</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Your friend receives €3 discount on their first eSIM purchase.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">You get €3 credit</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">You receive €3 credit once their order is confirmed (after 7 days).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Terms & Conditions</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Credits are valid only on eSIMfo purchases</li>
                <li>• Pending credits become available after 7 days</li>
                <li>• Self-referrals are not allowed</li>
                <li>• Maximum reward per user: €30/month</li>
                <li>• Credits expire after 12 months of inactivity</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">Referral History</h2>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{referralHistory.length} referrals</span>
              </div>
            </div>

            {referralHistory.map((referral) => (
              <div key={referral.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{referral.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{referral.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">€{referral.amount.toFixed(2)}</p>
                    {getStatusBadge(referral.status)}
                  </div>
                </div>
              </div>
            ))}

            {referralHistory.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No referrals yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Start sharing your link to see your referral history here.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Quick Actions Modal - Copied from /home */}
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
                  setLocation('/home?tab=local');
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
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Local eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Regional eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/home?tab=regional');
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
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regional eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Global eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/home?tab=global');
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

      {/* Sticky Tab Bar - Copied from /home */}
      <TabBar 
        onPlusClick={() => {
          setShowQuickActions(true);
        }}
        onShopClick={() => {
          // Shop button functionality 
          setLocation('/home');
        }}
      />
    </div>
  );
}