self._$feather.backup.Location = Location;

declare global {
  interface Window {
    Location: any;
  }
}

window.Location = class {};

export function getLocation(scope: Location): Location | {} {
  try {
    let fakeLocation: any = new URL(
      self._$feather_config.codec.decode(
        scope.pathname.replace(
          new RegExp(`^${self._$feather_config.prefix}`),
          ""
        )
      )
    );
    fakeLocation.ancestorOrigins = { length: 0 };
    fakeLocation.assign = (url: string) =>
      location.assign(
        self._$feather_config.prefix + self._$feather_config.codec.encode(url)
      );
    fakeLocation.reload = () => location.reload();
    fakeLocation.replace = (url: string) =>
      location.replace(
        self._$feather_config.prefix + self._$feather_config.codec.encode(url)
      );
    fakeLocation.toString = () => fakeLocation.href;
    return fakeLocation;
  } catch {
    return {};
  }
}

export class LocationProxy {
  constructor(scope: Location) {
    return new Proxy(new Location(), {
      get(target: any, prop: string, receiver: any): any {
        let fakeLocation: any = getLocation(scope);
        return fakeLocation[prop];
      },
      set(target: any, prop: string, value: any): any {
        let fakeLocation: any = getLocation(scope);
        fakeLocation[prop] = value;
        location.pathname =
          self._$feather_config.prefix +
          self._$feather_config.codec.encode(fakeLocation.href);
        return fakeLocation[prop];
      }
    });
  }
}

export default LocationProxy;
