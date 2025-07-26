import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

import NavigationBar from "@/components/navigation-bar";
import TabBar from "@/components/tab-bar";
import EsimfoLogo from "@/components/esimfo-logo";
import { useTheme } from "@/contexts/theme-context";
import type { User } from "@shared/schema";

export default function ProfileScreen() {
  const [, setLocation] = useLocation();
  const [showQuickActions, setShowQuickActions] = useState(false);
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

      <TabBar onPlusClick={() => setShowQuickActions(true)} />
      {showQuickActions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" onClick={() => setShowQuickActions(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div></div>
            <div className="px-6 pb-4"><h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quick Actions</h2><p className="text-gray-500 dark:text-gray-400 text-sm">Choose your eSIM category to get started</p></div>
            <div className="px-6 pb-8 space-y-3">
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations'); }} className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Local eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</p></div></div><svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations'); }} className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 rounded-2xl p-4 border border-green-200 dark:border-green-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regional eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</p></div></div><svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
              <button onClick={() => { setShowQuickActions(false); setLocation('/destinations'); }} className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 transition-all duration-200 group active:scale-[0.98]"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div className="text-left"><h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Global eSIMs</h3><p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage plans</p></div></div><svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
