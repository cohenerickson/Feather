const attributes: { [index: string]: any } = {
  href: [HTMLAnchorElement, HTMLLinkElement, HTMLAreaElement, HTMLBaseElement],
  src: [
    HTMLAudioElement,
    HTMLEmbedElement,
    HTMLIFrameElement,
    HTMLImageElement,
    HTMLInputElement,
    HTMLScriptElement,
    HTMLSourceElement,
    HTMLTrackElement,
    HTMLVideoElement
  ],
  srcset: [HTMLImageElement, HTMLSourceElement],
  action: [HTMLFormElement],
  poster: [HTMLVideoElement],
  formaction: [HTMLButtonElement],
  data: [HTMLObjectElement],
  background: [HTMLBodyElement],
  integrity: [HTMLScriptElement, HTMLLinkElement],
  nonce: [HTMLElement]
};

HTMLElement.prototype.setAttribute = new Proxy(
  HTMLElement.prototype.setAttribute,
  {
    apply(t: any, g: any, a: any[]) {
      const rewriteURL = self._$feather.rewrite.url;
      const rewriteCSS = self._$feather.rewrite.css;
      const rewriteSrcSet = self._$feather.rewrite.srcset;
      if (
        a[0].toLowerCase() === "integrity" ||
        a[0].toLowerCase() === "nonce"
      ) {
        g.dataset[`feather_${a[0].toLowerCase}`] = a[0].toLowerCase();
      } else if (attributes[a[0].toLowerCase()]) {
        if (a[0].toLowerCase() === "style") {
          g.dataset["feather_style"];
          a[1] = rewriteCSS(a[1], self._$f(location).href);
        } else if (a[0].toLowerCase() === "srcset") {
          g.dataset["feather_srcset"];
          a[1] = rewriteSrcSet(a[1], self._$f(location).href);
        } else {
          g.dataset[`feather_${a[0].toLowerCase()}`];
          a[1] = rewriteURL(a[1], self._$f(location).href);
        }
      }

      return Reflect.apply(t, g, a);
    }
  }
);

Object.keys(attributes).forEach((attribute) => {
  attributes[attribute].forEach((element: any) => {
    const rewriteURL = self._$feather.rewrite.url;
    const rewriteSrcSet = self._$feather.rewrite.srcset;
    try {
      const attr = Object.getOwnPropertyDescriptor(
        element.prototype,
        attribute
      ) as PropertyDescriptor & {
        get?: {
          call: (x: any, y: any) => any;
        };
        set?: {
          call: (x: any, y: any) => any;
        };
      };
      if (attribute !== "srcset") {
        Object.defineProperty(element.prototype, attribute, {
          get() {
            return attr.get?.call(this, this.dataset[`feather_${attribute}`]);
          },
          set(value) {
            if (attribute === "integrity" || attribute === "nonce") {
              this.dataset[`feather_${attribute}`] = value;
              return this.removeAttribute(attribute);
            } else {
              this.dataset[`feather_${attribute}`] = value;
              return attr.set?.call(
                this,
                rewriteURL(value, self._$f(location).href)
              );
            }
          }
        });
      } else {
        Object.defineProperty(element.prototype, attribute, {
          get() {
            return attr.get?.call(this, this.dataset[`osana_${attribute}`]);
          },
          set(value) {
            this.dataset[`osana_${attribute}`] = value;
            return attr.set?.call(
              this,
              rewriteSrcSet(value, self._$f(location).href)
            );
          }
        });
      }
    } catch (err) {
      if (err) throw err;
    }
  });
});

const innerHTML = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "innerHTML"
) as PropertyDescriptor & {
  get?: {
    call: (x: any, y: any) => any;
  };
  set?: {
    call: (x: any, y: any) => any;
  };
};
Object.defineProperty(HTMLElement.prototype, "innerHTML", {
  set(value) {
    const rewriteJS = self._$feather.rewrite.js;
    const rewriteCSS = self._$feather.rewrite.css;
    const rewriteHTML = self._$feather.rewrite.html;

    if (this instanceof HTMLScriptElement) {
      return innerHTML.set?.call(
        this,
        rewriteJS(value, self._$f(location).href)
      );
    } else if (this instanceof HTMLStyleElement) {
      return innerHTML.set?.call(
        this,
        rewriteCSS(value, self._$f(location).href)
      );
    }
    return innerHTML.set?.call(
      this,
      rewriteHTML(value, self._$f(location).href)
    );
  }
});
