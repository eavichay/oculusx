import {watch} from "./watch";
import {unwatch} from "./unwatch";

export type OculusChangeHandler = (value?: any, property?: PropertyKey) => any

export {watch} from './watch';
export {unwatch} from './unwatch';

+(function () {
  if (typeof window !== 'undefined' && typeof (<any>window)['oculusx'] === 'undefined') {
    (<any>window).oculusx = {
      watch,
      unwatch
    }
  }
})();