
IronbaneApp
    .factory('Game', ['$log', '$window', '$http', '$timeout', function($log, $window, $http, $timeout) { // using $window to reveal the globals
        // make this private so that it can't be called directly
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
            this.unitList = [];
            this.showingGame = false;

            this.loadingMessages = _.shuffle([
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
            ]);

            this.currentLoadingMessage = "Initializing";
            this.currentLoadingTickTimer = 0.0;
            this.currentLoadingStepCount = 0;

            // Used for dynamically added objects
            this.waypointOffset = -1000000;
        };

        Game.prototype.start = function() {
            var game = this;

            if (!$window.Detector.webgl) {
                $window.hudHandler.ResizeFrame();
                return;
            }

            var bgcolor = $window.ColorEnum.LIGHTBLUE;
            this.scene = new $window.THREE.Scene();
            this.octree = new $window.THREE.Octree();
            this.camera = new $window.THREE.PerspectiveCamera(75, $window.innerWidth / $window.innerHeight, 0.1, 100000);

            this.camera.position.x = 0;
            this.camera.position.y = 3;
            this.camera.position.z = 0;

            this.scene.add(this.camera);

            if ($window.isEditor) {
                this.scene.add(new $window.THREE.AxisHelper(5));
            }
            this.projector = new $window.THREE.Projector();

            this.renderer = new $window.THREE.WebGLRenderer({
                antialias: false,
                clearColor: bgcolor,
                clearAlpha: 1,
                maxLights: 20
            });
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapAutoUpdate = true;
            this.renderer.shadowMapSoft = false;
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
                    $window.hudHandler.MakeCharSelectionScreen();
                    $window.terrainHandler.Tick(0.1);

                    game.isRunning = true;
                    game.startTime = window.performance.now(); // shimmed!
                    game._lastFrameTime = game.startTime;

                    loop(game);
                });
        };

        Game.prototype.render = function() {
            this.renderer.render(this.scene, this.camera);
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
                if (!game.player) {
                    if ($window.terrainHandler.status === $window.terrainHandlerStatusEnum.LOADED &&
                        !$window.terrainHandler.IsLoadingCells()) {

                        game.player = new $window.Player($window.socketHandler.spawnLocation, new $window.THREE.Vector3(0, $window.socketHandler.spawnRotation, 0), $window.socketHandler.playerData.id, $window.socketHandler.playerData.name);
                        game.unitList.push(game.player);
                    }
                }
            }

            $window.particleHandler.Tick(dTime);

            for (var x = 0; x < game.unitList.length; x++) {
                game.unitList[x].Tick(dTime);
            }

            $window.cinema.Tick(dTime);

            $window.sw("THREE.Object3DLibrary.length", $window.THREE.Object3DLibrary.length);
            $window.sw("THREE.GeometryLibrary.length", $window.THREE.GeometryLibrary.length);
            $window.sw("THREE.MaterialLibrary.length", $window.THREE.MaterialLibrary.length);
            $window.sw("THREE.TextureLibrary.length", $window.THREE.TextureLibrary.length);



            // Keep track of what's going with the loading of the game
            var doneLoading = true;

            if ( !$window.isProduction ) game.currentLoadingMessage = "All set";

            if ( $window.terrainHandler.status !== $window.terrainHandlerStatusEnum.LOADED ) {
                doneLoading = false;
                if ( !$window.isProduction ) game.currentLoadingMessage = "Loading Terrain";
            }
            else if ( $window.terrainHandler.IsLoadingCells() ) {
                doneLoading = false;
                if ( !$window.isProduction ) game.currentLoadingMessage = "Loading Cells";
            }
            else if ( !$window.soundHandler.loadedMainMenuMusic ) {
                doneLoading = false;
                if ( !$window.isProduction ) game.currentLoadingMessage = "Loading Music";
            }

            if ( !game.showingGame && doneLoading ) {
                if (!$window.socketHandler.inGame) {
                    $window.hudHandler.MakeSoundButton();
                }

                game.showingGame = true;

                $timeout(function() {
                    $('#gameFrame').animate({
                        opacity: 1.00
                    }, 1000, function() {
                        $("#gameFrame").css('opacity', '');
                        $("#loadingBar").hide();
                    });
                }, 500);
            }

            if ( !doneLoading ) {
                game.currentLoadingTickTimer -= dTime;

                if ( game.currentLoadingTickTimer <= 0.0 ) {



                        // Change the message on production
                        if ( $window.isProduction ) {
                            game.currentLoadingTickTimer = getRandomFloat(0.5, 3.0);
                            game.currentLoadingMessage = ChooseSequenced(game.loadingMessages);
                        }
                        else {
                            game.currentLoadingTickTimer = 0.5;
                        }



                    //for (var i = 0; i < game.currentLoadingStepCount; i++) {
                        //game.currentLoadingMessage += ".";
                    //}

                    $("#loadingBarMessage").text(game.currentLoadingMessage);
                }
            }

            $window.relativeMouse = $window.mouse.clone().subSelf($window.lastMouse);
            $window.lastMouse = $window.mouse.clone();
            $window.sw("relativeMouse", $window.ConvertVector3($window.relativeMouse));
        };

        return Game;
    }]);