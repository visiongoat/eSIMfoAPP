import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ErrorBoundaryProps {
  title: string;
  message: string;
  type?: 'network' | 'server' | 'timeout' | 'generic';
  onRetry?: () => void;
  onGoOffline?: () => void;
}

export default function ErrorBoundary({ 
  title, 
  message, 
  type = 'generic', 
  onRetry, 
  onGoOffline 
}: ErrorBoundaryProps) {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff className="w-12 h-12 text-red-500" />;
      case 'timeout':
        return <RefreshCw className="w-12 h-12 text-yellow-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'network':
        return 'from-red-50 to-red-100';
      case 'timeout':
        return 'from-yellow-50 to-yellow-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getBackgroundColor()} rounded-2xl p-6 text-center shadow-sm border`}>
      <div className="flex flex-col items-center space-y-4">
        {getIcon()}
        
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
          
          {onGoOffline && type === 'network' && (
            <button
              onClick={onGoOffline}
              className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
            >
              <WifiOff className="w-4 h-4" />
              <span>Go Offline</span>
            </button>
          )}
        </div>

        {type === 'network' && (
          <div className="text-xs text-gray-500 mt-2">
            Check your internet connection and try again
          </div>
        )}
      </div>
    </div>
  );
}