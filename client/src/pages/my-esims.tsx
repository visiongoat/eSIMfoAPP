import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import EsimCard from "@/components/esim-card";
import type { Esim, Package, Country } from "@shared/schema";

export default function MyEsimsScreen() {
  const [, setLocation] = useLocation();

  const { data: esims = [], isLoading } = useQuery<(Esim & { package?: Package; country?: Country })[]>({
    queryKey: ["/api/esims"],
  });

  const handleViewQR = (esim: Esim) => {
    setLocation(`/qr/${esim.id}`);
  };

  const handleReorder = (esim: Esim & { package?: Package; country?: Country }) => {
    if (esim.package) {
      setLocation(`/packages/${esim.package.countryId}`);
    }
  };

  const activeEsims = esims.filter(esim => esim.status === 'Active');
  const recentEsims = esims.filter(esim => esim.status !== 'Active');

  // Calculate statistics
  const totalEsims = esims.length;
  const countriesVisited = new Set(esims.map(esim => esim.country?.name)).size;
  const totalDataUsed = esims.reduce((sum, esim) => {
    return sum + (parseFloat(esim.dataUsed || '0') / 1000); // Convert MB to GB
  }, 0);
  const totalSaved = 156; // Static for demo

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="My eSIMs"
        rightButton={
          <button 
            onClick={() => setLocation('/search')}
            className="text-primary font-medium"
          >
            + Add
          </button>
        }
      />

      <div className="px-4 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mobile-card p-4">
                <div className="skeleton w-full h-20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Active eSIMs */}
            {activeEsims.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-3">Active eSIMs</h2>
                {activeEsims.map((esim) => (
                  <EsimCard
                    key={esim.id}
                    esim={esim}
                    onViewQR={handleViewQR}
                  />
                ))}
              </div>
            )}

            {/* Recent eSIMs */}
            {recentEsims.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-3">Recent eSIMs</h2>
                <div className="space-y-3">
                  {recentEsims.map((esim) => (
                    <EsimCard
                      key={esim.id}
                      esim={esim}
                      onReorder={handleReorder}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Usage Statistics */}
            <div className="mobile-card p-4 mb-4">
              <h3 className="font-semibold mb-3">Usage Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{totalEsims}</p>
                  <p className="text-sm text-muted-foreground">Total eSIMs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{countriesVisited}</p>
                  <p className="text-sm text-muted-foreground">Countries Visited</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{totalDataUsed.toFixed(0)}GB</p>
                  <p className="text-sm text-muted-foreground">Data Used</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">€{totalSaved}</p>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {esims.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No eSIMs Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by purchasing your first eSIM
                </p>
                <button 
                  onClick={() => setLocation('/search')}
                  className="button-primary px-8"
                >
                  Browse eSIMs
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <TabBar />
    </div>
  );
}
