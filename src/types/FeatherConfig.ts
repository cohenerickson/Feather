export default interface FeatherConfig {
  prefix: string;
  codec: {
    encode(url: string): string;
    decode(url: string): string;
  };
  scripts: {
    bundle: string;
    config: string;
    client: string;
  };
  bare(): string;
}
