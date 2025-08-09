import { useState } from 'react';
import texturePattern from '@/assets/texture-pattern.jpeg';
import AddMoneyModal from '@/components/add-money-modal';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';

export default function Balance1Screen() {
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [balance, setBalance] = useState(75.92);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  
  const { displayValue } = useAnimatedCounter({
    targetValue: balance,
    duration: 1500,
    startAnimation: animationTrigger
  });

  const handleTopUpComplete = (amount: number, bonus: number = 0) => {
    const newBalance = balance + amount + bonus;
    setBalance(newBalance);
    setAnimationTrigger(true);
    
    // Reset animation trigger after animation completes
    setTimeout(() => setAnimationTrigger(false), 1600);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sophisticated Blue Gradient Header - includes status bar */}
      <div className="relative overflow-hidden">
        {/* Base blue background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"></div>
        
        {/* Animated Background image pattern */}
        <div 
          className="absolute inset-0 opacity-75"
          style={{
            backgroundImage: `url(${texturePattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'multiply',
            animation: 'textureFloat 6s ease-in-out infinite'
          }}
        ></div>
        
        <div className="relative z-10 px-6 pt-8 pb-16">
          {/* Welcome Message - Professional Typography */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
              </div>
              <div className="leading-tight">
                <div className="text-white/90 text-base font-medium">Welcome back,</div>
                <div className="text-white text-xl font-bold tracking-tight">Cassie!</div>
              </div>
            </div>
          </div>

          {/* 2. Elegant Balance Display */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <span className="text-white/80 text-base font-medium">Balance</span>
              <div className="w-1 h-1 bg-white/60 rounded-full mx-3"></div>
              <span className="text-white/80 text-base font-medium">EUR</span>
              <svg className="w-4 h-4 text-white/60 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-white text-6xl font-black tracking-tighter leading-none">€{displayValue.toFixed(2)}</div>
          </div>
          
          {/* 3. Action Buttons - smaller and left aligned */}
          <div className="flex justify-start space-x-6">
            <button 
              onClick={() => setIsAddMoneyModalOpen(true)}
              className="flex flex-col items-center group"
            >
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20 transition-all duration-200 group-hover:bg-white/30 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 group-active:bg-white/40">
                <svg className="w-5 h-5 text-white transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium transition-all duration-200 group-hover:text-white group-hover:font-semibold">Add money</span>
            </button>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium">Buy eSIM</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium">History</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content area with rounded top corners */}
      <div className="bg-gray-50 -mt-6 rounded-t-3xl relative z-20 pt-6 px-4">
        <p className="text-gray-600">Buraya sonraki adımları ekleyeceğiz...</p>
      </div>

      {/* Add Money Modal */}
      <AddMoneyModal 
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
        onTopUpComplete={handleTopUpComplete}
      />
    </div>
  );
}