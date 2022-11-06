self._$feather.backup.Window = Window;

declare global {
  interface Window {
    Window: any;
  }
}

window.Window = class {};

export class WindowProxy {
  constructor(scope: Window) {
    return new Proxy(scope, {
      get(target: any, prop: string, receiver: any): any {
        const value = self._$f(target[prop]);
        if (typeof value === "function") {
          return value.bind(scope);
        } else {
          return value;
        }
      },
      set(target: any, prop: string, value: any): any {
        return Reflect.set(scope, prop, value);
      }
    });
  }
}

export default WindowProxy;
