/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena {
    describe("ResolveManager", () => {
        var testGame, currentState;

        function getInitialStep(): Step {
            return new Step([
                new StepUnit(
                    currentState.pawns[0],
                    3,
                    4,
                    new Order.Stand(currentState.map.startPositions[0][0])
                ),
                new StepUnit(
                    currentState.pawns[1],
                    3,
                    4,
                    new Order.Stand(currentState.map.startPositions[1][0])
                )
            ]);
        }

        function testStepResolution(index, position, ap, hp) {
            let pawn = currentState.pawns[index];
            expect(currentState.spritesManager.getReal(pawn).getPosition().equals(position)).toEqual(true);
            expect(pawn.getAp()).toEqual(ap);
            expect(pawn.getHp()).toEqual(hp);
        }

        beforeEach(function (done) {
            spyOn(console, 'log').and.stub();
            spyOn(console, 'info').and.stub();
            spyOn(console, 'warn').and.stub();
            testGame = new TestGame(true);
            testGame.state.start('testpreload');
            testGame.state.onStateChange.add(function (stateName) {
                if (stateName === 'test') {
                    currentState = testGame.state.getCurrentState();
                    setTimeout(function () {
                        let p1 = new Champion.Test(currentState, currentState.map.startPositions[0][0], 1, 1);
                        currentState.pawns.push(p1);
                        currentState.spritesManager.add(p1);
                        let p2 = new Champion.Test(currentState, currentState.map.startPositions[1][0], 2, 2);
                        currentState.pawns.push(p2);
                        currentState.spritesManager.add(p2);
                        currentState.isPaused = true;
                        done();
                    }, 200);
                }
            });
        });

        afterEach(function () {
            testGame.destroy();
            testGame = null;
        });

        it("basic move from 1st pawn", async function (done) {
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    new Step([
                        new StepUnit(
                            currentState.pawns[0],
                            2,
                            4,
                            new Order.Move(currentState.map.startPositions[0][0].translate(1, 0))
                        ),
                        new StepUnit(
                            currentState.pawns[1],
                            2,
                            4,
                            new Order.Stand(currentState.map.startPositions[1][0])
                        )
                    ])
                ],
                0
            );
            await currentState.resolveManager.processStep(0);
            testStepResolution(0, currentState.map.startPositions[0][0], 3, 4);
            testStepResolution(1, currentState.map.startPositions[1][0], 3, 4);
            await currentState.resolveManager.processStep(1);
            testStepResolution(0, currentState.map.startPositions[0][0].translate(1, 0), 2, 4);
            testStepResolution(1, currentState.map.startPositions[1][0], 2, 4);
            done();
        });

        it("attack from 1st pawn", async function (done) {
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    new Step([
                        new StepUnit(
                            currentState.pawns[0],
                            2,
                            4,
                            new Order.Move(currentState.map.startPositions[0][0].translate(1, 0))
                        ),
                        new StepUnit(
                            currentState.pawns[1],
                            2,
                            4,
                            new Order.Stand(currentState.map.startPositions[1][0])
                        )
                    ]),
                    new Step([
                        new StepUnit(
                            currentState.pawns[0],
                            1,
                            4,
                            new Order.Attack(currentState.map.startPositions[0][0].translate(1, 0), [{
                                championId: currentState.pawns[1]._id,
                                dodge: false
                            }])
                        ),
                        new StepUnit(
                            currentState.pawns[1],
                            1,
                            3,
                            new Order.Attack(currentState.map.startPositions[1][0], [{
                                championId: currentState.pawns[0]._id,
                                dodge: true
                            }])
                        )
                    ])
                ],
                0
            );
            await currentState.resolveManager.processStep(0);
            testStepResolution(0, currentState.map.startPositions[0][0], 3, 4);
            testStepResolution(1, currentState.map.startPositions[1][0], 3, 4);
            await currentState.resolveManager.processStep(1);
            testStepResolution(0, currentState.map.startPositions[0][0].translate(1, 0), 2, 4);
            testStepResolution(1, currentState.map.startPositions[1][0], 2, 4);
            await currentState.resolveManager.processStep(2);
            testStepResolution(0, currentState.map.startPositions[0][0].translate(1, 0), 1, 4);
            testStepResolution(1, currentState.map.startPositions[1][0], 1, 3);
            done();
        });

        it("attack from 1st pawn with isPaused=false", async function (done) {
            currentState.isPaused = false;
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    new Step([
                        new StepUnit(
                            currentState.pawns[0],
                            2,
                            4,
                            new Order.Move(currentState.map.startPositions[0][0].translate(1, 0))
                        ),
                        new StepUnit(
                            currentState.pawns[1],
                            2,
                            4,
                            new Order.Stand(currentState.map.startPositions[1][0])
                        )
                    ]),
                    new Step([
                        new StepUnit(
                            currentState.pawns[0],
                            1,
                            4,
                            new Order.Attack(currentState.map.startPositions[0][0].translate(1, 0), [{
                                championId: currentState.pawns[1]._id,
                                dodge: false
                            }])
                        ),
                        new StepUnit(
                            currentState.pawns[1],
                            1,
                            3,
                            new Order.Attack(currentState.map.startPositions[1][0], [{
                                championId: currentState.pawns[0]._id,
                                dodge: true
                            }])
                        )
                    ])
                ],
                0
            );
            await currentState.resolveManager.processSteps(0);
            testStepResolution(0, currentState.map.startPositions[0][0].translate(1, 0), 1, 4);
            testStepResolution(1, currentState.map.startPositions[1][0], 1, 3);
            done();
        });

        it("move then cast from 1st pawn while 2nd move", async function (done) {
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    new Step([
                        new StepUnit(
                            currentState.pawns[0],
                            2,
                            4,
                            new Order.Move(currentState.map.startPositions[0][0].translate(0, -1))
                        ),
                        new StepUnit(
                            currentState.pawns[1],
                            2,
                            4,
                            new Order.Move(currentState.map.startPositions[1][0].translate(0, -1))
                        )
                    ]),
                    new Step([
                        new StepUnit(
                            currentState.pawns[0],
                            0,
                            4,
                            new Order.Fire(currentState.map.startPositions[0][0].translate(0, -1), [{championId: currentState.pawns[1]._id}])
                        ),
                        new StepUnit(
                            currentState.pawns[1],
                            1,
                            2,
                            new Order.Move(currentState.map.startPositions[1][0].translate(-1, -1))
                        )
                    ]),
                    new Step([
                        new StepUnit(
                            currentState.pawns[0],
                            0,
                            3,
                            new Order.Stand(currentState.map.startPositions[0][0].translate(0, -1))
                        ),
                        new StepUnit(
                            currentState.pawns[1],
                            0,
                            2,
                            new Order.Move(currentState.map.startPositions[1][0].translate(-1, -1))
                        )
                    ])
                ],
                0
            );
            await currentState.resolveManager.processStep(0);
            testStepResolution(0, currentState.map.startPositions[0][0], 3, 4);
            testStepResolution(1, currentState.map.startPositions[1][0], 3, 4);
            await currentState.resolveManager.processStep(1);
            testStepResolution(0, currentState.map.startPositions[0][0].translate(0, -1), 2, 4);
            testStepResolution(1, currentState.map.startPositions[1][0].translate(0, -1), 2, 4);
            await currentState.resolveManager.processStep(2);
            testStepResolution(0, currentState.map.startPositions[0][0].translate(0, -1), 0, 4);
            testStepResolution(1, currentState.map.startPositions[1][0].translate(-1, -1), 1, 2);
            await currentState.resolveManager.processStep(3);
            testStepResolution(0, currentState.map.startPositions[0][0].translate(0, -1), 0, 3);
            testStepResolution(1, currentState.map.startPositions[1][0].translate(-1, -1), 0, 2);
            done();
        });
    });
}