import { useEffect } from "react";
import { useLocation } from "wouter";
import EsimfoLogo from "@/components/esimfo-logo";

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="mobile-screen">
      <div className="flex items-center justify-center h-screen gradient-bg">
        <div className="relative z-10 text-center">
          <div className="splash-logo mb-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-2xl mx-auto flex items-center justify-center">
              <EsimfoLogo size="xl" variant="icon" />
            </div>
          </div>
          <div className="mb-4">
            <EsimfoLogo size="xl" className="justify-center text-white" />
          </div>
          <p className="text-white text-lg opacity-90">Global eSIM Connectivity</p>
          <div className="mt-12">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
