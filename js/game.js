define([], function () {
    return Class.extend({
        init: function () {
            this.hasNeverStarted = 1;
            this.running = 2;
            this.deletingRow = 4;
            this.gameOver = 8;
            this.State = this.hasNeverStarted;

            this.deleteRow = [];
            this.deleteRowCnt = 0;

            this.WellWidth = 10;
            this.WellHeight = 22; //Top two rows will not be rendered

            this.Well = [];
            this.FramesSinceLastAction = 0;
            this.DropBlockFramesToWait = 60;
            this.DeleteRowFramesPerCell = 5;

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


            this.pointsPerLine = [0,100,200,300,400];
            this.linesPerLevel = [0,2,10,20,40];
            this.pointsPerLevelMultiplier = 2;
            this.level = 0;
            this.linesCleared = 0;
            this.linesUntilNextLevel = this.linesPerLevel[this.level+1]-this.linesCleared;
            this.points = 0;

            this.newGame();

        },

        newGame: function () {

            this.ActiveBlock = this.newBlock();
            this.NextBlock = this.newBlock();

            this.initWell();

            this.State = this.running;

            this.level = 0;
            this.linesCleared = 0;
            this.linesUntilNextLevel = 0;
            this.points = 0;


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
                    this.performBlockOperations(input);
                    //Wait for correct delay before lowering the current block
                    if (this.FramesSinceLastAction >= this.DropBlockFramesToWait) {
                        //Attempt to lower the active block
                        if (!this.dropBlock()) {
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
                                }
                            } else {
                                //Block exceeds the game field, game over
                                this.State = this.gameOver;
                            }
                        }
                        this.FramesSinceLastAction = 0;
                    }
                    break;
                case this.deletingRow:
                    if (this.FramesSinceLastAction >= this.DeleteRowFramesPerCell) {
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
                                this.popDeletedRow(this.deleteRow.shift());
                                RowCount++;
                            }
                            this.UpdateScore(RowCount);
                            //Give user the next block
                            this.ActiveBlock = this.NextBlock;
                            this.NextBlock = this.newBlock();
                            this.State = this.running;
                        }
                        this.deleteRowCnt++;
                        this.FramesSinceLastAction = 0;
                    }
                    break;
            }
        },

        UpdateScore: function(RowsCleared){
//            this.pointsPerLine = [0,100,200,300,400];
//            this.linesPerLevel = [0,2,10,20,40];
//            this.pointsPerLevelMultiplier = 2;
//            this.level = 0;
//            this.linesCleared = 0;
//            this.linesUntilNextLevel = this.linesPerLevel[this.level+1]-this.linesCleared;
//            this.points = 0;
            this.linesCleared+=RowsCleared;
            var isAnotherLevel = (this.linesPerLevel[this.level+1])



        },

        popDeletedRow: function (row) {
            for (var i = row; i > 0; i--) {
                this.Well[i] = this.Well[i - 1];
            }
        },

        performBlockOperations: function (input) {
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
                this.FramesSinceLastAction += this.DropBlockFramesToWait;
            }
        },

        lockBlock: function (block) {
            var x , y ,
                pieces = this.blocks[block.TypeIndex]['orientations'][block.orientation];

            for (var j = pieces.length - 1; j >= 0; j--) {
                y = block.y + j;
                for (var i = 0; i < pieces[j].length; i++) {
                    x = block.x + i;
                    if (pieces[i][j] > 0) {
                        if (y < 2) {
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
                    console.log("need to delete row ", y);
                    this.deleteRow.push(y);
                    TransitionToDelete = true;
                }
            }
            return TransitionToDelete;
        },

        newBlock: function () {
            return  {
                x: Math.floor((this.WellWidth-1)/2)-2,
//                x: 0,
                y: -2,
                TypeIndex: Math.floor((Math.random()*100)%this.blockCount),
//                TypeIndex: 2,
                orientation: 0,
            };
        },

        dropBlock: function () {
            var self = this,
                block = this.ActiveBlock;
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
                rowOutOfBounds = false;

            for (var j = pieces.length - 1; j >= 0; j--) {
                y = newY + j;
                rowOutOfBounds = (y >= this.Well.length||y<0);
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
});
