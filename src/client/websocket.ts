import { encodeProtocol } from "../util/encodeProtocol";

const websockets = new Map();

window.WebSocket = new Proxy(WebSocket, {
  construct(target: any, args: any[], newTarget: any): any {
    if (args[0]) {
      const url = new URL(args[0]);
      const id = Math.random().toString();

      websockets.set(id, url.toString());

      const request = {
        remote: {
          host: url.hostname,
          port: url.port || (url.protocol === "wss:" ? "443" : "80"),
          path: url.pathname + url.search,
          protocol: url.protocol
        },
        headers: {
          Host: url.host,
          Origin: self._$f(location).origin,
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          Upgrade: "websocket",
          Connection: "Upgrade"
        },
        forward_headers: [
          "accept-encoding",
          "accept-language",
          "sec-websocket-extensions",
          "sec-websocket-key",
          "sec-websocket-version"
        ]
      };

      const bareURL = new URL(self._$feather_config.bare());
      return Reflect.construct(target, [
        location.protocol.replace("http", "ws") +
          "//" +
          (bareURL.host + bareURL.pathname) +
          `v1/?${id}`,
        ["bare", encodeProtocol(JSON.stringify(request))]
      ]);
    }
    return Reflect.construct(target, args, newTarget);
  }
});

const websocketURL = Object.getOwnPropertyDescriptor(
  WebSocket.prototype,
  "url"
) as PropertyDescriptor & {
  set?: {
    call: (x: any, y: any) => void;
  };
  get?: {
    call: (x: any, y: any) => void;
  };
};

Object.defineProperty(WebSocket.prototype, "url", {
  get() {
    const url = websocketURL.get?.call(this);
    const id = new URL(url).search.substring(1);
    return websockets.get(id);
  }
});
