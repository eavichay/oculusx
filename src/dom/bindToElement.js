/**
 * @module oculusx.DOM
 * @requires oculusx
 */

const {watch, unwatch} = oculusx;

const echo = x => x;

/**
 * @typedef NodeBindingOptions
 * @property {'attribute'|'text'} [method = 'text']
 * @property {string} [attribute]
 * @property {Function} [compute]
 */

/**
 * @param {object} model
 * @param {Element} node
 * @param {string} path
 * @param {NodeBindingOptions} options
 * @returns {Function} function to unbind the defined binding
 *
 * @example
 * const element = document.getElementById('#my-element');
 * const model = {};
 * const unsubscribe = oculusx.bindToElement(model, element, 'path.to.watch');
 * model.path = { to: watch: 12345 }; // DOM node changes
 * unsubscribe();
 * model.path.to.watch = 'Hello'; // DOM node does not change
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
