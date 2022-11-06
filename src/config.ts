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
    return "https://radon.games/bare/";
  }
};
