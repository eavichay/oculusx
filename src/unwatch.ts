import {$off, IObservable, IOculusUnwatcher} from "./oculusx";

export const unwatch = (target: IObservable, path: string):IOculusUnwatcher => {
  return target[$off](path)
};
