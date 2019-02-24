const {watch} = require('../src');
const assert = require('assert');

describe('Scope', () => {

  it('Should not be scoped to the target object', done => {
    const target = {
      a: 1,
      b: 2,
      c: {
        value: 3
      }
    };
    function assertScope () {
      // @ts-ignore
      const self = this;
      assert.notStrictEqual(self, target);
      done();
    }

    watch(target, 'c', assertScope);

    target.c = {
      value: 4
    };
  });

  it('Should not be scoped to the target object for arrow functions', done => {
    const target = {
      a: 1,
      b: 2,
      c: {
        value: 3
      }
    };
    const assertScope = () => {
      // @ts-ignore
      const self = this;
      assert.notStrictEqual(self, target);
      done();
    };

    watch(target, 'c', assertScope);

    target.c = {
      value: 4
    };
  });

});