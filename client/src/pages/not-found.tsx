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
            {/* Sol Göz - X şekli */}
            <rect x="16" y="18" width="3" height="3" fill="currentColor" />
            <rect x="19" y="21" width="3" height="3" fill="currentColor" />
            <rect x="22" y="24" width="3" height="3" fill="currentColor" />
            <rect x="19" y="24" width="3" height="3" fill="currentColor" />
            <rect x="16" y="21" width="3" height="3" fill="currentColor" />
            
            {/* Sağ Göz - X şekli */}
            <rect x="39" y="18" width="3" height="3" fill="currentColor" />
            <rect x="42" y="21" width="3" height="3" fill="currentColor" />
            <rect x="45" y="24" width="3" height="3" fill="currentColor" />
            <rect x="42" y="24" width="3" height="3" fill="currentColor" />
            <rect x="39" y="21" width="3" height="3" fill="currentColor" />
            
            {/* Üzgün Ağız - Ters U şekli */}
            <rect x="22" y="42" width="3" height="3" fill="currentColor" />
            <rect x="25" y="45" width="3" height="3" fill="currentColor" />
            <rect x="28" y="47" width="3" height="3" fill="currentColor" />
            <rect x="31" y="48" width="3" height="3" fill="currentColor" />
            <rect x="34" y="47" width="3" height="3" fill="currentColor" />
            <rect x="37" y="45" width="3" height="3" fill="currentColor" />
            <rect x="40" y="42" width="3" height="3" fill="currentColor" />
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