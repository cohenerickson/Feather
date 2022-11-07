import "./elements";
import "./history";
import LocationProxy from "./location";
import "./navigator";
import "./network";
import StorageProxy from "./storage";
import "./websocket";
import WindowProxy from "./window";

declare global {
  interface Window {
    _$f: (x: any) => any;
  }
}

const isInstanceOf = (x: any, y: string): boolean => {
  let ctx: any[] = [parent, top, window, globalThis, self];
  for (let i = 0; i < ctx.length; i++) {
    if (x instanceof ctx[i]._$feather.backup[y]) {
      return true;
    }
  }
  return false;
};

self._$f = (prop: any): any => {
  if (isInstanceOf(prop, "Location")) {
    return new LocationProxy(prop);
  } else if (isInstanceOf(prop, "Window")) {
    return new WindowProxy(prop);
  } else if (isInstanceOf(prop, "Storage")) {
    return new StorageProxy(prop);
  }
  return prop;
};

export {};
