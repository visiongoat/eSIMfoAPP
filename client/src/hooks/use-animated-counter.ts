import { useState, useEffect } from 'react';

interface UseAnimatedCounterProps {
  targetValue: number;
  duration?: number;
  startAnimation?: boolean;
}

export function useAnimatedCounter({ 
  targetValue, 
  duration = 1000, 
  startAnimation = true 
}: UseAnimatedCounterProps) {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const [previousValue, setPreviousValue] = useState(targetValue);

  useEffect(() => {
    if (!startAnimation) return;
    
    // If value hasn't changed, don't animate
    if (targetValue === previousValue) return;

    const startValue = currentValue;
    const difference = targetValue - startValue;
    const startTime = Date.now();
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const newValue = startValue + (difference * easeOutQuart);
      setCurrentValue(newValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
        setPreviousValue(targetValue);
      }
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup function to prevent memory leaks
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [targetValue, duration, startAnimation]); // Removed currentValue, previousValue from deps

  return {
    displayValue: currentValue,
    isAnimating: Math.abs(currentValue - targetValue) > 0.01
  };
}