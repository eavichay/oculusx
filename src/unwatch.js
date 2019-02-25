const {convert, destroy} = require('./convert');

/**
 * @typedef {Function} Unobserve
 * @param {string} path
 * @param {Function} callback
 */

/**
 * @module oculusx
 */
module.exports = {
  /**
   *
   * @param {object} target
   * @param {string} [path]
   * @param {Function} [callback]
   * @returns {Unobserve} scoped unwatch function on the target object
   */
  unwatch: (target, path, callback) => {
    if (!path) {
      return destroy(target);
    }
    const {unobserve} = convert(target);
    return unobserve(path, callback)
  }
};

