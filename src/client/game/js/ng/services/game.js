
IronbaneApp
    .factory('Game', ['$log', '$window', '$http', '$timeout', '$filter', 'TimerService', '$state',
        function($log, $window, $http, $timeout, $filter, TimerService, $state) { // using $window to reveal the globals        // make this private so that it can't be called directly

        var loop = function(game) {
            if(!game.isRunning) {
                return;
            }

            var currTime = window.performance.now();
            var delta = (currTime - game._lastFrameTime) / 1000;
            var frameTime = Math.min(delta, game._maxFrameTime);

            requestAnimationFrame(function() { loop(game); });

            game.tick(frameTime);
            game.render(frameTime);

            game._elapsedTime += delta;
            game._lastFrameTime = currTime;

            $window.TWEEN.update();
        };

        var Game = function() {
            // cheap hack to get mouthwash on the chat bubble
            this.mouthwash = $filter('mouthwash');

            // adjustable framerate
            this._lastFrameTime = 0;
            this._maxFrameTime = 0.1;
            this._elapsedTime = 0;

            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.stats = null;
            this.projector = null;
            this.player = null;
            this.newLevelEditor = null;
            this.unitList = [];
            this.showingGame = false;

            // Used for dynamically added objects
            this.waypointOffset = -1000000;
        };

        Game.prototype.start = function() {
            var game = this;

            if (!$window.Detector.webgl) {
                $window.hudHandler.ResizeFrame();
                return;
            }

            this.scene = new $window.THREE.Scene();
            this.octree = new $window.THREE.Octree();
            this.camera = new $window.THREE.PerspectiveCamera(75, $window.innerWidth / $window.innerHeight, 0.1, 100000);

            this.camera.position.x = 0;
            this.camera.position.y = 3;
            this.camera.position.z = 0;

            this.scene.add(this.camera);

            var container = null;
            var info = null;

            this.projector = new $window.THREE.Projector();

            this.renderer = new $window.THREE.WebGLRenderer({
                antialias: false
            });
            this.renderer.shadowMapType = THREE.BasicShadowMap;
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapAutoUpdate = true;
            this.renderer.shadowMapSoft = false;

            this.shadowLight = new THREE.DirectionalLight( 0xffffff, 1);
            this.shadowLight.onlyShadow = true;
            this.shadowLight.shadowMapWidth = 2048;
            this.shadowLight.shadowMapHeight = 2048;
            this.shadowLight.shadowCameraNear   = 5.1;
            this.shadowLight.castShadow   = true;
            this.shadowLight.shadowDarkness   = 0.3;
            ironbane.scene.add( this.shadowLight );

            // this.renderer.sortObjects = false;
            this.renderer.setSize($window.innerWidth, $window.innerHeight);



            $('#gameFrame').append(this.renderer.domElement);

            if (isEditor) {
                this.stats = new Stats();
                this.stats.domElement.style.position = 'absolute';
                $('#gameFrame').append(this.stats.domElement);
            }

            $window.hudHandler.ResizeFrame();

            var charUrl = '';
            if ($window.startdata.user === 0) {
                charUrl = '/api/guest/characters';
            } else {
                charUrl = '/api/user/' + $window.startdata.user + '/characters';
            }

            // todo: character service
            $http.get(charUrl)
                .then(function(response) {
                    $window.chars = response.data;
                    $window.charCount = $window.chars.length;
                }, function(response) {
                    // what to do here?
                    $window.chars = [];
                    $window.charCount = 0;

                    $log.error('error loading character data! ', response);
                })
                .then(function() {

                    $window.startdata.characterUsed = $window.hudHandler.GetLastCharacterPlayed();

                    $window.hudHandler.MakeCharSelectionScreen();
                    $window.terrainHandler.Tick(0.1);

                    game.isRunning = true;
                    game.startTime = window.performance.now(); // shimmed!
                    game._lastFrameTime = game.startTime;

                    loop(game);
                });

            this.renderer.setClearColor($window.ColorEnum.LIGHTBLUE, 1);
        };

        Game.prototype.render = function() {

            this.renderer.clear();

            this.renderer.render(this.scene, this.camera);

            if ( this.newLevelEditor ) {
                this.renderer.render(this.newLevelEditor.sceneHelpers, this.camera);
            }


            $window.debug.Clear();
        };

        Game.prototype.tick = function(dTime) {
            var game = this;

            // if ( showEditor  ) {
            $window.debug.Tick(dTime);
            // }

            if (game.stats) {
                game.stats.update();
            }

            if ($window.showEditor) {
                $window.levelEditor.Tick(dTime);
            }

            $window.hudHandler.Tick(dTime);

            if (!$window.socketHandler.loggedIn && !$window.cinema.IsPlaying()) {
                game.camera.position.x = $window.previewLocation.x + (Math.cos(new Date().getTime() / 20000) * $window.previewDistance) - 0;
                game.camera.position.y = $window.previewLocation.y + $window.previewHeight;
                game.camera.position.z = $window.previewLocation.z + (Math.sin(new Date().getTime() / 20000) * $window.previewDistance) - 0;
                game.camera.lookAt($window.previewLocation);
            }

            $window.terrainHandler.Tick(dTime);

            if ($window.socketHandler.loggedIn) {
                // Add the player once we have terrain we can walk on

                if ($window.terrainHandler.status === $window.terrainHandlerStatusEnum.LOADED &&
                    !$window.terrainHandler.IsLoadingCells()) {
                    if (!game.player) {
                        game.player = new $window.Player($window.socketHandler.spawnLocation, new $window.THREE.Euler(0, $window.socketHandler.spawnRotation, 0), $window.socketHandler.playerData.id, $window.socketHandler.playerData.name);
                    }
                }
            }

            $window.particleHandler.Tick(dTime);

            for (var x = 0; x < game.unitList.length; x++) {
                game.unitList[x].Tick(dTime);
            }

            if ( game.player ) {
                if ( le("globalEnable") && game.newLevelEditor ) {
                    game.newLevelEditor.Tick(dTime);
                }
                else {
                    game.player.Tick(dTime);
                }
            }

            $window.cinema.Tick(dTime);

            $window.sw("THREE.Object3DIdCount", $window.THREE.Object3DIdCount);
            $window.sw("THREE.GeometryIdCount", $window.THREE.GeometryIdCount);
            $window.sw("THREE.MaterialIdCount", $window.THREE.MaterialIdCount);
            $window.sw("THREE.TextureIdCount", $window.THREE.TextureIdCount);



            // Keep track of what's going with the loading of the game
            var doneLoading = true;

            // at some point this should prolly be async / "real"
            if ($window.terrainHandler.status !== $window.terrainHandlerStatusEnum.LOADED) {
                doneLoading = false;
                if (!$window.isProduction) {
                    $state.go('loading.terrain');
                }
            } else if ($window.terrainHandler.IsLoadingCells()) {
                doneLoading = false;
                if (!$window.isProduction) {
                    $state.go('loading.cells');
                }
            } else if (!$window.soundHandler.loadedMainMenuMusic) {
                doneLoading = false;
                if (!$window.isProduction) {
                    $state.go('loading.music');
                }
            }

            if (!game.showingGame && doneLoading) {
                game.showingGame = true;

                $state.go('loading.area');

                $timeout(function() {
                    $('#gameFrame').animate({
                        opacity: 1.00
                    }, 1000, function() {
                        $("#gameFrame").css('opacity', '');
                    });
                    $state.go('mainMenu');
                }, 500);
            }

            $window.relativeMouse = $window.mouse.clone().sub($window.lastMouse);
            $window.lastMouse = $window.mouse.clone();
        };

        return Game;
    }]);