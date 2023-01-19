import FeatherCodec from "~/types/FeatherCodec";

const plain: FeatherCodec = {
  encode: (x: string): string => encodeURIComponent(x),
  decode: (x: string): string => decodeURIComponent(x)
};

export default [plain];
