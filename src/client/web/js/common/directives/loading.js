angular.module('IronbaneApp')
    .directive('loading', [
        function() {
            return {
                restrict: "E",
                templateUrl: '/partials/loading.html',
                link: function(scope, el, attrs) {
                    var msgs =[
                        'for real brah',
                        'it\'s gonna take a while',
                        'you think this easy?',
                        'wait till you see the result',
                        'not that interesting really',
                        'just kidding',
                        'what are you gonna do?',
                        'blazing fast',
                        'you got too much time',
                        'can you do it faster?',
                        'I got feelings too',
                        'just this once',
                        'don\'t expect a lot',
                        'because I like you so much'
                    ];
                    scope.msg = msgs[Math.floor(Math.random()*msgs.length)];
                }
            };
        }
    ]);