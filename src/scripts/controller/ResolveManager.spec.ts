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
                    new Order.Stand(new Position(8, 8), 'E')
                ),
                new Entity.StepUnit(
                    currentState.pawns[1],
                    new Entity.StepUnitData(3, 4),
                    new Order.Stand(new Position(10, 8), 'W')
                )
            ]);
            return result;
        }

        function testStepResolution(index, position, ap, hp, direction) {
            let pawn = currentState.pawns[index];
            expect(pawn.getPosition().equals(position)).toEqual(true);
            expect(pawn.getAp()).toEqual(ap);
            expect(pawn.getHp()).toEqual(hp);
            expect(pawn.getDirection()).toEqual(direction);
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
                    currentState.pawns = [];
                    currentState.pathTilesGroup = currentState.add.group();
                    currentState.pawnsSpritesGroup = currentState.add.group();
                    currentState.pawns.push(new Entity.Pawn(currentState, 8, 8, 'E', 'skeleton', 1, false, 1, 'Eikio'));
                    currentState.pawns.push(new Entity.Pawn(currentState, 10, 8, 'W', 'skeleton', 2, false, 2, 'Dormammu'));
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
                            new Order.Move(new Position(9, 8), 'E')
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(2, 4),
                            new Order.Stand(new Position(10, 8), 'W')
                        )
                    ])
                ]
            );
            currentState.resolveManager.processStep(0).then(() => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 3, 4, 'W');
                return currentState.resolveManager.processStep(1);
            }).then(() => {
                testStepResolution(0, {x: 9, y: 8}, 2, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 2, 4, 'W');
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
                            new Order.Move(new Position(9, 8), 'E')
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(2, 4),
                            new Order.Stand(new Position(10, 8), 'W')
                        )
                    ]),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(1, 4),
                            new Order.Attack(new Position(9, 8), 'E', [{ entityId: currentState.pawns[1]._id, dodge: false }])
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(1, 3),
                            new Order.Attack(new Position(10, 8), 'W', [{ entityId: currentState.pawns[0]._id, dodge: true }])
                        )
                    ])
                ]
            );
            currentState.resolveManager.processStep(0).then(() => {
            }).then(() => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 3, 4, 'W');
                return currentState.resolveManager.processStep(1);
            }).then(() => {
                testStepResolution(0, {x: 9, y: 8}, 2, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 2, 4, 'W');
                return currentState.resolveManager.processStep(2);
            }).then(() => {
                testStepResolution(0, {x: 9, y: 8}, 1, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 1, 3, 'W');
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
                            new Order.Move(new Position(8, 7), 'E')
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(2, 4),
                            new Order.Move(new Position(10, 7), 'W')
                        )
                    ]),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(0, 4),
                            new Order.Fire(new Position(8, 7), 'E', [currentState.pawns[1]._id])
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(1, 2),
                            new Order.Move(new Position(9, 7), 'W')
                        )
                    ]),
                    new Entity.Step([
                        new Entity.StepUnit(
                            currentState.pawns[0],
                            new Entity.StepUnitData(0, 3),
                            new Order.Stand(new Position(8, 7), 'E', [currentState.pawns[1]._id])
                        ),
                        new Entity.StepUnit(
                            currentState.pawns[1],
                            new Entity.StepUnitData(0, 2),
                            new Order.Move(new Position(9, 7), 'W', { entity: currentState.pawns[0]._id, dodge: false })
                        )
                    ])
                ]
            );
            currentState.resolveManager.processStep(0).then(() => {
            }).then(() => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 3, 4, 'W');
                return currentState.resolveManager.processStep(1);
            }).then(() => {
                testStepResolution(0, {x: 8, y: 7}, 2, 4, 'E');
                testStepResolution(1, {x: 10, y: 7}, 2, 4, 'W');
                return currentState.resolveManager.processStep(2);
            }).then(() => {
                testStepResolution(0, {x: 8, y: 7}, 0, 4, 'E');
                testStepResolution(1, {x: 9, y: 7}, 1, 2, 'W');
                return currentState.resolveManager.processStep(3);
            }).then(() => {
                testStepResolution(0, {x: 8, y: 7}, 0, 3, 'E');
                testStepResolution(1, {x: 9, y: 7}, 0, 2, 'W');
                done();
            });
        });
    });
}