const assert = require('assert');
const {unwatch, watch} = require('../src/index.js');

const iterate = (callback) => {
    for (let i = 0; i < 1000; i++) {
        callback(i);
        global.gc();
    }
};

describe('Memory leaks', function () {
    it('Should not leak', (done) => {
        const startTestHeap = process.memoryUsage().heapUsed;
        iterate((count) => {
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
        });
        setTimeout(() => {
            global.gc();
            const endTestHeap = process.memoryUsage().heapUsed;
            assert.ok(endTestHeap <= startTestHeap, `Memory heap test failed: got ${endTestHeap - startTestHeap}. Should be zero or less`);
            done();
        }, 100);
    });
});