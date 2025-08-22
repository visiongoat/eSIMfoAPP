import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState } from "react";

import NavigationBar from "@/components/navigation-bar";
import ManualInstallationModal from "@/components/manual-installation-modal";
import TabBar from "@/components/tab-bar";
import type { Esim, Package, Country } from "@shared/schema";

export default function QRCodeScreen() {
  const [, params] = useRoute("/qr/:esimId");
  const [, setLocation] = useLocation();
  const esimId = params?.esimId ? parseInt(params.esimId) : null;
  const [showManualInstallation, setShowManualInstallation] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

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

  const handleSaveToPhotos = async () => {
    try {
      // Create a canvas to draw the QR code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Convert to blob and trigger download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `esim-qr-${esim.qrCode}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('QR code saved to downloads');
            alert('QR Code galeriye kaydedildi!');
          }
        }, 'image/png');
      };
      
      img.crossOrigin = 'anonymous';
      img.src = '/attached_assets/qrimages.png';
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert('QR kod kaydedilirken hata oluştu.');
    }
  };

  const handleQRCodeTap = () => {
    // Automatically save to gallery when QR code is tapped
    console.log('QR code tapped - saving to gallery...');
    handleSaveToPhotos();
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
          <div 
            onClick={handleQRCodeTap}
            className="w-64 h-64 bg-white border-2 border-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center p-4 cursor-pointer hover:border-blue-300 transition-colors active:scale-95 transform"
          >
            <img 
              src="/attached_assets/qrimages.png" 
              alt="eSIM QR Code" 
              className="w-full h-full object-contain rounded-lg pointer-events-none"
            />
          </div>
          <p className="font-medium mb-2">Scan to Install eSIM</p>
          <p className="text-sm text-muted-foreground mb-2">
            Use your device camera to scan this QR code
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">
            💾 Tap QR code to save to gallery
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

      {/* TabBar - exact copy from home */}
      <TabBar 
        onPlusClick={() => setShowQuickActions(true)}
        onShopClick={() => setLocation('/home')}
      />

      {/* Quick Actions Modal - exact copy from home */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" 
          onClick={() => setShowQuickActions(false)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 9999
          }}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 10000 }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Quick Actions</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Choose your eSIM category to get started</p>
            </div>

            {/* Action Items */}
            <div className="px-6 pb-8 space-y-3">
              {/* Local eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/destinations?tab=countries');
                }}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Local eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for single country travel</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Regional eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/destinations?tab=regions');
                }}
                className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 rounded-2xl p-4 border border-green-200 dark:border-green-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regional eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Great for multi-country trips</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Global eSIMs */}
              <button 
                onClick={() => {
                  setShowQuickActions(false);
                  setLocation('/destinations?tab=global');
                }}
                className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Global eSIMs</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Worldwide coverage plans</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
