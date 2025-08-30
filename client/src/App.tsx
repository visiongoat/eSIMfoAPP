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
import SplashScreen from "@/pages/splash";
import OnboardingScreen from "@/pages/onboarding";
import HomeScreen from "@/pages/home";
import PackagesScreen from "@/pages/packages";
import PurchaseScreen from "@/pages/purchase";
import QRCodeScreen from "@/pages/qr-code";
import MyEsimsScreen from "@/pages/my-esims";
import GuidesScreen from "@/pages/guides";
import ProfileScreen from "@/pages/profile";
import BalanceScreen from "@/pages/balance";
import TransactionsScreen from "@/pages/transactions";
import PersonalInfoScreen from "@/pages/personal-info";
import PartnerScreen from "@/pages/partner";
import LiveChatScreen from "@/pages/support";
import ContactSupportScreen from "@/pages/contact-support";
import LoginScreen from "@/pages/login";
import SignupScreen from "@/pages/signup";
import VerifyEmailScreen from "@/pages/verify-email";
import NotFoundPage from "@/pages/not-found";

function Router() {
  // Enable swipe navigation globally (disabled on splash and onboarding)
  const [location] = useLocation();
  const swipeEnabled = !['/', '/onboarding'].includes(location);
  
  const swipeState = useSwipeNavigation({ enabled: swipeEnabled });
  
  // Mobile debugging
  React.useEffect(() => {
    console.log('📱 Router loaded, current location:', location);
    
    // Mobile viewport fix
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport && window.innerWidth < 768) {
      console.log('📱 Mobile viewport detected');
    }
  }, [location]);

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
        <Route path="/guides" component={GuidesScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/personal-info" component={PersonalInfoScreen} />
        <Route path="/balance" component={BalanceScreen} />
        <Route path="/transactions" component={TransactionsScreen} />
        <Route path="/partner" component={PartnerScreen} />
        <Route path="/live-chat" component={LiveChatScreen} />
        <Route path="/contact-support" component={ContactSupportScreen} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/signup" component={SignupScreen} />
        <Route path="/verify-email" component={VerifyEmailScreen} />
        
        {/* 404 Catch-all route */}
        <Route path="/:rest*" component={NotFoundPage} />
      </Switch>
      
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
