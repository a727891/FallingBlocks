(function () {
    var app, game, input, renderer,swipe;
    var canvas = document.createElement('canvas');
    canvas.id = 'AppCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);


    var initApp = function () {

        //TODO: Create an intro animation, maybe an end game animation
        app = new App();
        game = new Game();
        swipe = new Swipe();
        input = new Input(app,swipe);
        renderer = new Renderer(game, canvas);
        app.setObjects(game, input, renderer);
        renderer.render(true);


    };