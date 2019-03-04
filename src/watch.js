const {convert} = require('./convert');

/**
 * @typedef {Function} Observe
 * @param {string} path
 * @param {Function} callback
 * @param {boolean} [invoke = false]
 */

/**
 * @module oculusx
 */
module.exports = {
  /**
   * Watches for object changes
   * @param {object} target
   * @param {string} [path]
   * @param {Function} [callback]
   * @param {boolean} [invoke = false]
   * @returns {Observe} watch function scoped to target object only
   *
   */
  watch: (target, path = undefined, callback = undefined, invoke = false) => {
    const {observe} = convert(target);
    if (path && callback) {
      observe(path, callback, invoke);
    }
    return observe;
  }
};

