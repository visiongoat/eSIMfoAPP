export default function Balance1Screen() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sophisticated Blue Gradient Header - includes status bar */}
      <div className="relative overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-blue-600"></div>
        
        {/* Multiple overlapping gradients for complex effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/80 via-blue-500/60 to-blue-700/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-300/40 via-transparent to-blue-800/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        
        {/* Noise-like effect using CSS */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 1px),
              radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 1px, transparent 1px),
              radial-gradient(circle at 90% 20%, rgba(255,255,255,0.12) 1px, transparent 1px),
              radial-gradient(circle at 60% 40%, rgba(255,255,255,0.09) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px, 120px 120px, 100px 100px, 90px 90px, 110px 110px'
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

      {/* Content area with rounded top corners */}
      <div className="bg-gray-50 -mt-6 rounded-t-3xl relative z-20 pt-6 px-4">
        {/* Promo Cards - matching example */}
        <div className="flex space-x-3 mb-6">
          {/* 200 MB Free Card */}
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">200 MB Free</h3>
                <p className="text-gray-600 text-sm leading-tight">for international and<br />local plans!</p>
              </div>
              <div className="ml-3 relative">
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" fill="#3B82F6" opacity="0.1"/>
                    <circle cx="20" cy="20" r="14" fill="#3B82F6" opacity="0.2"/>
                    <circle cx="20" cy="20" r="10" fill="#10B981"/>
                    <path d="M12 20l6 6 10-10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {/* Orbital lines */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="#3B82F6" strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="3 3"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Get £30 Card */}
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Get €30</h3>
              <p className="text-gray-600 text-sm">for referring a f...</p>
            </div>
          </div>
        </div>

        <p className="text-gray-600">Buraya sonraki adımları ekleyeceğiz...</p>
      </div>
    </div>
  );
}