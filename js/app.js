define([], function () {

    return Class.extend({
        init: function () {
            this.name = "app";
            this.ready = false;

            this.isStopped = true;
            this.hasNeverStarted = true;
            this.currentTime = 0;
            this.lastTimeStep = this.currentTime;

            this.game = {};
            this.input = {};
            this.renderer = {};
        },

        setObjects: function (Game,Input,Renderer) {
            var self = this;
            self.game = Game;
            self.input = Input;
            self.renderer = Renderer;

            this.ready = true;
        },

        tick: function () {
            var self = this;
            if(self.ready){
                self.currentTime = new Date().getTime();
                self.game.updateState(self.input.readInput());
                self.renderer.render(self.isStopped);

                if (!self.isStopped) {
                    requestAnimFrame(self.tick.bind(self));
                }
                self.lastTimeStep = self.currentTime;
            }
        },

        start: function () {
            if(this.ready){
                this.isStopped = false;
                this.tick();
                this.hasNeverStarted = false;
                console.info("APP: Game loop started.");
            }else{
                console.info("APP: Not .ready, unable to start.");
            }

        },

        stop: function () {
            if(!this.isStopped){
                this.isStopped = true;
                console.log("APP: Game loop paused");
            }
        },





    });
});