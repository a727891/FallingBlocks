define([], function () {
    return Class.extend({
        init: function () {
            this.ready = false;
            this.started = false;
            this.hasNeverStarted = true;
            this.currentTime = null;

            this.WellWidth = 7;
            this.WellHeight = 8;

            this.Well = [];
            this.FramesSinceLastFall = 0;
            this.FramesToWaitUntilFall = 60;

            /**
             * Contains block definition
             * color: render color
             * orientation[0-3]: collision detection of pieces
             * @type {Array}
             */
            this.blocks = [
                //Square (o)
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
                //Tee (t)
                {color: '#fdfd01', orientations: [
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
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Line (i)
                {color: '#00fdfd', orientations: [
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
                    ],
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
                    ]
                ]},
                //Zr (z)
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
                //Zl (s)
                {color: '#00fd01', orientations: [
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
                    ],
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
                        [0, 1, 2, 0, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Lr (l)
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
                //Ll (j)
                {color: '#0001fd', orientations: [
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
                    ],
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
                    ]
                ]},
            ];
            this.blockCount = this.blocks.length;
            this.orientationCount = 4;

            this.ActiveBlock = this.newBlock();
            this.NextBlock = this.newBlock();

            this.initWell();
//            console.info("Game Created."+JSON.stringify(this.ActiveBlock)+JSON.stringify(this.NextBlock));
        },

        initWell: function () {
            for (var j = 0; j < this.WellHeight; j++) {
                this.Well[j] = [];
                for (var i = 0; i < this.WellWidth; i++) {
                    this.Well[j][i] = 0;
                }
            }
            this.Well[6][1] = 1;
        },

        updateState: function (input) {
            this.FramesSinceLastFall++;
            if (input.Rotate == true) {
                this.rotateBlock();
            }

            if (input.Left == true) {
                this.moveBlock(-1)
            }

            if (input.Right == true) {
                this.moveBlock(1);
            }

            if (input.Fall == true) {
                this.FramesSinceLastFall += 30;
            }

            if (this.FramesSinceLastFall >= this.FramesToWaitUntilFall) {
                if (!this.dropBlock()) {
                    this.lockBlock(this.ActiveBlock);
//                    FallingBlocksApp.stop();
                    this.ActiveBlock = this.NextBlock;
                    this.NextBlock = this.newBlock();
                }
                this.FramesSinceLastFall = 0;
            }
        },

        lockBlock: function (block) {
            console.log("Lock the block");
            var x , y ,
                pieces = this.blocks[block.TypeIndex]['orientations'][block.orientation];
//            console.log(x, y, pieces);
//            console.dir(this.Well);
            for (var j = pieces.length - 1; j >= 0; j--) {
                y = block.y + j;
                for (var i = 0; i < pieces[j].length; i++) {
                    x = block.x + i;
                    if (pieces[j][i] > 0) {
//                        console.log(j, y, j + y, ':', i, x, i + x);
//                        if (this.Well[y] && this.Well[ y][ x]) {
                            console.log("locking well ",y,x);
                            this.Well[y][ x] = 1;
//                        } else {
//                            console.log("No well space ",y,x);
//                        }
                    }
                }
            }
            console.dir(this.Well);

        },

        newBlock: function () {
            return  {
                x: 0,
                y: 0,
//                TypeIndex: Math.floor((Math.random()*100)%this.blockCount),
                TypeIndex: 0,
                orientation: 0,
            };
        },

        dropBlock: function () {
            var self = this,
                block = this.ActiveBlock;
//            console.log("Drop block from(", block.x, block.y, ') to (', block.x, block.y + 1, ')');
            if (self.checkCollision(block.x, block.y + 1, block.TypeIndex, block.orientation)) {
                block.y++;
                return true;
            }
            return false;
        },

        rotateBlock: function () {
            var self = this,
                block = this.ActiveBlock,
                newOrientation = (block.orientation + 1) % this.orientationCount;
            if (self.checkCollision(block.x, block.y, block.TypeIndex, newOrientation)) {
                block.orientation = newOrientation;
                console.log("new orientation", newOrientation);
            }
        },

        moveBlock: function (direction) {
            var self = this,
                block = this.ActiveBlock;
            if (self.checkCollision(block.x + direction, block.y, block.TypeIndex, block.orientation)) {
                block.x += direction;
            }
        },

        checkCollision: function (newX, newY, blockType, orientation) {
            var x, y, pieces = this.blocks[blockType]['orientations'][orientation],
                rowOutOfBounds = false,
                debug = (newY + 5 > this.WellHeight );

//            if (debug) {
//                console.log("CheckCollision at nX:", newX, ', nY:', newY);
//            }
            for (var j = pieces.length - 1; j >= 0; j--) {
                y = newY + j;
                rowOutOfBounds = (y >= this.Well.length);
//                if (debug) {
//                    console.log("   check row ", j, "values=", pieces[j]);
//                    if (rowOutOfBounds)
//                        console.log("   WellRow out of bounds", y);
//                    else
//                        console.log("   WellRow index ", y, this.Well[y]);
//                }
                for (var i = 0; i < pieces[j].length; i++) {
                    x = newX + i;
                    if (pieces[j][i] > 0) {
                        if (rowOutOfBounds) {
//                            console.log("BOOM!!!!",j,i);
                            return false;
                        }
                        if (x < 0 || x >= this.WellWidth) {
//                            console.log("BAM!!!!",j,i);
                            return false;
                        }
                        if (this.Well[y][x] != 0) {
//                            console.log("Hit existing block at ",y,x,"with piece square",j,i);
                            return false;
                        }

//
//                        this.Well[j + y][i + x] = 1;
                    }
                }
            }
            return true;
        },


    });
});
