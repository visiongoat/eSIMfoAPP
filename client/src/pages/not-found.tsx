import { useLocation } from "wouter";
import EsimfoLogo from "@/components/esimfo-logo";

export default function NotFoundPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="mobile-screen flex flex-col items-center justify-center p-6 text-center">
      {/* 404 Illustration */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
          {/* Pixel Art Üzgün Surat */}
          <svg width="64" height="64" viewBox="0 0 64 64" className="text-blue-500 dark:text-blue-400">
            {/* Sol Göz */}
            <rect x="18" y="20" width="6" height="6" fill="currentColor" />
            <rect x="18" y="26" width="2" height="2" fill="currentColor" />
            <rect x="22" y="26" width="2" height="2" fill="currentColor" />
            
            {/* Sağ Göz */}
            <rect x="40" y="20" width="6" height="6" fill="currentColor" />
            <rect x="40" y="26" width="2" height="2" fill="currentColor" />
            <rect x="44" y="26" width="2" height="2" fill="currentColor" />
            
            {/* Burun */}
            <rect x="30" y="30" width="4" height="4" fill="currentColor" />
            
            {/* Üzgün Ağız - Ters U şekli (daha büyük) */}
            <rect x="20" y="44" width="4" height="2" fill="currentColor" />
            <rect x="24" y="46" width="2" height="2" fill="currentColor" />
            <rect x="26" y="48" width="2" height="2" fill="currentColor" />
            <rect x="28" y="50" width="2" height="2" fill="currentColor" />
            <rect x="30" y="51" width="4" height="2" fill="currentColor" />
            <rect x="34" y="50" width="2" height="2" fill="currentColor" />
            <rect x="36" y="48" width="2" height="2" fill="currentColor" />
            <rect x="38" y="46" width="2" height="2" fill="currentColor" />
            <rect x="40" y="44" width="4" height="2" fill="currentColor" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 w-full max-w-sm">
        <button
          onClick={() => setLocation('/home')}
          className="w-full bg-primary text-white py-4 rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
        >
          Go to Home
        </button>
        
        <button
          onClick={() => window.history.back()}
          className="w-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white py-4 rounded-2xl font-semibold transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-[0.98]"
        >
          Go Back
        </button>
      </div>

      {/* esimfo Branding Footer */}
      <div className="mt-12">
        <EsimfoLogo size="sm" className="justify-center mb-3 opacity-60" />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Need help? Contact our support team
        </p>
      </div>
    </div>
  );
}