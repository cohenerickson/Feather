import FeatherBundle from "~/types/FeatherBundle";
import FeatherClient from "~/types/FeatherClient";

declare var _$feather: FeatherBundle;
declare var _$featherClient: FeatherClient;

export default function MutationInit() {
  let origin =
    _$featherClient.location.origin + _$featherClient.location.pathname;

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
            case "script":
              console.log(element);
              {
                let oldScript = element as HTMLScriptElement;
                let script = document.createElement("script");
                if (oldScript.src)
                  script.src = _$feather.rewrite.url(
                    oldScript.getAttribute("src") || "",
                    origin
                  );
                if (oldScript.innerHTML) script.innerHTML = _$feather.rewrite.js(oldScript.innerHTML);
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
