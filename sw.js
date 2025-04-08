// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
caches.open(CACHE)
  .then((cache) => {
    return cache.addAll([
      "/",
      "/index.html",
      "/style.css",
      "/manifest.json",
      "/sw.js",
      "/icons/icon-192.png",
      "/icons/icon-512.png",
      // Add your Juz images:
      "/Juz1",
      "/Juz11/quran-juz-11-urdu-translation-1.jpg",
      "/juz3.png",
      // Add audio files if needed:
      // "/audio/juz1.mp3",
      // "/audio/juz2.mp3"
    ]);
  })
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
