/// <reference path="../state/Main.ts"/>

module TacticArena.Specs {
    import Main = TacticArena.State.Main;
    describe("OrderManager", () => {
        var testGame;

        //beforeEach(function (done) {
        //    testGame = new Main();
        //    spyOn(console, "log").and.stub();
        //    spyOn(console, "warn").and.stub();
        //    spyOn(testGame, "add").and.stub();
        //});

        it("must works too", function () {
            testGame = new Main();
            //spyOn(console, "log").and.stub();
            spyOn(console, "warn").and.stub();
            spyOn(console, "error").and.stub();
            //spyOn(testGame.add, "sprite").and.callFake(() => {
            //
            //});
            //spyOn(testGame.add, "tilemap").and.callFake(() => {
            //
            //});
            spyOn(testGame, "load").and.callFake(() => {

            });
            //spyOn(testGame, "create").and.callFake(() => {
            //
            //});
            //testGame.cache = new Phaser.Cache(testGame);
            //testGame.create();
            //let p1 = new Entity.Pawn(testGame, 8, 8, 'E', 'redhead', 1, false, 'Eikio');
            //let p2 = new Entity.Pawn(game, 10, 8, 'W', 'skeleton', 2, false, 'Dormammu');
            let result = true;
            expect(result).toBe(true);
            console.log(testGame);
        });
    });
}