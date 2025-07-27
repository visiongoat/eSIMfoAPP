import { useEffect, useRef } from 'react';

interface TabSwipeOptions {
  enabled?: boolean;
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useTabSwipe(options: TabSwipeOptions = {}) {
  const { enabled = true, threshold = 50, onSwipeLeft, onSwipeRight } = options;
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

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        isSwiping.current = true;
        // Prevent vertical scrolling during horizontal swipe
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !isSwiping.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // Check if it's a valid horizontal swipe
      if (
        Math.abs(deltaX) > threshold && 
        Math.abs(deltaY) < threshold * 2 // Allow some vertical movement
      ) {
        if (deltaX > 0 && onSwipeRight) {
          // Swipe right (left to right)
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          // Swipe left (right to left)
          onSwipeLeft();
        }
      }

      // Reset
      touchStartX.current = 0;
      touchStartY.current = 0;
      isSwiping.current = false;
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, onSwipeLeft, onSwipeRight]);
}