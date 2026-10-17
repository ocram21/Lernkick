/** Check the service worker and wait until a new version is fully downloaded. */
export function findUpdate(registration: ServiceWorkerRegistration, timeoutMs = 30_000): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let worker: ServiceWorker | null = null;
    let settled = false;
    const finish = (available?: boolean, error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker?.removeEventListener('statechange', changed);
      if (error) reject(error); else resolve(available!);
    };
    const changed = () => {
      if (worker?.state === 'installed') finish(Boolean(registration.waiting));
      else if (worker?.state === 'activated') finish(false);
      else if (worker?.state === 'redundant') finish(undefined, new Error('Die neue Version konnte nicht vollständig geladen werden. Bitte versuche es erneut.'));
    };
    const timer = setTimeout(() => finish(undefined, new Error('Das Laden dauert zu lange. Bitte prüfe die Verbindung und versuche es erneut.')), timeoutMs);
    (async () => {
      if (registration.waiting) { finish(true); return; }
      await registration.update();
      if (settled) return;
      if (registration.waiting) { finish(true); return; }
      worker = registration.installing;
      if (!worker) { finish(false); return; }
      worker.addEventListener('statechange', changed);
      changed();
    })().catch(() => finish(undefined, new Error('Die Aktualisierung ist gerade nicht erreichbar. Bitte prüfe die Internetverbindung und versuche es erneut.')));
  });
}

/** Activate only after a deliberate user click; never clear IndexedDB or caches. */
export function activateUpdate(registration: ServiceWorkerRegistration, timeoutMs = 15_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const worker = registration.waiting;
    if (!worker) { reject(new Error('Die neue Version ist noch nicht bereit. Bitte versuche es erneut.')); return; }
    const cleanup = () => { clearTimeout(timer); navigator.serviceWorker.removeEventListener('controllerchange', changed); };
    const changed = () => { cleanup(); resolve(); };
    const timer = setTimeout(() => { cleanup(); reject(new Error('Die neue Version konnte nicht geöffnet werden. Bitte versuche es erneut.')); }, timeoutMs);
    navigator.serviceWorker.addEventListener('controllerchange', changed);
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
}
