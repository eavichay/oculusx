import {watch} from "./watch";
import {unwatch} from "./unwatch";

export type IOculusHandler = (value?: any, property?: PropertyKey) => any
export type IOculusWatcher = (path: string, callback: IOculusHandler, autoInvoke?: boolean) => IOculusWatcher
export type IOculusUnwatcher = (path: string, callback?: Function) => IOculusWatcher

export const $on = 'ocolus-x-observe';
export const $off = 'ocolus-x-unobserve';
export const observing = new WeakSet<IObservable>();

export interface IObservable {
  [$on]: IOculusWatcher,
  [$off]: (path: string, callback?: Function) => IOculusUnwatcher
}

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