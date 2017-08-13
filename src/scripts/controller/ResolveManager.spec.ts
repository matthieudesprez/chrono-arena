/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena.Specs {
    describe("ResolveManager", () => {
        var testGame, currentState;

        function getInitialStep() {
            return [
                {
                    entity: currentState.pawns[0],
                    order: new Order.Stand(new Position(8, 8), 'E'),
                    data: getStepUnitData(3, 4)
                },
                {
                    entity: currentState.pawns[1],
                    order: new Order.Stand(new Position(10, 8), 'W'),
                    data: getStepUnitData(3, 4)
                }
            ];
        }

        function getStepUnitData(ap, hp) {
            return {
                ap: ap,
                hp: hp,
                moveHasBeenBlocked: false,
                positionBlocked: false
            };
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
                    [
                        {
                            entity: currentState.pawns[0],
                            order: new Order.Move(new Position(9, 8), 'E'),
                            data: getStepUnitData(2, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: new Order.Stand(new Position(10, 8), 'W'),
                            data: getStepUnitData(2, 4)
                        }
                    ]
                ]
            );
            currentState.resolveManager.processStep(0).then((res) => {
            }).then((res) => {

            }, (res) => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 3, 4, 'W');
                currentState.resolveManager.processStep(1).then((res) => {

                }, (res) => {
                    testStepResolution(0, {x: 9, y: 8}, 2, 4, 'E');
                    testStepResolution(1, {x: 10, y: 8}, 2, 4, 'W');
                    done();
                });
            });
        });

        it("attack from 1st pawn", function (done) {
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    [
                        {
                            entity: currentState.pawns[0],
                            order: new Order.Move(new Position(9, 8), 'E'),
                            data: getStepUnitData(2, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: new Order.Stand(new Position(10, 8), 'W'),
                            data: getStepUnitData(2, 4)
                        }
                    ],
                    [
                        {
                            entity: currentState.pawns[0],
                            order: new Order.Attack(new Position(9, 8), 'E', [{ entityId: currentState.pawns[1]._id, dodge: false }]),
                            data: getStepUnitData(1, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: new Order.Attack(new Position(10, 8), 'W', [{ entityId: currentState.pawns[0]._id, dodge: true }]),
                            data: getStepUnitData(1, 3)
                        }
                    ]
                ]
            );
            currentState.resolveManager.processStep(0).then((res) => {
            }).then((res) => {

            }, (res) => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 3, 4, 'W');
                currentState.resolveManager.processStep(1).then((res) => {

                }, (res) => {
                    testStepResolution(0, {x: 9, y: 8}, 2, 4, 'E');
                    testStepResolution(1, {x: 10, y: 8}, 2, 4, 'W');
                    currentState.resolveManager.processStep(2).then((res) => {

                    }, (res) => {
                        testStepResolution(0, {x: 9, y: 8}, 1, 4, 'E');
                        testStepResolution(1, {x: 10, y: 8}, 1, 3, 'W');
                        done();
                    });
                });
            });
        });

        it("move then cast from 1st pawn while 2nd move", function (done) {
            currentState.resolveManager.init(
                [
                    getInitialStep(),
                    [
                        {
                            entity: currentState.pawns[0],
                            order: new Order.Move(new Position(8, 7), 'E'),
                            data: getStepUnitData(2, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: new Order.Move(new Position(10, 7), 'W'),
                            data: getStepUnitData(2, 4)
                        }
                    ],
                    [
                        {
                            entity: currentState.pawns[0],
                            order: new Order.Fire(new Position(8, 7), 'E', [currentState.pawns[1]._id]),
                            data: getStepUnitData(0, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: new Order.Move(new Position(9, 7), 'W'),
                            data: getStepUnitData(1, 2)
                        }
                    ],
                    [
                        {
                            entity: currentState.pawns[0],
                            order: new Order.Stand(new Position(8, 7), 'E', [currentState.pawns[1]._id]),
                            data: getStepUnitData(0, 3)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: new Order.Move(new Position(9, 7), 'W', { entity: currentState.pawns[0]._id, dodge: false }),
                            data: getStepUnitData(0, 2)
                        }
                    ]
                ]
            );
            currentState.resolveManager.processStep(0).then((res) => {
            }).then((res) => {

            }, (res) => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4, 'E');
                testStepResolution(1, {x: 10, y: 8}, 3, 4, 'W');
                currentState.resolveManager.processStep(1).then((res) => {

                }, (res) => {
                    testStepResolution(0, {x: 8, y: 7}, 2, 4, 'E');
                    testStepResolution(1, {x: 10, y: 7}, 2, 4, 'W');
                    currentState.resolveManager.processStep(2).then((res) => {

                    }, (res) => {
                        testStepResolution(0, {x: 8, y: 7}, 0, 4, 'E');
                        testStepResolution(1, {x: 9, y: 7}, 1, 2, 'W');
                        currentState.resolveManager.processStep(3).then((res) => {

                        }, (res) => {
                            testStepResolution(0, {x: 8, y: 7}, 0, 3, 'E');
                            testStepResolution(1, {x: 9, y: 7}, 0, 2, 'W');
                            done();
                        });
                    });
                });
            });
        });
    });
}