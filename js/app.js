define(['jquery', 'input', 'render'], function ($, INPUT, RENDERER) {

    return Class.extend({
        init: function () {
            this.name = "app";
            this.ready = false;

            this.isStopped = true;
            this.currentTime = new Date().getTime();
            this.lastTimeStep = this.currentTime;

            console.info("App Created.")
        },

        setGame: function (game) {
            var self = this;
            self.game = game;
            //Creates a new Input class
            self.input = new INPUT(self);
            $(window).keydown(function (event) {
                //Prevent game command input when game is paused
//                if (!self.isStopped)
                    if (self.input.parseInput(event)) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    } else
                        return true;
//                else
//                    return true;
            });
            //Create a new Renderer Object
            self.renderer = new RENDERER(self.game);

            this.ready = true;
        },

        tick: function () {
            var self = this;
            this.currentTime = new Date().getTime();
            var input = self.input.readInput();
            self.game.updateState(input);
            self.renderer.render(self.isStopped);

            if (!self.isStopped) {
//                console.log('request anim frame tick,',this.currentTime);
                requestAnimFrame(self.tick.bind(self));
            }
        },

        start: function () {
            this.isStopped = false;
            this.tick();
            this.hasNeverStarted = false;
            console.info("APP: Game loop started.");
        },

        stop: function () {
            this.isStopped = true;
            console.log("APP: Game loop paused");
//            console.dir(this);
        },

        resume: function () {
            this.isStopped = false;
            this.tick();
            console.log("APP: Game loop resumed.");
        },





    });
});