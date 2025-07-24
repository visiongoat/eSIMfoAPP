import { useQuery } from "@tanstack/react-query";
import StatusBar from "@/components/status-bar";
import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import type { PartnerStats, Sale, Package, Country } from "@shared/schema";

export default function PartnerScreen() {
  const { data: stats } = useQuery<PartnerStats>({
    queryKey: ["/api/partner/stats"],
  });

  const { data: recentSales = [] } = useQuery<(Sale & { package?: Package; country?: Country })[]>({
    queryKey: ["/api/partner/sales"],
  });

  const partnerTools = [
    { icon: "📊", label: "Analytics", bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { icon: "👥", label: "Sub-Dealers", bgColor: "bg-green-50", textColor: "text-green-600" },
    { icon: "🎯", label: "Marketing", bgColor: "bg-purple-50", textColor: "text-purple-600" },
    { icon: "💰", label: "Payouts", bgColor: "bg-orange-50", textColor: "text-orange-600" },
  ];

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const saleDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  return (
    <div className="mobile-screen">
      <StatusBar />
      <NavigationBar 
        title="Partner Dashboard"
        rightButton={
          <button className="text-primary font-medium">
            More
          </button>
        }
      />

      <div className="px-4 pt-4">
        {/* Revenue Overview */}
        <div className="mobile-card p-4 mb-4 gradient-bg text-white">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold">€{stats?.monthlyRevenue || '2,468'}</p>
              <p className="text-sm opacity-90">This Month</p>
            </div>
            <div>
              <p className="text-xl font-semibold">+24%</p>
              <p className="text-sm opacity-90">vs Last Month</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="mobile-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats?.esimsSOld || 247}</p>
            <p className="text-sm text-muted-foreground">eSIMs Sold</p>
          </div>
          <div className="mobile-card p-4 text-center">
            <p className="text-2xl font-bold text-secondary">{stats?.subDealers || 18}</p>
            <p className="text-sm text-muted-foreground">Sub-Dealers</p>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="mobile-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Sales</h3>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          
          {recentSales.length > 0 ? (
            <div className="space-y-3">
              {recentSales.slice(0, 3).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {sale.country && (
                      <img 
                        src={sale.country.flagUrl} 
                        alt={`${sale.country.name} flag`} 
                        className="flag-icon" 
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {sale.country?.name} - {sale.package?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(sale.createdAt || new Date())}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">€{sale.amount}</p>
                    <p className="text-xs text-secondary">+€{sale.commission}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recent sales</p>
          )}
        </div>

        {/* Partner Tools */}
        <div className="mobile-card p-4 mb-4">
          <h3 className="font-semibold mb-3">Partner Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {partnerTools.map((tool, index) => (
              <button 
                key={index}
                className={`${tool.bgColor} ${tool.textColor} p-3 rounded-xl text-center touch-feedback`}
              >
                <div className="text-2xl mb-1">{tool.icon}</div>
                <p className="text-sm font-medium">{tool.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Commission Structure */}
        <div className="mobile-card p-4 mb-6">
          <h3 className="font-semibold mb-3">Commission Rates</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Direct Sales</span>
              <span className="font-medium">{stats?.commissionRate || 20}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sub-Dealer Sales</span>
              <span className="font-medium">5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bonus Tier</span>
              <span className="font-medium text-secondary">Achieved</span>
            </div>
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
