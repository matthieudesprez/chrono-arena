/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena.Specs {
    import Main = TacticArena.State.Main;

    describe("ResolveManager", () => {
        var testGame, currentState;

        function getInitialStep() {
            return [
                {
                    entity: currentState.pawns[0],
                    order: { action: "stand", direction: "E", x: 8, y: 8 },
                    entityState: getEntityState(3, 4)
                },
                {
                    entity: currentState.pawns[1],
                    order: { action: "stand", direction: "W", x: 10, y: 8 },
                    entityState: getEntityState(3, 4)
                }
            ];
        }

        function getEntityState(ap, hp) {
            return {
                ap: ap,
                hp: hp,
                moveHasBeenBlocked: false,
                positionBlocked: false
            };
        }

        function testStepResolution(index, position, ap, hp) {
            let pawn = currentState.pawns[index];
            expect(pawn.getPosition()).toEqual(position);
            expect(pawn.getAp()).toEqual(ap);
            expect(pawn.getHp()).toEqual(hp);
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
                    currentState.pawns.push(new Entity.Pawn(currentState, 8, 8, 'E', 'skeleton', 1, false, 'Eikio'));
                    currentState.pawns.push(new Entity.Pawn(currentState, 10, 8, 'W', 'skeleton', 2, false, 'Dormammu'));
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
                            order: { action: "move", direction: "E", x: 9, y: 8 },
                            entityState: getEntityState(2, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: { action: "stand", direction: "W", x: 10, y: 8 },
                            entityState: getEntityState(2, 4)
                        }
                    ]
                ]
            );
            currentState.resolveManager.processStep(0).then((res) => {
            }).then((res) => {

            }, (res) => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4);
                testStepResolution(1, {x: 10, y: 8}, 3, 4);
                currentState.resolveManager.processStep(1).then((res) => {

                }, (res) => {
                    testStepResolution(0, {x: 9, y: 8}, 2, 4);
                    testStepResolution(1, {x: 10, y: 8}, 2, 4);
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
                            order: { action: "move", direction: "E", x: 9, y: 8 },
                            entityState: getEntityState(2, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: { action: "stand", direction: "W", x: 10, y: 8 },
                            entityState: getEntityState(2, 4)
                        }
                    ],
                    [
                        {
                            entity: currentState.pawns[0],
                            order: {
                                action: "attack", direction: "E", x: 9, y: 8, target: { entity: currentState.pawns[1], dodge: false }
                            },
                            entityState: getEntityState(1, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: {
                                action: "attack", direction: "W", x: 10, y: 8, target: { entity: currentState.pawns[0], dodge: true }
                            },
                            entityState: getEntityState(1, 3)
                        }
                    ]
                ]
            );
            currentState.resolveManager.processStep(0).then((res) => {
            }).then((res) => {

            }, (res) => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4);
                testStepResolution(1, {x: 10, y: 8}, 3, 4);
                currentState.resolveManager.processStep(1).then((res) => {

                }, (res) => {
                    testStepResolution(0, {x: 9, y: 8}, 2, 4);
                    testStepResolution(1, {x: 10, y: 8}, 2, 4);
                    currentState.resolveManager.processStep(2).then((res) => {

                    }, (res) => {
                        testStepResolution(0, {x: 9, y: 8}, 1, 4);
                        testStepResolution(1, {x: 10, y: 8}, 1, 3);
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
                            order: { action: "move", direction: "E", x: 8, y: 7 },
                            entityState: getEntityState(2, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: { action: "move", direction: "W", x: 10, y: 7 },
                            entityState: getEntityState(2, 4)
                        }
                    ],
                    [
                        {
                            entity: currentState.pawns[0],
                            order: {action: "cast", direction: "E", x: 8, y: 7, targets: [currentState.pawns[1]] },
                            entityState: getEntityState(0, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: { action: "move", direction: "W", x: 9, y: 7 },
                            entityState: getEntityState(1, 2)
                        }
                    ],
                    [
                        {
                            entity: currentState.pawns[0],
                            order: {action: "stand", direction: "E", x: 8, y: 7, targets: [currentState.pawns[1]] },
                            entityState: getEntityState(0, 3)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: { action: "move", direction: "W", x: 9, y: 7, target: { entity: currentState.pawns[0], dodge: false } },
                            entityState: getEntityState(0, 2)
                        }
                    ]
                ]
            );
            currentState.resolveManager.processStep(0).then((res) => {
            }).then((res) => {

            }, (res) => {
                testStepResolution(0, {x: 8, y: 8}, 3, 4);
                testStepResolution(1, {x: 10, y: 8}, 3, 4);
                currentState.resolveManager.processStep(1).then((res) => {

                }, (res) => {
                    testStepResolution(0, {x: 8, y: 7}, 2, 4);
                    testStepResolution(1, {x: 10, y: 7}, 2, 4);
                    currentState.resolveManager.processStep(2).then((res) => {

                    }, (res) => {
                        testStepResolution(0, {x: 8, y: 7}, 0, 4);
                        testStepResolution(1, {x: 9, y: 7}, 1, 2);
                        currentState.resolveManager.processStep(3).then((res) => {

                        }, (res) => {
                            testStepResolution(0, {x: 8, y: 7}, 0, 3);
                            testStepResolution(1, {x: 9, y: 7}, 0, 2);
                            done();
                        });
                    });
                });
            });
        });
    });
}