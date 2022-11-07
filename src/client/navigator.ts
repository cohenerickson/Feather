Object.defineProperty(navigator, "serviceWorker", {});

navigator.sendBeacon = new Proxy(navigator.sendBeacon, {
  apply(target, thisArg, args) {
    const rewriteURL = self._$feather.rewrite.url;

    if (args[0]) args[0] = rewriteURL(args[0], self._$f(location).href);
    return Reflect.apply(target, thisArg, args);
  }
});
