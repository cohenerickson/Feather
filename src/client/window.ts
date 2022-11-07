import EventsProxy from "./events";

self._$feather.backup.Window = Window;

declare global {
  interface Window {
    Window: any;
  }
}

window.Window = class {};

export default class WindowProxy {
  constructor(scope: Window) {
    return new Proxy(scope, {
      get(target: any, prop: string, receiver: any): any {
        if (prop === "addEventListener") {
          return new EventsProxy(scope);
        } else {
          const value = self._$f(target[prop]);
          if (typeof value === "function") {
            return value.bind(scope);
          } else {
            return value;
          }
        }
      },
      set(target: any, prop: string, value: any): any {
        if (prop === "onmessage") {
          (new EventsProxy(scope) as any)("message", value);
          return true;
        }
        return Reflect.set(scope, prop, value);
      }
    });
  }
}

Object.defineProperty(window, "origin", {
  get() {
    return self._$f(location).origin;
  },
  set() {
    return arguments[0];
  }
});

window.CSSStyleDeclaration.prototype.setProperty = new Proxy(
  window.CSSStyleDeclaration.prototype.setProperty,
  {
    apply: (target, that, args) => {
      const rewriteCSS = self._$feather.rewrite.url;

      if (args[1]) args[1] = rewriteCSS(args[1], self._$f(location).href);
      return Reflect.apply(target, that, args);
    }
  }
);

window.eval = new Proxy(eval, {
  apply(target: typeof eval, thisArg: any, argumentsList: any[]): any {
    const rewriteJS = self._$feather.rewrite.js;

    if (argumentsList[0])
      argumentsList[0] = rewriteJS(argumentsList[0], self._$f(location).href);
    return Reflect.apply(target, thisArg, argumentsList);
  }
});
