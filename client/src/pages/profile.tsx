import { useQuery } from "@tanstack/react-query";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import EsimfoLogo from "@/components/esimfo-logo";
import { useTheme } from "@/contexts/theme-context";
import type { User } from "@shared/schema";

export default function ProfileScreen() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/profile"],
  });

  const { theme, toggleTheme } = useTheme();

  const profileSections = [
    {
      title: "Account Settings",
      items: [
        { icon: "👤", label: "Personal Information", hasArrow: true },
        { icon: "💳", label: "Payment Methods", hasArrow: true },
        { icon: "🎨", label: "Theme", hasToggle: true, enabled: theme === 'dark' },
        { icon: "🔔", label: "Notifications", hasToggle: true, enabled: true },
        { icon: "🔒", label: "Privacy & Security", hasArrow: true },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: "❓", label: "Help Center", hasArrow: true },
        { icon: "💬", label: "Contact Support", hasArrow: true },
        { icon: "⭐", label: "Rate the App", hasArrow: true },
      ]
    },
    {
      title: "About",
      items: [
        { icon: "📄", label: "Terms of Service", hasArrow: true },
        { icon: "🛡️", label: "Privacy Policy", hasArrow: true },
        { icon: "ℹ️", label: "About Esimfo", value: "v1.2.3" },
      ]
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Profile"
        rightButton={
          <button className="text-primary font-medium">
            Edit
          </button>
        }
      />

      <div className="px-4 pt-4">
        {/* Profile Header */}
        <div className="mobile-card p-6 mb-4 text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {user ? getInitials(user.name) : 'JD'}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">{user?.name || 'John Doe'}</h2>
          <p className="text-muted-foreground">{user?.email || 'john.doe@email.com'}</p>
          <p className="text-sm text-muted-foreground mt-2">Member since January 2023</p>
        </div>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mobile-card p-4 mb-4">
            <h3 className="font-semibold mb-3">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className={`flex items-center justify-between py-2 ${
                    'hasToggle' in item && item.hasToggle && item.label === 'Theme' 
                      ? 'cursor-pointer' 
                      : ''
                  }`}
                  onClick={() => {
                    if ('hasToggle' in item && item.hasToggle && item.label === 'Theme') {
                      toggleTheme();
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  
                  {item.hasArrow && (
                    <span className="text-gray-400">›</span>
                  )}
                  
                  {'hasToggle' in item && item.hasToggle && item.label === 'Theme' && (
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
                      </div>
                    </div>
                  )}
                  
                  {'hasToggle' in item && item.hasToggle && item.label !== 'Theme' && (
                    <div className="flex items-center space-x-2">
                      <div className={`w-10 h-6 rounded-full relative transition-all duration-200 ${
                        'enabled' in item && item.enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                          'enabled' in item && item.enabled ? 'right-0.5' : 'left-0.5'
                        }`}></div>
                      </div>
                    </div>
                  )}
                  
                  {'value' in item && item.value && (
                    <div className="text-right text-sm text-muted-foreground">
                      {item.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <button className="w-full py-4 text-red-500 font-medium mb-4">
          Sign Out
        </button>

        {/* esimfo Branding Footer */}
        <div className="text-center py-6 border-t border-gray-100">
          <EsimfoLogo size="sm" className="justify-center mb-2" />
          <p className="text-xs text-gray-500">Version 1.2.3 • Made with ❤️ for travelers</p>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
