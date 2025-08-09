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
import DestinationsScreen from "@/pages/destinations";
import PackagesScreen from "@/pages/packages";
import PurchaseScreen from "@/pages/purchase";
import QRCodeScreen from "@/pages/qr-code";
import MyEsimsScreen from "@/pages/my-esims";
import GuidesScreen from "@/pages/guides";
import ProfileScreen from "@/pages/profile";
import NewBalanceScreen from "@/pages/balance";
import PersonalInfoScreen from "@/pages/personal-info";
import PartnerScreen from "@/pages/partner";
import LiveChatScreen from "@/pages/support";
import NotFoundPage from "@/pages/not-found";

function Router() {
  // Enable swipe navigation globally (disabled on splash and onboarding)
  const [location] = useLocation();
  const swipeEnabled = !['/', '/onboarding'].includes(location);
  
  const swipeState = useSwipeNavigation({ enabled: swipeEnabled });

  return (
    <>
      <Switch>
        <Route path="/" component={SplashScreen} />
        <Route path="/onboarding" component={OnboardingScreen} />
        <Route path="/home" component={HomeScreen} />
        <Route path="/destinations" component={DestinationsScreen} />
        <Route path="/packages/:countryId" component={PackagesScreen} />
        <Route path="/purchase/:packageId" component={PurchaseScreen} />
        <Route path="/qr/:esimId" component={QRCodeScreen} />
        <Route path="/my-esims" component={MyEsimsScreen} />
        <Route path="/guides" component={GuidesScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/personal-info" component={PersonalInfoScreen} />
        <Route path="/balance" component={NewBalanceScreen} />
        <Route path="/partner" component={PartnerScreen} />
        <Route path="/live-chat" component={LiveChatScreen} />
        
        {/* 404 Catch-all route */}
        <Route path="/:rest*" component={NotFoundPage} />
      </Switch>
      
      {/* Global swipe indicator */}
      <SwipeIndicator isVisible={swipeState.isVisible} progress={swipeState.progress} />
    </>
  );
}

function App() {
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
