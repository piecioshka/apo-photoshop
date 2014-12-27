describe('CanvasHelper', function () {
    'use strict';

    it('completePixelList', function () {
        expect(CanvasHelper.completePixelList([1, 2, 3, 4], 2, 2, 2)).toEqual([
            2, 2, 2, 2,
            2, 1, 2, 2,
            2, 3, 4, 2,
            2, 2, 2, 2
        ]);
    });

    it('completePixelArray', function () {
        expect(CanvasHelper.completePixelArray([[1, 2, 3, 4]], 2)).toEqual([
            [2, 2, 2, 2, 2, 2],
            [2, 1, 2, 3, 4, 2],
            [2, 2, 2, 2, 2, 2]
        ]);
    });

    it('toPixelMatrix', function () {
        expect(CanvasHelper.toPixelMatrix([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    describe('getNeighbors', function () {
        var a;

        beforeEach(function () {
            a = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];
        });

        it('should work properly at first column', function () {
            expect(CanvasHelper.getNeighbors(a, 0, 0)).toEqual([1, 2, 4, 5]);
            expect(CanvasHelper.getNeighbors(a, 0, 1)).toEqual([1, 2, 4, 5, 7, 8]);
            expect(CanvasHelper.getNeighbors(a, 0, 2)).toEqual([4, 5, 7, 8]);
        });

        it('should work properly at second column', function () {
            expect(CanvasHelper.getNeighbors(a, 1, 0)).toEqual([1, 2, 3, 4, 5, 6]);
            expect(CanvasHelper.getNeighbors(a, 1, 1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(CanvasHelper.getNeighbors(a, 1, 2)).toEqual([4, 5, 6, 7, 8, 9]);
        });

        it('should work properly at third column', function () {
            expect(CanvasHelper.getNeighbors(a, 2, 0)).toEqual([2, 3, 5, 6]);
            expect(CanvasHelper.getNeighbors(a, 2, 1)).toEqual([2, 3, 5, 6, 8, 9]);
            expect(CanvasHelper.getNeighbors(a, 2, 2)).toEqual([5, 6, 8, 9]);
        });

        it('should work properly when change figure to square', function () {
            expect(CanvasHelper.getNeighbors(a, 0, 0, 'square')).toEqual([1, 2, 4, 5]);
            expect(CanvasHelper.getNeighbors(a, 0, 1, 'square')).toEqual([1, 2, 4, 5, 7, 8]);
            expect(CanvasHelper.getNeighbors(a, 0, 2, 'square')).toEqual([4, 5, 7, 8]);
            expect(CanvasHelper.getNeighbors(a, 1, 0, 'square')).toEqual([1, 2, 3, 4, 5, 6]);
            expect(CanvasHelper.getNeighbors(a, 1, 1, 'square')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(CanvasHelper.getNeighbors(a, 1, 2, 'square')).toEqual([4, 5, 6, 7, 8, 9]);
            expect(CanvasHelper.getNeighbors(a, 2, 0, 'square')).toEqual([2, 3, 5, 6]);
            expect(CanvasHelper.getNeighbors(a, 2, 1, 'square')).toEqual([2, 3, 5, 6, 8, 9]);
            expect(CanvasHelper.getNeighbors(a, 2, 2, 'square')).toEqual([5, 6, 8, 9]);
        });

        it('should work properly when change figure to diamond', function () {
            expect(CanvasHelper.getNeighbors(a, 0, 0, 'diamond')).toEqual([1, 2, 4]);
            expect(CanvasHelper.getNeighbors(a, 0, 1, 'diamond')).toEqual([1, 4, 5, 7]);
            expect(CanvasHelper.getNeighbors(a, 0, 2, 'diamond')).toEqual([4, 7, 8]);
            expect(CanvasHelper.getNeighbors(a, 1, 0, 'diamond')).toEqual([1, 2, 3, 5]);
            expect(CanvasHelper.getNeighbors(a, 1, 1, 'diamond')).toEqual([2, 4, 5, 6, 8]);
            expect(CanvasHelper.getNeighbors(a, 1, 2, 'diamond')).toEqual([5, 7, 8, 9]);
            expect(CanvasHelper.getNeighbors(a, 2, 0, 'diamond')).toEqual([2, 3, 6]);
            expect(CanvasHelper.getNeighbors(a, 2, 1, 'diamond')).toEqual([3, 5, 6, 9]);
            expect(CanvasHelper.getNeighbors(a, 2, 2, 'diamond')).toEqual([6, 8, 9]);
        });

        it('should work properly when change figure to not diamond and not square', function () {
            expect(CanvasHelper.getNeighbors(a, 2, 0, 'xxx')).toEqual([]);
            expect(CanvasHelper.getNeighbors(a, 2, 1, 'xxx')).toEqual([]);
            expect(CanvasHelper.getNeighbors(a, 2, 2, 'xxx')).toEqual([]);
        });
    });

    it('convertPositionIndexToXY', function () {
        // ----------------> x
        // | 1, 1, 1, 1, 1, 1,
        // | 2, 2, 2, 2, 2, 2,
        // | 3, 3, 3, 3, 3, 3,
        // | 4, 4, 4, 4, 4, 4
        // y

        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 0)).toEqual({ x: 0, y: 0 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 1)).toEqual({ x: 1, y: 0 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 2)).toEqual({ x: 2, y: 0 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 3)).toEqual({ x: 3, y: 0 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 4)).toEqual({ x: 4, y: 0 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 5)).toEqual({ x: 5, y: 0 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 6)).toEqual({ x: 0, y: 1 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 7)).toEqual({ x: 1, y: 1 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 8)).toEqual({ x: 2, y: 1 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 9)).toEqual({ x: 3, y: 1 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 10)).toEqual({ x: 4, y: 1 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 11)).toEqual({ x: 5, y: 1 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 12)).toEqual({ x: 0, y: 2 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 13)).toEqual({ x: 1, y: 2 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 14)).toEqual({ x: 2, y: 2 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 15)).toEqual({ x: 3, y: 2 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 16)).toEqual({ x: 4, y: 2 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 17)).toEqual({ x: 5, y: 2 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 18)).toEqual({ x: 0, y: 3 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 19)).toEqual({ x: 1, y: 3 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 20)).toEqual({ x: 2, y: 3 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 21)).toEqual({ x: 3, y: 3 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 22)).toEqual({ x: 4, y: 3 });
        expect(CanvasHelper.convertPositionIndexToXY(6, 4, 23)).toEqual({ x: 5, y: 3 });
    });

    it('convertXYToPositionIndex', function () {
        // ---------> x
        // | 1, 1, 1,
        // | 2, 2, 2,
        // | 3, 3, 3,
        // | 4, 4, 4,
        // y

        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 0, 0)).toEqual(0);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 1, 0)).toEqual(1);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 2, 0)).toEqual(2);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 0, 1)).toEqual(3);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 1, 1)).toEqual(4);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 2, 1)).toEqual(5);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 0, 2)).toEqual(6);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 1, 2)).toEqual(7);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 2, 2)).toEqual(8);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 0, 3)).toEqual(9);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 1, 3)).toEqual(10);
        expect(CanvasHelper.convertXYToPositionIndex(3, 4, 2, 3)).toEqual(11);
    });
});
