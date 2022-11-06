importScripts("/worker.js");

const worker = new ChargeWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(worker.fetch(event));
});
