import { useLocation } from "wouter";
import NavigationBar from "@/components/navigation-bar";

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  timestamp: Date;
  status: 'active' | 'completed';
  browser: string;
  os: string;
}

export default function LoginActivity() {
  const [, setLocation] = useLocation();

  // Mock login activity data - in real app this would come from API
  const loginSessions: LoginSession[] = [
    {
      id: '1',
      device: 'iPhone 14 Pro',
      location: 'Istanbul, Turkey',
      ip: '176.88.45.123',
      timestamp: new Date(),
      status: 'active',
      browser: 'Safari',
      os: 'iOS 17.2'
    },
    {
      id: '2',
      device: 'MacBook Pro',
      location: 'Ankara, Turkey',
      ip: '85.105.23.67',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'completed',
      browser: 'Chrome',
      os: 'macOS 14.2'
    },
    {
      id: '3',
      device: 'Windows PC',
      location: 'Izmir, Turkey',
      ip: '178.242.89.156',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: 'completed',
      browser: 'Firefox',
      os: 'Windows 11'
    },
    {
      id: '4',
      device: 'Samsung Galaxy S24',
      location: 'Antalya, Turkey',
      ip: '88.237.156.89',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      status: 'completed',
      browser: 'Chrome Mobile',
      os: 'Android 14'
    },
    {
      id: '5',
      device: 'iPad Air',
      location: 'Bursa, Turkey',
      ip: '213.74.98.123',
      timestamp: new Date(Date.now() - 604800000), // 1 week ago
      status: 'completed',
      browser: 'Safari',
      os: 'iPadOS 17.2'
    }
  ];

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString();
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Samsung') || device.includes('Android')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm2 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (device.includes('iPad')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zM4 4a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm6 11a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Login Activity"
        showBackButton={true}
        onBackClick={() => setLocation('/personal-info')}
      />

      <div className="px-6 pt-4 pb-28 space-y-6">
        {/* Current Session Info */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">Current Session</h3>
              <p className="text-sm text-green-700 dark:text-green-300">This device is currently signed in</p>
            </div>
          </div>
          
          {loginSessions.filter(session => session.status === 'active').map(session => (
            <div key={session.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-green-600 dark:text-green-400">
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">{session.device}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{session.browser} • {session.os}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">{formatRelativeTime(session.timestamp)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Active now</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
                <span>{session.location}</span>
                <span>{session.ip}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Sessions</h3>
          
          {loginSessions.filter(session => session.status === 'completed').map((session, index) => (
            <div key={session.id} className={`py-3 ${index !== loginSessions.filter(s => s.status === 'completed').length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500 dark:text-gray-400">
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{session.device}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session.browser} • {session.os}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatRelativeTime(session.timestamp)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Signed out</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{session.location}</span>
                <span>{session.ip}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Security Reminder</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                If you notice any suspicious activity or unrecognized devices, please change your password immediately and contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}