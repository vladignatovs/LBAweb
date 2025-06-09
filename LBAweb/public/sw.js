self.addEventListener("install", () => {
  console.log("[ServiceWorker] Installed");
});

self.addEventListener("activate", () => {
  console.log("[ServiceWorker] Activated");
});

self.addEventListener("fetch", () => {
  event.respondWith(fetch(event.request));
});
