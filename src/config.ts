declare global {
  interface Window {
    _$feather_config: {
      prefix: string;
      codec: {
        encode(url: string): string;
        decode(url: string): string;
      };
      bare(): string;
    };
  }
}

self._$feather_config = {
  prefix: "/~/",
  codec: self._$feather.codecs["plain"],
  bare: (): string => {
    return "https://radon.games/bare/";
  }
};

export {};
