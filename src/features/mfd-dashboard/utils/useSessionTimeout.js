import { useEffect } from 'react';

const useSessionTimeout = ({
  idleMs = 8 * 60 * 1000,
  countdownSeconds = 120,
  onWarning,
  onTick,
  onTimeout,
}) => {
  useEffect(() => {
    let idleTimer;
    let countdownTimer;
    let remaining = countdownSeconds;

    const clearTimers = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };

    const startCountdown = () => {
      remaining = countdownSeconds;
      if (onWarning) onWarning();
      if (onTick) onTick(remaining);

      countdownTimer = setInterval(() => {
        remaining -= 1;
        if (onTick) onTick(remaining);
        if (remaining <= 0) {
          clearTimers();
          if (onTimeout) onTimeout();
        }
      }, 1000);
    };

    const resetIdleTimer = () => {
      clearTimers();
      idleTimer = setTimeout(startCountdown, idleMs);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();

    return () => {
      clearTimers();
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer),
      );
    };
  }, [idleMs, countdownSeconds, onWarning, onTick, onTimeout]);
};

export default useSessionTimeout;

