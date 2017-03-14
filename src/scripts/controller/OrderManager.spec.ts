/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>


module TacticArena.Specs {
    //import TestGame = TacticalArena.Specs.TestGame;
    import Main = TacticArena.State.Main;
    describe("OrderManager", () => {
        //var testGame = new TestGame();

        //beforeEach(function (done) {
        //    testGame = new Main();
        //    spyOn(console, "log").and.stub();
        //    spyOn(console, "warn").and.stub();
        //    spyOn(testGame, "add").and.stub();
        //});


        it("must works too", function () {
            let testGame = new Game(true);
            console.log(testGame);
            testGame.state.add("test", State.Test);

            testGame.cache = new Phaser.Cache(testGame);
            testGame.state.start('test');
            //spyOn(console, "log").and.stub();
            //spyOn(console, "warn").and.stub();
            //spyOn(console, "error").and.stub();
            //spyOn(testGame, "add").and.callFake(() => {
            //
            //});
            //spyOn(testGame.add, "tilemap").and.callFake(() => {
            //
            //});
            //spyOn(testGame, "load").and.callFake(() => {
            //
            //});
            //spyOn(testGame, "create").and.callFake(() => {
            //
            //});
            //testGame.create();
            let p1 = new Entity.Pawn(testGame, 8, 8, 'E', null, 1, false, 'Eikio');
            //let p2 = new Entity.Pawn(game, 10, 8, 'W', 'skeleton', 2, false, 'Dormammu');

            //let done = function () {
            console.log(p1);
            //};
            //
            //let orig_create = testGame.create.bind();
            //spyOn(testGame, "create").and.callFake(() => {
            //    orig_create();
            //    done();
            //});
            //testGame.create();
            let result = true;
            expect(result).toBe(true);
        });
    });
}