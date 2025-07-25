import { useLocation } from "wouter";
import EsimfoLogo from "@/components/esimfo-logo";

export default function NotFoundPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="mobile-screen flex flex-col items-center justify-center p-6 text-center">
      {/* 404 Illustration */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
          {/* Sevimli Üzgün Surat */}
          <svg width="64" height="64" viewBox="0 0 64 64" className="text-blue-500 dark:text-blue-400" fill="none">
            {/* Sol Göz */}
            <circle cx="20" cy="24" r="3" fill="currentColor" />
            
            {/* Sağ Göz */}
            <circle cx="44" cy="24" r="3" fill="currentColor" />
            
            {/* Üzgün Ağız */}
            <path 
              d="M 20 40 Q 32 48 44 40" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Üzgün Kaşlar */}
            <path 
              d="M 14 18 L 26 20" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
            <path 
              d="M 38 20 L 50 18" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
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