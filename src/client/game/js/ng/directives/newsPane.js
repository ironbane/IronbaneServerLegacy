IronbaneApp
    .directive('newsPane', ['$log', 'News', '$timeout',
        function($log, News, $timeout) {
            return {
                restrict: 'E',
                templateUrl: '/game/templates/newsPane.html',
                replace: true,
                controller: ['$scope', 'News',
                    function($scope, News) {
                        $scope.posts = [];

                        News.get().then(function(posts) {
                            $scope.posts = posts;
                        });
                    }
                ],
                link: function(scope, el, attrs) {
                    var scroller = el.find('.news-content').jScrollPane().data('jsp');

                    scope.$watch('posts', function() {
                        // give it a millisecond to render...
                        $timeout(function() {
                            // $log.log('news scroller init');
                            scroller.reinitialise();
                        });
                    }, true);
                }
            };
        }
    ]);
