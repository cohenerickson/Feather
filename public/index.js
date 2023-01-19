const config = {
  prefix: "/~/",
  bare: location.origin + "/bare/",
  bundle: "/bundle.js"
};

window.navigator.serviceWorker.register(
  `/feather.js?config=${encodeURIComponent(JSON.stringify(config))}`,
  {
    scope: config.prefix
  }
);
