require({
    baseUrl: "/test/js"
}, [ "app" ], function (APP) {

    var requestAnimFrame = function(callback){return true;};
    var app = {};
    //Define mock objects
    var game = {
        updateState: function (input) {
            return true;
        }
    };
    var input = {
        parseInput: function (event) {
            return true;
        },
        readInput: function () {
            return {};
        }
    };
    var renderer = {
        render: function (isStopped) {
            return true;
        }
    };

    TestCase("TestApp", {
        setUp: function () {
            app = new APP();
        },

        "testAssignObjects":function(){
            assertTrue('Never see this',true);
            app.setObjects(game,input,renderer);
            assertSame('game not set correctly',game,app.game);
        },

        "testNotifyUserComplete_App":function(){
            console.info("App tests finished successfully");
        }

    });

});

