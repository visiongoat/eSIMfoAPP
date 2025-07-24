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
        <svg 
          viewBox="0 0 40 40" 
          className="h-full w-auto"
          fill="none"
        >
          {/* Modern eSIM chip icon */}
          <rect 
            x="6" y="8" 
            width="28" height="24" 
            rx="4" 
            fill="#3B82F6" 
            stroke="#1E40AF" 
            strokeWidth="1"
          />
          <rect x="10" y="12" width="8" height="6" rx="1" fill="white" />
          <rect x="22" y="12" width="8" height="6" rx="1" fill="white" />
          <rect x="10" y="22" width="20" height="4" rx="1" fill="white" />
          <circle cx="32" cy="32" r="6" fill="#FFD700" stroke="#F59E0B" strokeWidth="1" />
          <path d="M29 32l2 2 4-4" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center space-x-2`}>
      {/* Icon */}
      <svg 
        viewBox="0 0 40 40" 
        className="h-full w-auto"
        fill="none"
      >
        <rect 
          x="6" y="8" 
          width="28" height="24" 
          rx="4" 
          fill="#3B82F6" 
          stroke="#1E40AF" 
          strokeWidth="1"
        />
        <rect x="10" y="12" width="8" height="6" rx="1" fill="white" />
        <rect x="22" y="12" width="8" height="6" rx="1" fill="white" />
        <rect x="10" y="22" width="20" height="4" rx="1" fill="white" />
        <circle cx="32" cy="32" r="6" fill="#FFD700" stroke="#F59E0B" strokeWidth="1" />
        <path d="M29 32l2 2 4-4" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      
      {/* Text */}
      <div className="flex items-baseline space-x-0.5">
        <span className="font-bold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
          e-sim
        </span>
        <span className="font-bold text-blue-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
          fo
        </span>
      </div>
    </div>
  );
}