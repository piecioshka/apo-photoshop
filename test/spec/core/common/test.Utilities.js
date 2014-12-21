describe('Utilities', function () {
    'use strict';

    xit('isDarwin', function () {

    });

    it('max', function () {
        expect(Utilities.max(1, 2, 3)).toEqual(3);
        expect(Utilities.max(1, 3, 2)).toEqual(3);
        expect(Utilities.max(3, 1, 2)).toEqual(3);
        expect(Utilities.max(3, 3, 2)).toEqual(3);
        expect(Utilities.max(3, 3, 3)).toEqual(3);
        expect(Utilities.max(0, 3, 0)).toEqual(3);
        expect(Utilities.max(NaN, 3, NaN)).toEqual(3);
    });

    it('average', function () {
        expect(Utilities.average(NaN, 3, NaN)).toEqual(3);
        expect(Utilities.average(NaN, 3, 1)).toEqual(2);
        expect(Utilities.average(1, 7, 1)).toEqual(3);
        expect(Utilities.average(1, 10, 1)).toEqual(4);
        expect(Utilities.average(2, 10, 0, 0)).toEqual(3);
    });

    it('intToByte', function () {
        expect(Utilities.intToByte(100)).toEqual(100);
        expect(Utilities.intToByte(-100)).toEqual(0);
        expect(Utilities.intToByte(1000)).toEqual(255);
    });

    xit('walkTheDOM', function () {

    });

    it('sortNumbers', function () {
        var result = [1, 2, 3];
        expect([1, 2, 3].sort(Utilities.sortNumbers)).toEqual(result);
        expect([1, 3, 2].sort(Utilities.sortNumbers)).toEqual(result);
        expect([2, 3, 1].sort(Utilities.sortNumbers)).toEqual(result);
        expect([1, 3, 2].sort(Utilities.sortNumbers)).toEqual(result);
        expect([3, 1, 2].sort(Utilities.sortNumbers)).toEqual(result);
        expect([1, 2, 2, 1].sort(Utilities.sortNumbers)).toEqual([1, 1, 2, 2]);
    });
});
