import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Smartphone, Zap, ChevronLeft, ChevronRight } from "lucide-react";

const onboardingSteps = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Stay connected in 200+ countries worldwide with instant eSIM activation.",
    color: "blue"
  },
  {
    icon: Smartphone,
    title: "Easy Setup", 
    description: "Simple QR code scanning - no physical SIM card changes required.",
    color: "emerald"
  },
  {
    icon: Zap,
    title: "Instant Activation",
    description: "Get online immediately when you arrive at your destination.",
    color: "purple"
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLocation("/home");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
    <div className="mobile-screen relative">
      {/* Background */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>
      
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Skip
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-col h-full px-6 py-8">
        
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-8 bg-blue-600 dark:bg-blue-400' 
                  : index < currentStep
                  ? 'w-2 bg-blue-300 dark:bg-blue-600'
                  : 'w-2 bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          
          {/* Icon */}
          <div className={`w-32 h-32 rounded-full ${colors.bg} flex items-center justify-center shadow-lg`}>
            <IconComponent className={`w-16 h-16 ${colors.icon}`} />
          </div>

          {/* Title and description */}
          <div className="max-w-sm space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentStepData.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-8">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          <Button
            onClick={handleNext}
            className={`${colors.button} text-white flex items-center space-x-2 px-8`}
          >
            <span>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}