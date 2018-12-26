import {watch} from "./watch";
import {unwatch} from "./unwatch";

export type IOculusHandler = (value: any, property: PropertyKey | string | undefined) => any
export type IOculusWatcher<T = IOculusHandler> = (path: string, callback: T, autoInvoke?: boolean) => IOculusWatcher<IOculusHandler>
export type IOculusUnwatcher = (path: string) => IOculusWatcher

export const $on = 'ocolus-x-observe';
export const $off = 'ocolus-x-unobserve';
export const observing = new WeakSet<IObservable>();

export interface IObservable {
  [$on]: IOculusWatcher<Function>,
  [$off]: (path: string) => IOculusUnwatcher
}

export {watch} from './watch';
export {unwatch} from './unwatch';

+(function () {
  if (window && typeof (<any>window)['oculusx'] === 'undefined') {
    (<any>window).oculusx = {
      watch,
      unwatch
    }
  }
})();