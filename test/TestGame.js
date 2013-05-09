require({
    baseUrl: "/test/js"
}, ["game"], function ( GAME) {
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
    var game = new GAME(app);
    TestCase("TestGame", {
        setUp: function () {
        },


    });
});

