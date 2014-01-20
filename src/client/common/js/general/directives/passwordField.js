angular.module('IBCommon')
.constant('IBC_KEY_CODES', {
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    CMD_LEFT: 91,
    CMD_RIGHT: 92
})
.directive('passwordField', ['$log', '$browser', '$sniffer', 'IBC_KEY_CODES',
    function($log, $browser, $sniffer, KEY_CODES) {
        // helper
        function isEmpty(value) {
            return angular.isUndefined(value) || value === '' || value === null;
        }

        return {
            require: 'ngModel',
            restrict: 'EA',
            template: '<div><input class="form-control" type="text" /><input class="form-control" type="password" /></div>',
            replace: true,
            compile: function(tElement, tAttrs) {
                // forward some directives to inner inputs
                tElement.find('input').each(function(idx, input) {
                    if (tAttrs.ngDisabled) {
                        $(input).attr('ng-disabled', tAttrs.ngDisabled);
                    }
                    if (tAttrs.ngClass) {
                        $(input).attr('ng-class', tAttrs.ngClass);
                        tElement.removeAttr('ng-class');
                    }
                    // pass placeholder along
                    if(tAttrs.placeholder) {
                        $(input).attr('placeholder', tAttrs.placeholder);
                    }
                });

                return function passwordFieldPostLink(scope, el, attr, ctrl) {
                    var textInput = angular.element(el.children()[0]),
                        pwInput = angular.element(el.children()[1]);

                    var listener = function(e) {
                        var target = e.target,
                            value = angular.element(target).val();

                        if (ctrl.$viewValue !== value) {
                            scope.$apply(function() {
                                ctrl.$setViewValue(value);
                                ctrl.$render();
                            });
                        }
                    };

                    // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
                    // input event on backspace, delete or cut
                    if ($sniffer.hasEvent('input')) {
                        textInput.bind('input', listener);
                        pwInput.bind('input', listener);
                    } else {
                        var timeout;
                        var ev = function(event) {
                            var key = event.keyCode;

                            if (key === KEY_CODES.CMD_LEFT || (KEY_CODES.SHIFT <= key && key <= KEY_CODES.ALT) || (KEY_CODES.LEFT <= key && key <= KEY_CODES.DOWN)) {
                                // ignore: command, modifiers, arrows
                                return;
                            }

                            if (!timeout) {
                                timeout = $browser.defer(function() {
                                    listener(event);
                                    timeout = null;
                                });
                            }
                        };

                        textInput.bind('keydown', ev);
                        pwInput.bind('keydown', ev);

                        // if user paste into input using mouse, we need "change" event to catch it
                        textInput.bind('change', listener);
                        pwInput.bind('change', listener);
                    }

                    ctrl.$render = function() {
                        textInput.val(isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
                        pwInput.val(isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
                    };

                    scope.$watch(attr.toggle, function(val) {
                        if (val === true) {
                            textInput.css('display', 'none');
                            pwInput.css('display', 'inline');
                        } else {
                            textInput.css('display', 'inline');
                            pwInput.css('display', 'none');
                        }
                    });
                };
            }
        };
    }
]);
