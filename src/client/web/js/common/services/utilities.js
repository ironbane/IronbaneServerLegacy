// board.js
angular.module('IronbaneApp')
    .service('utilities', ['$http', '$log', '$q',
        function($http, $log, $q) {
            return {
                paginator: function(_data, currentPage, numPerPage) {
                    return _data.slice((currentPage - 1) * numPerPage, currentPage * numPerPage);
                }
            };
        }
    ]);