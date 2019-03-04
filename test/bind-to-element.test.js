const assert = require('assert');
global.oculusx = require('../src/index.js');
require('../src/dom/bindToElement.js');

describe('bind-to-element', function () {
    let count = 0;
    const {bindToElement} = oculusx;
    it('should bind a model to element\'s inner-text', function () {
        const mockElement = {
            set textContent (value) {
                switch (count) {
                    case 0:
                        assert.strictEqual('initialText', value);
                        break;
                    case 1:
                        assert.strictEqual('myText', value);
                        break;
                    default:
                        throw new Error('Should not occur');
                }
                count++;
            }
        };
        const model = {a: 'initialText'};
        bindToElement(model, mockElement, 'a');
        model.a = 'myText';
    });

    it('should bind a model to element\' inner-text with computed value', function () {
        let count = 0;
        const mockElement = {
            set textContent (value) {
                switch (count) {
                    case 0:
                        assert.strictEqual('INITIAL', value);
                        break;
                    case 1:
                        assert.strictEqual('MYTEXT', value);
                        break;
                    default:
                        throw new Error('Should not occur');
                }
                count++;
            }
        };
        const capitalize = x => x.toUpperCase();
        const model = {
            a: 'initial'
        };
        bindToElement(model, mockElement, 'a', {
            compute: capitalize
        });
        model.a = 'myText';
    });

    it('Should set attribute', function (done) {
        const mockElement = {
            setAttribute(attr, value) {
                assert.strictEqual(attr, 'some-attr');
                assert.strictEqual(value, 'some-value');
                done();
            }
        };
        const model = {
            a: 'some-value'
        };
        bindToElement(model, mockElement, 'a', {
            method: 'attribute',
            attribute: 'some-attr'
        });
    });

    it('Should set attribute - computed', function (done) {
        const mockElement = {
            setAttribute(attr, value) {
                assert.strictEqual(attr, 'some-attr');
                assert.strictEqual(value, 'some-value');
                done();
            }
        };
        const model = {
            a: 'eulav-emos'
        };
        bindToElement(model, mockElement, 'a', {
            method: 'attribute',
            attribute: 'some-attr',
            compute: x => x.split('').reverse().join('')
        });
    });

    it('should unsubscribe', function (done) {
        let counter = 0;
        const mockElement = {
            set textContent (value) {
                assert.equal(value, counter === 0 ? undefined : counter === 1 ? 'Hello' : new Error('Ooops'))
                counter++;
                if (counter > 2) {
                    done(new Error('Should be only invoked once'));
                }
            }
        };
        const mockData = {};
        const unsub = bindToElement(mockData, mockElement, 'a');
        mockData.a = 'Hello';
        unsub();
        mockData.a = 'Bello';
        done();
    });
});