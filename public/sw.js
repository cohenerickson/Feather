importScripts("/worker.js");

const worker = new FeatherWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(worker.fetch(event));
});
