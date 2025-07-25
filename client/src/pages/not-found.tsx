import { useLocation } from "wouter";
import EsimfoLogo from "@/components/esimfo-logo";

export default function NotFoundPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="mobile-screen flex flex-col items-center justify-center p-6 text-center">
      {/* 404 Illustration */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.064 2.379l-.833-.14C4.446 16.687 4 16.144 4 15.5c0-1.096.89-2 2-2h12c1.11 0 2 .904 2 2 0 .644-.446 1.187-1.103 1.739l-.833.14z" />
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