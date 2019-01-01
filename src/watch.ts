import {OculusChangeHandler} from "./oculusx";
import {convert, Observe} from "./convert";

export const watch = (target: object, path?: string, callback?: OculusChangeHandler): Observe => {
  const {observe} = convert(target);
  if (path && callback) {
    (<Observe>observe)(path, callback, false);
  }
  return observe as Observe;
};

