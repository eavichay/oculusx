const {convert, destroy} = require('./convert');

module.exports = {
  unwatch: (target, path, callback) => {
    if (!path) {
      return destroy(target);
    }
    const {unobserve} = convert(target);
    return unobserve(path, callback)
  }
};

