import "./client/intercepter";
import MutationInit from "./client/mutations";

declare global {
  interface Window {
    _$f: <T>(x: T) => T;
  }
}

MutationInit();
