import { useEffect, useRef, useState } from 'react';

/** The caller enables a fresh three-second reading period only for correct answers. */
export function useAutoAdvance(active: boolean, questionId: string | undefined, advance: () => void) {
  const latestAdvance = useRef(advance);
  const [seconds, setSeconds] = useState(3);
  useEffect(() => { latestAdvance.current = advance; }, [advance]);
  useEffect(() => {
    if (!active) return;
    setSeconds(3);
    const started = performance.now();
    const countdown = setInterval(() => setSeconds(Math.max(1, 3 - Math.floor((performance.now() - started) / 1000))), 250);
    const next = setTimeout(() => latestAdvance.current(), 3000);
    return () => { clearInterval(countdown); clearTimeout(next); };
  }, [active, questionId]);
  return seconds;
}
