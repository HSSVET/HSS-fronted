import { useEffect, useRef, useState } from 'react';

/**
 * Hook to handle user idle timeout
 * @param isAuthenticated User authentication status
 * @param logout Function to call on timeout
 * @param timeoutMs Timeout in milliseconds (default: 30 minutes)
 */
export const useIdleTimeout = (
  isAuthenticated: boolean,
  logout: () => void,
  timeoutMs: number = 30 * 60 * 1000
) => {
  const [isIdle, setIsIdle] = useState(false);
  const lastActivity = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer on activity
  const resetTimer = () => {
    lastActivity.current = Date.now();
    setIsIdle(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (isAuthenticated) {
      timerRef.current = setTimeout(() => {
        setIsIdle(true);
        handleLogout();
      }, timeoutMs);
    }
  };

  const handleLogout = () => {
    console.log('⏰ Session timeout due to inactivity');
    logout();
    setIsIdle(true);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Events to listen for activity
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart'
    ];

    // Initial set
    resetTimer();

    const onEvent = () => resetTimer();

    events.forEach(event => {
      window.addEventListener(event, onEvent);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, onEvent);
      });
    };
  }, [isAuthenticated, timeoutMs, logout]); // Re-run if auth state changes

  return { isIdle };
};
