import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import StatusBar from "@/components/status-bar";
import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import PackageCard from "@/components/package-card";
import type { Country, Package } from "@shared/schema";

export default function PackagesScreen() {
  const [, params] = useRoute("/packages/:countryId");
  const [, setLocation] = useLocation();
  const countryId = params?.countryId ? parseInt(params.countryId) : null;

  const { data: country } = useQuery<Country>({
    queryKey: ["/api/countries", countryId],
    enabled: !!countryId,
  });

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/countries", countryId, "packages"],
    enabled: !!countryId,
  });

  const handlePackageSelect = (pkg: Package) => {
    setLocation(`/purchase/${pkg.id}`);
  };

  if (!countryId) {
    return <div>Invalid country ID</div>;
  }

  return (
    <div className="mobile-screen">
      <StatusBar />
      <NavigationBar 
        title={country?.name || "Loading..."}
        showBack={true}
      />

      <div className="px-4 pt-4">
        {/* Country Info */}
        {country && (
          <div className="mobile-card p-4 mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src={country.flagUrl} 
                alt={`${country.name} flag`} 
                className="w-8 h-6 rounded" 
              />
              <div>
                <p className="font-semibold text-lg">{country.name}</p>
                <p className="text-sm text-muted-foreground">
                  {country.region} • {country.network} Network
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span>📶</span>
                <span>{country.coverage} Coverage</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>⚡</span>
                <span>{country.network} Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-4">
          <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
            Data Only
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            Voice + Data
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            Unlimited
          </button>
        </div>

        {/* Package List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mobile-card p-4">
                <div className="skeleton w-full h-20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onSelect={handlePackageSelect}
              />
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
