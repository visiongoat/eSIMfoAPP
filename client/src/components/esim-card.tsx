import type { Esim, Package, Country } from "@shared/schema";

interface EsimCardProps {
  esim: Esim & { package?: Package; country?: Country };
  onViewQR?: (esim: Esim) => void;
  onReorder?: (esim: Esim) => void;
}

export default function EsimCard({ esim, onViewQR, onReorder }: EsimCardProps) {
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
        <div className="space-x-3">
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
        </div>
      </div>
    </div>
  );
}
