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
    <div className="tab-bar-fixed bg-gradient-to-t from-white via-white to-gray-50/50 backdrop-blur-md border-t border-gray-200/60 px-2 py-1 shadow-lg shadow-gray-200/40 relative" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
      {/* Animated border accent - More subtle */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20 animate-pulse"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 animate-shimmer opacity-30"></div>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = location === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 transform relative group tab-ripple ${
                isActive 
                  ? 'bg-blue-50/80 scale-105 shadow-sm premium-glow' 
                  : 'hover:bg-gray-50/60 active:scale-95 hover:shadow-sm'
              }`}
            >
              {/* Premium glow effect for active tab */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-600/20 to-blue-500/10 rounded-xl blur-sm opacity-60 animate-pulse"></div>
              )}
              
              <div className={`mb-1 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                {tab.icon(isActive)}
              </div>
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 group-hover:text-gray-700'
              }`}>
                {tab.label}
              </span>
              
              {/* Premium ripple effect */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 group-active:scale-110 transition-all duration-200 ${
                isActive ? 'bg-blue-500/20' : 'bg-gray-500/20'
              }`}></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
