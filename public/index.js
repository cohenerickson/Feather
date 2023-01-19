const config = {
  prefix: "/~/",
  bare: "/bare/",
  codec: 0,
  bundle: "/bundle.js",
  client: "/client.js",
  disableCache: true
};

window.navigator.serviceWorker
  .getRegistration((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  })
  .then(() => {
    window.navigator.serviceWorker.register(
      `/worker.js?config=${encodeURIComponent(JSON.stringify(config))}${
        config.disableCache ? `&q=${Math.random()}` : ""
      }`,
      {
        scope: config.prefix,
        updateViaCache: config.disableCache ? "none" : undefined
      }
    );
  });

const input = document.querySelector("input");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    setTimeout(() => {
      if (input.value) {
        location.href =
          config.prefix +
          _$feather.codecs[config.codec].encode(url(input.value));
      }
    });
  }
});

function url(query) {
  if (/^https?:\/\//.test(query)) {
    return query;
  } else if (/^[^\s]+(\.[^\s]+)+$/) {
    return `https://${query}`;
  } else {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}
