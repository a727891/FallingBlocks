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

            this.WellOffsetLeft = this.TileWidth;
            this.WellOffsetTop = this.TileHeight;

            this.NextBlockTop = this.TileHeight * 2 + this.WellOffsetTop;
            this.NextBlockLeft = (this.TileWidth * this.game.WellWidth);


            this.ScoreTop = this.NextBlockTop + (this.TileHeight * 5) + 20;
            this.ScoreLeft = this.NextBlockLeft + this.WellOffsetLeft + this.TileWidth;

            this.Debug_Collision = false;
            this.Debug_Collision_Color = "pink";

        },

        render: function (isStopped) {
            var self = this, msg , msg2;

            if (self.game.State != self.game.gameOver) {
                self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                if (isStopped) {
                    self.drawWell(1);
                    msg = "Game Paused.";
                    msg2 = "Press [SPACE] to begin";
                    self.printMessage(msg, msg2);
                    self.drawScore(self.game.points, self.game.level, self.game.linesCleared, self.game.linesUntilNextLevel);
                } else {
                    self.drawWell();
                    if (self.game.State == self.game.running)
                        self.drawBlock(self.game.ActiveBlock, true);
                    self.drawBlock(self.game.NextBlock, false);
                    self.drawScore(self.game.points, self.game.level, self.game.linesCleared, self.game.linesUntilNextLevel);
                }
            } else {
                msg = "Game Over.";
                msg2 = "Press [SPACE] to play again";
                self.printMessage(msg, msg2);

            }


        },

        printMessage: function (msg, msg2) {
            var self = this, msgLen , msgLen2 , midWell , crossWell , centerMsg , centerMsg2;
            msg = msg || '';
            msg2 = msg2 || '';
            msgLen = self.context.measureText(msg).width;
            msgLen2 = self.context.measureText(msg2).width;
            midWell = (self.TileHeight * (self.game.WellHeight) / 2) + this.WellOffsetTop;
            crossWell = self.TileWidth * self.game.WellWidth;
            centerMsg = Math.floor((crossWell - msgLen) / 2);
            centerMsg2 = Math.floor((crossWell - msgLen2) / 2);
            self.context.fillStyle = "blue";
            self.context.fillRect(this.WellOffsetLeft, midWell - 25, crossWell, 40);
            self.context.fillStyle = "yellow";
            self.context.fillText(msg, centerMsg + this.WellOffsetLeft, midWell - 10);
            self.context.fillText(msg2, centerMsg2 + this.WellOffsetLeft, midWell + 10);
        },

        drawWell: function (ignoreRealWell) {
            ignoreRealWell = ignoreRealWell || 0;
            //Hide the top 2 rows
            for (var j = 2; j < this.game.WellHeight; j++) {
                for (var i = 0; i < this.game.WellWidth; i++) {
                    this.drawTile(
                        i * this.TileWidth,
                        j * this.TileHeight,
                        (this.game.Well[j][i] && !ignoreRealWell ? this.game.Well[j][i] : 'black'));
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
                        this.drawTile(x, y, color);
                    else if (this.Debug_Collision) {
                        this.drawTile(x, y, this.Debug_Collision_Color);
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
            if (CellColor) {
                this.context.fillStyle = CellColor;
            }
            this.context.fillRect(
                x + this.WellOffsetLeft + this.CellSpacing,
                y + this.WellOffsetTop + this.CellSpacing,
                this.TileWidth - this.CellSpacing, this.TileHeight - this.CellSpacing);
            this.context.restore();

        },

        drawScore: function (points, level, linesCleared, linesUntilNext) {
            this.context.save();
            this.context.fillStyle = 'white';
            this.context.fillText("Points:" + points, this.ScoreLeft, this.ScoreTop);
            this.context.fillText("Lines cleared:" + linesCleared, this.ScoreLeft, this.ScoreTop + 10);
            this.context.fillText("Level:" + level, this.ScoreLeft, this.ScoreTop + 20);
            this.context.fillText("Lines to next:" + linesUntilNext, this.ScoreLeft, this.ScoreTop + 30);

            this.context.restore();
        },

    });
});

