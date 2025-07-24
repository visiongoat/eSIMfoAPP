import { useLocation } from "wouter";

interface NavigationBarProps {
  title: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  showBack?: boolean;
}

export default function NavigationBar({ 
  title, 
  leftButton, 
  rightButton, 
  showBack = false 
}: NavigationBarProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="navigation-bar">
      <div className="flex items-center">
        {showBack ? (
          <button 
            onClick={handleBack}
            className="text-primary font-medium"
          >
            ← Back
          </button>
        ) : (
          leftButton || <div className="w-16"></div>
        )}
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center">
        {rightButton || <div className="w-16"></div>}
      </div>
    </div>
  );
}
