export default function js(content: string, url: string): string {
  return content;
}

/* JS rewriting should be done like so:

let x = _f$get(window);

if (_f$get(x) instanceof _f$get(Window)) {

}

_f$get(window).location.href = "/";

function f(x) {
  return _f$get(x) instanceof _f$get(Window);
}

_f$get(console).log(_f$get(f)(_f$get(this)));

*/
