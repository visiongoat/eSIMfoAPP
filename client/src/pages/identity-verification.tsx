import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IdentityVerification() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'standard' | 'temporary'>('standard');
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Mock verification status - in real app, this would come from user data
  const [standardVerificationStatus] = useState<'pending' | 'verified' | 'rejected' | 'none'>('rejected');
  const [temporaryVerificationStatus] = useState<'pending' | 'verified' | 'rejected' | 'none'>('none');

  const handleVerifyIdentity = () => {
    setShowVerificationModal(true);
  };

  const handleStartVerification = () => {
    setShowVerificationModal(false);
    // In real app, this would start the verification process
    console.log('Starting verification process...');
  };

  return (
    <div className="mobile-screen bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => setLocation('/profile')}
            className="flex items-center text-blue-500 dark:text-blue-400"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Identity verification</h1>
          <div className="w-5"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
              activeTab === 'standard'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            }`}
            data-testid="tab-standard-ekyc"
          >
            Standard eKYC
          </button>
          <button
            onClick={() => setActiveTab('temporary')}
            className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
              activeTab === 'temporary'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            }`}
            data-testid="tab-temporary-ekyc"
          >
            Temporary eKYC
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'standard' && (
          <div className="space-y-4">
            {/* Standard eKYC Status Card */}
            {standardVerificationStatus !== 'none' && (
              <div className={`p-4 rounded-2xl border-2 ${
                standardVerificationStatus === 'verified' 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
                  : standardVerificationStatus === 'rejected'
                  ? 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700'
                  : 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className={`w-5 h-5 ${
                      standardVerificationStatus === 'verified' ? 'text-green-600 dark:text-green-400'
                      : standardVerificationStatus === 'rejected' ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                    }`} />
                    <span className={`font-medium ${
                      standardVerificationStatus === 'verified' ? 'text-green-700 dark:text-green-400'
                      : standardVerificationStatus === 'rejected' ? 'text-red-700 dark:text-red-400'
                      : 'text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {standardVerificationStatus === 'verified' ? 'Verified' 
                       : standardVerificationStatus === 'rejected' ? 'Unknown'
                       : 'Under Review'}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-white dark:bg-gray-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                
                {standardVerificationStatus === 'rejected' && (
                  <div className="inline-block px-3 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-sm font-medium rounded-full mb-3">
                    Rejected
                  </div>
                )}
                
                <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  S**** Y********
                </div>
              </div>
            )}

            {/* Error Message for Rejected */}
            {standardVerificationStatus === 'rejected' && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    The ID can't be processed. Please submit a supported document type.
                  </p>
                </div>
              </div>
            )}

            {/* Learn More Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learn more about security</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                eSIMfo works with third-party services that maintain the highest levels of compliance and encryption when 
                processing your data. To learn more about eKYC and our identity verification providers, go to our{' '}
                <button className="text-blue-600 dark:text-blue-400 underline">
                  help center
                </button>.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'temporary' && (
          <div className="py-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Identity verification</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any Temporary eKYC verifications yet.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleVerifyIdentity}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
          data-testid="button-verify-identity"
        >
          Verify your identity
        </Button>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Identity verification</h2>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                data-testid="button-close-modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">eKYC verification tips</h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Before verifying your identity, please read our tips and prepare the following:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Make sure you're in a well-lit room or place to avoid picture clarity issues.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    When verifying your documents, hold the ID in your hand without covering any information or place the 
                    ID on a darker surface background.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Make sure glare does not cover up any important information on your ID.
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                By continuing the identity verification process, you agree to the{' '}
                <button 
                  onClick={() => window.open('https://www.jumio.com/privacy-center/privacy-notices/online-services-notice/', '_blank')}
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  data-testid="link-privacy-policy"
                >
                  provider's privacy policy
                </button>.
              </p>

              <Button
                onClick={handleStartVerification}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
                data-testid="button-start-verification"
              >
                Start verification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}