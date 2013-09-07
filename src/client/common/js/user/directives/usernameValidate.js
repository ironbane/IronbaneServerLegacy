angular.module('User')
.directive('usernameValidate', ['$log', function($log) {
    return {
        require: 'ngModel',
        link: function(scope, el, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if(!viewValue) {
                    return;
                }

                var test = /^[A-Za-z0-9 _.@]*$/,
                    minLength = viewValue.length >= 3,
                    maxLength = viewValue.length <= 20,
                    pattern = test.test(viewValue);

                ctrl.$setValidity('minLength', minLength);
                ctrl.$setValidity('maxLength', maxLength);
                ctrl.$setValidity('pattern', pattern);

                return (minLength && maxLength && pattern) ? viewValue : undefined;
            });
        }
    };
}]);