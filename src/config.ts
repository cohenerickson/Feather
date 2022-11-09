import FeatherConfig from "./types/FeatherConfig";

declare global {
  interface Window {
    _$feather_config: FeatherConfig;
  }
}

self._$feather_config = {
  prefix: "/~/",
  codec: self._$feather.codecs["plain"],
  bare: (): string => {
    return "http://localhost:8080/";
  },
  scripts: {
    bundle: "/bundle.js",
    config: "/config.js",
    client: "/client.js"
  }
};
