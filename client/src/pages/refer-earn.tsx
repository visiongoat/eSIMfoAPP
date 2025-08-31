import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Copy, Share, Users, Gift, Clock, CheckCircle } from "lucide-react";
import type { User } from "@shared/schema";
import TabBar from "@/components/tab-bar";

export default function ReferEarnScreen() {
  const [, setLocation] = useLocation();
  const [showReferralLink, setShowReferralLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'how-it-works' | 'history'>('dashboard');
  
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
      
      {/* Sticky Tab Bar - Copied from /home */}
      <TabBar 
        onPlusClick={() => {
          // Quick actions functionality can be added here
          console.log('Plus button clicked from refer-earn');
        }}
        onShopClick={() => {
          // Shop button functionality 
          setLocation('/home');
        }}
      />
    </div>
  );
}