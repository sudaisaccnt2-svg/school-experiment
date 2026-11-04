// This runs independently of the 3D loader, so saving and recovery still work if a scene fails to load.
const badge = document.getElementById('offlineBadge');
const show = (message, detail = '') => { badge.textContent = message; badge.title = detail; };

if (!('serviceWorker' in navigator) || !isSecureContext) {
  show('online only', 'Open the HTTPS app in Safari to save the website and every AR scene.');
} else {
  let timer, registration, reloaded = false, persistenceRequested = false;
  const hadController = !!navigator.serviceWorker.controller;
  const schedule = (delay = 2000) => { clearTimeout(timer); timer = setTimeout(ask, delay); };

  async function ask() {
    try {
      registration = await navigator.serviceWorker.getRegistration();
      const worker = registration && (registration.installing || registration.waiting || registration.active);
      if (worker) worker.postMessage('cache-status');
      else {
        show(navigator.onLine ? 'saving… keep open' : 'reconnect to finish saving');
        if (navigator.onLine) await register();
      }
    } catch { show('offline not ready', 'Reconnect and reopen the HTTPS app to finish saving.'); }
    schedule();
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !reloaded) { reloaded = true; location.reload(); }
    else ask();
  });
  navigator.serviceWorker.addEventListener('message', (event) => {
    const status = event.data;
    if (status?.type !== 'cache-status') return;
    const done = status.ready === true && event.source === navigator.serviceWorker.controller;
    badge.dataset.ready = String(done);
    if (event.source === navigator.serviceWorker.controller) badge.dataset.version = status.version;
    const version = String(status.version || '').replace('rutherford-', '').slice(0, 5);
    if (done) {
      show(`✓ offline · v${version}`, 'The complete website, every film, game and AR scene are saved on this device.');
      schedule(30000);
      if (!persistenceRequested) {
        persistenceRequested = true;
        navigator.storage?.persist?.().catch(() => {});
      }
    } else {
      const percent = Math.min(99, Math.round(100 * status.cachedBytes / Math.max(1, status.totalBytes)));
      const message = status.error === 'QuotaExceededError' ? 'storage full — offline not ready'
        : !navigator.onLine ? 'reconnect to finish saving'
        : status.ready ? 'finishing offline setup…' : `saving ${percent}% — includes AR`;
      show(message, `${status.cached}/${status.total} required files saved. Keep this app open until ✓ offline appears.`);
      schedule(status.error ? 10000 : 2000);
    }
  });

  async function register() {
    registration = await navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' });
    registration.addEventListener('updatefound', () => {
      if (navigator.serviceWorker.controller) show('updating… keep open');
      schedule();
    });
  }
  show('checking offline copy…');
  register().catch(() => {
    if (!navigator.serviceWorker.controller) show('offline not ready', 'Reconnect to finish the first download.');
  }).finally(ask);
  addEventListener('online', () => { registration?.update().catch(() => {}); ask(); });
  addEventListener('offline', ask);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) ask(); });
}

// Leaving this page while offline only works when the offline copy is complete. Otherwise say so here,
// instead of letting Safari show "not connected to the internet".
window.offlineGuard = () => {
  if (navigator.onLine || badge.dataset.ready === 'true' || navigator.serviceWorker?.controller) return true;
  let note = document.getElementById('offlineNote');
  if (!note) {
    note = document.createElement('div'); note.id = 'offlineNote';
    note.style.cssText = 'position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(5,7,12,.82);'
      + 'font:600 18px/1.5 system-ui,sans-serif;color:#e8eefc;text-align:center;padding:24px';
    note.onclick = () => note.remove();
    document.body.append(note);
  }
  note.innerHTML = '<div>📶 This iPad has not finished saving the app yet.<br>'
    + '<span style="font-weight:400;color:#aab6cc">Connect to Wi-Fi, open the app and wait for <b style="color:#4dff88">✓ offline</b> at the top. '
    + 'Then it works with no internet.</span><br><br><span style="font-weight:400;color:#7f8aa0">tap to close</span></div>';
  return false;
};
document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href]');
  if (!link || link.origin !== location.origin || link.rel === 'ar' || link.hasAttribute('download')) return;
  if (!window.offlineGuard()) event.preventDefault();
}, true);
