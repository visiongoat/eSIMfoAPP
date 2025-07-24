import type { Package } from "@shared/schema";

interface PackageCardProps {
  package: Package;
  onSelect: (pkg: Package) => void;
}

export default function PackageCard({ package: pkg, onSelect }: PackageCardProps) {
  return (
    <div className="mobile-card p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-lg">{pkg.name}</p>
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">€{pkg.price}</p>
          {pkg.originalPrice && (
            <p className="text-sm text-muted-foreground line-through">
              €{pkg.originalPrice}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          {pkg.features?.map((feature, index) => (
            <span key={index}>📱 {feature}</span>
          ))}
        </div>
        <button 
          onClick={() => onSelect(pkg)}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium touch-feedback"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
