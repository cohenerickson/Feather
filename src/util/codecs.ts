export const plain = {
  encode: (url: string): string => encodeURIComponent(url),
  decode: (url: string): string => decodeURIComponent(url)
};
