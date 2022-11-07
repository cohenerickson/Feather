window.fetch = new Proxy(fetch, {
  apply(target, thisArg, args) {
    const rewriteURL = self._$feather.rewrite.url;

    if (args[0]) args[0] = rewriteURL(args[0], self._$f(location).href);
    return Reflect.apply(target, thisArg, args);
  }
});

const XMLOpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (...args: any[]) {
  const rewriteURL = self._$feather.rewrite.url;

  if (args[1]) args[1] = rewriteURL(args[1], self._$f(location).href);
  // @ts-ignore
  // typescript doesn't like the spread operator
  return XMLOpen.call(this, ...args);
};

window.Request = new Proxy(Request, {
  construct(target, args) {
    const rewriteURL = self._$feather.rewrite.url;

    if (args[0]) args[0] = rewriteURL(args[0], self._$f(location).href);
    return new Proxy(Reflect.construct(target, args), {
      get(target: any, prop: string, receiver: any): any {
        if (prop === "url") {
          return self._$f(location).href;
        }
        return target[prop];
      }
    });
  }
});

window.Worker = new Proxy(window.Worker, {
  construct(target: any, args: any[], newTarget: any): any {
    const rewriteURL = self._$feather.rewrite.url;

    if (args[0]) args[0] = rewriteURL(args[0], self._$f(location).href);
    return Reflect.construct(target, args, newTarget);
  }
});

window.open = new Proxy(window.open, {
  apply(target: any, thisArg: any, args: any[]): any {
    const rewriteURL = self._$feather.rewrite.url;

    if (args[0] && args[0] !== "about:blank")
      args[0] = rewriteURL(args[0], self._$f(location).href);
    Reflect.apply(target, thisArg, args);
  }
});

