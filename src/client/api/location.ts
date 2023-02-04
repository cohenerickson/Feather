import FeatherBundle from "~/types/FeatherBundle";
import FeatherConfig from "~/types/FeatherConfig";

declare var _$feather: FeatherBundle;
declare var _$featherConfig: FeatherConfig;

export default class FeatherLocation extends URL {
  #scope: Location;
  ancestorOrigins: { length: number };

  constructor(scope: Location = location) {
    super(
      _$feather.codecs[_$featherConfig.codec].decode(
        scope.pathname.slice(_$featherConfig.prefix.length)
      )
    );
    this.#scope = scope;
    this.ancestorOrigins = scope.ancestorOrigins;
    // @ts-ignore
    this["Symbol(Symbol.toStringTag)"] = "Location";
    // @ts-ignore
    this["Symbol(Symbol.toPrimitive)"] = undefined;
  }

  assign(url: string | URL): void {
    this.#scope.assign(
      _$featherConfig.prefix +
        _$feather.codecs[_$featherConfig.codec].encode(
          new URL(url, this).toString()
        )
    );
  }

  reload(): void {
    this.#scope.reload();
  }

  replace(url: string | URL): void {
    this.#scope.replace(
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

_$feather.classes["Location"] = Location;
// @ts-ignore
self.Location = FeatherLocation;
