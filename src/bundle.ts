import FeatherBundle from "./types/FeatherBundle";
import codecs from "./util/codecs";
import rewriteURL from "./rewrites/url";
import rewriteCSS from "./rewrites/css";
import rewriteJS from "./rewrites/js";

declare global {
  interface Window {
    _$feather: FeatherBundle;
  }
}

self._$feather = {
  rewrite: {
    url: rewriteURL,
    css: rewriteCSS,
    js: rewriteJS
  },
  classes: {},
  codecs
};
