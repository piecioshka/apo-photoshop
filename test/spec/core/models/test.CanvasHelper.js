"use strict";

describe('CanvasHelper', function () {
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
            expect(CanvasHelper.getNeighbors(a, 0, 0)).toEqual([
                1, 2,
                4, 5
            ]);

            expect(CanvasHelper.getNeighbors(a, 0, 1)).toEqual([
                1, 2,
                4, 5,
                7, 8
            ]);

            expect(CanvasHelper.getNeighbors(a, 0, 2)).toEqual([
                4, 5,
                7, 8
            ]);
        });

        it('should work properly at second column', function () {
            expect(CanvasHelper.getNeighbors(a, 1, 0)).toEqual([
                1, 2, 3,
                4, 5, 6
            ]);

            expect(CanvasHelper.getNeighbors(a, 1, 1)).toEqual([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ]);

            expect(CanvasHelper.getNeighbors(a, 1, 2)).toEqual([
                4, 5, 6,
                7, 8, 9
            ]);
        });

        it('should work properly at third column', function () {
            expect(CanvasHelper.getNeighbors(a, 2, 0)).toEqual([
                2, 3,
                5, 6
            ]);

            expect(CanvasHelper.getNeighbors(a, 2, 1)).toEqual([
                2, 3,
                5, 6,
                8, 9
            ]);

            expect(CanvasHelper.getNeighbors(a, 2, 2)).toEqual([
                5, 6,
                8, 9
            ]);
        });
    });
});
