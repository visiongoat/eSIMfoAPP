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
    <div className="mobile-card p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {esim.country && (
            <img 
              src={esim.country.flagUrl} 
              alt={`${esim.country.name} flag`} 
              className="flag-icon" 
            />
          )}
          <div>
            <p className="font-semibold">{esim.country?.name}</p>
            <p className="text-sm text-muted-foreground">{esim.package?.name}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(esim.status)}`}>
          {esim.status}
        </span>
      </div>

      {esim.status === 'Active' && (
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Data Used</span>
            <span className="font-medium">
              {esim.dataUsed}MB / {esim.package?.data}
            </span>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-fill" 
              style={{ width: `${calculateUsagePercentage()}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          {esim.status === 'Active' ? 'Expires:' : 'Used:'} {' '}
          {esim.expiresAt ? new Date(esim.expiresAt).toLocaleDateString() : 'N/A'}
        </span>
        <div className="flex space-x-2">
          {esim.status === 'Active' && onViewQR && (
            <button 
              onClick={() => onViewQR(esim)}
              className="text-primary font-medium"
            >
              View QR
            </button>
          )}
          {esim.status === 'Expired' && onReorder && (
            <button 
              onClick={() => onReorder(esim)}
              className="text-primary font-medium"
            >
              Reorder
            </button>
          )}
          {onShare && (
            <button 
              onClick={() => onShare(esim)}
              className="text-gray-600 dark:text-gray-400 hover:text-primary font-medium"
              title="Share eSIM"
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
