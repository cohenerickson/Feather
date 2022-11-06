import LocationProxy from "./location";
import WindowProxy from "./window";
import "./navigator";

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

self._$f = (x: any): any => {
  if (isInstanceOf(x, "Location")) {
    return new LocationProxy(x);
  } else if (isInstanceOf(x, "Window")) {
    return new WindowProxy(x);
  }
  return x;
};

export {};
