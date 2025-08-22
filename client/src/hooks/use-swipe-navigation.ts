import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

interface SwipeNavigationOptions {
  enabled?: boolean;
  threshold?: number;
  onSwipeBack?: () => void;
}

interface SwipeState {
  isVisible: boolean;
  progress: number;
}

export function useSwipeNavigation(options: SwipeNavigationOptions = {}) {
  const { enabled = true, threshold = 100, onSwipeBack } = options;
  const [, setLocation] = useLocation();
  const [swipeState, setSwipeState] = useState<SwipeState>({ isVisible: false, progress: 0 });
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      isSwiping.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Only trigger if horizontal swipe is dominant and from left edge
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 20 && touchStartX.current < 50) {
        isSwiping.current = true;
        
        // Update visual feedback
        const progress = Math.min(1, Math.max(0, deltaX / threshold));
        setSwipeState({
          isVisible: true,
          progress
        });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Hide visual feedback
      setSwipeState({ isVisible: false, progress: 0 });

      if (!touchStartX.current || !isSwiping.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Check if it's a valid left-to-right swipe
      if (
        deltaX > threshold && 
        Math.abs(deltaY) < threshold && 
        touchStartX.current < 50 // Start swipe from left edge
      ) {
        if (onSwipeBack) {
          onSwipeBack();
        } else {
          // Default back navigation logic
          handleDefaultBack();
        }
      }

      // Reset
      touchStartX.current = 0;
      touchStartY.current = 0;
      isSwiping.current = false;
    };

    const handleDefaultBack = () => {
      const currentPath = window.location.pathname;
      
      // Define navigation hierarchy
      const navigationMap: Record<string, string> = {
        '/packages': '/home',
        '/purchase': '/packages',
        '/qr': '/purchase',
        '/my-esims': '/home',
        '/guides': '/home',
        '/profile': '/home',
        '/balance': '/home',
        '/transactions': '/balance',
        '/partner': '/home',
        '/live-chat': '/home',
      };

      // Handle dynamic routes
      if (currentPath.startsWith('/packages/')) {
        setLocation('/home');
        return;
      }
      if (currentPath.startsWith('/purchase/')) {
        // Go back to packages with same country ID
        const packageMatch = currentPath.match(/\/purchase\/(\d+)/);
        if (packageMatch) {
          // Go back to home page
          setLocation('/home');
        }
        return;
      }
      if (currentPath.startsWith('/qr/')) {
        setLocation('/my-esims');
        return;
      }

      // Use navigation map or fallback to home
      const backPath = navigationMap[currentPath] || '/home';
      setLocation(backPath);
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, onSwipeBack, setLocation]);

  return swipeState;
}