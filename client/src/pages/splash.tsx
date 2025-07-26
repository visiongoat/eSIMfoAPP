import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function SplashScreen() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [logoScale, setLogoScale] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);

  useEffect(() => {
    // Staggered animation sequence
    const logoTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    const scaleTimer = setTimeout(() => {
      setLogoScale(true);
    }, 600);

    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 1000);

    const particlesTimer = setTimeout(() => {
      setParticlesVisible(true);
    }, 1400);

    // Navigation timer
    const navTimer = setTimeout(() => {
      setLocation("/onboarding");
    }, 3500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(scaleTimer);
      clearTimeout(textTimer);
      clearTimeout(particlesTimer);
      clearTimeout(navTimer);
    };
  }, [setLocation]);

  return (
    <div className="mobile-screen">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/50">
        
        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]" 
             style={{
               backgroundImage: `
                 linear-gradient(90deg, currentColor 1px, transparent 1px),
                 linear-gradient(currentColor 1px, transparent 1px)
               `,
               backgroundSize: '60px 60px'
             }}>
        </div>
        
        {/* Dynamic Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary orb - top right */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/15 dark:from-blue-500/15 dark:to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Secondary orb - bottom left */}
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-purple-400/15 to-pink-400/10 dark:from-purple-500/10 dark:to-pink-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Accent orb - center */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-400/8 dark:from-emerald-500/8 dark:to-teal-500/6 rounded-full blur-3xl transition-all duration-2000 ${
            particlesVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`} style={{ animationDelay: '0.8s' }}></div>
        </div>

        {/* Floating Particles */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${particlesVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Particle 1 */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 dark:bg-blue-300/20 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
          {/* Particle 2 */}
          <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-purple-400/40 dark:bg-purple-300/25 rounded-full animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1s' }}></div>
          {/* Particle 3 */}
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-400/50 dark:bg-emerald-300/30 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-8">
        
        {/* Logo Container with Staggered Animations */}
        <div className={`transition-all duration-1200 ease-out transform ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90'
        }`}>
          
          {/* Main Logo Circle with Enhanced Effects */}
          <div className="relative mb-10 flex justify-center">
            
            {/* Outer Pulse Rings */}
            <div className={`absolute inset-0 w-40 h-40 rounded-full transition-all duration-1000 ${
              logoScale ? 'scale-110 opacity-20' : 'scale-100 opacity-40'
            }`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 dark:from-blue-400/25 dark:to-purple-400/25 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-pink-400/20 dark:from-cyan-400/15 dark:to-pink-400/15 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Logo Container with Glass Effect */}
            <div className={`relative w-36 h-36 bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl dark:shadow-2xl dark:shadow-black/60 flex items-center justify-center backdrop-blur-xl border border-white/20 dark:border-gray-700/30 transition-all duration-800 ${
              logoScale ? 'scale-105' : 'scale-100'
            }`}>
              
              {/* Inner Glow Ring */}
              <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/15 dark:to-purple-400/15"></div>
              
              {/* e-simfo Logo with Premium Styling */}
              <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-600 ${
                logoScale ? 'scale-110 shadow-blue-500/50' : 'scale-100'
              }`}>
                <span className="text-white text-3xl font-black tracking-tight drop-shadow-lg">e</span>
              </div>
              
              {/* Animated Border Shimmer */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10 transition-opacity duration-1000 ${
                logoScale ? 'opacity-100' : 'opacity-0'
              }`} style={{ 
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                animation: logoScale ? 'shimmer 2s ease-in-out infinite' : 'none'
              }}></div>
            </div>
          </div>

          {/* Brand Text with Enhanced Typography */}
          <div className={`text-center mb-8 transition-all duration-800 transform ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent tracking-tight mb-3 drop-shadow-sm">
              e-simfo
            </h1>
            <div className="relative">
              <p className="text-slate-600 dark:text-slate-300 text-lg font-semibold tracking-wide mb-1">
                Global eSIM Connectivity
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wider">
                Travel Connected, Stay Connected
              </p>
              
              {/* Accent Line */}
              <div className={`mx-auto mt-3 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-1000 ${
                textVisible ? 'w-24 opacity-60' : 'w-0 opacity-0'
              }`}></div>
            </div>
          </div>

          {/* Enhanced Loading Indicator */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Outer Ring */}
              <div className="w-12 h-12 border-2 border-slate-200/50 dark:border-slate-700/50 rounded-full"></div>
              
              {/* Animated Ring */}
              <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-blue-500 border-r-blue-500/70 dark:border-t-blue-400 dark:border-r-blue-400/70 rounded-full animate-spin"></div>
              
              {/* Inner Pulsing Dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
              </div>
              
              {/* Loading Particles */}
              <div className="absolute inset-0">
                <div className="absolute top-1 left-1/2 w-1 h-1 bg-blue-400/60 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-purple-400/60 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute left-1 top-1/2 w-1 h-1 bg-emerald-400/60 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute right-1 top-1/2 w-1 h-1 bg-pink-400/60 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Enhanced Bottom Indicator */}
        <div className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-1200 delay-700 ${
          textVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="flex flex-col items-center space-y-4">
            {/* Progress Dots */}
            <div className="flex space-x-3">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-300 dark:to-blue-400 rounded-full animate-pulse shadow-sm shadow-blue-400/50"></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-purple-500 dark:from-purple-300 dark:to-purple-400 rounded-full animate-pulse shadow-sm shadow-purple-400/50" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-300 dark:to-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400/50" style={{ animationDelay: '0.6s' }}></div>
            </div>
            
            {/* Loading Text */}
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium tracking-widest uppercase">
              Loading Experience...
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
