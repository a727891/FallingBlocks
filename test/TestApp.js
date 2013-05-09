require({baseUrl: "/test/js"}, [ "app" ], function (APP) {

    var app = {};
    //Define mock objects
    var MockGame = {
        updateState: function (input) {
            return true;
        }
    };
    var MockInput = {
        readInput: function () {
            return {};
        }
    };
    var MockRenderer = {
        render: function (isStopped) {
            return true;
        }
    };

    TestCase("TestApp", {
        setUp: function () {
            app = new APP();
        },

        "testAssignObjects": function () {
            assertTrue('Never see this', true);
            app.setObjects(MockGame, MockInput, MockRenderer);
            assertSame('game not set correctly,', MockGame, app.game);
            assertSame('input not set correctly,', MockInput, app.input);
            assertSame('renderer not set correctly,', MockRenderer, app.renderer);
            assertTrue('App::SetObjects did not set App.ready,', app.ready);
        },

        "testAppStart": function () {
            app.start();
            assertTrue('App::start() worked from initial,', app.isStopped);
            app.ready = true;
            app.tick = function () {
                return true;
            };
            var InitialIsStopped = app.isStopped;
            var InitialHasNeverStarted = app.hasNeverStarted;
            assertTrue('App did not initialize as stopped,', InitialIsStopped);
            assertTrue('App did not initialize as neverStarted', InitialHasNeverStarted);
            app.start();
            assertFalse('App:Start() did not work after setting objects', app.isStopped);
            assertNotEquals('App::Start() did not change isStopped flag', InitialIsStopped, app.isStopped);
            assertNotEquals('App::Start() did not change hasNeverStarted flag', InitialHasNeverStarted, app.hasNeverStarted);
        },

        "testAppStop": function () {
            app.isStopped = false;
            app.stop();
            assertTrue('App:stop() did not stop the app,', app.isStopped);
            app.isStopped = true;
            app.stop();
            assertTrue('App:stop() did not stop the app,', app.isStopped);
        },

        "testAppTick": function () {
            var self = this;
            var ranReqAnimFrame = false;
            window.requestAnimFrame = function (callback) {
                ranReqAnimFrame = true;
            };
            app.tick();
            assertFalse('Tick ran requestAnimFrame',ranReqAnimFrame);
            app.game = MockGame;
            app.input = MockInput;
            app.renderer = MockRenderer;
            app.ready = true;
            app.isStopped = false;
            app.currentTime = 123;
            app.lastTimeStep = app.currentTime;
            app.tick();
            assertTrue('Tick did not run requestAnimFrame',ranReqAnimFrame);

        }


    });

});

