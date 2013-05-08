define([], function () {

    return Class.extend({

        init: function (APP) {
            this.app = APP;
            this.game = APP.game;
            this.name = "input";
            this.keyboard = {};

            this.keyboard.canInput = true;

            this.keyboard.LEFT = 37;
            this.keyboard.UP = 38;
            this.keyboard.RIGHT = 39;
            this.keyboard.DOWN = 40;
            this.keyboard.W = 87;
            this.keyboard.A = 65;
            this.keyboard.S = 83;
            this.keyboard.D = 68;
            this.keyboard.N = 78;
            this.keyboard.ENTER = 13;
            this.keyboard.ESC = 27;
            this.keyboard.SPACE = 32;

            this.RotateFlag = false;
            this.LeftFlag = false;
            this.RightFlag = false;
            this.FallFlag = false;

        },

        readInput: function () {
            var ret = {
                Rotate: this.RotateFlag,
                Left: this.LeftFlag,
                Right: this.RightFlag,
                Fall: this.FallFlag
            };

            this.RotateFlag = false;
            this.LeftFlag = false;
            this.RightFlag = false;
            this.FallFlag = false;

            return ret;
        },

        parseInput: function (event) {
            var self = this;
//            console.log('User pressed key', event.keyCode, 'app state is ',(this.app.isStopped?'PAUSED':'RUNNING'));
            if (this.app.isStopped) {
                if (event.keyCode == self.keyboard.SPACE){
                    self.app.resume();
                    return true;
                }else{
                    return false
                }
            } else {
                if (event.altKey) return false;
                if (event.ctrlKey) return false;
                if (event.shiftKey) return false;

                switch (event.keyCode) {
                    case self.keyboard.W:
                    case self.keyboard.UP:
                        this.RotateFlag = true;
                        break;
                    case self.keyboard.S:
                    case self.keyboard.DOWN:
                        this.FallFlag = true;
                        break;
                    case self.keyboard.A:
                    case self.keyboard.LEFT:
                        this.LeftFlag = true;
                        break;
                    case self.keyboard.D:
                    case self.keyboard.RIGHT:
                        this.RightFlag = true;
                        break;
                    case self.keyboard.N:
                        self.game.ActiveBlock.TypeIndex = ++self.game.ActiveBlock.TypeIndex % 7;
                        break;
                    case self.keyboard.SPACE:
                        this.FallFlag = true;
                        break;
                    case self.keyboard.ESC:
                        self.app.stop();
                        break;
                }
                return true;

            }
        }

    });

});



