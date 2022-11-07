window.history.pushState = new Proxy(window.history.pushState, {
  apply(target: any, thisArg: any, args: string[]) {
    const rewriteURL = self._$feather.rewrite.url;
    const config = self._$feather_config;

    if (new RegExp(`^${config.prefix}`).test(args[2])) return;
    args[2] = rewriteURL(args[2], self._$f(location).href);
    Reflect.apply(target, thisArg, args);
  }
});

window.history.replaceState = new Proxy(window.history.replaceState, {
  apply(target: any, thisArg: any, args: string[]) {
    const rewriteURL = self._$feather.rewrite.url;
    const config = self._$feather_config;

    if (new RegExp(`^${config.prefix}`).test(args[2])) return;
    args[2] = rewriteURL(args[2], self._$f(location).href);
    Reflect.apply(target, thisArg, args);
  }
});
