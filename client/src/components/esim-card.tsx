import type { Esim, Package, Country } from "@shared/schema";

interface EsimCardProps {
  esim: Esim & { package?: Package; country?: Country };
  onViewQR?: (esim: Esim) => void;
  onReorder?: (esim: Esim) => void;
  onShare?: (esim: Esim) => void;
}

export default function EsimCard({ esim, onViewQR, onReorder, onShare }: EsimCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-secondary text-white';
      case 'expired':
        return 'bg-gray-100 text-gray-600';
      case 'ready':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateUsagePercentage = () => {
    if (!esim.package?.data || !esim.dataUsed) return 0;
    const total = parseFloat(esim.package.data.replace('GB', '')) * 1000; // Convert to MB
    const used = parseFloat(esim.dataUsed);
    return Math.min((used / total) * 100, 100);
  };

  return (
    <div className="mobile-card p-3 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {esim.country && (
            <img 
              src={esim.country.flagUrl} 
              alt={`${esim.country.name} flag`} 
              className="w-6 h-4 rounded object-cover" 
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{esim.country?.name || 'eSIM'}</p>
              <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${getStatusColor(esim.status)}`}>
                {esim.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{esim.package?.name}</p>
              {esim.status === 'Active' && (
                <p className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
                  {esim.dataUsed}MB/{esim.package?.data}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          {esim.status === 'Active' && onViewQR && (
            <button 
              onClick={() => onViewQR(esim)}
              className="text-blue-600 dark:text-blue-400 text-xs font-medium"
            >
              QR
            </button>
          )}
          {esim.status === 'Expired' && onReorder && (
            <button 
              onClick={() => onReorder(esim)}
              className="text-blue-600 dark:text-blue-400 text-xs font-medium"
            >
              Reorder
            </button>
          )}
          {onShare && (
            <button 
              onClick={() => onShare(esim)}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              title="Share"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
