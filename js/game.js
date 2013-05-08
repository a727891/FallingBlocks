define([], function () {
    return Class.extend({
        init: function (APP) {
            this.app = APP;
            this.ready = false;
            this.started = false;
            this.hasNeverStarted = true;
            this.currentTime = null;

            this.WellWidth = 11;
            this.WellHeight = 20;


            this.ActiveBlock = {
                x: 6,
                y: 1,
                TypeIndex: 1,
                orientation: 0,

            };

            this.Well = [];

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
                {color: '#fdfd01;', orientations: [
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

            this.initWell();
            console.info("Game Created.");
        },

        initWell: function () {
            for (var j = 0; j <= this.WellHeight; j++) {
                this.Well[j] = [];
                for (var i = 0; i <= this.WellWidth; i++) {
                    this.Well[j][i] = 0;
                }
            }
        },

        updateState: function(input){
            if(input.FallFlag){
                console.log("User wants to fast fall");
            }
            if(input.RotateFlag){
                console.log("User wants to rotate");
            }
            if(input.LeftFlag){
                console.log("User wants to move left");
            }
            if(input.RightFlag){
                console.log("User wants to move right");
            }


        },

        newBlock: function () {

        },

        rotateBlock: function () {
            var self = this;
            if (self.checkCollision(self.ActiveBlock.x, self.ActiveBlock.y, self.ActiveBlock.TypeIndex,
                ++this.ActiveBlock.orientation % this.orientationCount)) {
                this.ActiveBlock.orientation = ++this.ActiveBlock.orientation % this.orientationCount;
            }
        },

        moveBlock: function (direction) {
            var self = this;
            if (self.checkCollision(self.ActiveBlock.x + direction, self.ActiveBlock.y,
                self.ActiveBlock.TypeIndex, self.ActiveBlock.orientation)) {
            }
        },

        checkCollision: function (newX, newY, block, orientation) {
            return true;
        },


    });
});
