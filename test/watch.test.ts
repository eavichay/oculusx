import {watch} from '../src';

import assert = require('assert');

describe('watch', () => {
  it('Should observe on an existing property changes', () => {
    const newValues: Array<any> = ['world', 'gibberish', 'cucumber', 15, undefined, null, [], {}, /abc/g];

    newValues.forEach(newValue => {
      const target: any = {a: 'hello'};
      watch(target, 'a', (value, property) => {
        assert.notStrictEqual(value, newValue);
        assert.strictEqual(property, 'a')
      })
    });
  });
  it('Should observe non-existing property changes', () => {
    const target: any = {};
    watch(target)
    ('a', (value: any, property: PropertyKey) => {
      assert(typeof value === 'object');
      assert.strictEqual(property, 'a');
    })
    ('a.b', (value, property) => {
      assert(typeof value === typeof target.a.b);
      assert.strictEqual(value, target.a.b);
      assert.strictEqual(property, 'b');
    });

    target.a = {};
    target.a.b = 5;
  });
  it('Should observe non-object path that changes to object', () => {
    const target: any = {
      a: 1
    };
    watch(target, 'a.b', (value, property) => {
      assert.strictEqual(value, 5);
      assert.strictEqual(property, 'b');
    });

    target.a = {
      b: 5
    };
  })
  it('Should observe changes when a property becomes undefined', done => {
    const target: any = {
      a: 5
    };
    watch(target, 'a', (value) => {
      assert(void 0 === value);
      done();
    });
    target.a = undefined;
  });
  it('Should observe changes inside an object that becomes undefined and then becomes an object', done => {
    const target: any = {
      a: {
        name: 'hello'
      }
    };
    watch(target, 'a.name', (value) => {
      assert.strictEqual(value, 'again');
      done();
    });
    target.a = undefined;
    target.a = {
      name: 'again'
    };
  });
});