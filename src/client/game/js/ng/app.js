// app.js - interim angular app
var IronbaneApp = angular.module('Ironbane', ['ngSanitize']);

IronbaneApp.directive('chatWindow', ['$log', function($log) {
    return {
        restrict: 'E',
        template: [
            '<div class="content">',
                '<ul class="messages">',
                    '<li ng-repeat="msg in messages | limitTo:-50">',
                        '<chat-message type="{{ msg.type }}" data="msg"></chat-message>',
                    '</li>',
                '</ul>',
            '</div>'
        ].join(''),
        link: function(scope, el, attrs) {
            scope.messages = [];

            var scroller = el.jScrollPane({
                animateScroll: true,
                contentWidth:400
            }).data('jsp');

            // hook into external (non-angular) sources
            el.bind('onMessage', function(e, data) {
                //$log.log('chat onMessage', e, data);

                scope.$apply(function() {
                    scope.messages.push(data);
                });

                scroller.reinitialise();
                scroller.scrollToBottom();
            });
        }
    };
}])
.directive('chatMessage', ['$log', '$compile', 'DEATH_MESSAGES', function($log, $compile, DEATH_MESSAGES) {
    // logic for all of the different types of messages that are supported
    var templates = {
        welcome: '<div style="color:green;"><span>Hey there, {{ data.user.name }}</span><br>Players online: <span ng-repeat="user in data.online" class="name {{user.rank}}" ng-class="{delim: !$last}">{{ user.name }}</span></div>',
        join: '<div><span class="name {{ data.user.rank }}">{{ data.user.name }}</span> has joined the game!</div>',
        died: '<div><span class="name {{ data.victim.rank }}">{{ data.victim.name }}</span> was {{ deathMessage }} by <span class="name {{ data.killer.rank }}">{{ data.killer.name }}.</span>',
        diedspecial: '<div><span class="name {{ data.victim.rank }}">{{ data.victim.name }}</span> was {{ deathMessage }} by {{ data.cause }}.',
        leave: '<div><span class="name {{ data.user.rank }}">{{ data.user.name }}</span> has left the game.</div>',
        say: '<div><span class="name {{ data.user.rank }}"><{{ data.user.name }}></span> <span ng-bind-html="data.message"></span></div>',
        "announce": '<div class="message" ng-style="{color: data.message.color}" ng-bind-html="data.message.text"></div>',
        "announce:personal": '<div class="message" ng-style="{color: data.message.color}" ng-bind-html="data.message.text"></div>',
        "announce:mods": '<div class="message" ng-style="{color: data.message.color}" ng-bind-html="data.message.text"></div>',
        "default": '<div class="message">{{ data.message }}</div>'
    };

    function getTemplate(type) {
        //$log.log('getTemplate', type);
        if(!(type in templates)) {
            type = "default";
        }

        return templates[type];
    }

    return {
        restrict: 'E',
        scope: {
            type: '@',
            data: '='
        },
        template: '<div></div>',
        link: function(scope, el, attrs) {
            var getDeathMsg = function() {
                var random = Math.floor(Math.random() * DEATH_MESSAGES.length);

                return DEATH_MESSAGES[random];
            };

            // if we are a died type message, choose our message
            if(scope.data.type && scope.data.type.search('died') >= 0) {
                scope.deathMessage = getDeathMsg();
            }

            if(scope.data.type && scope.data.type === 'welcome') {
                if(scope.data.online.length === 0) {
                    scope.data.online.push({name: 'None', rank: 'fool'});
                }
            }

            el.html(getTemplate(scope.type));

            $compile(el.contents())(scope);
        }
    };
}])
.constant('DEATH_MESSAGES', "slaughtered butchered crushed defeated destroyed exterminated finished massacred mutilated slayed vanquished killed".split(" "));

// manually bootstrapping for now
angular.bootstrap('#chatBox', ['Ironbane']);
