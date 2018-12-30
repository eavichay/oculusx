import {OculusChangeHandler} from "./oculusx";
import {convert} from "./convert";

export const watch = (target: object, path?: string, callback?: OculusChangeHandler) => {
  const {observe} = convert(target);
  if (path && callback) {
    observe(path, callback, false);
  }
  return observe;
};

