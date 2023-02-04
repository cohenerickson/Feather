import FeatherCodec from "./FeatherCodec";

export default interface FeatherBundle {
  rewrite: {
    url: (x: string, y?: string) => string;
    css: (x: string, y?: string) => string;
    js: (x: string) => string;
  };
  classes: any;
  codecs: FeatherCodec[];
}
