import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// Simple World with Landmarks Animation - Inspired by Travel Apps
const GlobalConnectionAnimation = () => (
  <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50 dark:from-blue-900 dark:via-blue-800 dark:to-gray-900">
    
    {/* Simple Cloud Background */}
    <div className="absolute top-10 left-10 w-16 h-8 bg-white/60 dark:bg-white/20 rounded-full animate-pulse"></div>
    <div className="absolute top-16 right-16 w-20 h-10 bg-white/40 dark:bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
    <div className="absolute top-20 left-1/3 w-12 h-6 bg-white/50 dark:bg-white/18 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

    {/* Central World */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {/* Main Earth Globe */}
      <div className="relative w-48 h-48 bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 rounded-full shadow-2xl overflow-hidden">
        {/* Continents - Simple Shapes */}
        <div className="absolute top-6 left-8 w-12 h-8 bg-green-400 dark:bg-green-500 rounded-lg opacity-80"></div>
        <div className="absolute top-12 right-6 w-10 h-10 bg-green-500 dark:bg-green-600 rounded-full opacity-70"></div>
        <div className="absolute bottom-8 left-12 w-16 h-6 bg-green-400 dark:bg-green-500 rounded-2xl opacity-80"></div>
        <div className="absolute bottom-12 right-8 w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg opacity-75"></div>
        
        {/* Simple white clouds on Earth */}
        <div className="absolute top-8 left-20 w-4 h-2 bg-white/60 rounded-full"></div>
        <div className="absolute top-20 right-12 w-6 h-3 bg-white/50 rounded-full"></div>
        <div className="absolute bottom-16 left-16 w-5 h-2 bg-white/40 rounded-full"></div>
      </div>



      {/* Simple Connection Lines */}
      <div className="absolute inset-0">
        {/* Dotted lines connecting landmarks to earth */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
          <defs>
            <pattern id="dottedLine" patternUnits="userSpaceOnUse" width="8" height="8">
              <circle cx="4" cy="4" r="1" fill="#3b82f6" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          
          {/* Connection lines from landmarks to center */}
          <line x1="40" y1="30" x2="100" y2="100" stroke="url(#dottedLine)" strokeWidth="2" className="animate-pulse" />
          <line x1="160" y1="25" x2="100" y2="100" stroke="url(#dottedLine)" strokeWidth="2" className="animate-pulse" />
          <line x1="170" y1="120" x2="100" y2="100" stroke="url(#dottedLine)" strokeWidth="2" className="animate-pulse" />
          <line x1="130" y1="180" x2="100" y2="100" stroke="url(#dottedLine)" strokeWidth="2" className="animate-pulse" />
          <line x1="60" y1="180" x2="100" y2="100" stroke="url(#dottedLine)" strokeWidth="2" className="animate-pulse" />
        </svg>
      </div>
    </div>

    {/* Simple floating icons */}
    <div className="absolute top-1/4 left-1/4">
      <div className="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full animate-ping"></div>
    </div>
    <div className="absolute top-3/4 right-1/4">
      <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
    </div>
    <div className="absolute top-1/3 right-1/3">
      <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
    </div>

  </div>
);

const QRSetupAnimation = () => (
  <div className="relative w-64 h-64 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-3xl flex items-center justify-center overflow-hidden">
    {/* Phone Outline */}
    <div className="relative z-10 w-32 h-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 border-gray-300 dark:border-gray-600 flex flex-col">
      {/* Phone Screen */}
      <div className="flex-1 m-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl relative overflow-hidden">
        {/* QR Code Animation */}
        <div className="absolute inset-4 bg-white dark:bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="grid grid-cols-8 grid-rows-8 gap-1 w-full h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div 
                key={i}
                className={`bg-black dark:bg-gray-800 rounded-sm animate-pulse ${
                  Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>
        
        {/* Scan Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent h-1 animate-bounce"
             style={{ animationDuration: '2s' }} />
      </div>
      
      {/* Phone Home Indicator */}
      <div className="h-1 w-16 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto mb-2" />
    </div>
    
    {/* Success Checkmarks */}
    {[0, 1, 2].map((i) => (
      <div 
        key={i}
        className="absolute w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-ping"
        style={{
          top: `${20 + i * 20}%`,
          right: `${10 + i * 15}%`,
          animationDelay: `${i * 800}ms`
        }}
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ))}
  </div>
);

const InstantActivationAnimation = () => (
  <div className="relative w-64 h-64 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-3xl flex items-center justify-center overflow-hidden">
    {/* Central Tower */}
    <div className="relative z-10">
      <div className="w-16 h-32 bg-gradient-to-t from-purple-600 to-purple-500 rounded-t-full flex flex-col items-center justify-end pb-2">
        <div className="w-2 h-8 bg-purple-300 rounded-full mb-1" />
        <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
      </div>
    </div>
    
    {/* Signal Waves */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
      <defs>
        <radialGradient id="signalGrad" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      
      {/* Concentric Signal Circles */}
      {[40, 60, 80, 100, 120].map((radius, i) => (
        <circle 
          key={radius}
          cx="128" cy="180" 
          r={radius} 
          fill="none" 
          stroke="url(#signalGrad)" 
          strokeWidth="3" 
          strokeDasharray="8 8"
          className="animate-ping"
          style={{ animationDelay: `${i * 300}ms`, animationDuration: '2s' }}
        />
      ))}
    </svg>
    
    {/* Data Packets */}
    {[0, 1, 2, 3, 4].map((i) => (
      <div 
        key={i}
        className="absolute w-3 h-3 bg-purple-400 rounded-full animate-bounce"
        style={{
          left: `${30 + i * 20}%`,
          top: `${40 + Math.sin(i) * 10}%`,
          animationDelay: `${i * 200}ms`,
          animationDuration: '1.5s'
        }}
      />
    ))}
  </div>
);

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  const onboardingSteps = [
    {
      title: "Stay Connected Worldwide",
      description: "Get instant data connectivity in 200+ countries without changing your SIM card",
      component: GlobalConnectionAnimation,
      bgGradient: "from-blue-500/5 to-blue-600/10"
    },
    {
      title: "Simple Setup", 
      description: "Just scan the QR code and your eSIM will be ready to use in seconds",
      component: QRSetupAnimation,
      bgGradient: "from-emerald-500/5 to-emerald-600/10"
    },
    {
      title: "Instant Activation",
      description: "Activate your eSIM instantly when you arrive at your destination",
      component: InstantActivationAnimation,
      bgGradient: "from-purple-500/5 to-purple-600/10"
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setLocation("/home");
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleSkip = () => {
    setLocation("/home");
  };

  useEffect(() => {
    // Reset animation when step changes
    setIsAnimating(false);
  }, [currentStep]);

  return (
    <div className="mobile-screen relative">
      {/* Full-Screen Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"></div>
      
      {/* Animation Layer */}
      <div className={`absolute inset-0 transition-all duration-500 transform ${
        isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}>
        <currentStepData.component />
      </div>
      
      {/* Split Screen Layout */}
      <div className="absolute inset-0 z-30 flex flex-col">
        
        {/* Upper Half - Visual Content Area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Professional Visual Content */}
          <div className={`transition-all duration-700 transform ${
            isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
          }`}>
            
            {/* Step 1: Professional Globe */}
            {currentStep === 0 && (
              <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Professional Globe SVG */}
                <div className="w-48 h-48 text-blue-600 dark:text-blue-400">
                  <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-2xl">
                    <path fill="currentColor" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 2C7.589 4 4 7.589 4 12s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm4.8 3.6c.4 0 .8.4.8.8 0 .5-.4.8-.8.8s-.8-.4-.8-.8c0-.5.4-.8.8-.8zm-9.6 0c.4 0 .8.4.8.8 0 .5-.4.8-.8.8s-.8-.4-.8-.8c0-.5.4-.8.8-.8zM12 6c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6zm0 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                  </svg>
                </div>
                
                {/* Connection indicators */}
                <div className="absolute top-16 right-16 w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
                <div className="absolute top-20 left-16 w-3 h-3 bg-purple-500 rounded-full shadow-lg"></div>
                <div className="absolute bottom-16 right-20 w-3 h-3 bg-orange-500 rounded-full shadow-lg"></div>
              </div>
            )}
            
            {/* Step 2: Professional Phone SVG */}
            {currentStep === 1 && (
              <div className="relative w-72 h-80 flex items-center justify-center">
                {/* Professional Phone SVG */}
                <div className="w-32 h-48 text-gray-800 dark:text-gray-300">
                  <svg viewBox="0 0 101 101" className="w-full h-full drop-shadow-2xl">
                    <path fill="currentColor" d="M74.185,0h-47.37c-2.178,0-3.949,1.772-3.949,3.95v93.101c0,2.178,1.771,3.949,3.949,3.949h47.37c2.178,0,3.948-1.771,3.948-3.949V3.95C78.134,1.772,76.363,0,74.185,0z M46.627,92.5c0-2.14,1.732-3.875,3.873-3.875c2.144,0,3.873,1.735,3.873,3.875c0,2.141-1.729,3.875-3.873,3.875C48.359,96.375,46.627,94.641,46.627,92.5z M25.867,85.859V12.281h49.268v73.578H25.867z"/>
                  </svg>
                </div>
                
                {/* eSIM indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                    eSIM
                  </div>
                </div>
                
                {/* Signal indicators */}
                <div className="absolute top-8 right-8 flex space-x-1">
                  <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
                  <div className="w-1 h-4 bg-green-500 rounded-sm"></div>
                  <div className="w-1 h-5 bg-green-500 rounded-sm"></div>
                  <div className="w-1 h-6 bg-green-500 rounded-sm"></div>
                </div>
              </div>
            )}
            
            {/* Step 3: Professional World Map Success */}
            {currentStep === 2 && (
              <div className="relative w-80 h-64 flex items-center justify-center">
                {/* Professional World Map Background */}
                <div className="absolute inset-0 opacity-20 dark:opacity-30 text-gray-600 dark:text-gray-400">
                  <svg viewBox="0 0 2000 857" className="w-full h-full">
                    <path d="M1383 261.6l1.5 1.8-2.9 0.8-2.4 1.1-5.9 0.8-5.3 1.3-2.4 2.8 1.9 2.7 1.4 3.2-2 2.7 0.8 2.5-0.9 2.3-5.2-0.2 3.1 4.2-3.1 1.7-1.4 3.8 1.1 3.9-1.8 1.8-2.1-0.6-4 0.9-0.2 1.7-4.1 0-2.3 3.7 0.8 5.4-6.6 2.7-3.9-0.6-0.9 1.4-3.4-0.8-5.3 1-9.6-3.3 3.9-5.8-1.1-4.1-4.3-1.1-1.2-4.1-2.7-5.1 1.6-3.5-2.5-1 0.5-4.7 0.6-8 5.9 2.5 3.9-0.9 0.4-2.9 4-0.9 2.6-2-0.2-5.1 4.2-1.3 0.3-2.2 2.9 1.7 1.6 0.2 3 0 4.3 1.4 1.8 0.7 3.4-2 2.1 1.2 0.9-2.9 3.2 0.1 0.6-0.9-0.2-2.6 1.7-2.2 3.3 1.4-0.1 2 1.7 0.3 0.9 5.4 2.7 2.1 1.5-1.4 2.2-0.6 2.5-2.9 3.8 0.5 5.4 0z" fill="currentColor"/>
                    <path d="M1088 228l0.4 1.2 1.4-0.6 1.2 1.7 1.3 0.7 0.6 2.3-0.5 2.2 1 2.7 2.3 1.5 0.1 1.7-1.7 0.9-0.1 2.1-2.2 3.1-0.9-0.4-0.2-1.4-3.1-2.2-0.7-3 0.1-4.4 0.5-1.9-0.9-1-0.5-2.1 1.9-3.1z" fill="currentColor"/>
                  </svg>
                </div>
                
                {/* Central Success Checkmark */}
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full shadow-2xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                {/* Location markers */}
                <div className="absolute top-12 left-12 w-4 h-4 bg-blue-500 rounded-full shadow-md"></div>
                <div className="absolute top-16 right-16 w-4 h-4 bg-purple-500 rounded-full shadow-md"></div>
                <div className="absolute bottom-16 left-16 w-4 h-4 bg-orange-500 rounded-full shadow-md"></div>
                <div className="absolute bottom-12 right-12 w-4 h-4 bg-pink-500 rounded-full shadow-md"></div>
                
                {/* Success text */}
                <div className="absolute bottom-8 text-center">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">Connected Globally</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Lower Half - Text and Controls */}
        <div className="h-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-8 py-8 flex flex-col">
          <div className={`text-center transition-all duration-500 transform flex-1 ${
            isAnimating ? 'translate-y-4 opacity-50' : 'translate-y-0 opacity-100'
          }`}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6 max-w-sm mx-auto">
              {currentStepData.description}
            </p>
            
            {/* Step Indicators */}
            <div className="flex justify-center space-x-3 mb-6">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-8 bg-blue-500 dark:bg-blue-400' 
                      : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Action Buttons - Fixed at Bottom */}
          <div className="w-full max-w-sm mx-auto space-y-3">
            <button 
              onClick={handleNext}
              disabled={isAnimating}
              className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
            </button>
            
            <button 
              onClick={handleSkip}
              className="w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Skip
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
