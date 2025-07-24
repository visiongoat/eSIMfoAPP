import { useLocation } from "wouter";
import { useHaptic } from "@/hooks/use-haptic";

export default function TabBar() {
  const [location, setLocation] = useLocation();
  const { hapticFeedback } = useHaptic();

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/home' },
    { id: 'search', icon: '🔍', label: 'Search', path: '/search' },
    { id: 'my-esims', icon: '📱', label: 'My eSIMs', path: '/my-esims' },
    { id: 'partner', icon: '💼', label: 'Partner', path: '/partner' },
    { id: 'profile', icon: '👤', label: 'Profile', path: '/profile' },
  ];

  const handleTabClick = (path: string) => {
    hapticFeedback();
    setLocation(path);
  };

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-item ${location === tab.path ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.path)}
        >
          <div className="text-2xl mb-1">{tab.icon}</div>
          <span className="text-xs">{tab.label}</span>
        </div>
      ))}
    </div>
  );
}
