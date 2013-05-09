require({
    baseUrl: "/test/js"
}, [ "input" ], function (INPUT) {
    //Mock App object
    var app = {
        'stop': function () {
            return true;
        },
        'resume': function () {
            return true;
        },
        'isStopped': false,
        'game': {
            'ActiveBlock': {
                'TypeIndex': 0
            }
        }
    };
    var input = new INPUT(app);
    var keyboard = {};
    keyboard.LEFT = 37;
    keyboard.UP = 38;
    keyboard.RIGHT = 39;
    keyboard.DOWN = 40;
    keyboard.W = 87;
    keyboard.A = 65;
    keyboard.S = 83;
    keyboard.D = 68;
    keyboard.N = 78;
    keyboard.ENTER = 13;
    keyboard.ESC = 27;
    keyboard.SPACE = 32;
    TestCase("TestInput", {
        setUp: function () {
        },

        "testHandleKeyInputs": function () {
            var testran = false,
                inputs = [
                    {key: 'SPACE', Flag: 'FallFlag', 'pws': true},
                    {key: 'DOWN', Flag: 'FallFlag', 'pws': false},
                    {key: 'S', Flag: 'FallFlag', 'pws': false},
                    {key: 'UP', Flag: 'RotateFlag', 'pws': false},
                    {key: 'W', Flag: 'RotateFlag', 'pws': false},
                    {key: 'LEFT', Flag: 'LeftFlag', 'pws': false},
                    {key: 'A', Flag: 'LeftFlag', 'pws': false},
                    {key: 'RIGHT', Flag: 'RightFlag', 'pws': false},
                    {key: 'D', Flag: 'RightFlag', 'pws': false},
                    {key: 'ESC', Flag: false, 'pws': false}
                ];
            for (var i = 0, j = inputs.length; i < j; i++) {
                this.AreFlagsReset(1);
                testran = this.parseKey(inputs[i]['key'], inputs[i]['Flag'], inputs[i]['pws']);
                assertTrue('test for ' + inputs[i]['key'] + ' failed,', testran);
            }
        },

        "AreFlagsReset": function (RunReset) {
            if (RunReset)
                input.resetFlags();
            assertFalse('LeftFlag is not false', input.LeftFlag);
            assertFalse('RightFlag is not false', input.RightFlag);
            assertFalse('RotateFlag is not false', input.RotateFlag);
            assertFalse('FallFlag is not false', input.FallFlag);
        },

        "parseKey": function (KEY, FLAG, ParseWhenStopped) {
            input.app.isStopped = false;
            var parse = input.parseInput({keyCode: keyboard[KEY]});
            assertTrue(KEY + ' not parsed while running,', parse);
            if (FLAG != false)
                assertTrue(FLAG + ' did not set,', input[FLAG]);
            input.app.isStopped = true;
            parse = input.parseInput({keyCode: keyboard[KEY]});
            assertEquals(KEY + ' not handled while stopped,', ParseWhenStopped, parse);
            return true;
        },

        "testReadInput": function () {
            var ReadBack = {},
                Flags = [
                    {F: true, L: true, R: true, Rot: true},
                    {F: false, L: false, R: false, Rot: false},
                    {F: true, L: false, R: false, Rot: false},
                    {F: false, L: true, R: false, Rot: false},
                    {F: false, L: false, R: true, Rot: false},
                    {F: false, L: false, R: false, Rot: true},
                    {F: false, L: true, R: true, Rot: false},
                ];
            this.AreFlagsReset(1);
            for (var i = 0, j = Flags.length; i < j; i++) {

                input.FallFlag = Flags[i].F;
                input.LeftFlag = Flags[i].L;
                input.RightFlag = Flags[i].R;
                input.RotateFlag = Flags[i].Rot;
                ReadBack = input.readInput();
                assertNotUndefined('Fall is undefined on loop' + i, ReadBack.Fall);
                assertEquals('Fall is not correct after readInput on loop ' + i, ReadBack.Fall, Flags[i].F);
                assertNotUndefined('Left is undefined on loop' + i, ReadBack.Left);
                assertEquals('Left is not correct after readInput on loop ' + i, ReadBack.Left, Flags[i].L);
                assertNotUndefined('Right is undefined on loop' + i, ReadBack.Right);
                assertEquals('Right is not correct after readInput on loop ' + i, ReadBack.Right, Flags[i].R);
                assertNotUndefined('Rotate is undefined on loop' + i, ReadBack.Rotate);
                assertEquals('Rotate is not correct after readInput on loop ' + i, ReadBack.Rotate, Flags[i].Rot);
                this.AreFlagsReset(0);
            }


        }


    });
});

