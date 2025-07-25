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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6" style={{paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)'}}>
      <div className="max-w-md mx-auto">
        {/* iOS Native Style Container */}
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-2xl px-2 py-1.5 shadow-lg border border-gray-200/50"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          }}
        >
          <div className="flex justify-around items-center">
            {tabs.map((tab) => {
              const isActive = location === tab.path;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex flex-col items-center py-2 px-3 transition-all duration-200 relative group rounded-lg min-w-[60px] ${
                    isActive 
                      ? '' 
                      : 'hover:bg-white/10'
                  }`}
                  style={{willChange: 'transform, opacity'}}
                >
                  {/* iOS Native Active State */}
                  {isActive && (
                    <div 
                      className="absolute inset-1 rounded-lg transition-all duration-200 ease-out bg-blue-500"
                      style={{
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  )}
                  
                  {/* Icon Container */}
                  <div className="mb-1.5 transition-all duration-200 relative z-10">
                    <svg className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-white drop-shadow-sm' : 'text-gray-700 group-hover:text-gray-900'
                    }`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      {tab.id === 'shop' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 0 : 2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      )}
                      {tab.id === 'my-esims' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 0 : 2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      )}
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
                    isActive ? 'text-white font-semibold drop-shadow-sm' : 'text-gray-800 group-hover:text-gray-900'
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
  );
}
