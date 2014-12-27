describe('Canvas', function () {
    'use strict';

    describe('each', function () {
        it('run handler', function () {
            var c = new Canvas({ width: 1, height: 1 });
            var foo = { bar: Function };
            spyOn(foo, 'bar');
            c.each(foo.bar);
            expect(foo.bar).toHaveBeenCalled();
        });

        it('run handler many times', function () {
            var times = 0;
            var c = new Canvas({ width: 3, height: 5 });
            c.each(function () { times++; });
            expect(times).toEqual(c.settings.width * c.settings.height);
        });
    });

});
