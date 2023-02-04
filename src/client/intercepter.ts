import FeatherLocation from "./api/location";
import FeatherStorage from "./api/storage";

self._$f = (prop: any): any => {
  if (isInstanceOf(prop, "Location")) {
    return new FeatherLocation(prop);
  } else if (isInstanceOf(prop, "Storage")) {
    return new FeatherStorage(prop);
  }
  //  else if (isInstanceOf(prop, "Window")) {
  //   return new WindowProxy(prop);
  // }
  return prop;
};

function isInstanceOf(x: any, y: string): boolean {
  let ctx: any[] = [window, parent, top];
  for (let i = 0; i < ctx.length; i++) {
    if (x instanceof ctx[i]._$feather.classes[y]) {
      return true;
    }
  }
  return false;
}
