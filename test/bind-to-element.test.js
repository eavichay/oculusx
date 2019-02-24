const assert = require('assert');
global.oculusx = require('../src/index.js');
require('../src/dom/bindToElement.js');

describe('bind-to-element', function () {
    const {bindToElement} = oculusx;
    it('should bind a model to element\'s inner-text', function () {
        const mockElement = {
            set textContent (value) {
                assert.strictEqual('myText', value);
            }
        };
        const model = {};
        const unbind = bindToElement(model, mockElement, 'a');
        model.a = 'myText';
    });

    it('should bind a model to element\' inner-text with computed value', function (done) {
        const mockElement = {
            set textContent (value) {
                assert.strictEqual('MYTEXT', value);
                done();
            }
        };
        const capitalize = x => x.toUpperCase();
        const model = {};
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
        const model = {};
        bindToElement(model, mockElement, 'a', {
            method: 'attribute',
            attribute: 'some-attr'
        });
        model.a = 'some-value';
    });

    it('Should set attribute - computed', function (done) {
        const mockElement = {
            setAttribute(attr, value) {
                assert.strictEqual(attr, 'some-attr');
                assert.strictEqual(value, 'some-value');
                done();
            }
        };
        const model = {};
        bindToElement(model, mockElement, 'a', {
            method: 'attribute',
            attribute: 'some-attr',
            compute: x => x.split('').reverse().join('')
        });
        model.a = 'eulav-emos';
    });

    it('should unsubscribe', function (done) {
        let counter = 0;
        const mockElement = {
            set textContent (value) {
                counter++;
                if (counter > 1) {
                    done(new Error('Should be only invoked once'));
                }
            }
        };
        const mockData = {};
        const unsubscribe = bindToElement(mockData, mockElement, 'a');
        mockData.a = 'Hello';
        unsubscribe();
        mockData.a = 'Hello';
        done();
    });
});