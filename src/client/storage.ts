self._$feather.backup.Storage = Storage;

// @ts-ignore
window.Storage = class {};

export default class StorageProxy {
  constructor(scope: Storage) {
    return new Proxy(new Storage(), {
      get(target: any, prop: string, receiver: any): any {
        if (prop === "length") {
          return Object.keys(scope).filter((key) =>
            new RegExp(`@${self._$f(location).host}$`).test(key)
          ).length;
        } else if (prop === "getItem") {
          return (key: string) =>
            scope.getItem(key + "@" + self._$f(location).host);
        } else if (prop === "setItem") {
          return (key: string, value: string) =>
            scope.setItem(key + "@" + self._$f(location).host, value);
        } else if (prop === "removeItem") {
          return (key: string) =>
            scope.removeItem(key + "@" + self._$f(location).host);
        } else if (prop === "clear") {
          return () => {
            Object.keys(scope).forEach((key) => {
              if (new RegExp(`@${self._$f(location).host}$`).test(key))
                scope.removeItem(key);
            });
          };
        }
        return scope.getItem(prop + "@" + self._$f(location).host);
      },
      set(target: any, prop: string, value: any): any {
        return scope.setItem(prop + "@" + self._$f(location).host, value);
      }
    });
  }
}

const idbopen = indexedDB.open;
indexedDB.open = (name: string, version?: number): IDBOpenDBRequest => {
  return idbopen.call(indexedDB, `${name}@${self._$f(location).host}`, version);
};

declare global {
  interface Window {
    openDatabase: any;
  }
}

if ("openDatabase" in window) {
  const odb = window.openDatabase;
  window.openDatabase = (
    name: string,
    version: string,
    displayName: string,
    maxSize: number
  ): any => {
    return odb(
      `${name}@${self._$f(location).host}`,
      version,
      displayName,
      maxSize
    );
  };
}
