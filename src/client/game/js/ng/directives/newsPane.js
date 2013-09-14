IronbaneApp
    .directive('newsPane', ['$log', 'News', '$timeout',
        function($log, News, $timeout) {
            return {
                restrict: 'E',
                templateUrl: '/game/templates/newsPane.html',
                replace: true,
                controller: ['$scope', 'News',
                    function($scope, News) {
                        $scope.activeCategory = 'News';
                        $scope.posts = [];
                        $scope.tweets = [];

                        News.get().then(function(posts) {
                            $scope.posts = posts;
                        });
                    }
                ],
                link: function(scope, el, attrs) {
                    // twitter widget: TODO switch to API
                    !function(d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0],
                            p = /^http:/.test(d.location) ? 'http' : 'https';
                        if (!d.getElementById(id)) {
                            js = d.createElement(s);
                            js.id = id;
                            js.src = p + "://platform.twitter.com/widgets.js";
                            fjs.parentNode.insertBefore(js, fjs);
                        }
                    }(document, "script", "twitter-wjs");

                    var scroller = el.find('.news-content').jScrollPane().data('jsp');

                    scope.$watch('posts', function() {
                        // give it a millisecond to render...
                        $timeout(function() {
                            $log.log('news scroller init');
                            scroller.reinitialise();
                        });
                    }, true);
                }
            };
        }
    ]);
