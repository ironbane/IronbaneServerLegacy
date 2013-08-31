IronbaneApp
    .directive('loadingBar', ['$log',
        function($log) {
            return {
                scope: {
                    fake: '=',
                    messages: '=',
                    messageIndex: '='
                },
                replace: true,
                templateUrl: '/game/templates/loading.html',
                controller: ['$scope', 'TimerService', function($scope, TimerService) {
                    if($scope.fake) {
                        var funnyTimer = TimerService.add(getRandomFloat(0.5, 3.0), {loop: true});

                        funnyTimer.then(function() {
                            $log.log('timer loop expired', $scope);
                            $scope.messageIndex++;
                            funnyTimer.setTime(getRandomFloat(0.5, 3.0));
                        });

                        $scope.$on('$destroy', function() {
                            funnyTimer.kill();
                        });
                    }

                    // update the template string based on index
                    $scope.$watch('messageIndex', function(index) {
                        if(index < 0) {
                            index = 0;
                        }
                        if(index > $scope.messages.length - 1) {
                            index = 0;
                        }

                        $scope.message = $scope.messages[index];
                    });
                }]
            };
        }
    ])
    .constant('funnyLoads', _.shuffle([
        "Spawning random annoying monsters",
        "Setting a higher gravity just for you",
        "Testing your patience",
        "Insert funny message here",
        "Is this even helping?",
        "We lost Ironbane",
        "Making cool swords and daggers",
        "I hate this job",
        "Laying bridges",
        "Painting signs",
        "Brewing potions",
        "Making cheese",
        "Unleashing rats",
        "Plucking apples",
        "Mowing grass",
        "Making spooky dungeons",
        "Recording scary sounds",
        "Pixelating the sun",
        "Annoying developers",
        "Are your shoelaces tied?",
        "Telling Ironbane where to hide",
        "Spawning overpowered equipment",
        "Painting castle walls",
        "Feeding the staff",
        "Teleporting you above lava",
        "Chasing Ironbane",
        "Showing a random guy walking on the screen"
    ]));