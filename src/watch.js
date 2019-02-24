const {convert} = require('./convert');

module.exports = {
  /**
   * @param {object} target
   * @param {string} [path]
   * @param {Function} [callback]
   * @param {boolean} [invoke]
   * @returns {Function}
   */
  watch: (target, path, callback, invoke) => {
    const {observe} = convert(target);
    if (path && callback) {
      observe(path, callback, false, invoke);
    }
    return observe;
  }
};

