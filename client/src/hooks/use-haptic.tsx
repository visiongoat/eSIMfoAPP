import { useCallback } from "react";

export function useHaptic() {
  const hapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  return { hapticFeedback };
}
