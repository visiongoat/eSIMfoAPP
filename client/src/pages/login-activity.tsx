import { useState, useRef } from "react";
import { useLocation } from "wouter";
import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  timestamp: Date;
  status: 'active' | 'completed';
  browser: string;
  os: string;
}

export default function LoginActivity() {
  const [, setLocation] = useLocation();

  // Quick Actions modal states - copied from home.tsx
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [quickActionsStartY, setQuickActionsStartY] = useState<number>(0);
  const [quickActionsCurrentY, setQuickActionsCurrentY] = useState<number>(0);
  const [isQuickActionsDragging, setIsQuickActionsDragging] = useState<boolean>(false);
  const quickActionsModalRef = useRef<HTMLDivElement>(null);

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

  // Mock login activity data - in real app this would come from API
  const loginSessions: LoginSession[] = [
    {
      id: '1',
      device: 'iPhone 14 Pro',
      location: 'Istanbul, Turkey',
      ip: '176.88.45.123',
      timestamp: new Date(),
      status: 'active',
      browser: 'Safari',
      os: 'iOS 17.2'
    },
    {
      id: '2',
      device: 'MacBook Pro',
      location: 'Ankara, Turkey',
      ip: '85.105.23.67',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'completed',
      browser: 'Chrome',
      os: 'macOS 14.2'
    },
    {
      id: '3',
      device: 'Windows PC',
      location: 'Izmir, Turkey',
      ip: '178.242.89.156',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: 'completed',
      browser: 'Firefox',
      os: 'Windows 11'
    },
    {
      id: '4',
      device: 'Samsung Galaxy S24',
      location: 'Antalya, Turkey',
      ip: '88.237.156.89',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      status: 'completed',
      browser: 'Chrome Mobile',
      os: 'Android 14'
    },
    {
      id: '5',
      device: 'iPad Air',
      location: 'Bursa, Turkey',
      ip: '213.74.98.123',
      timestamp: new Date(Date.now() - 604800000), // 1 week ago
      status: 'completed',
      browser: 'Safari',
      os: 'iPadOS 17.2'
    }
  ];

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString();
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Samsung') || device.includes('Android')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm2 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (device.includes('iPad')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zM4 4a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm6 11a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Login Activity"
        showBackButton={true}
        onBackClick={() => setLocation('/personal-info')}
      />

      <div className="px-6 pt-4 pb-28 space-y-6">
        {/* Current Session Info */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">Current Session</h3>
              <p className="text-sm text-green-700 dark:text-green-300">This device is currently signed in</p>
            </div>
          </div>
          
          {loginSessions.filter(session => session.status === 'active').map(session => (
            <div key={session.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-green-600 dark:text-green-400">
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">{session.device}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{session.browser} • {session.os}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">{formatRelativeTime(session.timestamp)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Active now</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
                <span>{session.location}</span>
                <span>{session.ip}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Sessions</h3>
          
          {loginSessions.filter(session => session.status === 'completed').map((session, index) => (
            <div key={session.id} className={`py-3 ${index !== loginSessions.filter(s => s.status === 'completed').length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500 dark:text-gray-400">
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{session.device}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session.browser} • {session.os}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatRelativeTime(session.timestamp)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Signed out</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{session.location}</span>
                <span>{session.ip}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Security Reminder</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                If you notice any suspicious activity or unrecognized devices, please change your password immediately and contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Modal - Copied from home.tsx */}
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

      {/* Sticky Tab Bar - Copied from home.tsx */}
      <TabBar 
        onPlusClick={() => {
          setShowQuickActions(true);
        }}
        onShopClick={() => {
          setLocation('/home');
        }}
      />
    </div>
  );
}