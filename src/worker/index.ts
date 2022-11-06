import BareClient, {
  BareFetchInit,
  BareResponseFetch,
  createBareClient
} from "@tomphttp/bare-client";
import FetchEvent from "../types/FetchEvent";
importScripts("./bundle.js", "./config.js");

declare global {
  interface Window {
    featherWorker: typeof FeatherWorker;
  }
}

class FeatherWorker {
  client: BareClient | null = null;
  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    this.client = await createBareClient(self._$feather_config.bare());
  }

  async fetch(event: FetchEvent): Promise<Response> {
    if (!this.client)
      return new Response("Not Initialized.", {
        status: 205
      });

    const url =
      self._$feather_config.codec.decode(
        event.request.url.slice(
          (location.origin + self._$feather_config.prefix).length
        )
      ) + new URL(event.request.url).search;
    if (!/^https?:\/\//.test(url)) {
      return fetch(event.request.url);
    }
    console.log(url);

    const requestOptions: BareFetchInit = {
      method: event.request.method,
      headers: ((): Headers => {
        const headers: Headers = event.request.headers;
        if (headers.has("host")) {
          headers.set("host", new URL(url).host);
        }
        return headers;
      })()
    };

    if (!["GET", "HEAD"].includes(event.request.method)) {
      requestOptions.body = event.request.body;
    }

    const response: BareResponseFetch = await this.client.fetch(
      url,
      requestOptions
    );

    const contentType = response.headers.get("content-type");

    let responseData: ReadableStream<Uint8Array> | string | null =
      response.body;

    if (contentType && contentType.includes("text/html")) {
      const content = await response.text();
      responseData = self._$feather.rewrite.html(content, url);
    } else if (
      (contentType && contentType.includes("text/css")) ||
      event.request.destination === "style"
    ) {
      const content = await response.text();
      responseData = self._$feather.rewrite.css(content, url);
    } else if (
      (contentType && contentType.includes("text/javascript")) ||
      event.request.destination === "script"
    ) {
      const content = await response.text();
      responseData = self._$feather.rewrite.js(content, url);
    }

    return new Response(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: ((): Headers => {
        const headers: Headers = response.headers;
        [
          "Cache-Control",
          "Content-Security-Policy",
          "Content-Security-Policy-Report-Only",
          "Cross-Origin-Opener-Policy",
          "Cross-Origin-Opener-Policy-Report-Only",
          "Report-To",
          "Strict-Transport-Security",
          "X-Content-Type-Options",
          "X-Frame-Options",
          "Access-Control-Allow-Origin"
        ].forEach((header: string): void => {
          if (headers.has(header)) {
            headers.delete(header);
          }
        });
        return headers;
      })()
    });
  }
}

self.featherWorker = FeatherWorker;

export {};
