var Input = Class.extend({

    init: function (APP,SWIPE) {
        this.app = APP;
        this.swipe = SWIPE;
        var self = this;
        this.RotateFlag = false;
        this.LeftFlag = false;
        this.RightFlag = false;
        this.FallFlag = false;
        this.InstaDropFlag = false;


        this.swipe.bindTouchToElement('AppCanvas');

        this.swipe.bindCallback('left',function(){
           self.LeftFlag = true;
        });

        this.swipe.bindCallback('right',function(){
           self.RightFlag = true;
        });

        this.swipe.bindCallback('down',function(){
           self.InstaDropFlag = true;
        });

        this.swipe.bindCallback('tap',function(){
           self.RotateFlag = true;
        });

        this.swipe.bindCallback('up',function(){
            if (self.app.isStopped) {
                self.app.start();
            } else {
                self.app.stop();
            }
        });
    },
    readInput: function () {
        var ret = {
            Rotate: this.RotateFlag,
            Left: this.LeftFlag,
            Right: this.RightFlag,
            Fall: this.FallFlag,
            InstaDrop: this.InstaDropFlag,
        };
        this.resetFlags();
        return ret;
    },
    resetFlags: function () {
        this.RotateFlag = false;
        this.LeftFlag = false;
        this.RightFlag = false;
        this.FallFlag = false;
        this.InstaDropFlag = false;
    },
});