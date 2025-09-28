import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileContainer from "@/components/mobile-container";
import { ThemeProvider } from "@/contexts/theme-context";
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";
import { SwipeIndicator } from "@/components/swipe-indicator";
import { MessageCircle } from "lucide-react";
import SplashScreen from "@/pages/splash";
import OnboardingScreen from "@/pages/onboarding";
import HomeScreen from "@/pages/home";
import PackagesScreen from "@/pages/packages";
import PurchaseScreen from "@/pages/purchase";
import QRCodeScreen from "@/pages/qr-code";
import MyEsimsScreen from "@/pages/my-esims";
import ProfileScreen from "@/pages/profile";
import BalanceScreen from "@/pages/balance";
import TransactionsScreen from "@/pages/transactions";
import PersonalInfoScreen from "@/pages/personal-info";
import PartnerScreen from "@/pages/partner";
import LiveChatScreen from "@/pages/support";
import ContactSupportScreen from "@/pages/contact-support";
import ReferEarnScreen from "@/pages/refer-earn";
import LoginScreen from "@/pages/login";
import SignupScreen from "@/pages/signup";
import VerifyEmailScreen from "@/pages/verify-email";
import NotFoundPage from "@/pages/not-found";
import TravelerLevelsScreen from "@/pages/traveler-levels";
import LoginActivityScreen from "@/pages/login-activity";
import IdentityVerificationScreen from "@/pages/identity-verification";

function Router() {
  // Enable swipe navigation globally (disabled on splash and onboarding)
  const [location, setLocation] = useLocation();
  const swipeEnabled = !['/', '/onboarding'].includes(location);
  
  const swipeState = useSwipeNavigation({ enabled: swipeEnabled });
  
  // Chat button visibility (hidden on splash, onboarding, live-chat, home, and packages pages)
  const showChatButton = !['/', '/onboarding', '/live-chat', '/home'].includes(location) && !location.startsWith('/packages');
  
  // Mobile debugging
  React.useEffect(() => {
    console.log('📱 Router loaded, current location:', location);
    
    // Mobile viewport fix
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport && window.innerWidth < 768) {
      console.log('📱 Mobile viewport detected');
    }
  }, [location]);

  const handleChatClick = () => {
    setLocation('/live-chat');
  };

  return (
    <>
      <Switch>
        <Route path="/" component={SplashScreen} />
        <Route path="/onboarding" component={OnboardingScreen} />
        <Route path="/home" component={HomeScreen} />
        <Route path="/packages/:countryId" component={PackagesScreen} />
        <Route path="/purchase/:packageId" component={PurchaseScreen} />
        <Route path="/qr/:esimId" component={QRCodeScreen} />
        <Route path="/my-esims" component={MyEsimsScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/personal-info" component={PersonalInfoScreen} />
        <Route path="/login-activity" component={LoginActivityScreen} />
        <Route path="/balance" component={BalanceScreen} />
        <Route path="/transactions" component={TransactionsScreen} />
        <Route path="/partner" component={PartnerScreen} />
        <Route path="/live-chat" component={LiveChatScreen} />
        <Route path="/contact-support" component={ContactSupportScreen} />
        <Route path="/refer-earn" component={ReferEarnScreen} />
        <Route path="/traveler-levels" component={TravelerLevelsScreen} />
        <Route path="/identity-verification" component={IdentityVerificationScreen} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/signup" component={SignupScreen} />
        <Route path="/verify-email" component={VerifyEmailScreen} />
        
        {/* 404 Catch-all route */}
        <Route path="/:rest*" component={NotFoundPage} />
      </Switch>
      
      {/* Global Floating Chat Button - Airalo Style */}
      {showChatButton && (
        <div className="fixed bottom-24 right-4 z-40 transition-all duration-500 ease-in-out chat-button-container">
          <button
            onClick={handleChatClick}
            className="group relative w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center"
            data-testid="button-floating-chat"
          >
            {/* Chat Icon */}
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
            
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">2</span>
            </div>
            
            
            {/* Shadow Enhancement */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-700/20 to-transparent"></div>
          </button>
        </div>
      )}
      
      {/* Global swipe indicator */}
      <SwipeIndicator isVisible={swipeState.isVisible} progress={swipeState.progress} />
    </>
  );
}

function App() {
  // App loading and mobile optimization
  React.useEffect(() => {
    console.log('✅ eSIM App components initializing...');
    
    // Mark app as fully loaded
    setTimeout(() => {
      document.body.classList.add('app-loaded');
      console.log('✅ eSIM App fully loaded');
    }, 500);
    
    // Mobile-specific optimizations
    if (window.innerWidth < 768) {
      console.log('📱 Mobile mode activated');
      // Prevent scrolling issues on mobile
      document.body.style.overflow = 'hidden';
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <MobileContainer>
            <Toaster />
            <Router />
          </MobileContainer>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
