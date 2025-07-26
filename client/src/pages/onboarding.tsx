import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Globe, Smartphone, Zap } from "lucide-react";

const onboardingSteps = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Stay connected in 200+ countries worldwide with instant eSIM activation. No roaming fees, no surprises.",
    color: "blue",
    features: ["200+ Countries", "No Roaming Fees", "Instant Coverage"],
    stats: "98% Global Coverage",
    backgroundPattern: "globe"
  },
  {
    icon: Smartphone,
    title: "Easy Setup", 
    description: "Simple QR code scanning process. Get your eSIM ready in under 2 minutes with no technical knowledge required.",
    color: "emerald",
    features: ["QR Code Scan", "2 Min Setup", "No Tech Skills"],
    stats: "Under 2 Minutes",
    backgroundPattern: "circuit"
  },
  {
    icon: Zap,
    title: "Instant Activation",
    description: "Activate your eSIM the moment you land. Connect immediately without searching for WiFi or local stores.",
    color: "purple",
    features: ["Instant Active", "Airport Ready", "No WiFi Needed"],
    stats: "0.3s Activation",
    backgroundPattern: "network"
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setLocation] = useLocation();
  
  // Touch gesture states
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setLocation("/home");
      }
      setIsAnimating(false);
    }, 200);
  };

  const handlePrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
      setIsAnimating(false);
    }, 200);
  };

  // Auto-play progress on first load
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    
    // Calculate parallax offset based on swipe distance
    const deltaX = touchStart.x - touch.clientX;
    const maxOffset = 100; // Maximum parallax movement
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, deltaX * 0.3));
    setParallaxOffset(clampedOffset);
    
    // Show swipe direction feedback
    if (Math.abs(deltaX) > 20) {
      setSwipeDirection(deltaX > 0 ? 'left' : 'right');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    setSwipeDirection(null);
    
    // Reset parallax offset with smooth animation
    setParallaxOffset(0);
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      // Haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      if (deltaX > 0) {
        // Swipe left - next step
        handleNext();
      } else {
        // Swipe right - previous step
        handlePrevious();
      }
    }
  };

  const handleSkip = () => {
    setLocation("/home");
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  // Color mappings
  const colors = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/50",
      button: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      accent: "text-blue-600 dark:text-blue-400"
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      button: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800",
      icon: "text-emerald-600 dark:text-emerald-400",
      accent: "text-emerald-600 dark:text-emerald-400"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/50",
      button: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
      icon: "text-purple-600 dark:text-purple-400",
      accent: "text-purple-600 dark:text-purple-400"
    }
  };

  const currentColors = colors[currentStepData.color as keyof typeof colors];

  // Parallax background component for each step
  const renderParallaxBackground = () => {
    const offset = parallaxOffset;
    
    switch (currentStep) {
      case 0: // Global Coverage
        return (
          <>
            {/* Layer 0: Grid notebook background with fade */}
            <div 
              className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 30%, black 70%, transparent 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 30%, black 70%, transparent 85%, transparent 100%)'
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                {/* Vertical lines */}
                {[...Array(20)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
                ))}
                {/* Horizontal lines */}
                {[...Array(20)].map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
                ))}
              </svg>
            </div>
            
            {/* Layer 1: Slow moving world map outline */}
            <div 
              className="absolute inset-0 opacity-10 dark:opacity-20"
              style={{ transform: `translateX(${offset * 0.2}px)` }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                <path d="M50 100 Q100 80 150 100 T250 120 Q300 110 350 130" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <path d="M80 180 Q130 160 180 180 T280 200 Q330 190 380 210" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <circle cx="120" cy="140" r="2" fill="currentColor" opacity="0.4"/>
                <circle cx="280" cy="160" r="1.5" fill="currentColor" opacity="0.4"/>
                <circle cx="200" cy="120" r="1" fill="currentColor" opacity="0.4"/>
              </svg>
            </div>
            
            {/* Layer 2: Medium speed connection dots */}
            <div 
              className="absolute inset-0 opacity-15 dark:opacity-25"
              style={{ transform: `translateX(${offset * 0.5}px)` }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    left: `${20 + i * 45}%`,
                    top: `${30 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '3s'
                  }}
                />
              ))}
            </div>
            
            {/* Layer 3: Fast moving satellites */}
            <div 
              className="absolute inset-0 opacity-20 dark:opacity-30"
              style={{ transform: `translateX(${offset * 0.8}px)` }}
            >
              <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-bounce"/>
              <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '1s' }}/>
              <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '2s' }}/>
            </div>
          </>
        );
        
      case 1: // Easy Setup
        return (
          <>
            {/* Layer 0: Grid notebook background with fade */}
            <div 
              className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 30%, black 70%, transparent 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 30%, black 70%, transparent 85%, transparent 100%)'
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                {/* Vertical lines */}
                {[...Array(20)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
                ))}
                {/* Horizontal lines */}
                {[...Array(20)].map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
                ))}
              </svg>
            </div>
            
            {/* Layer 1: Circuit board patterns */}
            <div 
              className="absolute inset-0 opacity-[0.08] dark:opacity-15"
              style={{ transform: `translateX(${offset * 0.3}px)` }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                <rect x="50" y="50" width="20" height="4" rx="2" fill="currentColor" opacity="0.3"/>
                <rect x="80" y="48" width="4" height="8" rx="2" fill="currentColor" opacity="0.3"/>
                <rect x="200" y="150" width="30" height="4" rx="2" fill="currentColor" opacity="0.3"/>
                <rect x="240" y="148" width="4" height="8" rx="2" fill="currentColor" opacity="0.3"/>
                <path d="M70 54 L200 54 L200 152 L240 152" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                <circle cx="90" cy="54" r="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <circle cx="220" cy="152" r="2" fill="currentColor" opacity="0.4"/>
              </svg>
            </div>
            
            {/* Layer 2: QR code elements */}
            <div 
              className="absolute inset-0 opacity-[0.12] dark:opacity-20"
              style={{ transform: `translateX(${offset * 0.6}px)` }}
            >
              <div className="absolute top-16 right-16 grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`w-1 h-1 ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-transparent'} rounded-sm`}/>
                ))}
              </div>
              <div className="absolute bottom-20 left-20 grid grid-cols-2 gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-emerald-300 rounded-sm opacity-60"/>
                ))}
              </div>
            </div>
            
            {/* Layer 3: Fast moving data bits */}
            <div 
              className="absolute inset-0 opacity-20 dark:opacity-30"
              style={{ transform: `translateX(${offset * 0.9}px)` }}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-xs font-mono text-emerald-400 opacity-40 animate-pulse"
                  style={{
                    left: `${10 + i * 60}%`,
                    top: `${25 + (i % 2) * 50}%`,
                    animationDelay: `${i * 0.4}s`
                  }}
                >
                  {['01', '10', '11', '00'][i % 4]}
                </div>
              ))}
            </div>
          </>
        );
        
      case 2: // Instant Activation
        return (
          <>
            {/* Layer 0: Grid notebook background with fade */}
            <div 
              className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 30%, black 70%, transparent 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 30%, black 70%, transparent 85%, transparent 100%)'
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                {/* Vertical lines */}
                {[...Array(20)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
                ))}
                {/* Horizontal lines */}
                {[...Array(20)].map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
                ))}
              </svg>
            </div>
            
            {/* Layer 1: Lightning background */}
            <div 
              className="absolute inset-0 opacity-10 dark:opacity-18"
              style={{ transform: `translateX(${offset * 0.25}px)` }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                <path d="M100 50 L120 100 L90 100 L110 150" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                <path d="M300 80 L320 130 L290 130 L310 180" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                <path d="M200 200 L220 250 L190 250 L210 300" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
              </svg>
            </div>
            
            {/* Layer 2: Signal waves */}
            <div 
              className="absolute inset-0 opacity-15 dark:opacity-25"
              style={{ transform: `translateX(${offset * 0.7}px)` }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border border-purple-400 rounded-full opacity-30 animate-ping"
                  style={{
                    width: `${40 + i * 20}px`,
                    height: `${40 + i * 20}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
            
            {/* Layer 3: Energy particles */}
            <div 
              className="absolute inset-0 opacity-25 dark:opacity-35"
              style={{ transform: `translateX(${offset * 1.0}px)` }}
            >
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${1.5 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Parallax Background Layers */}
      <div className="fixed inset-0 transition-all duration-700 ease-out" style={{ color: currentColors.accent.replace('text-', '').replace('dark:', '') }}>
        {renderParallaxBackground()}
      </div>
      
      {/* Color wave transition effect */}
      {isAnimating && (
        <div 
          className="fixed inset-0 opacity-20 pointer-events-none z-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentColors.accent.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : 
                                                             currentColors.accent.includes('emerald') ? 'rgba(16, 185, 129, 0.3)' : 
                                                             'rgba(147, 51, 234, 0.3)'}, transparent 70%)`
          }}
        >
          <div className="w-full h-full animate-ping" style={{ animationDuration: '1s' }}></div>
        </div>
      )}
      
      {/* Original background gradients */}
      <div className="fixed inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]"></div>
      </div>

      {/* Skip button with color clouds */}
      <div className="absolute top-6 right-6 z-50">
        {/* Color clouds based on current step */}
        <div className="absolute -inset-12 opacity-20 dark:opacity-15">
          <div 
            className={`absolute top-1 right-10 w-16 h-12 rounded-full blur-xl animate-pulse ${
              currentStep === 0 ? 'bg-blue-400/60' : 
              currentStep === 1 ? 'bg-emerald-400/60' : 
              'bg-purple-400/60'
            }`}
            style={{ animationDuration: '3s' }}
          />
          <div 
            className={`absolute top-8 right-1 w-12 h-8 rounded-full blur-lg animate-pulse ${
              currentStep === 0 ? 'bg-blue-300/50' : 
              currentStep === 1 ? 'bg-emerald-300/50' : 
              'bg-purple-300/50'
            }`}
            style={{ animationDuration: '4s', animationDelay: '1s' }}
          />
          <div 
            className={`absolute -top-2 right-6 w-10 h-6 rounded-full blur-md animate-pulse ${
              currentStep === 0 ? 'bg-blue-500/40' : 
              currentStep === 1 ? 'bg-emerald-500/40' : 
              'bg-purple-500/40'
            }`}
            style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
          />
          <div 
            className={`absolute top-4 right-12 w-8 h-4 rounded-full blur-sm animate-pulse ${
              currentStep === 0 ? 'bg-blue-600/30' : 
              currentStep === 1 ? 'bg-emerald-600/30' : 
              'bg-purple-600/30'
            }`}
            style={{ animationDuration: '3.5s', animationDelay: '2s' }}
          />
        </div>
        
        <button
          onClick={handleSkip}
          className="relative px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full"
        >
          Skip
        </button>
      </div>

      {/* Main content - optimized height */}
      <div className="flex flex-col h-screen px-6 py-6 relative z-10">
        
        {/* Progress indicators */}
        <div className="mb-6">
          <div className="flex justify-center space-x-3 mb-3">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentStep 
                    ? 'w-12 bg-blue-600 dark:bg-blue-400 shadow-sm' 
                    : index < currentStep
                    ? 'w-3 bg-blue-300 dark:bg-blue-600'
                    : 'w-3 bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          
          <div className="text-center">
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>
        </div>

        {/* Content area with swipe indicators */}
        <div className={`flex-1 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-500 relative ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        } ${swipeDirection === 'left' ? 'transform -translate-x-2' : swipeDirection === 'right' ? 'transform translate-x-2' : ''}`}>
          


          {/* Icon Container */}
          <div className="relative">
            <div className={`absolute inset-0 w-32 h-32 rounded-full ${currentColors.bg} opacity-20 blur-xl animate-pulse`}></div>
            
            <div className={`w-28 h-28 rounded-3xl ${currentColors.bg} flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-700 hover:scale-110 hover:shadow-3xl hover:rotate-3 ${
              isAnimating ? 'scale-90 rotate-6' : 'scale-100 rotate-0'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 dark:from-white/10 dark:to-black/20"></div>
              
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-current animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 left-2 w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="absolute inset-4 border border-current/10 rounded-2xl animate-spin" style={{ animationDuration: '12s' }}></div>
              
              <IconComponent className={`w-16 h-16 ${currentColors.icon} relative z-20 transition-all duration-500 filter drop-shadow-lg`} />
              
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
          </div>

          {/* Title and description */}
          <div className="max-w-sm space-y-4">
            <h1 className={`text-3xl font-bold text-gray-900 dark:text-white leading-tight transition-all duration-300 ${
              isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
            }`}>
              {currentStepData.title}
            </h1>
            <p className={`text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 delay-100 ${
              isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
            }`}>
              {currentStepData.description}
            </p>
            
            {/* Feature highlights */}
            <div className="flex justify-center gap-2 mt-6 flex-nowrap">
              {currentStepData.features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-500 hover:scale-110 ${
                    isAnimating ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                >
                  <div className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold ${currentColors.bg} ${currentColors.icon} border border-current/30 shadow-md backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl whitespace-nowrap`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10">{feature}</span>
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-current rounded-full opacity-60"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className={`space-y-4 pt-6 transition-all duration-300 ${
          isAnimating ? 'translate-y-4 opacity-50' : 'translate-y-0 opacity-100'
        }`}>
          <div className="relative">
            <div className={`absolute inset-0 ${currentColors.bg} opacity-20 blur-xl rounded-3xl animate-pulse`}></div>
            
            <Button
              onClick={handleNext}
              disabled={isAnimating}
              className={`w-full ${currentColors.button} text-white py-5 rounded-3xl text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] disabled:scale-100 disabled:opacity-75 relative overflow-hidden group border-2 border-white/20`}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-200 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="absolute inset-0 opacity-30">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-bounce opacity-60"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s'
                    }}
                  ></div>
                ))}
              </div>
              
              <span className="relative z-10 flex items-center justify-center">
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    🚀 Start Your Journey
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                  </>
                )}
              </span>
            </Button>
          </div>
          
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              disabled={isAnimating}
              className="w-full py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}