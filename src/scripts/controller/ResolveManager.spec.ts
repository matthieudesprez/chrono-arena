/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena.Specs {
    import Main = TacticArena.State.Main;

    describe("ResolveManager", () => {
        var testGame, currentState;

        beforeEach(function (done) {
            testGame = new TestGame(true);
            testGame.state.start('test');
            testGame.state.onStateChange.add(function() {
                currentState = testGame.state.getCurrentState();
                setTimeout(function() {
                    currentState.pawns = [];
                    currentState.pathTilesGroup = currentState.add.group();
                    currentState.pawnsSpritesGroup = currentState.add.group();
                    currentState.pawns.push(new Entity.Pawn(currentState, 8, 8, 'E', 'skeleton', 1, false, 'Eikio'));
                    currentState.pawns.push(new Entity.Pawn(currentState, 10, 8, 'W', 'skeleton', 2, false, 'Dormammu'));
                    done();
                }, 200);
            });
        });

        afterEach(function () {
            testGame.destroy();
            testGame = null;
        });

        it("nothing is played", function () {
            console.log('ok')
        });
    });
}