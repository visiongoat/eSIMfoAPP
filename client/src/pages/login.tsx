import { useState } from "react";
import { useLocation } from "wouter";
import esimfoLogo from "@assets/160x160esimfologo.png";

export default function LoginScreen() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setLocation("/home");
      setIsLoading(false);
    }, 1500);
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setLocation("/home");
      setIsLoading(false);
    }, 1500);
  };

  const handleEmailLogin = async () => {
    if (!email.trim()) return;
    
    setIsLoading(true);
    
    // Simulate sending verification email
    setTimeout(() => {
      // Store email for verification page
      localStorage.setItem('verificationEmail', email);
      setLocation(`/verify-email?email=${encodeURIComponent(email)}`);
      setIsLoading(false);
    }, 1500);
  };

  const handleSignUp = () => {
    setLocation("/signup");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-2 flex flex-col items-center">
          <img 
            src={esimfoLogo}
            alt="eSIMfo" 
            className="h-24 w-24 object-contain mb-1"
          />
        </div>

        {/* Welcome Section */}
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Login to eSIMfo to continue
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-google-login"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Continue with Google
              </span>
            </button>

            <button
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-apple-login"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Continue with Apple
              </span>
            </button>
          </div>

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                Email address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border-2 border-blue-500 dark:border-blue-400 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                data-testid="input-email"
              />
            </div>

            <button
              onClick={handleEmailLogin}
              disabled={isLoading || !email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
              data-testid="button-continue"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Continuing...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-1">
            <span className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
            </span>
            <button
              onClick={handleSignUp}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              data-testid="link-signup"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}