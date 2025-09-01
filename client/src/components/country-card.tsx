import React, { memo } from 'react';
import type { Country } from "@shared/schema";

interface CountryCardProps {
  country: Country;
  onSelect: (country: Country) => void;
  showPrice?: boolean;
  price?: string;
}

const CountryCard = memo(function CountryCard({ 
  country, 
  onSelect, 
  showPrice = false, 
  price 
}: CountryCardProps) {
  return (
    <div 
      className="mobile-card p-4 touch-feedback cursor-pointer"
      onClick={() => onSelect(country)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={country.flagUrl} 
            alt={`${country.name} flag`} 
            className="flag-icon" 
          />
          <div>
            <p className="font-medium">{country.name}</p>
            <p className="text-sm text-muted-foreground">{country.region}</p>
          </div>
        </div>
        {showPrice && price ? (
          <p className="text-sm text-primary font-medium">from {price}</p>
        ) : (
          <span className="text-gray-400">›</span>
        )}
      </div>
    </div>
  );
});

export default CountryCard;
