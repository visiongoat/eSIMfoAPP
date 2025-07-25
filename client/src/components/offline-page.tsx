import { WifiOff, RefreshCw, Home } from "lucide-react";

interface OfflinePageProps {
  onRetry?: () => void;
}

export default function OfflinePage({ onRetry }: OfflinePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
        {/* Offline Icon */}
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          You're Offline
        </h1>
        
        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-8">
          It looks like you don't have an internet connection right now. 
          Please check your connection and try again.
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-4">
            Make sure airplane mode is off and you're connected to WiFi or mobile data
          </div>
        </div>
        
        {/* Offline Tips */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">When you're back online:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
            <li>• Browse 200+ country eSIM plans</li>
            <li>• Instant activation in minutes</li>
            <li>• 24/7 customer support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}