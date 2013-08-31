// timers based on engine tick

IronbaneApp
.factory('Timer', ['$log', '$q', '$rootScope', function($log, $q, $rootScope) {
    function Timer(time, options) {
        // _time is backup for when reset
        this._time = this.time = time;

        // defaults
        if(!options) {
            options = {
                loop: false
            };
        }

        this.loop = options.loop;
        this.stopped = false;

        // sequence of methods to run every expiry
        this._expiredCallbacks = [];
    }

    // for looping / restarting
    var reset = function(timer) {
        timer.time = timer._time;
        timer.stopped = false;
    };

    var complete = function(timer) {
        //$log.log('timer iteration complete', timer);
        timer.stopped = true;

        // resolve an iteration
        _.each(timer._expiredCallbacks, function(callback) {
            // bring it back into angular
            $rootScope.$apply(function() { callback(); });
        });

        if(timer.loop) {
            reset(timer);
        }
    };

    Timer.prototype.then = function(callback) {
        this._expiredCallbacks.push(callback);

        return this; // allow chaining
    };

    // change the time
    Timer.prototype.setTime = function(time) {
        this._time = this.time = time;
    };

    // advance the time on the timer, auto handle all looping and such
    Timer.prototype.advance = function(delta) {
        if(this.stopped) {
            return;
        }

        this.time -= delta;
        if(this.time <= 0) {
            complete(this);
        }
    };

    // stop this timer completely, but DO fire the completion
    Timer.prototype.end = function() {
        this.loop = false;
        complete(this);
    };

    // stop this timer completely, do not fire completion
    Timer.prototype.kill = function() {
        this.stopped = true;
        this.loop = false;
    };

    return Timer;
}])
.service('TimerService', ['$log', 'Timer', function($log, Timer) {

    var active = [],
        expired = [];

    // add an already created Timer object
    this.addTimer = function(timer) {
        timer.then(function() {
            if(!timer.loop) {
                // add to purge queue
                expired.push(timer);
            }
        });

        active.push(timer);
    };

    // add a new timer by parameters
    this.add = function(time, options) {
        var timer = new Timer(time, options);
        timer.then(function() {
            if(!timer.loop) {
                // add to purge queue
                expired.push(timer);
            }
        });

        active.push(timer);

        return timer;
    };

    // to be called during engine tick
    this.update = function(delta) {
        // cleanup expired timers
        active = _.difference(active, expired);

        _.each(active, function(timer) {
            timer.advance(delta);
        });
    };
}]);