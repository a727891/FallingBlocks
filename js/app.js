define([], function () {

    return Class.extend({
        init: function () {
            this.name = "app";
            this.ready = false;

            this.isStopped = true;
            this.hasNeverStarted = true;
//            this.currentTime = 0;
//            this.lastTimeStep = this.currentTime;

            this.game = {};
            this.input = {};
            this.renderer = {};
        },

        setObjects: function (Game, Input, Renderer) {
            var self = this;
            self.game = Game;
            self.input = Input;
            self.renderer = Renderer;

            this.ready = true;
        },

        tick: function () {
            var self = this;
            if (self.ready) {
                self.game.updateState(self.input.readInput());
                self.renderer.render(self.isStopped);

                if(self.game.State == self.game.gameOver){
                    self.isStopped = true;
                }

                if (!self.isStopped) {
                    requestAnimFrame(self.tick.bind(self));
                }
            }
        },

        start: function () {
            if (this.ready) {
                if (this.game.State == this.game.gameOver) {
                    this.game.newGame();
                }
                this.isStopped = false;
                this.tick();
                this.hasNeverStarted = false;
//                console.info("APP: Game loop started.");
            } else {
                console.info("APP: Not .ready, unable to start.");
            }

        },

        stop: function () {
            if (!this.isStopped) {
                this.isStopped = true;
//                console.log("APP: Game loop paused");
            }
        },


    });
});