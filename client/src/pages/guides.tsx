import MobileContainer from "@/components/mobile-container";
import TabBar from "@/components/tab-bar";
import EsimfoLogo from "@/components/esimfo-logo";

export default function GuidesScreen() {
  const guides = [
    {
      id: 1,
      title: "How to Install Your eSIM",
      description: "Step-by-step guide to activate your eSIM",
      icon: "📱",
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "Troubleshooting Connection Issues",
      description: "Common solutions for connectivity problems",
      icon: "🔧",
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "Best Practices for International Travel",
      description: "Tips for using eSIMs while traveling abroad",
      icon: "✈️",
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "Understanding Data Plans",
      description: "Choose the right plan for your needs",
      icon: "📊",
      readTime: "2 min read"
    }
  ];

  return (
    <MobileContainer>
      <div className="mobile-screen">
        {/* Header */}
        <div className="bg-white px-4 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <EsimfoLogo size="md" />
            <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Guides</h1>
          <p className="text-gray-600 mt-1">Everything you need to know about eSIMs</p>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="bg-gray-100 rounded-xl p-3 flex items-center space-x-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-500 text-sm">Search guides...</span>
          </div>
        </div>

        {/* Guides List */}
        <div className="px-4 space-y-3">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{guide.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{guide.readTime}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="px-4 py-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 text-sm">Need More Help?</h3>
                <p className="text-blue-700 text-xs mt-1">Contact our 24/7 support team</p>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
      <TabBar />
    </MobileContainer>
  );
}