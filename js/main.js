FallingBlocksApp = null;
FallingBlocksGame = null;
define(['jquery', 'app', 'lib/socket.io', 'lib/class'], function ($, App, IO, CLASS) {
    var app, game;

    var initApp = function () {
        $(document).ready(function () {

            console.info("Create a new app instance...");
            app = new App();
            FallingBlocksApp = app;


            initGame();
        })
    };


    var initGame = function () {
        require(['game'], function (Game) {
            console.info("Create a new game instance...");
            game = new Game(app);
            FallingBlocksGame = game;
            app.setGame(game);
            app.start();

        });
    };

    initApp();
});


