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
            this.WellIgnoredRows = 2;
            this.WellWidth = 10;
            this.WellHeight = 20 + this.WellIgnoredRows; //Top two rows will not be rendered

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
                {color: '#A901FD', orientations: [
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
                    ],
                    [
                        [0, 0, 1, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Zr (z)
                {color: '#fd0101', orientations: [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 1, 1, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
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
                    ]
                ]},
                //Zl (s)
                {color: '#00fd01', orientations: [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 1, 2, 0, 0],
                        [0, 0, 1, 1, 0],
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
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 1, 0],
                        [0, 0, 0, 1, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Lr (l)
                {color: '#fda401', orientations: [
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
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 2, 0, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
                //Ll (j)
                {color: '#0001fd', orientations: [
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
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 1, 1, 0],
                        [0, 0, 2, 0, 0],
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]},
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

            this.DropFramesPerLevel = [60,50,40,35,30,30,30,25,25,20,10];
            this.pointsPerLine = [0, 100, 200, 300, 400];
            this.linesPerLevel = [5,10,20,35,55,80,110,145,180,220,500];
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
//            this.pointsPerLine = [0,100,200,300,400];
//            this.linesPerLevel = [2,10,20,40,60];
//            this.pointsPerLevelMultiplier = 2;
//            this.linesCleared = 0;
//            this.linesUntilNextLevel = this.linesPerLevel[this.level+1]-this.linesCleared;
//            this.points = 0;
            this.linesCleared += RowsCleared;
            var multiplier = (this.pointsPerLevelMultiplier*this.level)|1;
            this.points += (this.pointsPerLine[RowsCleared]*multiplier);
            if(this.linesCleared >= this.linesPerLevel[this.level] && (this.linesPerLevel.length >= this.level+1)){
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
                cont = this.performBlockOperations(block, {Rotate: false, Left: false, Right: false, Fall: true, InstaDrop:false});
            }

            this.needToCalcShadowBlock = false;
        },

        performBlockOperations: function (block, input) {
            var X = block.x, Y = block.y, O = block.orientation;

            if(input.InstaDrop){
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

            //Wait for correct delay before lowering the current block
            if (input.Fall == true || this.FramesSinceLastAction >= this.DropBlockFramesToWait) {
                Y += 1;
                this.FramesSinceLastAction = 0;
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
                y: -2,
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
});
