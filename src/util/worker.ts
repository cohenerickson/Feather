import BareClient, { BareFetchInit } from "@tomphttp/bare-client";
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
    if (!this.bareClient)
      return new Response(null, {
        status: 205
      });

    let url = this.codec.decode(
      event.request.url.slice(
        location.origin.length + this.config.prefix.length
      )
    );

    if (!/^https?:\/\//.test(url)) {
      return fetch(event.request);
    }

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

    const bareResponse = await this.bareClient.fetch(url, requestOptions);

    // handle redirects
    if (bareResponse.finalURL !== url) {
      return new Response(
        `
        <script>
          location.href = "${self._$feather.rewrite.url(
            bareResponse.finalURL,
            url
          )}";
        </script>
      `,
        {
          headers: {
            "Content-Type": "text/html"
          }
        }
      );
    }

    const contentType = bareResponse.headers.get("content-type") || "";

    let responseData: BodyInit | undefined;
    if (
      /text\/html/.test(contentType) &&
      ["document", "iframe"].includes(event.request.destination)
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
      responseData = _$feather.rewrite.css(await bareResponse.text(), url);
    } else if (
      /(text|application)\/javascript/.test(contentType) ||
      ["script", "worker"].includes(event.request.destination)
    ) {
      // Scope JS
      responseData = _$feather.rewrite.js(await bareResponse.text());
    } else {
      // Fallback Binary
      responseData = await bareResponse.arrayBuffer();
    }

    return new Response(
      [101, 204, 205, 304].includes(bareResponse.status) ? null : responseData,
      {
        status: bareResponse.status,
        statusText: bareResponse.statusText,
        headers: ((): Headers => {
          const headers: Headers = bareResponse.headers;
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
      }
    );
  }
}

export default FeatherWorker;
