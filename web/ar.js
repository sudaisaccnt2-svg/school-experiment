// Quick Look needs a local blob and a .usdz download name to open without a network request.
// files[zone] is the film's USDZ for that zone (from the film's JSON), or null when the zone has none.
export function createARLink({ link, text, files, getZone, showMessage }) {
  const AR_FILES = files;
  const supported = link.relList.supports('ar');
  const blobs = new Map(), loads = new Map();

  function update() {
    const zone = getZone();
    link.hidden = !AR_FILES[zone];
    if (!AR_FILES[zone]) return;
    link.href = (blobs.get(zone) || AR_FILES[zone]) + '#allowsContentScaling=1';
    link.download = AR_FILES[zone].split('/').pop();
  }

  function prepare(zone) {
    if (!loads.has(zone)) {
      const load = fetch(AR_FILES[zone]).then(async (response) => {
        if (!response.ok) throw new Error(`AR file: ${response.status}`);
        const data = await response.blob();
        if (!data.size) throw new Error('Empty AR file');
        const blob = new Blob([data], { type: 'model/vnd.usdz+zip' });
        const url = URL.createObjectURL(blob);
        blobs.set(zone, url);
        update();
        return url;
      }).catch((error) => { loads.delete(zone); throw error; });
      loads.set(zone, load);
    }
    return loads.get(zone);
  }

  function prepareAll() {
    if (supported) AR_FILES.forEach((f, zone) => { if (f) prepare(zone).catch(() => {}); });
  }

  link.addEventListener('click', (event) => {
    if (!supported) {
      event.preventDefault();
      showMessage('Open AR in Safari on iPad / iPhone');
      return;
    }
    const zone = getZone();
    if (blobs.has(zone)) { update(); return; }
    event.preventDefault();
    text.textContent = 'Preparing AR…';
    prepare(zone).then(() => {
      text.textContent = '';
      // Keep the next tap as a real user gesture; an async .click() can be blocked by Safari.
      showMessage('AR ready — tap AR again');
    }).catch(() => {
      text.textContent = '';
      showMessage(navigator.onLine ? 'AR could not load — tap to retry' : 'Reconnect to save this AR scene');
    });
  });

  update();
  // Wait for installation so the first visit reads the saved files instead of downloading them twice.
  if (supported) {
    if (isSecureContext && 'serviceWorker' in navigator) navigator.serviceWorker.ready.then(prepareAll);
    else prepareAll();
    addEventListener('online', prepareAll);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) prepareAll(); });
  }
  // Object URLs stay alive while Quick Look uses them, and the browser frees them when the page closes.
  return { update };
}
