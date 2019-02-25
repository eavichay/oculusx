const {watch, unwatch} = require('./oculusx');

/**
 * @module oculusx
 * @description <h2>Usage</h2> &lt;script src="/path/to/oculusx.js"&gt;&lt;/script&gt;
 *
 */
module.exports = {
  /**
   * @param {object} target
   * @param {string} [path]
   * @param {Function} [callback]
   * @param {boolean} [invoke]
   * @returns {Observe}
   */
  watch,

  /**
   * @param {object} target
   * @param {string} [path]
   * @param {Function} [callback]
   * @returns {Unobserve} scoped unwatch function on the target object
   */
  unwatch
};
