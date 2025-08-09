export default function Balance1Screen() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 1. Mavi Gradient Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 pt-12 pb-8">
        {/* Welcome Message */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <span className="text-white text-lg font-medium">Welcome back,</span>
            <br />
            <span className="text-white text-lg font-bold">Cassie!</span>
          </div>
        </div>

        {/* 2. Balance Display */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-white/90 text-base">Balance</span>
            <span className="text-white/70 mx-2">•</span>
            <span className="text-white/90 text-base">EUR</span>
            <svg className="w-4 h-4 text-white/70 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="text-white text-5xl font-bold">€75.92</div>
        </div>
      </div>

      {/* Geçici content area */}
      <div className="p-4">
        <p className="text-gray-600">Buraya sonraki adımları ekleyeceğiz...</p>
      </div>
    </div>
  );
}