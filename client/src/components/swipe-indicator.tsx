import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface SwipeIndicatorProps {
  isVisible: boolean;
  progress: number; // 0-1
}

export function SwipeIndicator({ isVisible, progress }: SwipeIndicatorProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Delay hiding to allow fade-out animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: `translateY(-50%) translateX(${Math.max(0, progress * 30)}px)`,
      }}
    >
      <div className="bg-black/20 dark:bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/10">
        <ChevronLeft 
          className="w-6 h-6 text-white dark:text-gray-200" 
          style={{
            transform: `scale(${0.8 + progress * 0.4})`,
          }}
        />
      </div>
    </div>
  );
}