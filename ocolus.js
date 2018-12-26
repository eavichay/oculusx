const $on = 'ocolus-x-observers'
const observing = new WeakSet();

function watch (target, path = undefined, callback = undefined) {
  convert(target);
  if (path && callback) {
    target[$on](path, callback)
  }
  return target[$on]
}

function convert (target) {
  if (observing.has(target)) return;

  const observers = new Map();
  const values = {};

  function observe (path, callback, invoke = false) {
    const chain = path.split('.');
    const [prop,] = chain;
    const isNew = !observers.has(prop);
    observers.set(path, observers.get(path) || new Set());

    const callbacks = observers.get(path);
    callbacks.add(callback)

    if (isNew) {
      const initialValue = target[prop];
      if (typeof initialValue === 'object') {
        convert(initialValue)
        Array.from(observers.entries()).forEach(([path, set]) => {
          if (path.startsWith(prop + '.')) {
            set.forEach(cb => initialValue[$on](path.split('.').slice(1).join('.'), cb));
          }
        })
      }
      values[prop] = initialValue;
      typeof target === 'object' && Object.defineProperty(target, prop, {
        get () {
          return values[prop]
        },
        set (v) {
          values[prop] = v;
          const set = observers.get(prop)
          const globalSet = observers.get('*')
          set && set.forEach(cb => cb(v, prop));
          if (globalSet) {
            debugger;
            globalSet.forEach(cb => cb(v, prop));
          }
          if (typeof v === 'object') {
            convert(v);
            Array.from(observers.entries()).forEach(([path, set]) => {
              if (path.startsWith(prop + '.')) {
                const nextProp = path.split('.')[1];
                set.forEach(cb => v[$on](path.split('.').slice(1).join('.'), () => cb(v[nextProp], nextProp), true));
              }
            })
          }
        },
        configurable: true
      });
    }

    if (invoke) {
      const set = observers.get(prop);
      set && set.forEach(cb => cb(values[path]));
    }

    return target[$on];
  };

  Object.defineProperty(target, $on, {
    value: observe,
    enumerable: false
  })

  observing.add(target);
  return target;
}

module.exports.watch = watch;