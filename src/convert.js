/**
 * @typedef ObservableMetadata
 * @property {Function|undefined} observe
 * @property {Function|undefined} unobserve,
 * @property {Map<string, Set<Function>>} observers
 * @property {object} [values = {}]
 */


/**
 * @type {WeakMap<object, ObservableMetadata>}
 */
const registeredObservables = new WeakMap();

/**
 * @returns {Function}
 */
const noOp = () => noOp;


const deadObservableExecution = function () {
  throw new Error('Cannot watch a non-registered object');
};

/**
 * @param {object} target
 * @returns {Function}
 */
function destroy(target) {
  const meta = registeredObservables.get(target);
  registeredObservables.delete(target);
  if (meta) {
    meta.observe = deadObservableExecution;
    meta.observers.clear();
    meta.values = {};
    return meta.unobserve;
  }
  return noOp;
}

/**
 * Enables object observing on a target object
 * @param {object} target
 * @returns {ObservableMetadata}
 */
function convert(target) {
  /**
   * @type {ObservableMetadata}
   */
  let metadata = registeredObservables.get(target);
  if (metadata) {
    return metadata;
  } else {
    metadata = {
      observers: new Map(),
      observe: undefined,
      unobserve: undefined,
      values: {}
    };
  }

  const {observers, values} = metadata;

  /**
   * @param [path]
   * @param {Function} [callback]
   * @returns {unobserve}
   */
  const unobserve = (path, callback) => {
    if (typeof path === 'undefined') {
      return destroy(target);
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
          const observeMethods = registeredObservables.get(nextInChain);
          if (observeMethods) {
            const {unobserve} = observeMethods;
            const path = chain.slice(1).join('.');
            if (path && unobserve !== deadObservableExecution) {
              unobserve(path, callback);
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

  /**
   * @param {string} [path]
   * @param {Function} [callback]
   * @param {boolean} [invoke = false]
   */
  const observe = (path, callback, invoke) => {
    if (!registeredObservables.has(target)) {
      deadObservableExecution();
    }
    const chain = path.split('.');
    const [prop,] = chain;
    const isNew = !observers.has(prop);
    let callbacks = observers.get(path);
    if (!callbacks) {
      /**
       * @type {Set<Function>}
       */
      callbacks = new Set();
      observers.set(path, callbacks);
    }
    callbacks.add(callback);

    if (isNew) {
      const initialValue = target[prop];
      if (typeof initialValue === 'object') {
        const {observe} = convert(initialValue);
        Array.from(observers.entries()).forEach(([path, set]) => {
          if (path.startsWith(prop + '.')) {
            set.forEach(cb => observe(path.split('.').slice(1).join('.'), cb));
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
                set.forEach(cb => observe(path.split('.').slice(1).join('.'), cb, true));
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

module.exports = {
  convert,
  destroy
};