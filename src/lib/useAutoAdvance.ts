import { useEffect, useRef, useState } from 'react';

/** The caller enables a fresh two-second reading period once feedback is visible. */
export function useAutoAdvance(active: boolean, questionId: string | undefined, advance: () => void) {
  const latestAdvance = useRef(advance);
  const [seconds, setSeconds] = useState(2);
  useEffect(() => { latestAdvance.current = advance; }, [advance]);
  useEffect(() => {
    if (!active) return;
    setSeconds(2);
    const started = performance.now();
    const countdown = setInterval(() => setSeconds(Math.max(1, 2 - Math.floor((performance.now() - started) / 1000))), 250);
    const next = setTimeout(() => latestAdvance.current(), 2000);
    return () => { clearInterval(countdown); clearTimeout(next); };
  }, [active, questionId]);
  return seconds;
}
