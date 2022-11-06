import rewriteURL from "./url";

export default function srcset(content: string, url: string): string {
  return content
    .split(",")
    .map((src: string): string => {
      var split = src.trimStart().split(" ");
      if (split[0]) split[0] = rewriteURL(split[0], url);
      return split.join(" ");
    })
    .join(", ");
}
