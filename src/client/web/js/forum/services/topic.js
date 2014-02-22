angular.module('IronbaneApp')
    .factory('Topic', ['$log', '$http', 'Post', 'User', '$q',
        function($log, $http, Post, User, $q) {
            var Topic = function(json) {
                angular.copy(json || {}, this);

                if (!this.icon) {
                    // todo: some fallback in the css?
                    if (this.locked) {
                        this.$setIcon("lockedthread");
                    } else if (this.sticky) {
                        this.$setIcon("stickythread");
                    } else if (this.postcount >= 25) {
                        this.$setIcon("hotthread");
                    } else {
                        // Todo: implement read/unread
                        this.$setIcon("unreadthread");
                    }
                } else {
                    this.$setIcon(this.icon);
                }
            };

            Topic.getTopic = function(topicId) {
                $log.log("getting topic " + topicId);
                return $http.get('/api/forum/topics/' + topicId + '/posts')
                    .then(function(response) {
                        var posts = [];
                        angular.forEach(response.data, function(post) {
                            var p = new Post(post);
                            p.user.avatar = post.avatar || User.getDefaultAvatar();
                            posts.push(p);
                        });
                        return posts;
                    }, function(error) {
                        return $q.reject(error);
                    });

            };

            Topic.unsticky = function(topicId) {
                return $http.post('/api/forum/topics/' + topicId + '/unsticky')
                    .then(function(response) {

                    }, function(error) {
                        return $q.reject(error);
                    });
            };

            Topic.sticky = function(topicId) {
                return $http.post('/api/forum/topics/' + topicId + '/sticky')
                    .then(function(response) {

                    }, function(error) {
                        return $q.reject(error);
                    });
            };

            Topic.unlock = function(topicId) {
                return $http.post('/api/forum/topics/' + topicId + '/unlock')
                    .then(function(response) {

                    }, function(error) {
                        return $q.reject(error);
                    });
            };

            Topic.lock = function(topicId) {
                return $http.post('/api/forum/topics/' + topicId + '/lock')
                    .then(function(response) {

                    }, function(error) {
                        return $q.reject(error);
                    });
            };

            Topic.delete = function(topicId) {
                return $http.post('/api/forum/topics/' + topicId + '/delete')
                    .then(function(response) {
                        return response;
                    }, function(error) {
                        return $q.reject(error);
                    });
            };

            Topic.get = function(topicId) {
                return $http.get('/api/forum/topics/' + topicId)
                    .then(function(response) {
                        return response;
                    }, function(error) {
                        return $q.reject(error);
                    });

            };

            Topic.getTopics = function(boardId) {
                $log.log("getting topics for " + boardId);
                return $http.get('/api/forum/' + boardId + '/topics')
                    .then(function(response) {
                        var topics = [];

                        // upgrade objects
                        angular.forEach(response.data, function(topic) {
                            //post.author = new User(post.author);
                            topic.board_id = boardId; // for news section...
                            topics.push(new Topic(topic));
                        });
                        return topics;

                    }, function(error) {
                        return $q.reject(error);
                    });
            };

            Topic.getRecentTopics = function() {
                $log.log("getting recent topics");
                return $http.get('/api/forum/recent/')
                    .then(function(response) {
                        var topics = [];

                        // upgrade objects
                        angular.forEach(response.data, function(topic) {
                            topics.push(new Topic(topic));
                        });

                        return topics;

                    }, function(error) {
                        return $q.reject(error);
                    });

            };

            Topic.prototype.$setIcon = function(icon) {
                this.icon = icon;
                this.iconStyle = {
                    'background-image': 'url(/images/icons/topics/' + icon + '.png)'
                };
            };

            return Topic;

        }
    ]);