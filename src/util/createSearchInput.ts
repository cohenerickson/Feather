import * as Bowser from "bowser";

export default function createSearchInput(search: HTMLInputElement): void {
  const browser = Bowser.getParser(window.navigator.userAgent);

  const isValidBrowser = browser.satisfies({
    chrome: ">=40",
    edge: ">=17",
    firefox: ">44",
    opera: ">=27",
    safari: ">=11.1",
    mobile: {
      safari: ">=11.3",
      samsung_internet: ">=4.0"
    }
  });

  if (!isValidBrowser) {
    throw new Error("Unsupported browser");
  }

  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    throw new Error("Unsupported protocol");
  }

  search.addEventListener("keypress", ({ key }) => {
    if (key === "Enter") {
      const value = search.value;
      if (!value) return;
      if (/^(https?:\/\/)?([^\s.]+\.)+[^\s.]+/.test(value)) {
        if (/^https?:\/\//.test(value)) {
          redirect(value);
        } else {
          redirect(`https://${value}`);
        }
      } else {
        redirect(
          `https://www.google.com/search?q=${encodeURIComponent(value)}`
        );
      }
    }
  });

  function redirect(url: string): void {
    location.href = `/~/${self._$feather_config.codec.encode(url)}`;
  }
}
