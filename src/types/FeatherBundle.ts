export default interface FeatherBundle {
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
    srcset(content: string, url: string): string;
    url(url: string, meta: string): string;
  };
  register: (url: string) => void;
  backup: {
    [key: string]: any;
  };
  createSearchInput: (id: HTMLInputElement) => void;
}
