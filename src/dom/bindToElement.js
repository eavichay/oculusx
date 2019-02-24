const {watch, unwatch} = oculusx;

const echo = x => x;

/**
 * @typedef NodeBindingOptions
 * @property {'attribute'|'text'} [method = 'text']
 * @property {string} [attribute]
 * @property {Function} [compute]
 */

/**
 *
 * @param {object} model
 * @param {Element} node
 * @param {string} path
 * @param {object} options
 * @returns {Function} unbind function
 */
function bindToElement (model, node, path, options = {}) {
    const compute = options.compute || echo;
    const binder = (value) => {
        switch (options.method) {
            case 'attribute':
                node.setAttribute(options.attribute, compute(value));
                break;
            default:
            case 'text':
                node.textContent = compute(value);
                break;
        }
        if (options.callback) {
            options.callback(value);
        }
    };
    watch(model, path, binder, true);
    return () => unwatch(model, path, binder);
}

oculusx.bindToElement = bindToElement;


module.exports = {
    bindToElement
};
