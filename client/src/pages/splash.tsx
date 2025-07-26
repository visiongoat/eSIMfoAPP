import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function SplashScreen() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Logo fade-in animation trigger
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Navigation timer
    const navTimer = setTimeout(() => {
      setLocation("/onboarding");
    }, 3000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(navTimer);
    };
  }, [setLocation]);

  return (
    <div className="mobile-screen">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px),
                                radial-gradient(circle at 75% 75%, currentColor 2px, transparent 2px)`,
               backgroundSize: '100px 100px'
             }}>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100/20 dark:bg-purple-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-8">
        
        {/* Logo Container */}
        <div className={`transition-all duration-1000 ease-out transform ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          
          {/* Main Logo Circle - Centered */}
          <div className="relative mb-8 flex justify-center">
            {/* Outer Ring Animation */}
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-400/20 dark:to-purple-400/20 animate-pulse"></div>
            
            {/* Logo Container */}
            <div className="relative w-32 h-32 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 flex items-center justify-center backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              
              {/* e-simfo Logo SVG - Centered */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold tracking-tight">e</span>
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
            </div>
          </div>

          {/* Brand Text - Without small logo */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight mb-2">
              e-simfo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium tracking-wide">
              Global eSIM Connectivity
            </p>
          </div>

          {/* Loading Indicator */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Main Spinner */}
              <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
              
              {/* Inner Dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Indicator */}
        <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-500 ${
          isLoaded ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}
