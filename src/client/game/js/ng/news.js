// news.js

// todo: move templates to external html?
var newsPaneTmpl = [
    '<div>',
        // nav
        '<strong>',
            '<a href="forum.php" target="_new">Forum</a>',
            ' | ',
            '<a href="https://twitter.com/IronbaneMMO" target="_new">Twitter</a>',
            // ' | ',
            // '<a href="forum.php?action=topic&topic=353" target="_new">Credits</a>',
        '</strong>',
        '<section>',
            '<header><h2>News</h2></header>',
            '<div class="news-content">',
                '<div>',
                    '<article ng-repeat="post in posts">',
                        '<header>',
                            '<h4 class="news-post-title"><a ng-href="/forum.php?action=topic&topic={{ post.topic_id }}">{{ post.title }}</a></h4>',
                            '<p class="news-post-time"><time datetime="{{ post.time * 1000 }}">{{ post.time * 1000 | timeSince }}</time></p>',
                        '</header>',
                        '<p ng-bind-html-unsafe="post.content"></p>',
                        '<footer><hr></footer>',
                    '</article>',
                '</div>',
            '</div>',
        '</section>',
    '</div>'
].join('');

IronbaneApp
    .directive('newsPane', ['$log', 'News', '$timeout', function($log, News, $timeout) {
        return {
            restrict: 'E',
            template: newsPaneTmpl,
            replace: true,
            controller: ['$scope', 'News', function($scope, News) {
                $scope.posts = [];

                News.get().then(function(posts) {
                    $scope.posts = posts;
                });
            }],
            link: function(scope, el, attrs) {
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
    }])
    .filter('timeSince', ['$log', function() {
        return function(input) {
            if(!input) {
                return;
            }

            function timeSince(date) {
                var seconds = Math.floor((new Date() - date) / 1000);

                var interval = Math.floor(seconds / 31536000);

                if (interval >= 1) {
                    return interval + " years";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval >= 1) {
                    return interval + " months";
                }
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    return interval + " days";
                }
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    return interval + " hours";
                }
                interval = Math.floor(seconds / 60);
                if (interval >= 1) {
                    return interval + " minutes";
                }
                return Math.floor(seconds) + " seconds";
            }

            var since = 'about ' + timeSince(input) + ' ago';

            return since;
        };
    }])
    .factory('News', ['$http', '$q', '$log', function($http, $q, $log) {
        var getNews = function() {
            return $http.get('/api/forum/news')
                .then(function(response) {
                    return response.data; // for now no processing...
                }, function(err) {
                    $log.warn('error getting news!', err);
                    return [];
                });
        };

        return {
            get: getNews
        };
    }]);