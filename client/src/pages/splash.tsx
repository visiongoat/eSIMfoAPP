import { useEffect } from "react";
import { useLocation } from "wouter";

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
            <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl mx-auto flex items-center justify-center">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
            </div>
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Esimfo</h1>
          <p className="text-white text-lg opacity-90">Global eSIM Connectivity</p>
          <div className="mt-12">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
