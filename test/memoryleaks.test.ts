import {unwatch, watch} from "../src";

import assert = require('assert');

const iterate = (callback: Function) => {
  for (let i = 0; i < 100000; i++) {
    callback();
  }
};

describe('Memory leaks', () => {
  it('Should not leak', (done) => {
    const startTestHeap = process.memoryUsage().heapUsed;
    iterate( () => {
      const target = {
        a: {
          b: {
            c: 3
          }
        },
        x: 0
      };
      const callback = () => target.x++;

      watch(target, 'a.b.c', callback);

      target.a.b.c = 5;
      target.a.b = {
        c: 7
      };
      target.a = {
        b: {
          c: 15
        }
      };

      unwatch(target, 'a.b.c', callback);
    });
    setTimeout(() => {
      global.gc();
      const endTestHeap = process.memoryUsage().heapUsed;
      assert.ok(endTestHeap <= startTestHeap, `Memory heap test failed: got ${endTestHeap - startTestHeap}. Should be zero or less`);
      done();
    }, 200);
  })
});