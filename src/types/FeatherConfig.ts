export default interface FeatherConfig {
  prefix: string;
  codec: {
    encode(url: string): string;
    decode(url: string): string;
  };
  bare(): string;
}
