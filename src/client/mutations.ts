import FeatherBundle from "~/types/FeatherBundle";

declare var _$feather: FeatherBundle;
declare var _$f: <T>(x: T) => T;

export default function MutationInit() {
  let origin = _$f(location).origin + _$f(location).pathname;

  new MutationObserver((mutations, observer) => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          let element = node as HTMLElement;
          if (element.getAttribute("_observed") === "true") return;

          switch (element.tagName.toLowerCase()) {
            case "a":
              {
                let anchor = element as HTMLAnchorElement;
                anchor.href = _$feather.rewrite.url(
                  anchor.getAttribute("href") || "",
                  origin
                );
              }
              break;
            case "link":
              {
                let link = element as HTMLLinkElement;
                link.href = _$feather.rewrite.url(
                  link.getAttribute("href") || "",
                  origin
                );
              }
              break;
            case "style":
              {
                let style = element as HTMLStyleElement;
                style.innerHTML = _$feather.rewrite.css(style.innerHTML);
              }
              break;
            case "img":
              {
                let image = element as HTMLImageElement;
                image.src = _$feather.rewrite.url(
                  image.getAttribute("src") || "",
                  _$f(location).href
                );
              }
              break;

            case "script":
              {
                let oldScript = element as HTMLScriptElement;
                let script = document.createElement("script");
                if (oldScript.src)
                  script.src = _$feather.rewrite.url(
                    oldScript.getAttribute("src") || "",
                    origin
                  );
                if (oldScript.type) script.type = oldScript.type;
                if (
                  oldScript.innerHTML &&
                  ["application/javascript", undefined].includes(oldScript.type)
                )
                  script.innerHTML = _$feather.rewrite.js(oldScript.innerHTML);

                script.async = oldScript.async;
                script.defer = oldScript.defer;
                script.type = oldScript.type;
                (oldScript.parentNode || document).insertBefore(
                  script,
                  oldScript
                );
                element.remove();
                element = script;
              }
              break;
          }

          element.setAttribute("_observed", "true");
        }
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
}
