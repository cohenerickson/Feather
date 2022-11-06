import FeatherBundle from "./types/FeatherBundle";
import createSearchInput from "./util/createSearchInput";
import * as codecs from "./util/codecs";
import rewriteHTML from "./rewrite/html";
import rewriteURL from "./rewrite/url";
import rewriteCSS from "./rewrite/css";
import rewriteJS from "./rewrite/js";
import rewriteSrcset from "./rewrite/srcset";

declare global {
  interface Window {
    _$feather: FeatherBundle;
  }
}

self._$feather = {
  codecs,
  rewrite: {
    html: rewriteHTML,
    css: rewriteCSS,
    js: rewriteJS,
    url: rewriteURL,
    srcset: rewriteSrcset
  },
  register: (scriptURL: string): void => {
    navigator.serviceWorker.register(scriptURL, {
      scope: self._$feather_config.prefix
    });
  },
  backup: {},
  createSearchInput
};
