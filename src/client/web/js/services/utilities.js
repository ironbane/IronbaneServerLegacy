// board.js
angular.module('IronbaneApp')
.service('utilities', ['$http', '$log','$q', function($http, $log, $q) {
    return {
    paginator : function(_data, currentPage) {
        


            var numPerPage = 25;
            var noOfPages = Math.ceil(_data.length / numPerPage);
            return _data.slice( (currentPage - 1) * numPerPage, currentPage * numPerPage );
                            
            }
              
    };
    
}]);