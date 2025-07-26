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
    features: ["200+ Countries", "No Roaming Fees", "Instant Coverage"]
  },
  {
    icon: Smartphone,
    title: "Easy Setup", 
    description: "Simple QR code scanning process. Get your eSIM ready in under 2 minutes with no technical knowledge required.",
    color: "emerald",
    features: ["QR Code Scan", "2 Min Setup", "No Tech Skills"]
  },
  {
    icon: Zap,
    title: "Instant Activation",
    description: "Activate your eSIM the moment you land. Connect immediately without searching for WiFi or local stores.",
    color: "purple",
    features: ["Instant Active", "Airport Ready", "No WiFi Needed"]
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
    <div className="mobile-screen relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
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
          
          {/* Icon with enhanced styling and animations */}
          <div className={`w-40 h-40 rounded-3xl ${colors.bg} flex items-center justify-center shadow-xl relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
            isAnimating ? 'scale-90' : 'scale-100'
          }`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-current animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 left-2 w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Rotating ring effect */}
            <div className="absolute inset-4 border-2 border-current/10 rounded-2xl animate-spin" style={{ animationDuration: '8s' }}></div>
            
            <IconComponent className={`w-20 h-20 ${colors.icon} relative z-10 transition-transform duration-300`} />
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
            
            {/* Feature highlights with stagger */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {currentStepData.features.map((feature, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.icon} border border-current/20 transition-all duration-300 hover:scale-105 ${
                    isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced navigation with animations */}
        <div className={`space-y-4 pt-8 transition-all duration-300 ${
          isAnimating ? 'translate-y-4 opacity-50' : 'translate-y-0 opacity-100'
        }`}>
          {/* Main action button with enhanced effects */}
          <Button
            onClick={handleNext}
            disabled={isAnimating}
            className={`w-full ${colors.button} text-white py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-75 relative overflow-hidden group`}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <span className="relative z-10">
              {currentStep === onboardingSteps.length - 1 ? 'Get Started with eSIMfo' : 'Continue'}
            </span>
            <ChevronRight className="w-5 h-5 ml-2 relative z-10 transition-transform group-hover:translate-x-1" />
          </Button>
          
          {/* Back button with slide animation */}
          {currentStep > 0 && (
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isAnimating}
              className="w-full flex items-center justify-center space-x-2 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
            </Button>
          )}
          
          {/* Step counter */}
          <div className="text-center pt-2">
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}