require({
    baseUrl: "/test/js"
}, ["game"], function ( GAME) {
   var game = {};
    TestCase("TestGame", {
        setUp: function () {
            game = new GAME();
        },

        "testInitWell":function(){
            assertEquals('WellHeight is wrong.',game.Well.length,game.WellHeight);
            for(var i= 0,j=game.Well.length;i<j;i++){
                assertEquals('WellWidth at'+i+' is wrong.',game.Well[i].length,game.WellWidth);
            }
        },

        "testNewBlock":function(){

        },


    });
});

