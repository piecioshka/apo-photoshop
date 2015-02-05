describe('Utilities', function () {
    'use strict';

    it('isDarwin', function () {
        window.process = { platform: 'darwin'};
        expect(Utilities.isDarwin()).toBeTruthy();
        window.process = { platform: 'win'};
        expect(Utilities.isDarwin()).toBeFalsy();
        window.process = { platform: 'linux'};
        expect(Utilities.isDarwin()).toBeFalsy();
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

    it('walkTheDOM', function () {
        var list = document.createElement('ul');
        var item = document.createElement('li');
        list.appendChild(item);
        list.appendChild(item);
        list.appendChild(item);

        Utilities.walkTheDOM(list, function (elm) {
            var nodeName = elm.nodeName.toLowerCase();
            if (nodeName === 'ul') {
                expect(elm).toEqual(list);
            } else if (nodeName === 'li') {
                expect(elm).toEqual(item);
            }
        });

        Utilities.walkTheDOM(item, function (elm) {
            expect(elm).toEqual(item);
        });
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

    it('sum', function () {
        expect(Utilities.sum([])).toEqual(0);
        expect(Utilities.sum([1])).toEqual(1);
        expect(Utilities.sum([1, 2, 3])).toEqual(6);
        expect(Utilities.sum([1000, 100, 10, 1])).toEqual(1111);
    });

    it('hex2rgb', function () {
        expect(Utilities.hex2rgb('000000')).toEqual([0, 0, 0]);
        expect(Utilities.hex2rgb('28d735')).toEqual([40, 215, 53]);
    });
});
