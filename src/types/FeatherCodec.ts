export default interface FeatherCodec {
  encode: (x: string) => string,
  decode: (x: string) => string
}
