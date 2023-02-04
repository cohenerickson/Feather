import FeatherBundle from "../types/FeatherBundle";

declare var _$feather: FeatherBundle;

export default function css(
  source: string,
  url: string = location.href
): string {
  return source.replace(
    /(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g,
    (match: string): string => {
      return _$feather.rewrite?.url(match, url);
    }
  );
}
