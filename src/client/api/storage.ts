import FeatherBundle from "~/types/FeatherBundle";

declare var _$feather: FeatherBundle;
declare var _$f: <T>(x: T) => T;

export default class FeatherStorage {
  constructor(scope: Storage) {
    return new Proxy({}, {
      get(target: any, prop: string, receiver: any): any {
        if (prop === "length") {
          return Object.keys(scope).filter((key) =>
            new RegExp(`@${_$f(location).host}$`).test(key)
          ).length;
        } else if (prop === "getItem") {
          return (key: string) => scope.getItem(key + "@" + _$f(location).host);
        } else if (prop === "setItem") {
          return (key: string, value: string) =>
            scope.setItem(key + "@" + _$f(location).host, value);
        } else if (prop === "removeItem") {
          return (key: string) =>
            scope.removeItem(key + "@" + _$f(location).host);
        } else if (prop === "clear") {
          return () => {
            Object.keys(scope).forEach((key) => {
              if (new RegExp(`@${_$f(location).host}$`).test(key))
                scope.removeItem(key);
            });
          };
        } else if (prop === "Symbol(Symbol.toStringTag)") {
          return "Storage";
        } else if (prop === "key") {
          return (index?: number): string => {
            return Object.keys(scope).filter((x) =>
              new RegExp(`@${_$f(location).host}$`).test(x)
            )[index || 0];
          };
        }
        return scope.getItem(prop + "@" + _$f(location).host);
      },
      set(target: any, prop: string, value: any): any {
        return scope.setItem(prop + "@" + _$f(location).host, value);
      }
    });
  }
}

_$feather.classes["Storage"] = Storage;
// @ts-ignore
self.Storage = FeatherStorage;



// EXPERIMENTAL: Class based proxy

// export default class FeatherStorage {
//   #scope: Storage;

//   constructor(scope: Storage) {
//     this.#scope = scope;

//     Object.entries(scope).forEach(([key, value]: string[]) => {
//       if (key.startsWith(_$f(location).host)) {
//         if ()
//         const properties = Object.getOwnPropertyDescriptor(
//           this,
//           key
//         ) as PropertyDescriptor & {
//           get?: {
//             call: (x: any, y: any) => any;
//           };
//           set?: {
//             call: (x: any, y: any) => any;
//           };
//         };
//         Object.defineProperty(this, key, {
//           set(value) {

//           }
//         });
//         // @ts-ignore
//         this[key] = value;
//       }
//     });

//     // @ts-ignore
//     this["Symbol(Symbol.toStringTag)"] = "Storage";
//   }

//   clear() {
//     Object.keys(this.#scope)
//       .filter((x) => x.startsWith(_$f(location).host))
//       .forEach((key) => {
//         this.removeItem(key);
//       });
//   }

//   getItem(key: string): string | null {
//     return this.#scope.getItem(`${_$f(location).host}@${key}`);
//   }

//   key(index: number) {
//     return Object.keys(this.#scope).filter((x) =>
//       x.startsWith(_$f(location).host)
//     )[index || 0];
//   }

//   get length(): number {
//     return Object.keys(this.#scope).filter((x) =>
//       x.startsWith(_$f(location).host)
//     ).length;
//   }

//   removeItem(key: string): void {
//     this.#scope.removeItem(`${_$f(location).host}@${key}`);
//     // @ts-ignore
//     delete this[key];
//   }

//   setItem(key: string, value: string): void {
//     this.#scope.setItem(`${_$f(location).host}@${key}`, value);
//     // @ts-ignore
//     this[key] = value;
//   }
// }
