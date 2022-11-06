import { parse, serialize } from "parse5";
import rewriteURL from "./url";
import rewriteCSS from "./css";
import rewriteJS from "./js";
import rewriteSrcSet from "./srcset";

export default function html(content: string, baseUrl: string): string {
  const AST: any = parse(content);
  for (const i in AST.childNodes) {
    AST.childNodes[i] = rewriteNode(AST.childNodes[i], baseUrl);
  }
  return wrapHtml(serialize(AST), baseUrl);
}

function wrapHtml(source: string, baseUrl: string): string {
  return `<head>
    <script src="${self._$feather_config.scripts.bundle}"></script>
    <script src="${self._$feather_config.scripts.config}"></script>
    <script src="${self._$feather_config.scripts.client}"></script>
    <link rel="icon" href="${rewriteURL("/favicon.ico", baseUrl)}">
  </head>${source}`;
}

function rewriteNode(node: any, baseUrl: string): any {
  switch (node.tagName?.toLowerCase()) {
    case "a":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "href") {
          node.attrs.push({
            name: "data-feather_href",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        }
      }
      break;

    case "script":
      let src: boolean = false;
      for (let i in node.attrs) {
        if (node.attrs.includes({ name: "type", value: "application/json" })) {
          return;
        } else {
          if (node.attrs[i].name === "src") {
            node.attrs.push({
              name: "data-feather_src",
              value: node.attrs[i].value
            });
            node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
            src = true;
          } else if (node.attrs[i].name === "integrity") {
            node.attrs.push({
              name: "data-feather_integrity",
              value: node.attrs[i].value
            });
            node.attrs[i].value = "";
          } else if (node.attrs[i].name === "nonce") {
            node.attrs.push({
              name: "data-feather_nonce",
              value: node.attrs[i].value
            });
            node.attrs[i].value = "";
          }
        }
      }

      if (!src) {
        for (let i in node.childNodes) {
          node.childNodes[i].value = rewriteJS(
            node.childNodes[i].value,
            baseUrl
          );
        }
      }
      break;

    case "style":
      for (let i in node.childNodes) {
        node.childNodes[i].value = rewriteCSS(
          node.childNodes[i].value,
          baseUrl
        );
      }
      break;

    case "link":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "href") {
          node.attrs.push({
            name: "data-feather_href",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "integrity") {
          node.attrs.push({
            name: "data-feather_integrity",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "img":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "src") {
          node.attrs.push({
            name: "data-feather_src",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "srcset") {
          node.attrs.push({
            name: "data-feather_srcset",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteSrcSet(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "source":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "src") {
          node.attrs.push({
            name: "data-feather_src",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "srcset") {
          node.attrs.push({
            name: "data-feather_srcset",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteSrcSet(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "form":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "action") {
          node.attrs.push({
            name: "data-feather_action",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "iframe":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "src") {
          node.attrs.push({
            name: "data-feather_src",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "meta":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "http-equiv") {
          if (node.attrs[i].value === "Content-Security-Policy") {
            node.attrs.push({
              name: "data-Content-Security-Policy",
              value: node.attrs[i].value
            });
            node.attrs[i].value = "*";
          }
          for (let i in node.attrs) {
            if (node.attrs[i].name === "content") {
              node.attrs.push({
                name: "data-content",
                value: node.attrs[i].value
              });
              node.attrs[i].value = "";
            }
          }
        }
      }
      break;

    case "area":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "href") {
          node.attrs.push({
            name: "data-feather_href",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "base":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "href") {
          node.attrs.push({
            name: "data-feather_href",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "body":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "background") {
          node.attrs.push({
            name: "data-feather_background",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        }
      }
      break;

    case "input":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "src") {
          node.attrs.push({
            name: "data-feather_src",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        }
      }
      break;

    case "object":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "data") {
          node.attrs.push({
            name: "data-feather_data",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "audio":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "src") {
          node.attrs.push({
            name: "data-feather_src",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "button":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "formaction") {
          node.attrs.push({
            name: "data-feather_formaction",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        }
      }
      break;

    case "embed":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "src") {
          node.attrs.push({
            name: "data-feather_src",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "track":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "src") {
          node.attrs.push({
            name: "data-feather_src",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;

    case "video":
      for (let i in node.attrs) {
        if (node.attrs[i].name === "src") {
          node.attrs.push({
            name: "data-feather_src",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "poster") {
          node.attrs.push({
            name: "data-feather_poster",
            value: node.attrs[i].value
          });
          node.attrs[i].value = rewriteURL(node.attrs[i].value, baseUrl);
        } else if (node.attrs[i].name === "nonce") {
          node.attrs.push({
            name: "data-feather_nonce",
            value: node.attrs[i].value
          });
          node.attrs[i].value = "";
        }
      }
      break;
  }
  if (node.childNodes) {
    for (const i in node.childNodes) {
      node.childNodes[i] = rewriteNode(node.childNodes[i], baseUrl);
    }
  }
  return node;
}
