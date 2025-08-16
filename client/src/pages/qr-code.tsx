import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";

import NavigationBar from "@/components/navigation-bar";
import ManualInstallationModal from "@/components/manual-installation-modal";
import type { Esim, Package, Country } from "@shared/schema";

export default function QRCodeScreen() {
  const [, params] = useRoute("/qr/:esimId");
  const esimId = params?.esimId ? parseInt(params.esimId) : null;
  const [showManualInstallation, setShowManualInstallation] = useState(false);

  const { data: esim } = useQuery<Esim & { package?: Package; country?: Country }>({
    queryKey: ["/api/esims", esimId],
    enabled: !!esimId,
  });

  if (!esimId || !esim) {
    return <div>eSIM not found</div>;
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My eSIM QR Code',
          text: `eSIM for ${esim.country?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleEmailQR = () => {
    const subject = encodeURIComponent(`Your eSIM QR Code for ${esim.country?.name}`);
    const body = encodeURIComponent(`Here is your eSIM QR code for ${esim.country?.name}. Please scan this code to install your eSIM.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSaveToPhotos = () => {
    // In a real app, this would generate and download the QR code image
    alert('QR code would be saved to photos');
  };

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Your eSIM"
        showBack={true}
        rightButton={
          <button 
            onClick={handleShare}
            className="text-primary font-medium"
          >
            Share
          </button>
        }
      />

      <div className="px-4 pt-4 text-center">
        {/* Success Message */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold mb-2">eSIM Ready!</h2>
          <p className="text-muted-foreground">
            Your eSIM has been successfully purchased and is ready to install
          </p>
        </div>

        {/* QR Code */}
        <div className="mobile-card p-6 mb-4">
          <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center p-4">
            <img 
              src="/attached_assets/qrimages.png" 
              alt="eSIM QR Code" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <p className="font-medium mb-2">Scan to Install eSIM</p>
          <p className="text-sm text-muted-foreground mb-4">
            Use your device camera to scan this QR code
          </p>
          
          {/* Click to Install Button */}
          <button 
            onClick={() => {
              // Automatic installation function - will trigger eSIM installation in real app
              console.log('Starting automatic eSIM installation...');
              alert('Starting eSIM installation...');
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l0 6" />
            </svg>
            <span>Click to Install</span>
          </button>
        </div>

        {/* eSIM Details */}
        <div className="mobile-card p-4 mb-4 text-left">
          <h3 className="font-semibold mb-3">eSIM Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Country</span>
              <span>{esim.country?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data</span>
              <span>{esim.package?.data}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Validity</span>
              <span>{esim.package?.validity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span>{esim.country?.operators?.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-secondary">{esim.status}</span>
            </div>
          </div>
        </div>

        {/* Manual Installation Section */}
        <div 
          onClick={() => setShowManualInstallation(true)}
          className="mobile-card p-4 mb-4 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-l-4 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400 text-lg">📱</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Manual Installation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alternative setup method</p>
              </div>
            </div>
            <div className="text-gray-400 dark:text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Installation Guide */}
        <div className="mobile-card p-4 mb-6 text-left">
          <h3 className="font-semibold mb-3">Installation Guide</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <p>Go to Settings → Cellular → Add Cellular Plan</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <p>Scan the QR code above with your camera</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <p>Follow the on-screen instructions to complete setup</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-4">
          <button 
            onClick={handleEmailQR}
            className="w-full button-secondary"
          >
            📧 Email QR Code
          </button>
          <button 
            onClick={handleSaveToPhotos}
            className="w-full button-secondary"
          >
            💾 Save to Photos
          </button>
        </div>
      </div>

      {/* Manual Installation Modal */}
      <ManualInstallationModal
        isOpen={showManualInstallation}
        onClose={() => setShowManualInstallation(false)}
        esim={esim}
      />
    </div>
  );
}
