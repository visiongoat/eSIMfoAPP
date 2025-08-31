import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import NavigationBar from "@/components/navigation-bar";
import { getTravelerLevel, TRAVELER_LEVELS } from "@shared/schema";
import type { User } from "@shared/schema";
import TabBar from "@/components/tab-bar";

export default function TravelerLevelsScreen() {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery<User>({
    queryKey: ["/api/profile"],
  });

  const totalSpent = parseFloat(user?.totalSpent || "0");
  const currentLevel = getTravelerLevel(totalSpent);

  // Quick Actions modal states - copied from refer-earn.tsx
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [quickActionsStartY, setQuickActionsStartY] = useState<number>(0);
  const [quickActionsCurrentY, setQuickActionsCurrentY] = useState<number>(0);
  const [isQuickActionsDragging, setIsQuickActionsDragging] = useState<boolean>(false);
  const quickActionsModalRef = useRef<HTMLDivElement>(null);

  // Quick Actions modal swipe handlers - copied from refer-earn.tsx
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

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Traveler Levels"
        leftButton={
          <button 
            onClick={() => setLocation('/profile')}
            className="text-primary"
            data-testid="button-back"
          >
            ← Back
          </button>
        }
      />

      <div className="px-4 pt-4 pb-1">
        {/* Current Level Card */}
        <div className="mobile-card p-6 mb-4 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700">
          <div className="text-4xl mb-2">{currentLevel.emoji}</div>
          <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100">
            You are a {currentLevel.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-3">{currentLevel.description}</p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Spent: <span className="font-semibold">€{totalSpent.toFixed(0)}</span>
          </div>
        </div>

        {/* All Levels */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">All Traveler Levels</h3>
          
          {TRAVELER_LEVELS.map((level, index) => {
            const isCurrentLevel = level.key === currentLevel.key;
            const isUnlocked = totalSpent >= level.minSpent;
            const isNextLevel = !isUnlocked && level.minSpent > currentLevel.minSpent && 
              TRAVELER_LEVELS.findIndex(l => l.minSpent > currentLevel.minSpent && l.minSpent <= totalSpent) === -1 &&
              TRAVELER_LEVELS.findIndex(l => l.minSpent > currentLevel.minSpent) === index;

            return (
              <div 
                key={level.key}
                className={`mobile-card p-4 border-l-4 ${
                  isCurrentLevel 
                    ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10' 
                    : isUnlocked
                    ? 'border-l-gray-400 bg-gray-50 dark:bg-gray-800/50'
                    : isNextLevel
                    ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
                    : 'border-l-gray-200 dark:border-l-gray-700'
                }`}
                data-testid={`card-level-${level.key}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      isCurrentLevel
                        ? 'bg-green-100 dark:bg-green-800 border-2 border-green-500'
                        : isUnlocked
                        ? `${
                            level.color === 'gray' ? 'bg-gray-100 dark:bg-gray-700' :
                            level.color === 'blue' ? 'bg-blue-100 dark:bg-blue-800' :
                            level.color === 'purple' ? 'bg-purple-100 dark:bg-purple-800' :
                            level.color === 'gold' ? 'bg-yellow-100 dark:bg-yellow-800' :
                            'bg-gray-100 dark:bg-gray-700'
                          }`
                        : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                    }`}>
                      {level.emoji}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {level.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {level.description}
                      </p>
                    </div>
                  </div>
                  
                  {isCurrentLevel && (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 text-sm font-medium">
                      <span>Current</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {isNextLevel && (
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Next Level
                    </div>
                  )}
                </div>

                {/* Spending Requirement */}
                <div className="mb-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Spending Requirement
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    €{level.minSpent}{level.maxSpent ? ` - €${level.maxSpent}` : '+'}
                  </div>
                </div>

                {/* Benefits */}
                {level.benefits && level.benefits.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Benefits
                    </div>
                    <div className="space-y-1">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            isUnlocked ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <span className={
                            isUnlocked 
                              ? 'text-gray-900 dark:text-gray-100' 
                              : 'text-gray-500 dark:text-gray-500'
                          }>
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unlock Status */}
                {!isUnlocked && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Spend €{(level.minSpent - totalSpent).toFixed(0)} more to unlock
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Keep Exploring - Original Design */}
        <div className="mobile-card p-4 mt-4 mb-1 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="text-2xl mb-2">🌍</div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Keep Exploring!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The more you travel with eSIMfo, the more exclusive benefits you unlock. 
            Each purchase brings you closer to your next traveler level!
          </p>
        </div>
      </div>

      {/* Quick Actions Modal - Copied from refer-earn.tsx */}
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

      {/* Sticky Tab Bar - Copied from refer-earn.tsx */}
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