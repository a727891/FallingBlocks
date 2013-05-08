// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
define([], function () {

    return Class.extend({
        init: function (Game) {
            this.game = Game;
            this.canvas = document.getElementById('canvas');
            this.context = this.canvas.getContext('2d');

            this.TileHeight = 16;
            this.TileWidth = 16;

            this.WellOffsetLeft = 10;
            this.WellOffsetTop = 10;

        },

        render: function (isStopped) {
            var self = this;
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
            if(isStopped){
                self.context.fillText("Game Paused. Press [SPACE] to resume",50,50);
            }else{
                self.drawWell();
                self.drawActiveBlock();
            }


        },


        drawWell: function () {
            this.context.save();
            for (var j = 0; j <= this.game.WellHeight; j++) {
                for (var i = 0; i <= this.game.WellWidth; i++) {
                    this.drawTile(i * this.TileWidth, j * this.TileHeight, this.game.Well[i][j]);
                }
            }
            this.context.restore();

        },

        drawActiveBlock: function () {
            this.context.save();

            var block = this.game.ActiveBlock;
            if (block.x < 0 || block.x > this.game.WellWidth ||
                block.y < 0 || block.y > this.game.WellHeight) {
                return false;
            } else {
                var matrix = this.game.blocks[block.TypeIndex]['orientations'][block.orientation];
                this.context.fillStyle = this.game.blocks[block.TypeIndex]['color'];
                for (var j = 0; j < matrix.length; j++) {
                    for (var i = 0; i < matrix[j].length; i++) {
                        if (matrix[i][j] > 0)
                            this.drawTile((block.x + i - 2) * this.TileWidth, (block.y + j - 2) * this.TileHeight,block);
                    }
                }
            }
            this.context.restore();
            return true;
        },

        drawTile: function (x, y, Type) {
            this.context.fillRect(
                x + this.WellOffsetLeft,
                y + this.WellOffsetTop,
                this.TileHeight, this.TileHeight);
        },


    });
});

