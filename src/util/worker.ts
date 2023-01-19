import BareClient, {
  BareFetchInit,
  BareResponseFetch,
  createBareClient
} from "@tomphttp/bare-client";
import FetchEvent from "~/types/FetchEvent";
import FeatherConfig from "~/types/FeatherConfig";

class FeatherWorker {
  bareClient: BareClient;
  constructor(config: FeatherConfig) {
    this.bareClient = new BareClient(config.bare);
  }

  fetch(event: FetchEvent): Response {
    return new Response("Hello World");
  }
}

export default FeatherWorker;
