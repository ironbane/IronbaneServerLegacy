IronbaneApp
.service('AlertService', ['$log', '$rootScope', function($log, $rootScope) {
    var svc = this;

    svc.show = function(msg, options) {
        var obj = {
            message: msg
        };

        if(options) {
            obj.ok = options.ok;
            obj.cancel = options.cancel;
        }

        $rootScope.mainAlert = obj;
    };

}]);
