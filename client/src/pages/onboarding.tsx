import { useState } from "react";
import { useLocation } from "wouter";
import StatusBar from "@/components/status-bar";

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const onboardingSteps = [
    {
      title: "Stay Connected Worldwide",
      description: "Get instant data connectivity in 200+ countries without changing your SIM card",
      icon: "🌍",
      bgColor: "from-blue-100 to-primary/20",
      iconBg: "bg-primary"
    },
    {
      title: "Simple Setup", 
      description: "Just scan the QR code and your eSIM will be ready to use in seconds",
      icon: "📱",
      bgColor: "from-green-100 to-secondary/20",
      iconBg: "bg-secondary"
    },
    {
      title: "Instant Activation",
      description: "Activate your eSIM instantly when you arrive at your destination",
      icon: "⚡",
      bgColor: "from-purple-100 to-purple-500/20", 
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500"
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLocation("/home");
    }
  };

  const handleSkip = () => {
    setLocation("/home");
  };

  return (
    <div className="mobile-screen">
      <StatusBar />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-8 bg-white">
        <div className={`w-64 h-64 mb-8 bg-gradient-to-br ${currentStepData.bgColor} rounded-3xl flex items-center justify-center`}>
          <div className={`w-32 h-32 ${currentStepData.iconBg} rounded-full flex items-center justify-center`}>
            <span className="text-white text-4xl">{currentStepData.icon}</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-4">{currentStepData.title}</h2>
        <p className="text-muted-foreground text-center text-lg leading-relaxed mb-12">
          {currentStepData.description}
        </p>
        
        <div className="flex space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full ${
                index === currentStep ? 'w-8 bg-primary' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          className="w-full button-primary mb-4"
        >
          {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
        </button>
        
        <button 
          onClick={handleSkip}
          className="w-full py-4 text-muted-foreground"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
