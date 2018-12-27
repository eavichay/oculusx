import {$off, IObservable, IOculusUnwatcher} from "./oculusx";

export const unwatch = (target: IObservable, path: string, callback?: Function):IOculusUnwatcher => {
  return target[$off](path, callback)
};
