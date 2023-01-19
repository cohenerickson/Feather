import FeatherBundle from "~/types/FeatherBundle";
import FeatherConfig from "~/types/FeatherConfig";

declare var _$feather: FeatherBundle;
declare var _$featherConfig: FeatherConfig;

export default class FeatherLocation extends URL {
  #scope: Window;
  ancestorOrigins: { length: number };

  constructor(scope: Window = window) {
    super(
      _$feather.codecs[_$featherConfig.codec].decode(
        scope.location.pathname.slice(_$featherConfig.prefix.length)
      )
    );
    this.#scope = scope;
    this.ancestorOrigins = scope.location.ancestorOrigins;
    // @ts-ignore
    this["Symbol(Symbol.toStringTag)"] = "Location";
    // @ts-ignore
    this["Symbol(Symbol.toPrimitive)"] = undefined;
  }

  assign(url: string | URL): void {
    this.#scope.location.assign(
      _$featherConfig.prefix +
        _$feather.codecs[_$featherConfig.codec].encode(
          new URL(url, this).toString()
        )
    );
  }

  reload(): void {
    this.#scope.location.reload();
  }

  replace(url: string | URL): void {
    this.#scope.location.replace(
      _$featherConfig.prefix +
        _$feather.codecs[_$featherConfig.codec].encode(
          new URL(url, this).toString()
        )
    );
  }

  toString(): string {
    return this.href;
  }

  valueOf(): FeatherLocation {
    return this;
  }
}
