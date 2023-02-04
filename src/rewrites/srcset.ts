import FeatherBundle from "~/types/FeatherBundle";

declare var _$feather: FeatherBundle;

export default function srcset(content: string, url: string): string {
  return content
    .split(",")
    .map((src: string): string => {
      var split = src.trimStart().split(" ");
      if (split[0]) split[0] = _$feather.rewrite.url(split[0], url);
      return split.join(" ");
    })
    .join(", ");
}
