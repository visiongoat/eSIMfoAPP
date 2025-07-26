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
            
            {/* Step 1: Simple World Connectivity */}
            {currentStep === 0 && (
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Clean Earth Globe */}
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 dark:from-blue-600 dark:via-blue-700 dark:to-blue-900 shadow-2xl relative overflow-hidden">
                  {/* Continents */}
                  <div className="absolute top-4 left-6 w-8 h-6 bg-green-500/60 rounded-full"></div>
                  <div className="absolute bottom-6 right-8 w-12 h-8 bg-green-500/60 rounded-lg"></div>
                  <div className="absolute top-1/2 left-2 w-6 h-10 bg-green-500/60 rounded-full"></div>
                  {/* Globe shine */}
                  <div className="absolute top-6 left-8 w-12 h-12 bg-white/20 rounded-full blur-sm"></div>
                </div>
                
                {/* Connection Points around Globe */}
                <div className="absolute top-8 right-8 w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
                <div className="absolute bottom-12 left-8 w-4 h-4 bg-blue-400 rounded-full shadow-lg"></div>
                <div className="absolute top-12 left-12 w-4 h-4 bg-purple-400 rounded-full shadow-lg"></div>
                <div className="absolute bottom-8 right-12 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
                
                {/* Simple Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                  <path d="M50 50 L128 128" stroke="#3B82F6" strokeWidth="2" opacity="0.4"/>
                  <path d="M206 50 L128 128" stroke="#8B5CF6" strokeWidth="2" opacity="0.4"/>
                  <path d="M50 206 L128 128" stroke="#10B981" strokeWidth="2" opacity="0.4"/>
                  <path d="M206 206 L128 128" stroke="#F59E0B" strokeWidth="2" opacity="0.4"/>
                </svg>
              </div>
            )}
            
            {/* Step 2: Clean eSIM Phone */}
            {currentStep === 1 && (
              <div className="relative w-64 h-80 flex items-center justify-center">
                {/* Simple Smartphone */}
                <div className="w-44 h-64 bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-[2rem] shadow-2xl relative">
                  {/* Screen */}
                  <div className="absolute inset-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 rounded-[1.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="h-6 bg-black/5 dark:bg-white/5 flex items-center justify-between px-3">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">eSIM</div>
                    </div>
                    
                    {/* eSIM Card in Center */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-24 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg relative">
                          {/* Chip Pattern */}
                          <div className="absolute top-3 left-3 grid grid-cols-4 gap-1">
                            {[...Array(8)].map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-sm"></div>
                            ))}
                          </div>
                          {/* eSIM Text */}
                          <div className="absolute bottom-2 right-3 text-sm text-white font-bold">eSIM</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Signal Bars at Bottom */}
                    <div className="h-8 flex items-center justify-center space-x-1">
                      <div className="w-2 h-3 bg-blue-500 rounded-t-sm"></div>
                      <div className="w-2 h-4 bg-blue-500 rounded-t-sm"></div>
                      <div className="w-2 h-5 bg-blue-500 rounded-t-sm"></div>
                      <div className="w-2 h-6 bg-blue-500 rounded-t-sm"></div>
                      <div className="w-2 h-7 bg-blue-500 rounded-t-sm"></div>
                    </div>
                  </div>
                  
                  {/* Home Indicator */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
            )}
            
            {/* Step 3: Travel Success */}
            {currentStep === 2 && (
              <div className="relative w-80 h-64 flex items-center justify-center">
                {/* World Map Background */}
                <div className="absolute inset-0 opacity-15 dark:opacity-25">
                  <svg viewBox="0 0 320 256" className="w-full h-full">
                    <path d="M50 80 L120 60 L180 80 L240 70 L280 90 L270 140 L200 160 L140 150 L80 160 L40 140 Z" 
                          fill="currentColor" className="text-blue-500"/>
                    <path d="M60 180 L130 170 L190 180 L250 175 L290 190 L280 220 L210 230 L150 225 L90 230 L50 220 Z" 
                          fill="currentColor" className="text-green-500"/>
                  </svg>
                </div>
                
                {/* Central Success Icon */}
                <div className="relative z-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full shadow-2xl flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                {/* Connection Points */}
                <div className="absolute top-12 left-12 w-6 h-6 bg-blue-500 rounded-full shadow-lg"></div>
                <div className="absolute top-16 right-16 w-6 h-6 bg-purple-500 rounded-full shadow-lg"></div>
                <div className="absolute bottom-16 left-16 w-6 h-6 bg-yellow-500 rounded-full shadow-lg"></div>
                <div className="absolute bottom-12 right-12 w-6 h-6 bg-pink-500 rounded-full shadow-lg"></div>
                
                {/* Simple Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 256">
                  <path d="M48 48 L160 128" stroke="#3B82F6" strokeWidth="2" opacity="0.3"/>
                  <path d="M272 64 L160 128" stroke="#8B5CF6" strokeWidth="2" opacity="0.3"/>
                  <path d="M64 208 L160 128" stroke="#EAB308" strokeWidth="2" opacity="0.3"/>
                  <path d="M256 208 L160 128" stroke="#EC4899" strokeWidth="2" opacity="0.3"/>
                </svg>
                
                {/* Travel Icons */}
                <div className="absolute top-8 right-8 text-2xl">✈️</div>
                <div className="absolute bottom-8 left-8 text-2xl">🌍</div>
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
