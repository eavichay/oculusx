import {convert, destroy, Unobserve} from "./convert";
import {OculusChangeHandler} from "./oculusx";

export const unwatch = (target: object, path?: string, callback?: OculusChangeHandler): Unobserve => {
  if (!path) {
    return <Unobserve>(destroy(target));
  }
  const {unobserve} = convert(target);
  return (<Unobserve>unobserve)(path, callback)
};
