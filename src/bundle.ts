import createSearchInput from "./util/createSearchInput";
import html from "./rewrite/html";
import css from "./rewrite/css";
import js from "./rewrite/js";
import url from "./rewrite/url";

declare global {
  interface Window {
    _$feather: {
      codecs: {
        [key: string]: {
          encode(url: string): string;
          decode(url: string): string;
        };
      };
      rewrite: {
        html(content: string, url: string): string;
        js(content: string, url: string): string;
        css(content: string, url: string): string;
        url(url: string): string;
      };
      register: (url: string) => void;
      createSearchInput: (id: HTMLInputElement) => void;
    };
  }
}

self._$feather = {
  codecs: {
    plain: {
      encode(url: string): string {
        return encodeURIComponent(url);
      },
      decode(url: string): string {
        return decodeURIComponent(url);
      }
    }
  },
  rewrite: {
    html,
    css,
    js,
    url
  },
  register: (scriptURL: string): void => {
    navigator.serviceWorker.register(scriptURL, {
      scope: self._$feather_config.prefix
    });
  },
  createSearchInput
};

export {};
