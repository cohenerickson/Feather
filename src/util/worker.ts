import BareClient, {
  BareFetchInit,
  BareResponseFetch,
  createBareClient
} from "@tomphttp/bare-client";
import FetchEvent from "~/types/FetchEvent";
import FeatherConfig from "~/types/FeatherConfig";
import FeatherCodec from "~/types/FeatherCodec";
import FeatherBundle from "~/types/FeatherBundle";

declare var _$feather: FeatherBundle;

declare global {
  interface Window {
    _$featherConfig: FeatherConfig;
  }
}

class FeatherWorker {
  config: FeatherConfig;
  codec: FeatherCodec;
  bareClient: BareClient;

  constructor(config: FeatherConfig) {
    importScripts(config.bundle);
    this.config = config;
    self._$featherConfig = config;
    this.codec = _$feather.codecs[config.codec];
    this.bareClient = new BareClient(
      /^https?:\/\//.test(config.bare)
        ? config.bare
        : location.origin + config.bare
    );
  }

  async fetch(event: FetchEvent): Promise<Response> {
    let url = this.codec.decode(
      event.request.url.slice(
        location.origin.length + this.config.prefix.length
      )
    );

    if (!/^https?:\/\//.test(url)) {
      return fetch(event.request);
    }

    const bareResponse = await this.bareClient.fetch(url, {
      headers: Object.fromEntries(event.request.headers)
    });

    const contentType = bareResponse.headers.get("content-type") || "";

    let responseData: BodyInit | undefined;
    if (
      /text\/html/.test(contentType) &&
      event.request.destination === "document"
    ) {
      // Inject Scripts
      responseData = `
        <script src="${this.config.bundle}${
        this.config.disableCache ? `?q=${Math.random()}` : ""
      }"></script>
        <script>
          window._$featherConfig = ${JSON.stringify(this.config)}
        </script>
        <script src="${this.config.client}${
        this.config.disableCache ? `?q=${Math.random()}` : ""
      }"></script>
        ${await bareResponse.text()}
      `;
    } else if (
      /text\/css/.test(contentType) ||
      event.request.destination === "style"
    ) {
      // Rewrite CSS
      responseData = (await bareResponse.text()).replace(
        /(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g,
        (match: string): string => {
          return _$feather.rewrite?.url(match, url);
        }
      );
    } else if (
      /(text|application)\/javascript/.test(contentType) ||
      event.request.destination === "script"
    ) {
      responseData = _$feather.rewrite.js(await bareResponse.text());
    } else {
      responseData = await bareResponse.arrayBuffer();
    }

    return new Response(responseData, {
      headers: {
        "content-type": contentType
      }
    });
  }
}

export default FeatherWorker;
