IronbaneApp
.directive('itemEditor', ['$log', function($log) {
    return {
        scope: true,
        templateUrl: '/game/templates/item_editor.html',
        restrict: 'EA',
        controller: ['$scope', '$log', 'ItemTemplateSvc', '$fileUploader', 'ITEM_TYPE_ENUM', '$window',
            function($scope, $log, ItemTemplateSvc, $fileUploader, ITEM_TYPE_ENUM, $window) {

            $scope.templates = [];
            $scope.item = {};

            $scope.item_types = _.keys(ITEM_TYPE_ENUM);
            $scope.item_subtypes = ITEM_TYPE_ENUM[$scope.item_types[0]];

            $scope.$watch('item.type', function(type) {
                if(!type) {
                    return;
                }

                $scope.item_subtypes = ITEM_TYPE_ENUM[type];
            });

            var uploader = $scope.uploader = $fileUploader.create({scope: $scope});

            uploader.bind('afteraddingfile', function(e, item) {
                $log.log('afteraddingfile: ', item);
                var fr = new FileReader();
                fr.readAsDataURL(item.file);
                fr.onload = function() {
                    $scope.imageUrl = fr.result;
                    $scope.item.image = -1;
                    $scope.$digest();
                };
            });

            ItemTemplateSvc.getAll().then(function(templates) {
                $scope.templates = templates;
            }, function(err) {
                $log.error('Error loading unit templates!', err);
            });

            $scope.$watch('item.image', function(image) {
                if(!image || !$scope.item || image < 0) {
                    return;
                }

                if ($scope.item.type === 'armor') {
                    $scope.imageUrl = 'images/characters/base/' + $scope.item.subtype + '/' + image + '/80/80';
                } else {
                    $scope.imageUrl = 'images/items/' + image + '/80/80';
                }
            });

            $scope.doSave = function() {
                if($scope.item.id) {
                    // update?
                } else {
                    ItemTemplateSvc.create($scope.item).then(function(item) {
                        $scope.templates.push(item);
                    }, function(err) {
                        hudHandler.messageAlert('Error saving! ' + JSON.stringify(err.data));
                    });
                }
            };

            $scope.doNew = function() {
                $scope.item = {};
            };

            $scope.doDuplicate = function() {
                $scope.item = angular.copy($scope.item);
                delete $scope.item.id;
            };

            $scope.giveItem = function() {
                if(!$scope.item || !$scope.item.id) {
                    // can't give a non-final item (yet!)
                    return;
                }

                // todo: wrap this in a service!
                socketHandler.socket.emit('chatMessage', {
                  message: '/giveitem ' + $scope.item.id
                });
            };

            $scope.showAnalysis = function() {
                if(!$scope.item || !$scope.item.id) {
                    // can't give a non-final item (yet!)
                    return;
                }

                ItemTemplateSvc.getAnalysis($scope.item.id).then(function(result) {
                    var report = "This item is found " + result.items + " times in inventories.<br>";
                    report += "It is in the loot of " + result.loots + " units.";

                    hudHandler.messageAlert(report);
                }, function(err) {
                    hudHandler.messageAlert('Error' + err);
                });
            };

            $scope.closeDialog = function() {
                $window.disableGameControls = false; // TODO: have a dialog service manage this
                $scope.showItemEditor=false;
            };

            $scope.doDelete = function() {
                // show confirm modal?
                // warn about usage?
                // maybe best to not have this? (or enable soft delete)
            };
        }],
        link: function(scope, el, attrs) {

        }
    };
}]);