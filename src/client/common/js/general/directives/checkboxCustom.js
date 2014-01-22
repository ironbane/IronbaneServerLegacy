angular.module('IBCommon')
    .directive('checkboxCustom', ['$log', 'IBC_KEY_CODES',
        function($log, KEY_CODES) {
            return {
                require: 'ngModel',
                template: [
                    '<div class="customCheckbox">',
                        '<input type="checkbox" class="OffScreen" tabindex="-1">',
                        '<i tabindex="0" class="customCheckbox"></i>',
                    '</div>'
                ].join(''),
                replace: true,
                compile: function(tElement, tAttrs) {
                    var $label, $customBox = tElement.find('.customCheckbox');

                    // transfer model over to fake input
                    $customBox.attr('ng-model', tAttrs.ngModel);
                    // and now the parent doesn't need it
                    tElement.removeAttr('ng-model');

                    if (tAttrs.label) {
                        $label = $('<span class="customCheckboxLabel">' + tAttrs.label + '</span>');
                        tElement.append($label);
                    }

                    return {
                        post: function checkboxCustomPostLink(scope, el, attrs, ctrl) {
                            var $customBox = el.find('i.customCheckbox'),
                                $label = el.find('span.customCheckboxLabel');

                            if (!$label.length) {
                                $label = $('[for="' + attrs.id + '"]');
                                if ($label.length) {
                                    $label.addClass('customCheckboxLabel');
                                }
                            }

                            if (attrs.ngDisabled) {
                                attrs.$observe('ngDisabled', function(disabled) {
                                    if (scope.$eval(disabled)) {
                                        el.addClass('disabled');
                                    } else {
                                        el.removeClass('disabled');
                                    }
                                });
                            }

                            var toggleIcon = function(value) {
                                $customBox.removeClass(value ? 'icon-check-empty' : 'icon-check').addClass(value ? 'icon-check' : 'icon-check-empty');
                            };

                            var toggleHandler = function(event) {
                                if (event) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }

                                if (scope.$eval(attrs.ngDisabled)) {
                                    return;
                                }

                                ctrl.$setViewValue(!ctrl.$viewValue);

                                toggleIcon(ctrl.$viewValue);

                                scope.$apply(function(self) {
                                    if (attrs.callback) {
                                        self[attrs.callback](attrs.id, ctrl.$viewValue);
                                    }
                                });
                            };

                            scope.$watch(attrs.ngModel, function(val, old) {
                                // $log.log("checkbox watch ngModel", val, old, scope);
                                toggleIcon(val);
                            });

                            // create handler on $custombox to update the model
                            $customBox.click(toggleHandler);
                            $label.click(toggleHandler);

                            $customBox.keydown(function(checkboxKeyEvent) {
                                if (checkboxKeyEvent.which === KEY_CODES.SPACE) {
                                    checkboxKeyEvent.preventDefault();
                                    toggleHandler();
                                }
                            });
                        }
                    };
                }
            };
        }
    ]);