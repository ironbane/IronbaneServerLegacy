// chat.js

IronbaneApp
.directive('chatWindow', ['$log', '$window', function($log, $window) {
    return {
        restrict: 'E',
        template: [
            '<div>',
                '<div class="tabs">',
                    '<button ng-class="{active: msgFilterCategory === \'all\'}" ng-click="setFilter(\'all\')">All</button>',
                    '<button ng-class="{active: msgFilterCategory === \'system\'}" ng-click="setFilter(\'system\')">System</button>',
                    '<button ng-class="{active: msgFilterCategory === \'global\'}" ng-click="setFilter(\'global\')">Global</button>',
                    '<button ng-class="{active: msgFilterCategory === \'whisper\'}" ng-click="setFilter(\'whisper\')">Whisper</button>',
                '</div>',
                '<div class="content">',
                    '<ul class="messages">',
                        '<li ng-repeat="msg in messages | filter:filterMsgs | limitTo:-50">',
                            '<chat-message type="{{ msg.type }}" data="msg"></chat-message>',
                        '</li>',
                    '</ul>',
                '</div>',
                '<input chat-input type="text" name="chatInput" id="chatInput" class="iinput">',
            '</div>'
        ].join(''),
        link: function(scope, el, attrs) {
            scope.messages = [];

            var width = Math.floor($(window).width() * 0.4);
            el.css({
                width: width + 'px',
                left: ($(window).width() - width - 8) + 'px',
                top: '8px'
            });

            var scroller = el.find('.content').jScrollPane({
                animateScroll: true,
                contentWidth: 400
            }).data('jsp');

            // hook into external (non-angular) sources
            el.on('onMessage', function(e, data) {
                //$log.log('chat onMessage', e, data);

                scope.$apply(function() {
                    scope.messages.push(data);
                });

                scroller.reinitialise();
                scroller.scrollToBottom();
            });

            el.on('show', function() {
                scope.$apply(function() {
                    scope.showMe = true;
                });
            });

            el.on('hide', function() {
                scope.$apply(function() {
                    scope.showMe = false;
                });
            });

            scope.msgFilterCategory = 'all';
            // sets msg filtering to pre-defined categories (for now)
            scope.setFilter = function(category) {
                scope.msgFilterCategory = category; // just for button highlights
                if(category === 'system') {
                    scope.msgFilter = ['announce', 'welcome', 'join', 'died', 'diedspecial', 'leave'];
                } else if (category === 'global') {
                    scope.msgFilter = ['say']; // what else is "global"?
                } else if (category === 'whisper') {
                    scope.msgFilter = 'say:' + $window.socketHandler.playerData.name; // super hack!!!!
                } else {
                    scope.msgFilter = 'all';
                }
            };

            scope.filterMsgs = function(msg) {
                if(scope.msgFilter === 'all' || !scope.msgFilter) {
                    return true;
                } else if(angular.isString(scope.msgFilter)) {
                    return msg.type === scope.msgFilter;
                } else {
                    return _.contains(scope.msgFilter, msg.type);
                }
            };
        }
    };
}])
.directive('chatMessage', ['$log', '$compile', 'DEATH_MESSAGES', function($log, $compile, DEATH_MESSAGES) {
    // logic for all of the different types of messages that are supported
    var templates = {
        welcome: '<div style="color:#46fc52;"><span>Hey there, {{ data.user.name }}</span><br>Players online: <span ng-repeat="user in data.online" class="name {{user.rank}}" ng-class="{delim: !$last}">{{ user.name }}</span><br>Use /help for all keys and commands.</div>',
        join: '<div><span class="name {{ data.user.rank }}">{{ data.user.name }}</span> has joined the game!</div>',
        died: '<div><span class="name {{ data.victim.rank }}">{{ data.victim.name }}</span> was {{ deathMessage }} by <span class="name {{ data.killer.rank }}">{{ data.killer.name }}.</span>',
        diedspecial: '<div><span class="name {{ data.victim.rank }}">{{ data.victim.name }}</span> was {{ deathMessage }} by {{ data.cause }}.',
        leave: '<div><span class="name {{ data.user.rank }}">{{ data.user.name }}</span> has left the game.</div>',
        say: '<div><span class="name {{ data.user.rank }}"><{{ data.user.name }}></span> <span ng-bind-html="data.message | mouthwash"></span></div>',
        "say:targetted": '<div><span class="target">[{{ data.target }}]</span> <span class="name {{ data.user.rank }}"><{{ data.user.name }}></span> <span ng-bind-html="data.message | mouthwash"></span></div>',
        "announce": '<div class="message announce {{ data.target }}" ng-style="{color: data.message.color}" ng-bind-html="data.message.text | mouthwash"></div>',
        "default": '<div class="message">{{ data.message | mouthwash }}</div>'
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

            // rooms & PM
            if(scope.data.type && scope.data.type.search('say:') >= 0) {
                scope.type = 'say:targetted';
                scope.data.target = scope.data.type.split(':')[1];
            }

            // announcements all go to the same one
            if(scope.data.type && scope.data.type.search('announce') >= 0) {
                scope.type = 'announce';
                scope.data.target = scope.data.type.split(':')[1];
            }

            el.html(getTemplate(scope.type));

            $compile(el.contents())(scope);
        }
    };
}])
.directive('chatInput', ['$log', '$window', function($log, $window) {
    return {
        link: function(scope, el, attrs) {
            var lastUsedChat = [];
            var lastUsedChatCounter = 0;
            var lastUsedChatSelectCounter = 0;

            el.on('focus', function(e) {
                $(this).val('').addClass('focused');
                $window.hasChatFocus = true;
            });

            el.on('blur', function(e) {
                $(this).val('').removeClass('focused');
                $window.hasChatFocus = false;
            });

            el.on('keydown', function(e) {
                if (!socketHandler.inGame) {
                    return;
                }

                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 45) {
                    if (player.target_unit) {
                        $(this).val($(this).val() + ' ' + player.target_unit.id + ' ');
                    }
                }

                if (code === 38) {
                    if (lastUsedChatSelectCounter > 0) {
                        lastUsedChatSelectCounter--;
                    }
                    $(this).val(lastUsedChat[lastUsedChatSelectCounter]);
                }

                if (code === 40) {
                    if (lastUsedChatSelectCounter < lastUsedChat.length - 1) {
                        lastUsedChatSelectCounter++;
                    }

                    $(this).val(lastUsedChat[lastUsedChatSelectCounter]);
                }
            });

            el.on('keypress', function(e) {
                if ( !$window.socketHandler.inGame ) {
                    return;
                }

                var code = (e.keyCode ? e.keyCode : e.which);
                if (code === 13) {
                    var clientmsg = $(this).val(),
                        finalmsg;

                    // prevent blank messages
                    if(clientmsg.trim() !== '') {
                        lastUsedChat[lastUsedChatCounter++] = clientmsg;
                        lastUsedChatSelectCounter = lastUsedChatCounter;

                        // default chat "command" is /say to the global
                        // supports both / & @ as commands
                        if(clientmsg[0] === '/' || clientmsg[0] === '@') {
                            // continue as normal!
                            finalmsg = clientmsg;
                        } else {
                            finalmsg = '/say ' + clientmsg;
                        }

                        $window.socketHandler.socket.emit('chatMessage', {
                            message: finalmsg
                        });
                    }

                    $(this).blur();
                }
            });
        }
    };
}])
.constant('DEATH_MESSAGES', "slaughtered butchered crushed defeated destroyed exterminated finished massacred mutilated slayed vanquished killed".split(" "));
