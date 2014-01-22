angular.module('IBCommon')
.value('LOG_LEVEL', 5) // to be overridden in index.html
.config(['$provide', function($provide) {
    $provide.decorator('$log', ['LOG_LEVEL', '$delegate', function(LOG_LEVEL, $delegate) {
        var log = $delegate.log,
            debug = $delegate.debug,
            warn = $delegate.warn,
            info = $delegate.info,
            error = $delegate.error;

        $delegate.log = function() {
            if(LOG_LEVEL >= 3) {
                log.apply($delegate, arguments);
            }
        };

        $delegate.debug = function() {
            if(LOG_LEVEL >= 5) {
                debug.apply($delegate, arguments);
            }
        };

        $delegate.warn = function() {
            if(LOG_LEVEL >= 2) {
                warn.apply($delegate, arguments);
            }
        };

        $delegate.info = function() {
            if(LOG_LEVEL >= 4) {
                info.apply($delegate, arguments);
            }
        };

        $delegate.error = function() {
            if(LOG_LEVEL >= 1) {
                error.apply($delegate, arguments);
            }
        };

        return $delegate;
    }]);
}]);