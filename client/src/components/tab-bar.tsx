import { useLocation } from "wouter";
import { useHaptic } from "@/hooks/use-haptic";

export default function TabBar() {
  const [location, setLocation] = useLocation();
  const { hapticFeedback } = useHaptic();

  const tabs = [
    { 
      id: 'shop', 
      label: 'Shop', 
      path: '/home',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      id: 'my-esims', 
      label: 'My eSIMs', 
      path: '/my-esims',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'guides', 
      label: 'Guides', 
      path: '/guides',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      path: '/profile',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  const handleTabClick = (path: string) => {
    hapticFeedback();
    setLocation(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
      <div className="max-w-md mx-auto relative">


        {/* FAB Button - floating with enhanced elevation */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => {
              hapticFeedback();
              // Add your FAB action here
            }}
            className="w-14 h-14 rounded-full transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
              boxShadow: '0 12px 32px rgba(0, 122, 255, 0.4), 0 6px 16px rgba(0, 0, 0, 0.2)',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Tab Bar with seamless upward curve integration */}
        <div className="relative z-10">
          {/* Wide semicircle with extended sides */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-32 h-10 -top-8 z-20"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
              borderRadius: '80px 80px 0 0',
              backdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
            }}
          ></div>
          
          <div 
            className="bg-white/20 backdrop-blur-2xl px-3 py-1.5 shadow-2xl border-t border-white/30 relative z-10"
            style={{
              backdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
              boxShadow: '0 -8px 32px -8px rgba(0, 0, 0, 0.15), 0 -4px 16px -4px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
            }}
          >
          <div className="flex items-center relative">
            {/* First two tabs */}
            {tabs.slice(0, 2).map((tab, index) => {
              const isActive = location === tab.path;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex-1 flex flex-col items-center py-1.5 px-2 transition-all duration-300 transform relative group rounded-xl ${
                    isActive 
                      ? 'scale-105' 
                      : 'active:scale-95 hover:scale-102 hover:bg-white/10'
                  }`}
                  style={{willChange: 'transform, opacity'}}
                >
                  {/* Icon Container */}
                  <div className={`mb-1 transition-all duration-300 relative z-10 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    <svg className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-blue-500 hover:text-blue-600' : 'text-gray-700 group-hover:text-gray-900'
                    }`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      {tab.id === 'shop' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 0 : 2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      )}
                      {tab.id === 'my-esims' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 0 : 2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      )}
                    </svg>
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium transition-all duration-300 relative z-10 ${
                    isActive ? 'text-blue-500 font-semibold hover:text-blue-600' : 'text-gray-800 group-hover:text-gray-900'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 group-active:scale-110 transition-all duration-200 bg-blue-400/30"></div>
                </button>
              );
            })}
            
            {/* Central Space for FAB (Empty but maintains flex structure) */}
            <div className="flex-1"></div>
            
            {/* Last two tabs */}
            {tabs.slice(2, 4).map((tab, index) => {
              const isActive = location === tab.path;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex-1 flex flex-col items-center py-1.5 px-2 transition-all duration-300 transform relative group rounded-xl ${
                    isActive 
                      ? 'scale-105' 
                      : 'active:scale-95 hover:scale-102 hover:bg-white/10'
                  }`}
                  style={{willChange: 'transform, opacity'}}
                >
                  {/* Icon Container */}
                  <div className={`mb-1 transition-all duration-300 relative z-10 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    <svg className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-blue-500 hover:text-blue-600' : 'text-gray-700 group-hover:text-gray-900'
                    }`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      {tab.id === 'guides' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 0 : 2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      )}
                      {tab.id === 'profile' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      )}
                    </svg>
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium transition-all duration-300 relative z-10 ${
                    isActive ? 'text-blue-500 font-semibold hover:text-blue-600' : 'text-gray-800 group-hover:text-gray-900'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 group-active:scale-110 transition-all duration-200 bg-blue-400/30"></div>
                </button>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
