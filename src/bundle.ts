import FeatherBundle from "./types/FeatherBundle";
import codecs from "./util/codecs";
import rewriteURL from "./rewrites/url";
import rewriteJS from "./rewrites/js";

declare global {
  interface Window {
    _$feather: FeatherBundle;
  }
}

self._$feather = {
  rewrite: {
    url: rewriteURL,
    js: rewriteJS
  },
  codecs
};
