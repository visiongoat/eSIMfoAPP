import texturePattern from '@/assets/texture-pattern.jpeg';

export default function Balance1Screen() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sophisticated Blue Gradient Header - includes status bar */}
      <div className="relative overflow-hidden">
        {/* Base blue background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"></div>
        
        {/* Background image pattern */}
        <div 
          className="absolute inset-0 opacity-75"
          style={{
            backgroundImage: `url(${texturePattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'multiply'
          }}
        ></div>
        
        <div className="relative z-10 px-6 pt-8 pb-24">
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
            <div className="text-white text-6xl font-black tracking-tighter leading-none">€75.92</div>
          </div>
          
          {/* 3. Action Buttons - smaller and left aligned */}
          <div className="flex justify-start space-x-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium">Add money</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium">Exchange</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="text-white/90 text-xs font-medium">Cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content area with rounded top corners - extends higher */}
      <div className="bg-gray-50 -mt-16 rounded-t-3xl relative z-20 pt-8 px-4">
        <p className="text-gray-600">Buraya sonraki adımları ekleyeceğiz...</p>
      </div>
    </div>
  );
}