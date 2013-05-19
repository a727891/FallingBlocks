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
/*** BEGIN CLASS.JS ***/
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
var initializing = false, fnTest = /xyz/.test(function () {
    xyz;
}) ? /\b_super\b/ : /.*/;
// The base Class implementation (does nothing)
Class = function () {
};
// Create a new Class that inherits from this class
Class.extend = function (prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function (name, fn) {
                return function () {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    // The dummy class constructor
    Class = function () {
        // All construction is actually done in the init method
        if (!initializing && this.init)
            this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
};
if (!(typeof exports === 'undefined')) {
    exports.Class = Class;
}
/*** END CLASS.JS ***/
/*** Function bind shim ***/
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
/*** End Function bind shim ***/
(function () {
    var app, game, input, renderer;
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    var initApp = function () {

        //TODO: Create an intro animation, maybe an end game animation
        app = new App();
        game = new Game();
        input = new Input(app);

        renderer = new Renderer(game, canvas);
        app.setObjects(game, input, renderer);
        renderer.render(true);


    };
    var App = Class.extend({
        init: function () {
            this.name = "app";
            this.ready = false;

            this.isStopped = true;
            this.hasNeverStarted = true;
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

                if (self.game.State == self.game.gameOver) {
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
    var Game = Class.extend({
        init: function () {
            this.hasNeverStarted = 1;
            this.running = 2;
            this.deletingRow = 4;
            this.gameOver = 8;
            this.State = this.hasNeverStarted;

            this.deleteRow = [];
            this.deleteRowCnt = 0;
            this.WellIgnoredRows = 3;
            this.WellWidth = 10;
            this.WellHeight = 20 + this.WellIgnoredRows; //Top two rows will not be rendered

            this.Well = [];
            this.FramesSinceLastAction = 0;
            this.DropBlockFramesToWait = 60;
            this.DeleteRowFramesPerCell = 5;

            /**
             * Contains block definition
             * Note: I did the mirror over y=-x bug with the arrays again
             * color: render color
             * orientation[0-3]: collision detection of pieces
             * @type {Array}
             */
            this.blocks = [
                //Square (o) yellow
                {color: '#fdfd01', orientations: [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Tee (t) purple
                {color: '#A901FD', orientations: [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 1, 2, 1, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 1, 2, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 1, 2, 1, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Line (i) teal
                {color: '#00fdfd', orientations: [
                    [
                        [0, 0, 1, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 1, 2, 1, 1],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 1, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [1, 1, 2, 1, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Zr (z) red
                {color: '#fd0101', orientations: [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 1, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 1, 2, 0, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 1, 2, 0, 0],
                        [0, 1, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 1, 1, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Zl (s) green
                {color: '#00fd01', orientations: [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 1, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0],
                        [0, 1, 2, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 1, 0],
                        [0, 1, 2, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Lr (l) orange
                {color: '#fda401', orientations: [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 0, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 1, 2, 1, 0],
                        [0, 1, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 1, 1, 0, 0],
                        [0, 0, 2, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 1, 0],
                        [0, 1, 2, 1, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Ll (j) blue
                {color: '#0001fd', orientations: [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 2, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 1, 2, 1, 0],
                        [0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 0, 0],
                        [0, 1, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0],
                        [0, 1, 2, 1, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]}
            ];
            this.blockCount = this.blocks.length;
            this.orientationCount = 4;

            this.newGame();

        },

        newGame: function () {

            this.blockHistory = [3, 4, 3, 4];//Disallow s and z blocks on the first piece
            this.ActiveBlock = this.newBlock();
            this.shadowBlock = {};//this.ActiveBlock;
            this.shadowBlock.TypeIndex = this.ActiveBlock.TypeIndex;
            this.needToCalcShadowBlock = true;
            this.NextBlock = this.newBlock();

            this.initWell();

            this.State = this.running;

            this.DropFramesPerLevel = [60, 50, 40, 35, 30, 30, 30, 25, 25, 20, 10];
            this.pointsPerLine = [0, 100, 200, 300, 400];
            this.linesPerLevel = [5, 10, 20, 35, 55, 80, 110, 145, 180, 220, 500];
            this.pointsPerLevelMultiplier = 2;
            this.level = 0;
            this.linesCleared = 0;
            this.linesUntilNextLevel = this.linesPerLevel[this.level] - this.linesCleared;
            this.points = 0;

            this.DropBlockFramesToWait = this.DropFramesPerLevel[this.level];

        },

        initWell: function () {
            var emptyRow = [];
            for (var i = 0; i < this.WellWidth; i++) {
                emptyRow.push(0);
            }
            this.Well = [];
            for (var j = 0; j < this.WellHeight; j++) {
                this.Well[j] = emptyRow.slice(0);
            }
        },

        updateState: function (input) {
            this.FramesSinceLastAction++;

            switch (this.State) {
                case this.running:
                    //Add a drop to the transformation to apply gravity
                    if (this.FramesSinceLastAction >= this.DropBlockFramesToWait) {
                        input.Fall = true;
                        this.FramesSinceLastAction = 0;
                    }
                    if (!this.performBlockOperations(this.ActiveBlock, input)) {
                        //Block cannot fall any farther
                        if (this.lockBlock(this.ActiveBlock)) {
                            //Block is added to field, attempt to score any complete rows
                            if (this.checkCompleteRows(this.ActiveBlock)) {
                                this.deleteRowCnt = 0;
                                this.State = this.deletingRow;
                            } else {
                                //No state transition, give user the next block
                                this.ActiveBlock = this.NextBlock;
                                this.NextBlock = this.newBlock();
                                this.shadowBlock.TypeIndex = this.ActiveBlock.TypeIndex;
                                this.needToCalcShadowBlock = true;
                            }
                        } else {
                            //Block exceeds the game field, game over
                            this.State = this.gameOver;
                        }
                    } else {

                        if (this.needToCalcShadowBlock) {
                            this.shadowBlock.orientation = this.ActiveBlock.orientation;
                            this.shadowBlock.x = this.ActiveBlock.x;
                            this.shadowBlock.y = this.ActiveBlock.y;
                            this.calculateShadowBlock(this.shadowBlock);
                        }
                    }
                    break;
                case this.deletingRow:
                    if (this.FramesSinceLastAction >= this.DeleteRowFramesPerCell) {
                        navigator.vibrate(15 * this.DeleteRowFramesPerCell);
                        //Still deleting the scored rows
                        var i, j;
                        if (this.deleteRowCnt < this.WellWidth) {
                            for (i = 0, j = this.deleteRow.length; i < j; i++) {
                                if (this.Well[this.deleteRow[i]]) {
                                    if (i % 2) {
                                        this.Well[this.deleteRow[i]][this.deleteRowCnt] = 0;
                                    } else {
                                        this.Well[this.deleteRow[i]][this.WellWidth - this.deleteRowCnt] = 0;
                                    }
                                }
                            }
                        } else {
                            //Time to transition back to running
                            //Pop the deleted rows lowering well contents above
                            var RowCount = 0;
                            while (this.deleteRow.length > 0) {
                                this.popDeletedRow(this.deleteRow.pop());
                                RowCount++;
                            }
                            this.UpdateScore(RowCount);
                            //Give user the next block
                            this.ActiveBlock = this.NextBlock;
                            this.NextBlock = this.newBlock();
                            this.shadowBlock.TypeIndex = this.ActiveBlock.TypeIndex;
                            this.needToCalcShadowBlock = true;
                            this.State = this.running;
                        }
                        this.deleteRowCnt++;
                        this.FramesSinceLastAction = 0;
                    }
                    break;
            }
        },

        UpdateScore: function (RowsCleared) {
            //TODO: Add points for soft drops and hard drops.
//            this.pointsPerLine = [0,100,200,300,400];
//            this.linesPerLevel = [2,10,20,40,60];
//            this.pointsPerLevelMultiplier = 2;
//            this.linesCleared = 0;
//            this.linesUntilNextLevel = this.linesPerLevel[this.level+1]-this.linesCleared;
//            this.points = 0;
            this.linesCleared += RowsCleared;
            var multiplier = (this.pointsPerLevelMultiplier * this.level) | 1;
            this.points += (this.pointsPerLine[RowsCleared] * multiplier);
            if (this.linesCleared >= this.linesPerLevel[this.level] && (this.linesPerLevel.length >= this.level + 1)) {
                this.level++;
                this.DropBlockFramesToWait = this.DropFramesPerLevel[this.level];
            }
            this.linesUntilNextLevel = this.linesPerLevel[this.level] - this.linesCleared;


        },

        popDeletedRow: function (row) {
            for (var i = row; i > this.WellIgnoredRows; i--) {
                this.Well[i] = this.Well[i - 1].splice(0);
            }
            for (var i = 0; i < this.WellWidth; i++) {
                this.Well[this.WellIgnoredRows][i] = 0;
            }
        },

        calculateShadowBlock: function (block) {
            var cont = true;
            while (cont) {
                cont = this.performBlockOperations(block, {Rotate: false, Left: false, Right: false, Fall: true, InstaDrop: false});
            }

            this.needToCalcShadowBlock = false;
        },

        performBlockOperations: function (block, input) {
            var X = block.x, Y = block.y, O = block.orientation;

            if (input.InstaDrop) {
                this.ActiveBlock.x = this.shadowBlock.x;
                this.ActiveBlock.y = this.shadowBlock.y;
                return false;
            }

            if (input.Rotate == true) {
                O = (O + 1) % this.orientationCount;
                this.needToCalcShadowBlock = true;
            }

            if (input.Left == true) {
                X -= 1;
                this.needToCalcShadowBlock = true;
            }

            if (input.Right == true) {
                X += 1;
                this.needToCalcShadowBlock = true;
            }

            //calculate shadow block used input.fall to find the lowest location
            //due to frameSinceLastAction reset, this caused the infinity spin or move.
            //Moved DropFramesToWait check to UpdateState()
            ////Wait for correct delay before lowering the current block
            if (input.Fall == true) {// || this.FramesSinceLastAction >= this.DropBlockFramesToWait) {
                Y += 1;
//                this.FramesSinceLastAction = 0;
            }
            //Try user requested transformation
            if (this.checkCollision(X, Y, block.TypeIndex, O)) {
                block.x = X;
                block.y = Y;
                block.orientation = O;
                return true;
                //Else do we need to lock the block now?
            } else return this.checkCollision(block.x, block.y + 1, block.TypeIndex, block.orientation);
        },

        lockBlock: function (block) {
            var x , y ,
                pieces = this.blocks[block.TypeIndex]['orientations'][block.orientation];

            for (var j = pieces.length - 1; j >= 0; j--) {
                y = block.y + j;
                for (var i = 0; i < pieces[j].length; i++) {
                    x = block.x + i;
                    if (pieces[i][j] > 0) {
                        if (y < this.WellIgnoredRows) {
                            //If any of the piece is over the "top" of the well, return false
                            return false;
                        }
                        this.Well[y][x] = this.blocks[block.TypeIndex]['color'];
                    }
                }
            }
            return true;

        },

        checkCompleteRows: function (block) {
            var pieces = this.blocks[block.TypeIndex]['orientations'][block.orientation],
                checkRow = false,
                TransitionToDelete = false;
            for (var j = pieces.length - 1; j >= 0; j--) {
                y = block.y + j;
                checkRow = (this.Well[y] != undefined);
                for (var i = 0; i < this.WellWidth && checkRow; i++) {
                    if (this.Well[y][i] == 0) {
                        checkRow = false;
                    }
                }
                if (checkRow) {
                    this.deleteRow.push(y);
                    TransitionToDelete = true;
                }
            }
            return TransitionToDelete;
        },

        newBlock: function () {
            var newType, tries = 0;
            //Reduce the likelihood of a string of same pieces
            newType = Math.floor((Math.random() * 100) % this.blockCount);
            while (this.blockHistory.indexOf(newType) >= 0 && tries < 6) {
                newType = Math.floor((Math.random() * 100) % this.blockCount);
                tries++;
            }
            this.blockHistory.push(newType);
            this.blockHistory.shift();
            return  {
                x: Math.floor((this.WellWidth - 1) / 2) - 2,
                y: -1,
                TypeIndex: newType,
//                TypeIndex: 2,
                orientation: 0,
            };
        },

        checkCollision: function (newX, newY, blockType, orientation) {
            var x, y, pieces = this.blocks[blockType]['orientations'][orientation],
                rowOutOfBounds = false;

            for (var j = pieces.length - 1; j >= 0; j--) {
                y = newY + j;
                rowOutOfBounds = (y >= this.Well.length || y < 0);
                for (var i = 0; i < pieces[j].length; i++) {
                    x = newX + i;
                    if (pieces[i][j] > 0) {
                        if (rowOutOfBounds) {
                            return false;
                        }
                        if (x < 0 || x >= this.WellWidth) {
                            return false;
                        }
                        if (this.Well[y][x] != 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
    });
    var Input = Class.extend({

        init: function (APP) {
            this.app = APP;

            this.RotateFlag = false;
            this.LeftFlag = false;
            this.RightFlag = false;
            this.FallFlag = false;
            this.InstaDropFlag = false;

//            var el = document.getElementsByTagName("canvas")[0];
//            this.CanvasCenter = el.width / 2;
//            this.Canvas80H = el.height * .8;
//            this.Canvas50H = el.height * .5;
//            this.Canvas70W = el.width * .7;
//            this.Canvas30W = el.width * .3;
//            el.addEventListener("touchstart", this.touchStart.bind(this), false);
////            el.addEventListener("touchstart", this.startTouch.bind(this), false);
//            el.addEventListener("touchend", this.touchEnd.bind(this), false);
//            el.addEventListener("touchmove", this.touchMove.bind(this), false);
            this.attachImages();

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
                canvas = document.getElementsByTagName("canvas")[0];
                Canvas20H = canvas.height * .2,
                Canvas20W = Math.floor(canvas.width / images.length),
                imgsize = Math.min(Canvas20H,Canvas20W);
            for (var i = 0; i < images.length; i++) {
                newImg = document.createElement('img');
                newImg.src = images[i].pic;
                newImg.id = images[i].flag;
                newImg.style.position = 'absolute';
                newImg.style.left = (imgsize * i) ;
                newImg.style.top = canvas.height - imgsize;
                newImg.style.width = imgsize;

                newImg.addEventListener('touchstart', this.touchHandler.bind(this));
                document.body.appendChild(newImg);
            }
        },
        touchHandler:function(event){
            var id = event.target.id;
            switch(id){
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
                    if(this.app.isStopped){
                        this.app.start();
                    }else{
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
    var Renderer = Class.extend({
        init: function (Game, CanvasObj) {
            this.game = Game;
            this.canvas = CanvasObj;
            this.context = this.canvas.getContext('2d');
            this.context.font = '16px Arial';

            this.TileWidth = Math.floor((window.innerWidth * .9) / (this.game.WellWidth + 5));//16;
            this.TileHeight = Math.floor((window.innerHeight * .8) / (this.game.WellHeight + 1));//16;
            var min = Math.min(this.TileHeight, this.TileWidth);
            this.TileHeight = min;
            this.TileWidth = min;
            this.CellSpacing = 1;

            this.WellOffsetLeft = this.TileWidth;
            this.WellOffsetTop = this.TileHeight;

            this.NextBlockTop = this.TileHeight * 2 + this.WellOffsetTop;
            this.NextBlockLeft = (this.TileWidth * this.game.WellWidth);


            this.ScoreTop = this.NextBlockTop + (this.TileHeight * 5) + 20;
            this.ScoreLeft = this.NextBlockLeft + this.WellOffsetLeft + this.TileWidth;

            this.Debug_Collision = false;
            this.Debug_Collision_Color = "pink";

            this.WellColor = '#444444';
            this.TextColor = 'green';

        },

        render: function (isStopped) {
            var self = this, msg , msg2;

            if (self.game.State != self.game.gameOver) {
                self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
                if (isStopped) {
                    self.drawWell(1);
                    msg = "Game Paused.";
                    msg2 = "Tap P/P to begin";
                    self.printMessage(msg, msg2);
                    self.drawScore(self.game.points, self.game.level, self.game.linesCleared, self.game.linesUntilNextLevel);
                } else {
                    self.drawWell();
                    if (self.game.State == self.game.running) {
                        self.drawBlock(self.game.ActiveBlock, 0);
                        self.drawBlock(self.game.shadowBlock, 2);
                    }
                    self.drawBlock(self.game.NextBlock, 1);
                    self.drawScore(self.game.points, self.game.level, self.game.linesCleared, self.game.linesUntilNextLevel);
                }
            } else {
                msg = "Game Over.";
                msg2 = "Tap P/P to play again";
                self.printMessage(msg, msg2);

            }
////        this.context.fillStyle = 'white';
////        this.context.fillRect(0,300,100,100);
//            this.context.save();
//            this.context.fillStyle = 'red';
//            this.context.fillRect(0,this.canvas.height *.8,this.canvas.width/2,this.canvas.height *.2);
//            this.context.fillStyle = 'green';
//            this.context.fillRect(this.canvas.width/2,this.canvas.height *.8,this.canvas.width/2,this.canvas.height *.2);
//            this.context.fillStyle = 'yellow';
//            this.context.fillRect(this.canvas.width *.7,this.canvas.height *.5,this.canvas.width *.3,this.canvas.height *.3);
//
//
////            this.context.fillText('LEFT');
//            this.context.restore();
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
            for (var j = this.game.WellIgnoredRows; j < this.game.WellHeight; j++) {
                for (var i = 0; i < this.game.WellWidth; i++) {
                    this.drawTile(
                        i * this.TileWidth,
                        j * this.TileHeight,
                        (this.game.Well[j][i] && !ignoreRealWell ? this.game.Well[j][i] : this.WellColor));
                }
            }

        },

        /**
         *
         * @param block
         * @param state 0:ActiveBlock;1:NextBlock;2:shadowBlock
         */
        drawBlock: function (block, state) {
            var matrix = this.game.blocks[block.TypeIndex]['orientations'][block.orientation],
                color = this.game.blocks[block.TypeIndex]['color'],
                y = 0,
                x = 0;
            for (var j = 0; j < matrix.length; j++) {
                y = ((block.y + j ) * this.TileHeight) + (state == 1 ? this.NextBlockTop : 0);
                for (var i = 0; i < matrix[j].length; i++) {
                    x = ((block.x + i ) * this.TileWidth) + (state == 1 ? this.NextBlockLeft : 0);

                    if (matrix[i][j] > 0)
                        if (state != 2)
                            this.drawTile(x, y, color);
                        else
                            this.drawTile(x, y, color, true);
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
         * @param shadow boolean to draw the block as a shadow block
         */
        drawTile: function (x, y, CellColor, shadow) {
            shadow = shadow | 0;
            this.context.save();
            if (CellColor) {
                this.context.fillStyle = CellColor;
            }
            if (shadow) {
                this.context.strokeStyle = CellColor;
                this.context.beginPath();
                this.context.arc(
                    x + this.WellOffsetLeft + this.TileWidth / 2,//+ this.shadowBorder,
                    y + this.WellOffsetTop + this.TileHeight / 2,// + this.shadowBorder,
                    Math.floor((this.TileWidth - this.CellSpacing) / 2),
                    0, Math.PI * 2, true
                );
                this.context.closePath();
                this.context.stroke();
            } else
                this.context.fillRect(
                    x + this.WellOffsetLeft + this.CellSpacing,
                    y + this.WellOffsetTop + this.CellSpacing,
                    this.TileWidth - this.CellSpacing, this.TileHeight - this.CellSpacing);
            this.context.restore();


        },

        drawScore: function (points, level, linesCleared, linesUntilNext) {
            this.context.save();
            this.context.fillStyle = this.TextColor;
            this.context.fillText("Points:" + points, this.ScoreLeft, this.ScoreTop);
            this.context.fillText("Lines cleared:" + linesCleared, this.ScoreLeft, this.ScoreTop + 10);
            this.context.fillText("Level:" + level, this.ScoreLeft, this.ScoreTop + 20);
            this.context.fillText("Lines to next:" + linesUntilNext, this.ScoreLeft, this.ScoreTop + 30);
            this.context.restore();
        },

    });
    initApp();

})();

