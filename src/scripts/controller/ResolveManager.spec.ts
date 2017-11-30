/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena.Specs {
    describe("ResolveManager", () => {
        var testGame, currentState;

        function getInitialStep():Entity.Step {
            let result = new Entity.Step([
                new Entity.StepUnit(
                    currentState.pawns[0],
                    new Entity.StepUnitData(3, 4),
                    new Order.Stand(new Position(currentState.map.startPositions[0][0].x, currentState.map.startPositions[0][0].y), currentState.map.startPositions[0][0].d)
                ),
                new Entity.StepUnit(
                    currentState.pawns[1],
                    new Entity.StepUnitData(3, 4),
                    new Order.Stand(new Position(currentState.map.startPositions[1][0].x, currentState.map.startPositions[1][0].y), currentState.map.startPositions[1][0].d)
                )
            ]);
            return result;
        }

        function testStepResolution(index, position, ap, hp, direction) {
            let pawn = currentState.pawns[index];
            expect(currentState.spritesManager.getReal(pawn).getPosition().equals(position)).toEqual(true);
            expect(pawn.getAp()).toEqual(ap);
            expect(pawn.getHp()).toEqual(hp);
            expect(currentState.spritesManager.getReal(pawn).getDirection()).toEqual(direction);
        }

        beforeEach(function (done) {
            spyOn(console, 'log').and.stub();
            spyOn(console, 'info').and.stub();
            spyOn(console, 'warn').and.stub();
            testGame = new TestGame(true);
            testGame.state.start('test');
            testGame.state.onStateChange.add(function() {
                currentState = testGame.state.getCurrentState();
                setTimeout(function() {
                    let p1 = new Entity.Character.Test(currentState, currentState.map.startPositions[0][0].x, currentState.map.startPositions[0][0].y, currentState.map.startPositions[0][0].d, 1, 1);
                    currentState.pawns.push(p1);
                    currentState.spritesManager.add(p1);
                    let p2 = new Entity.Character.Test(currentState, currentState.map.startPositions[1][0].x, currentState.map.startPositions[1][0].y, currentState.map.startPositions[1][0].d, 2, 2)
                    currentState.pawns.push(p2);
                    currentState.spritesManager.add(p2);
                    currentState.isPaused = true;
                    done();
                }, 200);
            });
        });

        afterEach(function () {
            testGame.destroy();
            testGame = null;
        });

        it("basic move from 1st pawn", function (done) {
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(2, 4),
                            new Order.Move(new Position(currentState.map.startPositions[0][0].x + 1, currentState.map.startPositions[0][0].y), currentState.map.startPositions[0][0].d)
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(2, 4),
                            new Order.Stand(new Position(currentState.map.startPositions[1][0].x, currentState.map.startPositions[1][0].y), currentState.map.startPositions[1][0].d)
                        )
                    ])
                ]
            );
            currentState.resolveManager.processStep(0).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x, y: currentState.map.startPositions[0][0].y}, 3, 4, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x, y: currentState.map.startPositions[1][0].y}, 3, 4, currentState.map.startPositions[1][0].d);
                return currentState.resolveManager.processStep(1);
            }).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x + 1, y: currentState.map.startPositions[0][0].y}, 2, 4, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x, y: currentState.map.startPositions[1][0].y}, 2, 4, currentState.map.startPositions[1][0].d);
                done();
            });
        });

        it("attack from 1st pawn", function (done) {
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(2, 4),
                            new Order.Move(new Position(currentState.map.startPositions[0][0].x + 1, currentState.map.startPositions[0][0].y), currentState.map.startPositions[0][0].d)
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(2, 4),
                            new Order.Stand(new Position(currentState.map.startPositions[1][0].x, currentState.map.startPositions[1][0].y), currentState.map.startPositions[1][0].d)
                        )
                    ]),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(1, 4),
                            new Order.Attack(new Position(currentState.map.startPositions[0][0].x + 1, currentState.map.startPositions[0][0].y), currentState.map.startPositions[0][0].d, [{ entityId: currentState.pawns[1]._id, dodge: false }])
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(1, 3),
                            new Order.Attack(new Position(currentState.map.startPositions[1][0].x, currentState.map.startPositions[1][0].y), currentState.map.startPositions[1][0].d, [{ entityId: currentState.pawns[0]._id, dodge: true }])
                        )
                    ])
                ]
            );
            currentState.resolveManager.processStep(0).then(() => {
            }).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x, y: currentState.map.startPositions[0][0].y}, 3, 4, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x, y: currentState.map.startPositions[1][0].y}, 3, 4, currentState.map.startPositions[1][0].d);
                return currentState.resolveManager.processStep(1);
            }).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x + 1, y: currentState.map.startPositions[0][0].y}, 2, 4, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x, y: currentState.map.startPositions[1][0].y}, 2, 4, currentState.map.startPositions[1][0].d);
                return currentState.resolveManager.processStep(2);
            }).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x + 1, y: currentState.map.startPositions[0][0].y}, 1, 4, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x, y: currentState.map.startPositions[1][0].y}, 1, 3, currentState.map.startPositions[1][0].d);
                done();
            });
        });

        it("move then cast from 1st pawn while 2nd move", function (done) {
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(2, 4),
                            new Order.Move(new Position(currentState.map.startPositions[0][0].x, currentState.map.startPositions[0][0].y - 1), currentState.map.startPositions[0][0].d)
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(2, 4),
                            new Order.Move(new Position(currentState.map.startPositions[1][0].x, currentState.map.startPositions[1][0].y - 1), currentState.map.startPositions[1][0].d)
                        )
                    ]),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(0, 4),
                            new Order.Fire(new Position(currentState.map.startPositions[0][0].x, currentState.map.startPositions[0][0].y - 1), currentState.map.startPositions[0][0].d, [currentState.pawns[1]._id])
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(1, 2),
                            new Order.Move(new Position(currentState.map.startPositions[1][0].x - 1, currentState.map.startPositions[1][0].y - 1), currentState.map.startPositions[1][0].d)
                        )
                    ]),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(0, 3),
                            new Order.Stand(new Position(currentState.map.startPositions[0][0].x, currentState.map.startPositions[0][0].y - 1), currentState.map.startPositions[0][0].d, [currentState.pawns[1]._id])
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(0, 2),
                            new Order.Move(new Position(currentState.map.startPositions[1][0].x - 1, currentState.map.startPositions[1][0].y - 1), currentState.map.startPositions[1][0].d, { entity: currentState.pawns[0]._id, dodge: false })
                        )
                    ])
                ]
            );
            currentState.resolveManager.processStep(0).then(() => {
            }).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x, y: currentState.map.startPositions[0][0].y}, 3, 4, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x, y: currentState.map.startPositions[1][0].y}, 3, 4, currentState.map.startPositions[1][0].d);
                return currentState.resolveManager.processStep(1);
            }).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x, y: currentState.map.startPositions[0][0].y - 1}, 2, 4, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x, y: currentState.map.startPositions[1][0].y - 1}, 2, 4, currentState.map.startPositions[1][0].d);
                return currentState.resolveManager.processStep(2);
            }).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x, y: currentState.map.startPositions[0][0].y - 1}, 0, 4, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x - 1, y: currentState.map.startPositions[1][0].y - 1}, 1, 2, currentState.map.startPositions[1][0].d);
                return currentState.resolveManager.processStep(3);
            }).then(() => {
                testStepResolution(0, {x: currentState.map.startPositions[0][0].x, y: currentState.map.startPositions[0][0].y - 1}, 0, 3, currentState.map.startPositions[0][0].d);
                testStepResolution(1, {x: currentState.map.startPositions[1][0].x - 1, y: currentState.map.startPositions[1][0].y - 1}, 0, 2, currentState.map.startPositions[1][0].d);
                done();
            });
        });
    });
}