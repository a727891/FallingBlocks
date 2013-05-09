FallingBlocksApp = null;
define(['jquery', 'lib/class', 'app', 'game', 'input', 'render' ],
    function ($, CLASS, App, Game, Input, Renderer ) {
        var app, game, input, renderer;

        var initApp = function () {
            $(document).ready(function () {

                console.info("Create a new app instance...");
                app = new App();
                FallingBlocksApp = app;
                game = new Game();
                input = new Input(app);
                var canvas = document.getElementById('canvas');
                renderer = new Renderer(game,canvas);
                app.setObjects(game,input,renderer);
                app.start();

            })
        };


        initApp();
    });


