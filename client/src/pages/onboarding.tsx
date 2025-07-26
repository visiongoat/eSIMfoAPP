import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Smartphone, Zap, ChevronLeft, ChevronRight } from "lucide-react";

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
    
    // Show swipe direction feedback
    const deltaX = touchStart.x - touch.clientX;
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

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          icon: 'text-blue-600 dark:text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          icon: 'text-emerald-600 dark:text-emerald-400',
          button: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          icon: 'text-purple-600 dark:text-purple-400',
          button: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          icon: 'text-gray-600 dark:text-gray-400',
          button: 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700'
        };
    }
  };

  const colors = getColorClasses(currentStepData.color);

  return (
    <div 
      className="mobile-screen relative overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Background with Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          {currentStepData.backgroundPattern === 'globe' && (
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
                               radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              animation: 'drift 20s linear infinite'
            }}></div>
          )}
          {currentStepData.backgroundPattern === 'circuit' && (
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(90deg, currentColor 1px, transparent 1px),
                               linear-gradient(0deg, currentColor 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              animation: 'circuit-flow 15s linear infinite'
            }}></div>
          )}
          {currentStepData.backgroundPattern === 'network' && (
            <div className="absolute inset-0" style={{
              backgroundImage: `conic-gradient(from 0deg at 50% 50%, transparent, currentColor 2deg, transparent 4deg)`,
              backgroundSize: '60px 60px',
              animation: 'network-pulse 10s ease-in-out infinite'
            }}></div>
          )}
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 ${colors.bg} opacity-10 rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${colors.bg} opacity-10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
      
      {/* Enhanced Skip button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105"
        >
          Skip
        </Button>
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
          
          {/* Step counter moved here */}
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
          
          {/* Dynamic swipe indicators */}
          {currentStep > 0 && (
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
              swipeDirection === 'right' ? 'opacity-80 scale-110 text-blue-500' : 'opacity-30 dark:opacity-20'
            }`}>
              <div className="flex items-center space-x-1 text-gray-400">
                <svg className={`w-4 h-4 transition-all duration-200 ${swipeDirection === 'right' ? 'text-blue-500 animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs font-medium">Swipe</span>
              </div>
            </div>
          )}
          
          {currentStep < onboardingSteps.length - 1 && (
            <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
              swipeDirection === 'left' ? 'opacity-80 scale-110 text-blue-500' : 'opacity-30 dark:opacity-20'
            }`}>
              <div className="flex items-center space-x-1 text-gray-400">
                <span className="text-xs font-medium">Swipe</span>
                <svg className={`w-4 h-4 transition-all duration-200 ${swipeDirection === 'left' ? 'text-blue-500 animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
          

          
          {/* Enhanced Icon Container - compact */}
          <div className="relative">
            {/* Outer glow ring */}
            <div className={`absolute inset-0 w-32 h-32 rounded-full ${colors.bg} opacity-20 blur-xl animate-pulse`}></div>
            
            {/* Main icon container - smaller */}
            <div className={`w-28 h-28 rounded-3xl ${colors.bg} flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-700 hover:scale-110 hover:shadow-3xl hover:rotate-3 ${
              isAnimating ? 'scale-90 rotate-6' : 'scale-100 rotate-0'
            }`}>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 dark:from-white/10 dark:to-black/20"></div>
              
              {/* Animated micro-patterns */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-current animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 left-2 w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
              
              {/* Multiple rotating rings */}
              <div className="absolute inset-4 border border-current/10 rounded-2xl animate-spin" style={{ animationDuration: '12s' }}></div>
              
              {/* Central icon with micro-animations */}
              {currentStepData.title === "Global Coverage" ? (
                // Enhanced Globe with world map animation
                <div className="relative w-16 h-16 z-20">
                  {/* Base globe with rotation */}
                  <svg className="w-16 h-16 animate-spin [animation-duration:8s] filter drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  
                  {/* Animated world continents overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-10 h-10">
                      {/* Continent dots with staggered animations */}
                      <div className="absolute top-2 left-3 w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:0s]"></div>
                      <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-current rounded-full animate-pulse [animation-delay:0.5s]"></div>
                      <div className="absolute bottom-3 left-2 w-0.5 h-0.5 bg-current rounded-full animate-pulse [animation-delay:1s]"></div>
                      <div className="absolute bottom-2 right-3 w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:1.5s]"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-current rounded-full animate-pulse [animation-delay:2s]"></div>
                    </div>
                  </div>
                  
                  {/* Connection lines animation */}
                  <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full animate-pulse [animation-duration:2s]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 12h8M8 8l8 8M16 8l-8 8" opacity="0.6" />
                    </svg>
                  </div>
                </div>
              ) : currentStepData.title === "Instant Setup" ? (
                // Enhanced Setup icon with gear animation
                <div className="relative w-16 h-16 z-20">
                  <svg className="w-16 h-16 animate-spin [animation-duration:4s] filter drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {/* Inner pulse */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-current rounded-full opacity-20 animate-ping"></div>
                  </div>
                </div>
              ) : currentStepData.title === "Secure Connection" ? (
                // Enhanced Shield with scanning lines
                <div className="relative w-16 h-16 z-20">
                  <svg className="w-16 h-16 filter drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {/* Scanning line animation */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute inset-x-0 h-0.5 bg-current opacity-40 animate-bounce transform -translate-y-8 [animation-duration:2s]"></div>
                  </div>
                  {/* Check mark pulse */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 opacity-60 animate-pulse [animation-delay:1s]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ) : (
                // Default icon with basic animation
                <IconComponent className={`w-16 h-16 ${colors.icon} relative z-20 transition-all duration-500 animate-icon-bounce filter drop-shadow-lg`} />
              )}
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
          </div>

          {/* Title and description - compact */}
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
            
            {/* Enhanced Feature highlights - single row */}
            <div className="flex justify-center gap-2 mt-6 flex-nowrap">
              {currentStepData.features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-500 hover:scale-110 ${
                    isAnimating ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                >
                  {/* Feature badge with enhanced design - smaller */}
                  <div className={`relative px-2.5 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.icon} border border-current/30 shadow-md backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl whitespace-nowrap`}>
                    {/* Background shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Feature text */}
                    <span className="relative z-10">{feature}</span>
                    
                    {/* Subtle dot indicator */}
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-current rounded-full opacity-60"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium navigation - compact */}
        <div className={`space-y-4 pt-6 transition-all duration-300 ${
          isAnimating ? 'translate-y-4 opacity-50' : 'translate-y-0 opacity-100'
        }`}>
          {/* Main action button with premium effects */}
          <div className="relative">
            {/* Button background glow */}
            <div className={`absolute inset-0 ${colors.bg} opacity-20 blur-xl rounded-3xl animate-pulse`}></div>
            
            <Button
              onClick={handleNext}
              disabled={isAnimating}
              className={`w-full ${colors.button} text-white py-5 rounded-3xl text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] disabled:scale-100 disabled:opacity-75 relative overflow-hidden group border-2 border-white/20`}
            >
              {/* Multiple shine effects */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-200 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* Button particles */}
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
          
          {/* Back button with enhanced design */}
          {currentStep > 0 && (
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isAnimating}
              className="w-full flex items-center justify-center space-x-2 py-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm group"
            >
              <ChevronLeft className="w-4 h-4 transition-all duration-300 group-hover:-translate-x-2 group-hover:scale-110" />
              <span className="font-medium">Back</span>
            </Button>
          )}
          

        </div>
      </div>
    </div>
  );
}