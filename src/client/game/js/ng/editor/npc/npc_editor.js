IronbaneApp
.directive('npcEditor', ['$log', function($log) {
    return {
        templateUrl: '/game/templates/npc_editor.html',
        restrict: 'EA',
        controller: ['$scope', '$log', 'UnitTemplateSvc', 'UnitSvc', function($scope, $log, UnitTemplateSvc, UnitSvc) {
            $scope.templates = [];
            UnitTemplateSvc.getAll().then(function(templates) {
                $scope.templates = templates;
            }, function(err) {
                $log.error('Error loading unit templates!', err);
            });

            // this global stuff should eventually go into a service or constants
            $scope.getUnitType = function(type) {
                return _.invert(IB.UnitTypeEnum)[type];
            };

            $scope.$watch('unit.template', function(templateId) {
                if(!$scope.unit || !templateId) {
                    return;
                }

                $scope.unit.$template = _.findWhere($scope.templates, {id: templateId});
            });

            $scope.load = function(id) {
                UnitSvc.getById(id).then(function(unit) {
                    $scope.unit = unit;
                }, function(err) {
                    // prolly not found, that's OK
                    $log.warn('Error loading unit id[' + id + ']: ', err);
                });
            };
        }],
        link: function(scope, el, attrs) {

        }
    };
}]);