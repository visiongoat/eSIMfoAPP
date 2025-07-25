import { AlertTriangle, RefreshCw } from "lucide-react";

interface ServerErrorProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
  showRetryButton?: boolean;
  errorCode?: string;
}

export default function ServerError({
  onRetry,
  title = "Server Error",
  message = "Something went wrong on our end. Our team has been notified.",
  showRetryButton = true,
  errorCode
}: ServerErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Error Icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/20 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-orange-500 dark:text-orange-400" />
      </div>

      {/* Error Content */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">{message}</p>

      {/* Error Code */}
      {errorCode && (
        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg mb-6">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            Error: {errorCode}
          </span>
        </div>
      )}

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

      {/* Help Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        If the problem persists, please contact support
      </p>
    </div>
  );
}