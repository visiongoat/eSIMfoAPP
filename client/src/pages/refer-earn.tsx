import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Copy, Share, Users, Gift, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";
import TabBar from "@/components/tab-bar";

export default function ReferEarnScreen() {
  const [, setLocation] = useLocation();
  const [showReferralLink, setShowReferralLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'how-it-works' | 'history'>('dashboard');
  const { toast } = useToast();
  
  // Quick Actions modal states - copied from home.tsx
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [quickActionsStartY, setQuickActionsStartY] = useState<number>(0);
  const [quickActionsCurrentY, setQuickActionsCurrentY] = useState<number>(0);
  const [isQuickActionsDragging, setIsQuickActionsDragging] = useState<boolean>(false);
  const quickActionsModalRef = useRef<HTMLDivElement>(null);
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/profile"],
  });

  const { data: referralStats } = useQuery<any>({
    queryKey: ["/api/referrals/stats"],
  });

  const { data: referralHistory = [] } = useQuery<any[]>({
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      // Haptic feedback for mobile
      if (navigator.vibrate) navigator.vibrate(50);
      
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard",
        variant: "default",
      });
      
      setShowReferralLink(true);
      setTimeout(() => setShowReferralLink(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      // Haptic feedback for mobile
      if (navigator.vibrate) navigator.vibrate(50);
      
      toast({
        title: "Code Copied!",
        description: "Referral code copied to clipboard",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const message = `Get €3 off your first eSIM! Join eSIMfo with my referral link: ${referralLink}`;
    if (navigator.share) {
      navigator.share({
        title: 'Get €3 off your first eSIM',
        text: message,
        url: referralLink
      }).then(() => {
        // Haptic feedback for mobile
        if (navigator.vibrate) navigator.vibrate(50);
        
        toast({
          title: "Shared!",
          description: "Thanks for sharing eSIMfo",
          variant: "default",
        });
      });
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
    <>
      <div className="mobile-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
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
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'how-it-works'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              How it Works
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Hero Section with reduced saturation */}
              <div className="bg-gradient-to-r from-orange-400/80 to-orange-500/80 dark:from-orange-400/60 dark:to-orange-500/60 rounded-2xl p-6 text-white">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Earn €3 per referral</h2>
                  <p className="text-orange-100 mb-4">Share your link and earn credit for every friend who joins eSIMfo</p>
                  
                  {/* Equal width CTA buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 bg-white text-orange-500 font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      aria-label="Copy referral link"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 bg-orange-600/20 text-white border-2 border-white/30 font-semibold py-3 px-4 rounded-xl hover:bg-orange-600/30 transition-all duration-200 flex items-center justify-center gap-2"
                      aria-label="Share referral link"
                    >
                      <Share className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Referral Code Section - Monospace font with mini copy icon */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Referral Code</h3>
                <div 
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 relative"
                  onClick={handleCopyCode}
                  aria-label="Tap to copy referral code"
                >
                  <code className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
                    {referralCode}
                  </code>
                  <Copy className="w-4 h-4 text-gray-400 absolute top-3 right-3" />
                </div>
              </div>

              {/* Available Credits - smaller heading */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Credits</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">€{creditSummary.available.toFixed(2)}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" strokeWidth={2} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">€{creditSummary.pending.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" strokeWidth={2} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">€{creditSummary.used.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Monthly Progress - Thinner progress bar (1.5px) */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">This Month</h3>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">€{creditSummary.monthlyEarned.toFixed(2)}</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full" style={{ height: '1.5px' }}>
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min((creditSummary.monthlyEarned / creditSummary.monthlyLimit) * 100, 100)}%`,
                      height: '1.5px'
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    €0
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Max €{creditSummary.monthlyLimit.toFixed(0)}/mo credit
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* How it Works Tab */}
          {activeTab === 'how-it-works' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How it Works</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-2">
                      <Share className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Share Your Link</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Send your unique referral link to friends via social media, email, or messaging apps.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Friends Join</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">When someone uses your link to create an account, they get €3 off their first purchase.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                      <Gift className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">You Earn Credit</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Once they make their first purchase, you receive €3 credit to use on your next eSIM purchase.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">Terms & Conditions</h4>
                    <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                      <li>• Credits expire 1 year after being earned</li>
                      <li>• Maximum €30 in referral credits per month</li>
                      <li>• Referral must make a purchase to qualify</li>
                      <li>• Credits cannot be transferred or exchanged for cash</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Referral History</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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

        <TabBar 
          onPlusClick={() => setShowQuickActions(true)}
          onShopClick={() => setLocation('/home')}
        />
      </div>

      {/* Quick Actions Modal - copied from home.tsx */}
      {showQuickActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div
            ref={quickActionsModalRef}
            className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-6 pb-8 transform transition-transform duration-300 ease-out"
            onTouchStart={handleQuickActionsModalTouchStart}
            onTouchMove={handleQuickActionsModalTouchMove}
            onTouchEnd={handleQuickActionsModalTouchEnd}
          >
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors duration-200"
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/destinations');
                }}
              >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  🌍
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Browse eSIMs</span>
              </button>
              
              <button 
                className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/my-esim');
                }}
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  📱
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">My eSIMs</span>
              </button>
              
              <button 
                className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/refer-earn');
                }}
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  💰
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Refer & Earn</span>
              </button>
              
              <button 
                className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200"
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/support');
                }}
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  🎧
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Support</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}