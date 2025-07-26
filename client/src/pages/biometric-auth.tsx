import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Fingerprint, Eye, Shield, CheckCircle, XCircle, Smartphone } from "lucide-react";

type BiometricType = 'fingerprint' | 'faceId' | 'none';
type AuthState = 'idle' | 'scanning' | 'success' | 'failed' | 'unavailable';

export default function BiometricAuthScreen() {
  const [, setLocation] = useLocation();
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [biometricType, setBiometricType] = useState<BiometricType>('fingerprint');
  const [showFallback, setShowFallback] = useState(false);

  // Simulate biometric availability check
  useEffect(() => {
    const checkBiometricAvailability = () => {
      // Simulate random availability
      const isAvailable = Math.random() > 0.1; // 90% chance available
      if (!isAvailable) {
        setAuthState('unavailable');
        setShowFallback(true);
      }
    };
    
    setTimeout(checkBiometricAvailability, 500);
  }, []);

  const handleBiometricAuth = async (type: BiometricType) => {
    setBiometricType(type);
    setAuthState('scanning');

    // Simulate biometric scanning process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/failure (80% success rate)
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      setAuthState('success');
      setTimeout(() => {
        setLocation('/home');
      }, 1500);
    } else {
      setAuthState('failed');
      setTimeout(() => {
        setAuthState('idle');
      }, 2000);
    }
  };

  const handleSkip = () => {
    setLocation('/home');
  };

  const renderAuthIcon = () => {
    const iconClass = "w-20 h-20 mx-auto mb-6";
    
    switch (authState) {
      case 'scanning':
        return (
          <div className="relative">
            {biometricType === 'fingerprint' ? (
              <Fingerprint className={`${iconClass} text-blue-500 animate-pulse`} />
            ) : (
              <Eye className={`${iconClass} text-blue-500 animate-pulse`} />
            )}
            <div className="absolute inset-0 border-4 border-blue-500 border-dashed rounded-full animate-spin opacity-50"></div>
          </div>
        );
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'failed':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'unavailable':
        return <Smartphone className={`${iconClass} text-gray-400`} />;
      default:
        return <Shield className={`${iconClass} text-gray-700 dark:text-gray-300`} />;
    }
  };

  const renderStatusMessage = () => {
    switch (authState) {
      case 'scanning':
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {biometricType === 'fingerprint' ? 'Touch Sensor' : 'Look at Camera'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {biometricType === 'fingerprint' 
                ? 'Place your finger on the sensor and hold steady'
                : 'Position your face within the frame'
              }
            </p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
              Authentication Successful
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Taking you to your account...
            </p>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again or use alternative method
            </p>
          </div>
        );
      case 'unavailable':
        return (
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Biometric Not Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your device doesn't support biometric authentication
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Secure Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose your preferred authentication method
            </p>
          </div>
        );
    }
  };

  return (
    <div className="mobile-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setLocation('/onboarding')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Authentication
        </h1>
        <button
          onClick={handleSkip}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Auth Icon */}
        <div className="mb-8">
          {renderAuthIcon()}
        </div>

        {/* Status Message */}
        {renderStatusMessage()}

        {/* Biometric Options */}
        {authState === 'idle' && !showFallback && (
          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleBiometricAuth('fingerprint')}
              className="w-full mobile-card p-6 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-[0.98]"
              disabled={authState === 'scanning'}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Fingerprint</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Touch the sensor to authenticate
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleBiometricAuth('faceId')}
              className="w-full mobile-card p-6 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-[0.98]"
              disabled={authState === 'scanning'}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Face ID</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Look at the camera to authenticate
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Retry Button for Failed State */}
        {authState === 'failed' && (
          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleBiometricAuth(biometricType)}
              className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl py-4 px-6 font-semibold transition-all duration-200 active:scale-[0.98]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Fallback Options */}
        {(showFallback || authState === 'unavailable') && (
          <div className="space-y-4 mb-8">
            <button
              onClick={() => setLocation('/home')}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl py-4 px-6 font-semibold transition-all duration-200 active:scale-[0.98]"
            >
              Continue with PIN
            </button>
            <button
              onClick={() => setLocation('/home')}
              className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl py-4 px-6 font-semibold transition-all duration-200 active:scale-[0.98]"
            >
              Use Password
            </button>
          </div>
        )}

        {/* Security Info */}
        <div className="mobile-card p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Secure & Private
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your biometric data is encrypted and stored locally on your device. 
                We never have access to your personal biometric information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 pb-6">
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div className="w-8 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
}