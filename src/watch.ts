import {$on, IObservable, IOculusHandler} from "./oculusx";
import {convert} from "./convert";

export const watch = (target: object | IObservable, path?: string, callback?: IOculusHandler) => {
  convert(target);
  if (path && callback) {
    (<IObservable>target)[$on](path, callback, false);
  }
  return (<IObservable>target)[$on];
};

