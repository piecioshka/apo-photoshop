(function (root) {
    'use strict';

    var OperationsNeighbourhood = {
        smoothing: function () {
            console.time('Neighbourhood: Smoothing');
            // ...
            console.timeEnd('Neighbourhood: Smoothing');
        },

        sharpen: function () {
            console.time('Neighbourhood: Sharpen');
            // ...
            console.timeEnd('Neighbourhood: Sharpen');
        }
    };

    // Exports `OperationsNeighbourhood`.
    return (root.OperationsNeighbourhood = OperationsNeighbourhood);

}(this));
