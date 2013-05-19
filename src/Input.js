var Input = Class.extend({

    init: function (APP) {
        this.app = APP;
        var self = this;
        this.RotateFlag = false;
        this.LeftFlag = false;
        this.RightFlag = false;
        this.FallFlag = false;
        this.InstaDropFlag = false;

        var el = document.getElementsByTagName("canvas")[0];
        var swipe = new Swipe();
        swipe.bindTouchToElement('AppCanvas');
        swipe.bindCallback('left',function(){
           self.LeftFlag = true;
        });
        swipe.bindCallback('right',function(){
           self.RightFlag = true;
        });
        swipe.bindCallback('down',function(){
           self.InstaDropFlag = true;
        });
        swipe.bindCallback('tap',function(){
           self.RotateFlag = true;
        });
        swipe.bindCallback('up',function(){
            if (self.app.isStopped) {
                self.app.start();
            } else {
                self.app.stop();
            }
        });
//        this.attachImages();

    },
    attachImages: function () {
        var images = [
                {pic: 'DownHard.png', flag: 'InstaDrop'},
                {pic: 'Left.png', flag: 'Left'},
                {pic: 'Rotate.png', flag: 'Rotate'},
                {pic: 'Right.png', flag: 'Right'},
                {pic: 'Down.png', flag: 'Fall'},
                {pic: 'PP.png', flag: 'Pause'}
            ], newImg, self = this,
            canvas = document.getElementsByTagName("canvas")[0],
            Canvas20H = canvas.height * .2,
            Canvas20W = Math.floor(canvas.width / images.length),
            imgsize = Math.min(Canvas20H, Canvas20W);
        for (var i = 0; i < images.length; i++) {
            newImg = document.createElement('img');
            newImg.src = images[i].pic;
            newImg.id = images[i].flag;
            newImg.style.position = 'absolute';
            newImg.style.left = (imgsize * i);
            newImg.style.top = canvas.height - imgsize;
            newImg.style.width = imgsize;

            newImg.addEventListener('touchstart', this.touchHandler.bind(this));
            document.body.appendChild(newImg);
        }
    },
    touchHandler: function (event) {
        var id = event.target.id;
        switch (id) {
            case 'Left':
                this.LeftFlag = true;
                break;
            case 'Right':
                this.RightFlag = true;
                break;
            case 'Rotate':
                this.RotateFlag = true;
                break;
            case 'Fall':
                this.FallFlag = true;
                break;
            case 'InstaDrop':
                this.InstaDropFlag = true;
                break;
            case 'Pause':
                if (this.app.isStopped) {
                    this.app.start();
                } else {
                    this.app.stop();
                }
                break;
        }
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