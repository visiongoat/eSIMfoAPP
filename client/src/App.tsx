import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileContainer from "@/components/mobile-container";
import { ThemeProvider } from "@/contexts/theme-context";
import SplashScreen from "@/pages/splash";
import OnboardingScreen from "@/pages/onboarding";
import HomeScreen from "@/pages/home";
import SearchScreen from "@/pages/search";
import PackagesScreen from "@/pages/packages";
import PurchaseScreen from "@/pages/purchase";
import QRCodeScreen from "@/pages/qr-code";
import MyEsimsScreen from "@/pages/my-esims";
import GuidesScreen from "@/pages/guides";
import ProfileScreen from "@/pages/profile";
import PartnerScreen from "@/pages/partner";
import LiveChatScreen from "@/pages/support";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/onboarding" component={OnboardingScreen} />
      <Route path="/home" component={HomeScreen} />
      <Route path="/search" component={SearchScreen} />
      <Route path="/packages/:countryId" component={PackagesScreen} />
      <Route path="/purchase/:packageId" component={PurchaseScreen} />
      <Route path="/qr/:esimId" component={QRCodeScreen} />
      <Route path="/my-esims" component={MyEsimsScreen} />
      <Route path="/guides" component={GuidesScreen} />
      <Route path="/profile" component={ProfileScreen} />
      <Route path="/partner" component={PartnerScreen} />
      <Route path="/live-chat" component={LiveChatScreen} />
    </Switch>
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
