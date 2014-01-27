angular.module('IBCommon')
.filter('unsafe', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);