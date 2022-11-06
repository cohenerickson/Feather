import js from "./js";

export default function url(url: string, base?: string): string {
  const config = self._$feather_config;
  if (new RegExp(`^${config.prefix}`).test(url)) return url;
  let fakeLocation: URL | undefined;

  if ("window" in self) {
    fakeLocation = new URL(
      config.codec.decode(
        location.href.slice((location.origin + config.prefix).length)
      )
    );
  }

  if (base) {
    fakeLocation = new URL(base);
  }

  if (/^(#|about|data|mailto):/.test(url)) {
    return url;
  } else if (/^javascript:/.test(url)) {
    return `javascript:${js(url.slice("javascript:".length), base ?? "")}`;
  } else {
    if (!fakeLocation) return url;
    try {
      return `${config.prefix}${config.codec.encode(
        new URL(url, fakeLocation).href
      )}`;
    } catch {
      return `${config.prefix}${config.codec.encode(url)}`;
    }
  }
}
