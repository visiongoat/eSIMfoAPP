import NavigationBar from "@/components/navigation-bar";

export default function ContactSupportScreen() {
  const handleEmailSupport = () => {
    window.location.href = "mailto:support@esimfo.com?subject=eSIM Support Request";
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/436766440122?text=Hello! I need help with my eSIM service.", "_blank");
  };

  const handleLiveChat = () => {
    // Placeholder for live chat integration
    console.log("Opening live chat...");
  };

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Contact Support"
        showBackButton={true}
      />

      <div className="px-4 pt-4 pb-20">
        {/* Hero Illustration */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">We're Here to Help!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Need assistance with your eSIM or have questions about our services? Our friendly support team is ready to help you 24/7.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-500 mb-1">&lt; 2h</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Average Response</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-500 mb-1">24/7</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Support Available</div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Choose Your Preferred Way</h3>
          
          {/* Live Chat */}
          <button 
            onClick={handleLiveChat}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl flex items-center justify-between transition-colors duration-200"
            data-testid="button-live-chat"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Start Live Chat</div>
                <div className="text-sm opacity-90">Get instant help from our agents</div>
              </div>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* WhatsApp */}
          <button 
            onClick={handleWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl flex items-center justify-between transition-colors duration-200"
            data-testid="button-whatsapp"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Message on WhatsApp</div>
                <div className="text-sm opacity-90">Quick responses via WhatsApp</div>
              </div>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Email Support */}
          <button 
            onClick={handleEmailSupport}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-xl flex items-center justify-between transition-colors duration-200"
            data-testid="button-email"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Send us an Email</div>
                <div className="text-sm opacity-90">For detailed inquiries</div>
              </div>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* FAQ Link */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Before contacting us</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Check our FAQ section for quick answers to common questions about eSIM activation, data plans, and troubleshooting.
          </p>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium" data-testid="link-faq">
            Browse FAQ →
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Support Hours</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">24/7 Customer Support</p>
          <p className="text-xs text-gray-500 mt-1">Average response time: Under 2 hours</p>
        </div>
      </div>
    </div>
  );
}