import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

interface NetworkErrorProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
  showRetryButton?: boolean;
}

export default function NetworkError({
  onRetry,
  title = "Connection Problem",
  message = "Please check your internet connection and try again.",
  showRetryButton = true
}: NetworkErrorProps) {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Network Status Icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center">
        {isOnline ? (
          <Wifi className="w-10 h-10 text-red-500 dark:text-red-400" />
        ) : (
          <WifiOff className="w-10 h-10 text-red-500 dark:text-red-400" />
        )}
      </div>

      {/* Error Content */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">{message}</p>

      {/* Connection Status */}
      <div className="flex items-center space-x-2 mb-6">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isOnline ? 'Connected' : 'No Internet Connection'}
        </span>
      </div>

      {/* Retry Button */}
      {showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}