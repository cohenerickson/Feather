import FeatherWorker from "./util/worker";
import FeatherConfig from "./types/FeatherConfig";
import FetchEvent from "./types/FetchEvent";

const query = new URLSearchParams(location.search);
const config: FeatherConfig = JSON.parse(
  decodeURIComponent(query.get("config") || "")
);

const worker = new FeatherWorker(config);

self.addEventListener("fetch", (event) => {
  (event as FetchEvent).respondWith(worker.fetch(event as FetchEvent));
});
