import FeatherBundle from "../types/FeatherBundle";
import FeatherConfig from "../types/FeatherConfig";

declare var _$feather: FeatherBundle;
declare var _$featherConfig: FeatherConfig;

export default function url(source: string, origin: string = location.origin + location.pathname): string {
  return (
    _$featherConfig.prefix +
    _$feather.codecs[_$featherConfig.codec].encode(
      new URL(source, origin).toString()
    )
  );
}
