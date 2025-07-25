import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useState } from "react";

interface NetworkBannerProps {
  isVisible: boolean;
  type: 'offline' | 'error' | 'slowConnection';
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function NetworkBanner({ isVisible, type, onRetry, onDismiss }: NetworkBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed) return null;

  const getBannerConfig = () => {
    switch (type) {
      case 'offline':
        return {
          bgColor: 'bg-red-500',
          icon: <AlertTriangle className="w-4 h-4" />,
          message: 'You are offline. Check your connection.',
          showRetry: false
        };
      case 'error':
        return {
          bgColor: 'bg-orange-500',
          icon: <AlertTriangle className="w-4 h-4" />,
          message: 'Connection issues detected.',
          showRetry: true
        };
      case 'slowConnection':
        return {
          bgColor: 'bg-yellow-500',
          icon: <AlertTriangle className="w-4 h-4" />,
          message: 'Slow connection detected.',
          showRetry: false
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          icon: <AlertTriangle className="w-4 h-4" />,
          message: 'Network issue',
          showRetry: false
        };
    }
  };

  const config = getBannerConfig();

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className={`${config.bgColor} text-white px-4 py-2 flex items-center justify-between shadow-lg animate-slideDown`}>
      <div className="flex items-center space-x-2">
        {config.icon}
        <span className="text-sm font-medium">{config.message}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        {config.showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}