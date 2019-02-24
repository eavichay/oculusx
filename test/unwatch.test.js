const {watch, unwatch} = require('../src');
const assert = require('assert');

describe('unwatch', () => {

    describe('De-registering', () => {
        const target = {
            some: {
                path: 123
            }
        };

        it('Should throw error when observing a de-registered target', done => {
            const observe = watch(target)('some.path', () => {
            });
            unwatch(target);
            try {
                observe('some.path', () => {
                });
            } catch (err) {
                return done();
            }
            done(new Error('unobserve was still executed'));
        });

        it('Should NOT throw error when un-observing a non-registered path', done => {
            const callback = () => {};
            watch(target, 'some.path', callback);
            try {
                unwatch(target, 'x.x.x.x', callback);
                unwatch(target, 'y.y.y', callback);
                unwatch(target, 'z.z');
            } catch (e) {
                done(e);
            }
            done();
        });

        it('Should NOT throw error when un-observing a de-registered target', done => {
            watch(target, 'some.path', () => done(new Error('Should not be invoked')));
            unwatch(target)('bla')('a.b.c.d')()();
            unwatch(target, 'x.y.z');
            unwatch(target);
            unwatch(target)('bla')('a.b.c.d')()();
            done();
        });

        it('Should allow watch after de-registering a target', done => {
            let error = new Error('Registered callback was not invoked');
            watch(target, 'some.path', () => done(new Error('Should not be invoked')));
            unwatch(target);
            watch(target, 'some.path', (value) => {
                assert.strictEqual(value, 1);
                error = undefined;
            });
            target.some = {
                path: 1
            };
            done(error);
        });
    });

    it('Should remove all watchers', done => {
        /**
         * @type {undefined|string}
         */
        let fail = undefined;
        const target = {
            a: {
                b: 12345
            }
        };
        watch(target, 'a.b', () => fail = 'Unwatch did not work');
        unwatch(target, 'a.b');
        target.a.b = 6;
        done(fail);
    });

    it('Should chain watch/unwatch functions', done => {
        const target = {
            a: {
                b: 1
            },
            c: 2
        };
        const callback = () => done(new Error('Callback should not have been invoked'));
        watch(target)
        ('a.b', callback)
        ('c', callback);

        unwatch(target)
        ('a.b', callback)
        ('c');

        target.a = {
            b: 2
        };
        target.c = 5;
        done();
    });

    it('Should not remove deep nested watchers when removing intermediate watcher', done => {
        const target = {
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
        const assertionCallback = (value, prop) => {
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
        };
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
        const target = {
            a: {
                b: 12345
            }
        };
        const callback = () => {
            done('Unwatch did not work');
        };
        watch(target, 'a.b', callback);
        watch(target, 'a.b', (value, prop) => {
            assert.strictEqual(value, 6);
            assert.strictEqual(prop, 'b');
            done();
        });
        unwatch(target, 'a.b', callback);
        target.a.b = 6;
    });

});