import {OculusChangeHandler} from "./oculusx";

type ObservableMetadata = {
  observe: Observe | undefined,
  unobserve: Unobserve | undefined,
  observers: Map<Path, Set<OculusChangeHandler>>,
  values: any
};

type Path = string;

export type Unobserve = (path?: Path, callback?: OculusChangeHandler) => Unobserve;
export type Observe = (path: Path, callback: OculusChangeHandler, invoke?: boolean) => Observe;

const registeredObservables = new WeakMap<object, ObservableMetadata>();

const deadObservableExecution = function () {
  throw new Error('Cannot watch a non-registered object');
};

export function destroy(target: object) {
  const meta = registeredObservables.get(target);
  registeredObservables.delete(target);
  if (meta) {
    meta.observe = deadObservableExecution;
    meta.observers.clear();
    meta.values = {};
    return meta.unobserve;
  }
  return deadObservableExecution;
}

export function convert(target: any): ObservableMetadata {

  let metadata = registeredObservables.get(target);
  if (metadata) {
    return metadata;
  } else {
    metadata = {
      observers: new Map<Path, Set<OculusChangeHandler>>(),
      observe: undefined,
      unobserve: undefined,
      values: {}
    };
  }

  const {observers, values} = metadata;

  const unobserve: Unobserve = (path?: Path, callback?: OculusChangeHandler): Unobserve => {
    if (typeof path === undefined) {
      destroy(target);
      return deadObservableExecution;
    } else if (path) {
      const chain = path.split('.');
      const [prop,] = chain;
      const set = observers.get(path);
      if (set) {
        if (callback) {
          set.delete(callback);
        } else {
          set.clear();
        }
        const nextInChain = target[prop];
        if (typeof nextInChain === 'object') {
          const observeMethods: ObservableMetadata | undefined = registeredObservables.get(nextInChain);
          if (observeMethods) {
            const {unobserve} = observeMethods;
            const path: Path = chain.slice(1).join('.');
            if (path && unobserve !== deadObservableExecution) {
              (<Unobserve>unobserve)(path, callback);
            }
          }
        }
        if (set.size === 0) {
          observers.delete(path);
        }
      }
    }

    return unobserve;
  };

  const observe: Observe = (path: string, callback: OculusChangeHandler, invoke?: boolean): Observe => {
    if (!registeredObservables.has(target)) {
      deadObservableExecution();
    }
    const chain = path.split('.');
    const [prop,] = chain;
    const isNew = !observers.has(prop);
    let callbacks = observers.get(path);
    if (!callbacks) {
      callbacks = new Set<OculusChangeHandler>();
      observers.set(path, callbacks);
    }
    callbacks.add(callback);

    if (isNew) {
      const initialValue = target[prop];
      if (typeof initialValue === 'object') {
        const {observe} = convert(initialValue);
        Array.from(observers.entries()).forEach(([path, set]) => {
          if (path.startsWith(prop + '.')) {
            set.forEach(cb => (<Observe>observe)(path.split('.').slice(1).join('.'), cb));
          }
        })
      }
      values[prop] = initialValue;
      typeof target === 'object' && Object.defineProperty(target, prop, {
        get() {
          return values[prop]
        },
        set(v) {
          values[prop] = v;
          const set = observers.get(prop);
          set && set.forEach(cb => cb(v, prop));
          if (typeof v === 'object') {
            const {observe} = convert(v);
            Array.from(observers.entries()).forEach(([path, set]) => {
              if (path.startsWith(prop + '.')) {
                set.forEach(cb => (<Observe>observe)(path.split('.').slice(1).join('.'), cb, true));
              }
            })
          }
        },
        configurable: true
      });
    }

    if (invoke) {
      const set = observers.get(prop);
      set && set.forEach(cb => cb(values[prop], prop));
    }

    return observe;
  };

  metadata.observe = observe;
  metadata.unobserve = unobserve;
  metadata.values = values;

  registeredObservables.set(target, metadata);
  return metadata;
}