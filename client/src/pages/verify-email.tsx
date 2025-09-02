import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import esimfoLogo from "@assets/160x160esimfologo.png";

export default function VerifyEmailScreen() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Get email from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const emailFromStorage = localStorage.getItem('verificationEmail');
    
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      localStorage.setItem('verificationEmail', emailFromUrl);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // If no email found, redirect back to signup
      setLocation('/signup');
    }
  }, [setLocation]);

  const handleVerifyCode = async () => {
    if (!code.trim() || code.length < 4) return;
    
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      localStorage.removeItem('verificationEmail');
      localStorage.removeItem('signupName');
      setLocation("/home");
      setIsLoading(false);
    }, 1500);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    // Simulate resend
    setTimeout(() => {
      setIsResending(false);
      // You could show a toast here
    }, 2000);
  };

  const handleEditEmail = () => {
    localStorage.removeItem('verificationEmail');
    localStorage.removeItem('signupName');
    setLocation('/signup');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.trim() && code.length >= 4) {
      handleVerifyCode();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-2 flex flex-col items-center">
          <img 
            src={esimfoLogo}
            alt="eSIMfo" 
            className="h-24 w-24 object-contain mb-1"
          />
        </div>

        {/* Verification Section */}
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Verify Your Identity
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              We've sent an email with your code to
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium">
              {email}
            </p>
          </div>

          {/* Email Display with Edit Option */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300 text-sm truncate">
              {email}
            </span>
            <button
              onClick={handleEditEmail}
              className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-2"
              data-testid="button-edit-email"
            >
              Edit
            </button>
          </div>

          {/* Code Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                Enter the code *
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 border-2 border-blue-500 dark:border-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors text-center text-lg tracking-widest"
                placeholder="Enter verification code"
                maxLength={6}
                data-testid="input-verification-code"
              />
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={isLoading || !code.trim() || code.length < 4}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
              data-testid="button-verify"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>

          {/* Resend Code */}
          <div className="text-center pt-4">
            <span className="text-gray-600 dark:text-gray-400">
              Didn't receive an email?{" "}
            </span>
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
              data-testid="button-resend"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}