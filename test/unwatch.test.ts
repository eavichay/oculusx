import {watch, unwatch, IOculusHandler} from '../src';

import assert = require('assert');

describe('unwatch',  () => {

  it('Should remove all watchers', done => {
    let fail = undefined;
    const target:any = {
      a: {
        b: 12345
      }
    };
    watch(target, 'a.b', () => fail = 'Unwatch did not work');
    unwatch(target, 'a.b');
    target.a.b = 6;
    done(fail);
  });

  it('Should not remove deep nested watchers when removing intermediate watcher', done => {
    const target: any = {
      level1: {
        level2: {
          level3: {
            value: 12345
          }
        }
      }
    };
    let count = 0;
    const callback = () => {
      done('Should be unwatched');
    };
    const assertionCallback: IOculusHandler = (value, prop) => {
      count++;
      if (count === 1) {
        assert.strictEqual(value, 5678);
        assert.strictEqual(prop, 'value');
      }
      if (count === 2) {
        assert.strictEqual(prop, 'level2');
        assert.deepStrictEqual(value, {
          level3: {
            value: 5678
          }
        });
        done();
      }
    }
    watch(target, 'level1.level2.level3.value', assertionCallback);
    watch(target, 'level1.level2.level3', callback);
    watch(target, 'level1.level2', assertionCallback);
    unwatch(target, 'level1.level2.level3', callback);

    target.level1.level2.level3 = {
      value: 5678
    };

    target.level1.level2 = {
      level3: {
        value: 5678
      }
    };
  });

  it('Should remove specific callback on a nested object', done => {
    const target:any = {
      a: {
        b: 12345
      }
    };
    const callback = () => {
      done('Unwatch did not work');
    }
    watch(target, 'a.b', callback);
    watch(target, 'a.b', (value, prop) => {
      assert.strictEqual(value, 6);
      assert.strictEqual(prop, 'b');
      done();
    });
    unwatch(target, 'a.b', callback);
    target.a.b = 6;
  })

});