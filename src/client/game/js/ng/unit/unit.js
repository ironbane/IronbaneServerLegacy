IronbaneApp
.factory('Unit', ['$log', function($log) {
    var Unit = function(config) {
        angular.copy(config || {}, this);

        if(this.data) {
            this.data = JSON.parse(this.data);
        }
    };

    return Unit;
}]);