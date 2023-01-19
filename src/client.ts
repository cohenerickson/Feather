import MutationInit from "./client/mutations";
import FeatherClient from "./types/FeatherClient";
import FeatherLocation from "./client/api/location";

declare global {
  interface Window {
    _$featherClient: FeatherClient;
    _$f: <T>(x: T) => T;
  }
}

self._$featherClient = {
  location: new FeatherLocation()
};

self._$f = <T>(x: T): T => {
  return x;
};

MutationInit();

// @ts-ignore
self.Location = FeatherLocation;
