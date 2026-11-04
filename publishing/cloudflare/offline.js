// Public-site offline controls. Large models are saved when opened, unless Save all is chosen.
let badge = document.getElementById('offlineBadge');
if (!badge) {
  badge = document.createElement('span');
  badge.id = 'offlineBadge'; badge.className = 'badge'; badge.setAttribute('role', 'status');
  (document.getElementById('top') || document.body).append(badge);
  badge.style.cssText = 'font:12px system-ui;align-self:center;color:#d6deed';
}
const button = document.createElement('button');
button.id = 'saveAllOffline'; button.textContent = 'Save all offline';
button.type = 'button';
button.style.cssText = 'font:12px system-ui;cursor:pointer;margin-left:8px;padding:5px 8px;'
  + 'border:1px solid #ffffff44;border-radius:8px;background:#121923;color:#e8eefc;align-self:center';
badge.after(button);
const show = (message, detail = '') => { badge.textContent = message; badge.title = detail; };
let registration, timer, reloaded = false, ready = false;
const hadController = !!navigator.serviceWorker?.controller;

function schedule(delay = 5000) { clearTimeout(timer); timer = setTimeout(ask, delay); }
async function ask() {
  try {
    registration = await navigator.serviceWorker.getRegistration(new URL('./', import.meta.url));
    const worker = registration?.installing || registration?.waiting || registration?.active;
    worker?.postMessage('cache-status');
  } catch { /* Existing saved content can still work when an update check fails. */ }
  schedule();
}
function resume() {
  if (navigator.onLine) navigator.serviceWorker.controller?.postMessage('resume-download');
  ask();
}

// On the first ever visit some requests finish before the worker controls the page.
// Save those opened resources too, without downloading any unopened lessons.
function rememberOpened(entries) {
  const urls = entries.map(entry => entry.name).filter(href => {
    try { return new URL(href).origin === location.origin; } catch { return false; }
  });
  if (urls.length) navigator.serviceWorker.controller?.postMessage({ type: 'cache-opened', urls });
}

if (!isSecureContext || !('serviceWorker' in navigator)) {
  show('online only', 'Use the HTTPS website to save lessons for offline use.');
  button.hidden = true;
} else {
  show('checking saved lessons…');
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !reloaded) { reloaded = true; location.reload(); }
    else resume();
  });
  navigator.serviceWorker.addEventListener('message', event => {
    const status = event.data;
    if (status?.type !== 'cache-status' || event.source !== navigator.serviceWorker.controller) return;
    ready = status.ready === true;
    badge.dataset.ready = String(ready);
    badge.dataset.shellReady = String(status.shellReady);
    badge.dataset.version = status.version;
    const mb = (status.totalBytes / 1e6).toFixed(0);
    button.title = `Save every film, game and AR scene (about ${mb} MB).`;
    button.hidden = ready;
    button.disabled = status.savingAll && navigator.onLine && !status.error;
    button.textContent = status.savingAll ? 'Resume saving' : 'Save all offline';
    if (ready) {
      show('✓ all saved offline', 'Every film, game and AR scene is saved on this device.');
      schedule(30000);
    } else if (status.savingAll) {
      const percent = Math.min(99, Math.round(100 * status.cachedBytes / Math.max(1, status.totalBytes)));
      show(status.error === 'QuotaExceededError' ? 'Storage full — saving paused'
        : !navigator.onLine ? 'Reconnect to finish saving' : `Saving all ${percent}%`,
        'Keep this app open until ✓ all saved offline appears.');
      schedule(2000);
    } else {
      show(navigator.onLine ? 'Opened lessons save offline' : 'Offline — saved lessons only',
        `About ${(status.cachedBytes / 1e6).toFixed(1)} MB saved. Save all downloads the complete library (${mb} MB).`);
      schedule(15000);
    }
  });
  button.addEventListener('click', () => {
    if (!navigator.onLine) { show('Reconnect to save the library'); return; }
    const worker = navigator.serviceWorker.controller;
    if (!worker) { show('Preparing offline saving…'); ask(); return; }
    worker.postMessage('download-all');
    show('Saving all… keep this app open');
    navigator.storage?.persist?.().catch(() => {});
    ask();
  });
  navigator.serviceWorker.register(new URL('./sw.js', import.meta.url), { updateViaCache: 'none' })
    .then(reg => { registration = reg; return navigator.serviceWorker.ready; })
    .then(() => {
      rememberOpened(performance.getEntriesByType('resource'));
      const observer = new PerformanceObserver(list => rememberOpened(list.getEntries()));
      observer.observe({ entryTypes: ['resource'] });
      resume();
    }).catch(() => show('Offline setup incomplete — reconnect')).finally(ask);
  addEventListener('online', () => { registration?.update().catch(() => {}); resume(); });
  addEventListener('offline', ask);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) resume(); });
}

// Existing navigation hooks keep working; the worker caches each lesson as it is requested.
window.offlineGuard = () => {
  if (navigator.onLine || ready || navigator.serviceWorker?.controller) return true;
  show('Reconnect once to prepare offline saving');
  return false;
};
document.addEventListener('click', event => {
  const link = event.target.closest?.('a[href]');
  if (!link || link.origin !== location.origin || link.rel === 'ar' || link.hasAttribute('download')) return;
  if (!window.offlineGuard()) event.preventDefault();
}, true);
