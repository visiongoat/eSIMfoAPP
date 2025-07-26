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
    <div className="mobile-screen relative overflow-hidden">
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

      {/* Main content */}
      <div className="flex flex-col min-h-screen px-6 py-8 relative z-10">
        
        {/* Progress indicators */}
        <div className="flex justify-center space-x-3 mb-12">
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

        {/* Content area */}
        <div className={`flex-1 flex flex-col items-center justify-center text-center space-y-8 transition-all duration-500 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}>
          
          {/* Enhanced Icon Container with Premium Effects */}
          <div className="relative mb-4">
            {/* Outer glow ring */}
            <div className={`absolute inset-0 w-44 h-44 rounded-full ${colors.bg} opacity-20 blur-xl animate-pulse`}></div>
            
            {/* Main icon container */}
            <div className={`w-40 h-40 rounded-3xl ${colors.bg} flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-700 hover:scale-110 hover:shadow-3xl hover:rotate-3 ${
              isAnimating ? 'scale-90 rotate-6' : 'scale-100 rotate-0'
            }`}>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 dark:from-white/10 dark:to-black/20"></div>
              
              {/* Animated micro-patterns */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-current animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 left-3 w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-6 left-1/2 w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '1.5s' }}></div>
              </div>
              
              {/* Multiple rotating rings */}
              <div className="absolute inset-6 border border-current/10 rounded-2xl animate-spin" style={{ animationDuration: '12s' }}></div>
              <div className="absolute inset-8 border border-current/5 rounded-xl animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
              
              {/* Central icon with enhanced effects */}
              <IconComponent className={`w-20 h-20 ${colors.icon} relative z-20 transition-all duration-500 animate-icon-bounce filter drop-shadow-lg`} />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
            
            {/* Stats badge */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className={`${colors.bg} ${colors.icon} px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-current/20 backdrop-blur-sm`}>
                {currentStepData.stats}
              </div>
            </div>
          </div>

          {/* Title and description with stagger animation */}
          <div className="max-w-sm space-y-6">
            <h1 className={`text-4xl font-bold text-gray-900 dark:text-white leading-tight transition-all duration-300 ${
              isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
            }`}>
              {currentStepData.title}
            </h1>
            <p className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 delay-100 ${
              isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
            }`}>
              {currentStepData.description}
            </p>
            
            {/* Enhanced Feature highlights */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {currentStepData.features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-500 hover:scale-110 ${
                    isAnimating ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                >
                  {/* Feature badge with enhanced design */}
                  <div className={`relative px-4 py-2 rounded-2xl text-sm font-semibold ${colors.bg} ${colors.icon} border border-current/30 shadow-md backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl`}>
                    {/* Background shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Feature text */}
                    <span className="relative z-10">{feature}</span>
                    
                    {/* Subtle dot indicator */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full opacity-60"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional visual enhancements */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${colors.bg} opacity-60 animate-pulse`}
                    style={{ animationDelay: `${i * 0.3}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Premium navigation with particle effects */}
        <div className={`space-y-6 pt-8 transition-all duration-300 ${
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
          
          {/* Enhanced step counter with dots */}
          <div className="text-center pt-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {onboardingSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => !isAnimating && setCurrentStep(index)}
                  disabled={isAnimating}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? `${colors.bg} scale-125 shadow-lg`
                      : index < currentStep
                      ? 'bg-gray-400 dark:bg-gray-600 hover:scale-110'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                ></button>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}