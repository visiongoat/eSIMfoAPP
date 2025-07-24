interface EsimfoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

export default function EsimfoLogo({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}: EsimfoLogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-10',
    xl: 'h-12'
  };

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center`}>
        {/* Gerçek esimfo logosu - mavi kare ikon */}
        <div className="h-full aspect-square bg-blue-500 rounded-md flex items-center justify-center">
          <div className="text-white font-bold text-lg">e</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center space-x-2`}>
      {/* Gerçek esimfo logosu - mavi kare ikon */}
      <div className="h-full aspect-square bg-blue-500 rounded-md flex items-center justify-center">
        <div className="text-white font-bold text-lg">e</div>
      </div>
      
      {/* esimfo yazısı - gerçek logo stilinde */}
      <div className="flex items-center">
        <span className="font-semibold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
          e-sim
        </span>
        <span className="font-semibold text-blue-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
          fo
        </span>
      </div>
    </div>
  );
}