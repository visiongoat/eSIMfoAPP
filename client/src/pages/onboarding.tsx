import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// Full-Screen Global Connection Animation
const GlobalConnectionAnimation = () => (
  <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-900/10 via-blue-800/5 to-purple-900/10 dark:from-blue-900/20 dark:via-blue-800/10 dark:to-purple-900/20">
    {/* World Map Background Pattern */}
    <div className="absolute inset-0 opacity-5 dark:opacity-10">
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {/* Simplified World Map Paths */}
        <path d="M100 150 Q200 100 350 120 T600 180 L650 200 Q700 220 750 180 L800 200 L800 400 Q600 350 400 380 T100 400 Z" 
              fill="currentColor" opacity="0.3" />
        <path d="M50 300 Q150 280 250 300 T450 320 L500 340 Q550 360 600 340 L650 360 L650 500 Q450 480 250 500 T50 500 Z" 
              fill="currentColor" opacity="0.2" />
      </svg>
    </div>

    {/* Central Globe - Much Larger */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
      <div className="relative">
        {/* Outer Glow Ring */}
        <div className="absolute -inset-8 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-300/30 dark:to-purple-300/30 rounded-full blur-xl animate-pulse"></div>
        
        {/* Main Globe */}
        <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full shadow-2xl flex items-center justify-center">
          {/* Inner Earth */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-inner">
            <svg className="w-10 h-10 text-white/90" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Rotating Ring */}
          <div className="absolute inset-0 border-2 border-blue-300/50 dark:border-blue-200/50 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        </div>
      </div>
    </div>

    {/* Connection Lines to Corners */}
    <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="connectionLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="1">
            <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </stop>
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.6s" />
          </stop>
        </linearGradient>
      </defs>
      
      {/* Main Connection Lines */}
      <line x1="200" y1="300" x2="50" y2="100" stroke="url(#connectionLine)" strokeWidth="3" strokeDasharray="8 4" className="animate-pulse" />
      <line x1="200" y1="300" x2="350" y2="100" stroke="url(#connectionLine)" strokeWidth="3" strokeDasharray="8 4" className="animate-pulse" />
      <line x1="200" y1="300" x2="50" y2="500" stroke="url(#connectionLine)" strokeWidth="3" strokeDasharray="8 4" className="animate-pulse" />
      <line x1="200" y1="300" x2="350" y2="500" stroke="url(#connectionLine)" strokeWidth="3" strokeDasharray="8 4" className="animate-pulse" />
      
      {/* Data Flow Lines */}
      <line x1="200" y1="300" x2="50" y2="100" stroke="url(#dataFlow)" strokeWidth="2" />
      <line x1="200" y1="300" x2="350" y2="100" stroke="url(#dataFlow)" strokeWidth="2" />
      <line x1="200" y1="300" x2="50" y2="500" stroke="url(#dataFlow)" strokeWidth="2" />
      <line x1="200" y1="300" x2="350" y2="500" stroke="url(#dataFlow)" strokeWidth="2" />
    </svg>

    {/* Connection Nodes */}
    {[
      { x: '12%', y: '20%', delay: '0s' },
      { x: '88%', y: '20%', delay: '0.5s' },
      { x: '12%', y: '80%', delay: '1s' },
      { x: '88%', y: '80%', delay: '1.5s' },
      { x: '25%', y: '15%', delay: '2s' },
      { x: '75%', y: '15%', delay: '2.5s' },
      { x: '25%', y: '85%', delay: '3s' },
      { x: '75%', y: '85%', delay: '3.5s' }
    ].map((node, i) => (
      <div 
        key={i}
        className="absolute w-4 h-4 bg-blue-400 dark:bg-blue-300 rounded-full shadow-lg animate-ping z-20"
        style={{
          left: node.x,
          top: node.y,
          animationDelay: node.delay,
          animationDuration: '2s'
        }}
      >
        <div className="absolute inset-0 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
      </div>
    ))}

    {/* Floating Data Packets */}
    {Array.from({ length: 12 }).map((_, i) => (
      <div 
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce z-15"
        style={{
          left: `${15 + (i * 6)}%`,
          top: `${30 + Math.sin(i) * 20}%`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${2 + (i % 3)}s`
        }}
      />
    ))}

    {/* Signal Waves from Center */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5">
      {[80, 120, 160, 200, 240].map((size, i) => (
        <div 
          key={size}
          className="absolute border-2 border-blue-400/30 dark:border-blue-300/40 rounded-full animate-ping"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${-size/2}px`,
            top: `${-size/2}px`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: '3s'
          }}
        />
      ))}
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
      
      {/* Content Overlay */}
      <div className="relative z-30 flex flex-col items-center justify-end h-screen px-8 pb-20">
        <div className={`text-center transition-all duration-500 transform ${
          isAnimating ? 'translate-y-4 opacity-50' : 'translate-y-0 opacity-100'
        }`}>
          {/* Content Background */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-800/20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-sm mx-auto">
              {currentStepData.description}
            </p>
            
            {/* Step Indicators */}
            <div className="flex justify-center space-x-3 mb-8">
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
            
            {/* Action Buttons */}
            <div className="w-full max-w-sm mx-auto space-y-4">
              <button 
                onClick={handleNext}
                disabled={isAnimating}
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
              </button>
              
              <button 
                onClick={handleSkip}
                className="w-full py-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
