IronbaneApp
.directive('itemEditor', ['$log', function($log) {
    return {
        scope: true,
        templateUrl: '/game/templates/item_editor.html',
        restrict: 'EA',
        controller: ['$scope', '$log', 'ItemTemplateSvc', '$fileUploader', 'ITEM_TYPE_ENUM', '$window', '$modal',
            function($scope, $log, ItemTemplateSvc, $fileUploader, ITEM_TYPE_ENUM, $window, $modal) {

            $scope.templates = [];
            $scope.item = {};

            $scope.item_types = _.keys(ITEM_TYPE_ENUM);
            $scope.item_subtypes = ITEM_TYPE_ENUM[$scope.item_types[0]];
            // since these are the only choices
            $scope.projectile_types = _.keys($window.ProjectileTypeEnum);

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
                    ItemTemplateSvc.update($scope.item).then(function(item) {
                        // also make sure the global items db is updated (todo: change that from global)
                        $window.items[$scope.item.id] = $scope.item;
                    }, function(err) {
                        $window.hudHandler.messageAlert('Error saving! ' + JSON.stringify(err.data));
                    });
                } else {
                    ItemTemplateSvc.create($scope.item).then(function(item) {
                        $scope.templates.push(item);
                        // also make sure the global items db is updated (todo: change that from global)
                        $window.items[item.id] = item;
                    }, function(err) {
                        $window.hudHandler.messageAlert('Error saving! ' + JSON.stringify(err.data));
                    });
                }
            };

            $scope.doNew = function() {
                $scope.item = {};
                $scope.itemEditorForm.$setPristine();
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
                $window.socketHandler.socket.emit('chatMessage', {
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

                    $window.hudHandler.messageAlert(report);
                }, function(err) {
                    $window.hudHandler.messageAlert('Error' + err);
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

            var imageSelectorModal;

            $scope.chooseImage = function() {
                // no double modals
                if(imageSelectorModal) {
                    return;
                }

                imageSelectorModal = $modal.open({
                    templateUrl: '/game/templates/item_image_selector.html',
                    backdrop: false,
                    resolve: {
                        images: ['$http', function($http) {
                            var imageIds;

                            if($scope.item.type !== 'armor') {
                                return $http.get('/game/images/items').then(function(response) {
                                    imageIds = response.data;
                                    return _.map(imageIds, function(i) {
                                        return {id: i, url: 'images/items/' + i + '/80/80'};
                                    });
                                }, function(err) {
                                    $log.error('error getting images list', err);
                                    return err;
                                });
                            } else {
                                var subtype = $scope.item.subtype;
                                if(subtype !== 'body' && subtype !== 'feet' && subtype !== 'head') {
                                    subtype = 'body';
                                }

                                return $http.get('/game/images/armor/' + subtype).then(function(response) {
                                    imageIds = response.data;
                                    return _.map(imageIds, function(i) {
                                        return {id: i, url: 'images/characters/base/' + subtype + '/' + i + '/80/80'};
                                    });
                                }, function(err) {
                                    $log.error('error getting images list', err);
                                    return err;
                                });
                            }
                        }],
                        type: function() {
                            return $scope.item.type;
                        },
                        subtype: function() {
                            return $scope.item.subtype;
                        }
                    },
                    controller: ['$modalInstance', '$scope', 'type', 'subtype', 'images', function($modalInstance, $scope, type, subtype, images) {
                        $scope.images = images;
                        $scope.type = type;
                        $scope.subtype = subtype;
                        $scope.close = function(item) {
                            $modalInstance.close(item);
                        };
                        $scope.dismiss = function(reason) {
                            $modalInstance.dismiss(reason);
                        };
                    }]
                });

                // result success means something was chosen
                imageSelectorModal.result.then(function(image) {
                    $scope.item.image = image.id;
                    imageSelectorModal = null;
                }, function() {
                    imageSelectorModal = null;
                });
            };
        }]
    };
}]);