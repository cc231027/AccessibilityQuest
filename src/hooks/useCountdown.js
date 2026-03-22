// src/hooks/useCountdown.js
import { useState, useEffect, useRef } from 'react';

export function useCountdown(seconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);
  const hasExpired = useRef(false);

  const start = () => {
    hasExpired.current = false;
    setTimeLeft(seconds);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (!hasExpired.current) {
            hasExpired.current = true;
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    hasExpired.current = false;
    setTimeLeft(seconds);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Colour state based on time left
  const getTimerState = () => {
    const pct = timeLeft / seconds;
    if (pct > 0.4) return 'green';
    if (pct > 0.2) return 'orange';
    return 'red';
  };

  return { timeLeft, start, stop, reset, timerState: getTimerState() };
}