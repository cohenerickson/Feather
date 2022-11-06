import rewriteURL from "./url";

export default function rewriteCSS(content: string, url?: string): string {
  return content.replace(
    /(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g,
    (match: string): string => {
      return rewriteURL(match, url);
    }
  );
}
