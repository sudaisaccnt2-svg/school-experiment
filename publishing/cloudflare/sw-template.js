// Public-site worker: save the small app first, then cache lessons as they are opened.
const VERSION = 'asawera-__VERSION__';
const CODE_PREFIX = 'asawera-code-';
const CODE_CACHE = CODE_PREFIX + VERSION;
const DATA_CACHE = 'asawera-content-v1';
const CATALOG = __ASSETS__;
const ASSETS = CATALOG.map(asset => ({ ...asset, href: new URL(asset.url, self.registration.scope).href }));
const CORE = ASSETS.filter(asset => asset.core);
const paths = new Map();
for (const asset of ASSETS) {
  for (const path of [asset.url, ...asset.aliases]) paths.set(new URL(path, self.registration.scope).pathname, asset);
}
const contentKey = asset => new URL('__saved/' + asset.hash, self.registration.scope).href;
const fullRequestKey = new URL('__save_everything', self.registration.scope).href;
const downloads = new Map();
let savingAll = null, lastError = '';

async function cacheFor(asset) { return caches.open(asset.core ? CODE_CACHE : DATA_CACHE); }
async function stored(asset) {
  return (await cacheFor(asset)).match(asset.core ? asset.href : contentKey(asset));
}

function obtain(asset) {
  if (!downloads.has(asset.href)) {
    const pending = (async () => {
      const hit = await stored(asset);
      if (hit) return;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
      try {
        const response = await fetch(new Request(asset.href, {
          cache: 'reload', integrity: asset.integrity, signal: controller.signal,
        }));
        if (response.status !== 200) throw new Error('Download failed: ' + response.status);
        // Pages redirects .html URLs. A redirected Response cannot be replayed for every navigation mode.
        const headers = new Headers(response.headers);
        headers.delete('Content-Encoding'); headers.delete('Content-Length');
        const saved = new Response(response.body, { status: 200, headers });
        await (await cacheFor(asset)).put(asset.core ? asset.href : contentKey(asset), saved);
      } finally { clearTimeout(timeout); }
    })().finally(() => { downloads.delete(asset.href); });
    downloads.set(asset.href, pending);
  }
  return downloads.get(asset.href);
}

async function status() {
  const code = new Set((await (await caches.open(CODE_CACHE)).keys()).map(request => request.url));
  const data = new Set((await (await caches.open(DATA_CACHE)).keys()).map(request => request.url));
  const present = ASSETS.filter(asset => asset.core ? code.has(asset.href) : data.has(contentKey(asset)));
  const shellReady = CORE.every(asset => code.has(asset.href));
  return { type: 'cache-status', version: VERSION, shellReady,
    ready: present.length === ASSETS.length, savingAll: data.has(fullRequestKey),
    cached: present.length, total: ASSETS.length,
    cachedBytes: present.reduce((sum, asset) => sum + asset.size, 0),
    totalBytes: ASSETS.reduce((sum, asset) => sum + asset.size, 0), error: lastError };
}

async function notify(target) {
  const message = await status();
  if (target) target.postMessage(message);
  else (await self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
    .forEach(client => client.postMessage(message));
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    for (const asset of CORE) await obtain(asset);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (!(await status()).shellReady) throw new Error('App installation incomplete');
    // Downloaded models use content hashes and remain available across app updates.
    for (const name of await caches.keys()) {
      if (name.startsWith(CODE_PREFIX) && name !== CODE_CACHE) await caches.delete(name);
    }
    await self.clients.claim();
    await notify();
  })());
});

function saveEverything() {
  return savingAll ??= (async () => {
    lastError = '';
    await (await caches.open(DATA_CACHE)).put(fullRequestKey, new Response('requested'));
    for (const asset of ASSETS) {
      try { await obtain(asset); }
      catch (error) {
        lastError = error.name;
        await notify();
        return; // Resume when the visitor reconnects; do not loop on a broken connection.
      }
      await notify();
    }
    await notify();
  })().finally(() => { savingAll = null; });
}

async function ranged(response, range) {
  const blob = await response.blob();
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  let start, end;
  if (match && (match[1] || match[2])) {
    start = match[1] ? Number(match[1]) : Math.max(0, blob.size - Number(match[2]));
    end = match[1] && match[2] ? Math.min(Number(match[2]), blob.size - 1) : blob.size - 1;
  }
  const headers = new Headers(response.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.delete('Content-Encoding');
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= blob.size) {
    headers.set('Content-Range', `bytes */${blob.size}`);
    headers.set('Content-Length', '0');
    return new Response(null, { status: 416, headers });
  }
  headers.set('Content-Range', `bytes ${start}-${end}/${blob.size}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(blob.slice(start, end + 1), { status: 206, headers });
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const asset = paths.get(url.pathname);
  if (!asset || (url.searchParams.has('v') && url.search !== new URL(asset.href).search)) return;
  if (event.request.mode === 'navigate' && asset.url.endsWith('/index.html')
      && url.pathname === new URL(asset.href).pathname.replace('/index.html', '')) {
    event.respondWith(Response.redirect(url.pathname + '/' + url.search));
    return;
  }
  event.respondWith((async () => {
    try {
      await obtain(asset);
      const response = await stored(asset);
      const range = event.request.headers.get('Range');
      return range ? ranged(response, range) : response;
    } catch {
      return new Response('This lesson is not saved yet. Reconnect to load it.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'cache-status') event.waitUntil(notify(event.source));
  if (event.data === 'download-all') event.waitUntil(saveEverything());
  if (event.data?.type === 'cache-opened') event.waitUntil((async () => {
    for (const href of event.data.urls || []) {
      const url = new URL(href);
      if (url.origin !== self.location.origin) continue;
      const asset = paths.get(url.pathname);
      if (!asset || (url.searchParams.has('v') && url.search !== new URL(asset.href).search)) continue;
      try { await obtain(asset); } catch { /* An interrupted first visit can be saved after reconnecting. */ }
    }
  })());
  if (event.data === 'resume-download') event.waitUntil((async () => {
    const current = await status();
    if (current.savingAll && !current.ready) await saveEverything();
  })());
});
