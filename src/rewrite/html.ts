import { parse, serialize } from "parse5";
import url from "./url";

export default function html(content: string, baseUrl: string): string {
  const AST: any = parse(content);
  for (const i in AST.childNodes) {
    AST.childNodes[i] = rewriteNode(AST.childNodes[i], baseUrl);
  }
  return serialize(AST);
}

function rewriteNode(node: any, baseUrl: string): any {
  switch (node.tagName?.toLowerCase()) {
    case "a":
      for (const i in node.attrs) {
        node.attrs[i] = rewriteAttr(node.attrs[i], baseUrl);
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

function rewriteAttr(attr: any, baseUrl: string): any {
  switch (attr.name?.toLowerCase()) {
    case "href":
      attr.value = url(attr.value, baseUrl);
      break;
  }
  return attr;
}
