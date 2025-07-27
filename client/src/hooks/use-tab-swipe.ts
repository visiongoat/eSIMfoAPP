import { useEffect, useRef, useCallback } from 'react';

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
  const containerRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
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
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartX.current || !isSwiping.current) {
      // Reset even if not swiping
      touchStartX.current = 0;
      touchStartY.current = 0;
      isSwiping.current = false;
      return;
    }

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
        console.log('Swipe right detected');
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        // Swipe left (right to left)
        console.log('Swipe left detected');
        onSwipeLeft();
      }
    }

    // Reset
    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwiping.current = false;
  }, [threshold, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    if (!enabled) return;

    // Find the main content container
    const container = document.querySelector('.swipe-container') || document.body;
    containerRef.current = container as HTMLElement;

    if (!containerRef.current) return;

    // Add event listeners
    containerRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
    containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    containerRef.current.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('touchstart', handleTouchStart);
        containerRef.current.removeEventListener('touchmove', handleTouchMove);
        containerRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return containerRef;
}