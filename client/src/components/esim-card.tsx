import { Esim } from "@shared/schema";

interface EsimCardProps {
  esim: Esim & {
    country?: { name: string; flagUrl: string };
    package?: { name: string; data: string; duration: string; price: string };
  };
  onViewQR?: (esim: Esim) => void;
  onReorder?: (esim: Esim) => void;
  onShare?: (esim: Esim) => void;
}

export default function EsimCard({ esim, onViewQR, onReorder, onShare }: EsimCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Expired':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'Inactive':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const calculateUsagePercentage = () => {
    if (!esim.package?.data || !esim.dataUsed) return 0;
    const totalGB = parseFloat(esim.package.data.replace('GB', ''));
    const total = totalGB * 1000; // Convert GB to MB
    const used = parseFloat(esim.dataUsed);
    return Math.min((used / total) * 100, 100);
  };

  return (
    <div className="mobile-card p-4 mb-3">
      <div className="space-y-3">
        {/* Header with Flag, Country, and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={esim.country?.flagUrl || 'https://flagcdn.com/w320/tr.png'} 
              alt={`${esim.country?.name || 'Turkey'} flag`} 
              className="w-12 h-8 rounded object-cover border border-gray-200 dark:border-gray-600 shadow-sm" 
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-base">
                {esim.country?.name || 'Turkey'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {esim.package?.name || '5GB / 30 Days'} • eSIM #{esim.id}
              </p>
            </div>
          </div>
          <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${getStatusColor(esim.status)}`}>
            {esim.status}
          </span>
        </div>
        

        {/* Progress Bar for Active eSIMs */}
        {esim.status === 'Active' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                {esim.dataUsed}MB used of {esim.package?.data}
              </span>
              <span className={`font-medium ${calculateUsagePercentage() >= 80 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                {Math.round(calculateUsagePercentage())}%
                {calculateUsagePercentage() >= 80 && (
                  <span className="ml-1 text-orange-500">⚠️</span>
                )}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  calculateUsagePercentage() >= 80 ? 'bg-red-400' : 
                  calculateUsagePercentage() >= 60 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${Math.min(calculateUsagePercentage(), 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Footer with Actions and Date */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {esim.status === 'Active' ? 'Expires:' : 'Used:'} {' '}
            {esim.expiresAt ? new Date(esim.expiresAt).toLocaleDateString() : 'N/A'}
          </p>
          
          <div className="flex items-center space-x-3">
            {esim.status === 'Active' && onViewQR && (
              <button 
                onClick={() => onViewQR(esim)}
                className="text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline"
              >
                Setup eSIM
              </button>
            )}
            {esim.status === 'Expired' && onReorder && (
              <button 
                onClick={() => onReorder(esim)}
                className="text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline"
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
    </div>
  );
}