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
        init: function (Game, CanvasObj) {
            this.game = Game;
            this.canvas = CanvasObj;
            this.context = this.canvas.getContext('2d');

            this.TileHeight = 16;
            this.TileWidth = 16;

            this.CellSpacing = 1;

            this.WellOffsetLeft = 0;
            this.WellOffsetTop = -32;

            this.NextBlockTop = this.TileHeight * 2;
            this.NextBlockLeft = (this.TileWidth * (this.game.WellWidth + 2))

            this.Debug_Collision = false;
            this.Debug_Collision_Color = "pink";

        },

        render: function (isStopped) {
            var self = this;
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
//            if(isStopped){
//                self.context.fillText("Game Paused. Press [SPACE] to resume",50,50);
//            }else{
            self.drawWell();
            self.drawBlock(self.game.ActiveBlock,true);
            self.drawBlock(self.game.NextBlock,false);
//            }


        },

        drawWell: function () {
            for (var j = 2; j < this.game.WellHeight; j++) {
                for (var i = 0; i < this.game.WellWidth; i++) {
                    this.drawTile(
                        i * this.TileWidth,
                        j * this.TileHeight,
                        (this.game.Well[j][i]?'grey':'black'));
                }
            }

        },

        drawBlock: function (block, isActive) {
            var matrix = this.game.blocks[block.TypeIndex]['orientations'][block.orientation],
                color = this.game.blocks[block.TypeIndex]['color'],
                y = 0,
                x = 0;
            for (var j = 0; j < matrix.length; j++) {
                y = ((block.y + j ) * this.TileHeight) + (!isActive ? this.NextBlockTop : 0);
                for (var i = 0; i < matrix[j].length; i++) {
                    x = ((block.x + i ) * this.TileWidth) + (!isActive ? this.NextBlockLeft : 0);
                    if (matrix[i][j] > 0)
                        this.drawTile( x,y,color);
                    else if(this.Debug_Collision){
                        this.drawTile( x,y,this.Debug_Collision_Color);
                    }
                }
            }
        },

        /**
         *
         * @param x Canvas X pixel
         * @param y Canvas Y pixel
         * @param CellColor Game.Well status
         */
        drawTile: function (x, y, CellColor) {
            this.context.save();
            if(CellColor){
                this.context.fillStyle = CellColor;
            }
            this.context.fillRect(
                x + this.WellOffsetLeft + this.CellSpacing,
                y + this.WellOffsetTop + this.CellSpacing,
                this.TileWidth - this.CellSpacing, this.TileHeight - this.CellSpacing);
            this.context.restore();

        },


    });
});

