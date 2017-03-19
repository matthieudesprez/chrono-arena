/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>


module TacticArena.Specs {
    //import TestGame = TacticalArena.Specs.TestGame;
    import Main = TacticArena.State.Main;
    describe("OrderManager", () => {
        var testGame, currentState;

        beforeEach(function (done) {
            testGame = new TestGame(true);
            testGame.state.start('test');
            //spyOn(console, "log").and.stub();
            //spyOn(console, "warn").and.stub();
            //spyOn(testGame, "add").and.stub();

            //spyOn(testGame.state, 'onInitCallback').and.callFake(() => {
            //    console.log('o');
            //});

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


        describe("2 players / Fleerate 0%", () => {

            beforeEach(function () {
                spyOn(currentState.orderManager, 'resolutionEsquive').and.callFake(() => {
                   return true;
                });
            });

            it("nothing is played", function (done) {
                setTimeout(function () {
                    let steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(2);
                    expect(steps[0].length).toEqual(2);

                    expect(steps[0][0].entity._id).toEqual(1);
                    expect(steps[0][0].order.action).toEqual('stand');
                    expect(steps[0][0].order.direction).toEqual('E');
                    expect(steps[0][0].order.x).toEqual(8);
                    expect(steps[0][0].order.y).toEqual(8);
                    expect(steps[0][0].entityState.ap).toEqual(3);

                    expect(steps[0][1].entity._id).toEqual(2);
                    expect(steps[0][1].order.action).toEqual('stand');
                    expect(steps[0][1].order.direction).toEqual('W');
                    expect(steps[0][1].order.x).toEqual(10);
                    expect(steps[0][1].order.y).toEqual(8);
                    expect(steps[0][1].entityState.ap).toEqual(3);

                    expect(steps[1][0].entity._id).toEqual(1);
                    expect(steps[1][0].order.action).toEqual('stand');
                    expect(steps[1][0].order.direction).toEqual('E');
                    expect(steps[1][0].order.x).toEqual(8);
                    expect(steps[1][0].order.y).toEqual(8);
                    expect(steps[1][0].entityState.ap).toEqual(2);

                    expect(steps[1][1].entity._id).toEqual(2);
                    expect(steps[1][1].order.action).toEqual('stand');
                    expect(steps[1][1].order.direction).toEqual('W');
                    expect(steps[1][1].order.x).toEqual(10);
                    expect(steps[1][1].order.y).toEqual(8);
                    expect(steps[1][1].entityState.ap).toEqual(2);

                    done();
                }, 200);
            });

            it("1st one stands same position for 1 step", function (done) {
                setTimeout(function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                {
                                    action: "stand",
                                    direction: "E",
                                    x: 8,
                                    y: 8
                                }
                            ]
                        }
                    ];
                    let steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(2);
                    expect(steps[0].length).toEqual(2);

                    expect(steps[0][0].entity._id).toEqual(1);
                    expect(steps[0][0].order.action).toEqual('stand');
                    expect(steps[0][0].order.direction).toEqual('E');
                    expect(steps[0][0].order.x).toEqual(8);
                    expect(steps[0][0].order.y).toEqual(8);
                    expect(steps[0][0].entityState.ap).toEqual(3);

                    expect(steps[0][1].entity._id).toEqual(2);
                    expect(steps[0][1].order.action).toEqual('stand');
                    expect(steps[0][1].order.direction).toEqual('W');
                    expect(steps[0][1].order.x).toEqual(10);
                    expect(steps[0][1].order.y).toEqual(8);
                    expect(steps[0][1].entityState.ap).toEqual(3);

                    expect(steps[1][0].entity._id).toEqual(1);
                    expect(steps[1][0].order.action).toEqual('stand');
                    expect(steps[1][0].order.direction).toEqual('E');
                    expect(steps[1][0].order.x).toEqual(8);
                    expect(steps[1][0].order.y).toEqual(8);
                    expect(steps[1][0].entityState.ap).toEqual(2);

                    expect(steps[1][1].entity._id).toEqual(2);
                    expect(steps[1][1].order.action).toEqual('stand');
                    expect(steps[1][1].order.direction).toEqual('W');
                    expect(steps[1][1].order.x).toEqual(10);
                    expect(steps[1][1].order.y).toEqual(8);
                    expect(steps[1][1].entityState.ap).toEqual(2);

                    done();
                }, 200);
            });

            it("1st one moves toward the 2nd for 2 steps", function (done) {
                setTimeout(function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                {
                                    action: "move",
                                    direction: "E",
                                    x: 9,
                                    y: 8
                                },
                                {
                                    action: "move",
                                    direction: "E",
                                    x: 10,
                                    y: 8
                                },
                            ]
                        }
                    ];
                    let steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(3);
                    expect(steps[0].length).toEqual(2);

                    expect(steps[1][0].entity._id).toEqual(1);
                    expect(steps[1][0].order.action).toEqual('move');
                    expect(steps[1][0].order.direction).toEqual('E');
                    expect(steps[1][0].order.x).toEqual(9);
                    expect(steps[1][0].order.y).toEqual(8);
                    expect(steps[1][0].entityState.ap).toEqual(2);

                    expect(steps[1][1].entity._id).toEqual(2);
                    expect(steps[1][1].order.action).toEqual('stand');
                    expect(steps[1][1].order.direction).toEqual('W');
                    expect(steps[1][1].order.x).toEqual(10);
                    expect(steps[1][1].order.y).toEqual(8);
                    expect(steps[1][1].entityState.ap).toEqual(2);

                    expect(steps[2][0].entity._id).toEqual(1);
                    expect(steps[2][0].order.action).toEqual('attack');
                    expect(steps[2][0].order.direction).toEqual('E');
                    expect(steps[2][0].order.x).toEqual(9);
                    expect(steps[2][0].order.y).toEqual(8);
                    expect(steps[2][0].entityState.ap).toEqual(1);

                    expect(steps[2][1].entity._id).toEqual(2);
                    expect(steps[2][1].order.action).toEqual('attack');
                    expect(steps[2][1].order.direction).toEqual('W');
                    expect(steps[2][1].order.x).toEqual(10);
                    expect(steps[2][1].order.y).toEqual(8);
                    expect(steps[2][1].entityState.ap).toEqual(1);

                    done();
                }, 200);
            });

            it("both going same position then the first one wants to continue moving", function (done) {
                setTimeout(function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                {
                                    action: "move",
                                    direction: "E",
                                    x: 9,
                                    y: 8
                                },
                                {
                                    action: "move",
                                    direction: "E",
                                    x: 9,
                                    y: 9
                                },
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                {
                                    action: "move",
                                    direction: "W",
                                    x: 9,
                                    y: 8
                                }
                            ]
                        }
                    ];
                    let steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(3);
                    expect(steps[0].length).toEqual(2);

                    expect(steps[1][0].entity._id).toEqual(1);
                    expect(steps[1][0].order.action).toEqual('move');
                    expect(steps[1][0].order.direction).toEqual('E');
                    expect(steps[1][0].order.x).toEqual(8);
                    expect(steps[1][0].order.y).toEqual(8);
                    expect(steps[1][0].entityState.ap).toEqual(2);
                    expect(steps[1][0].entityState.moveHasBeenBlocked).toBeTruthy();
                    expect(steps[1][0].entityState.positionBlocked).toEqual({x: 8, y: 8});

                    expect(steps[1][1].entity._id).toEqual(2);
                    expect(steps[1][1].order.action).toEqual('move');
                    expect(steps[1][1].order.direction).toEqual('W');
                    expect(steps[1][1].order.x).toEqual(10);
                    expect(steps[1][1].order.y).toEqual(8);
                    expect(steps[1][1].entityState.ap).toEqual(2);
                    expect(steps[1][1].entityState.moveHasBeenBlocked).toBeTruthy();
                    expect(steps[1][1].entityState.positionBlocked).toEqual({x: 10, y: 8});

                    expect(steps[2][0].entity._id).toEqual(1);
                    expect(steps[2][0].order.action).toEqual('stand');
                    expect(steps[2][0].order.direction).toEqual('E');
                    expect(steps[2][0].order.x).toEqual(8);
                    expect(steps[2][0].order.y).toEqual(8);
                    expect(steps[2][0].entityState.ap).toEqual(1);
                    expect(steps[2][0].entityState.moveHasBeenBlocked).toBeFalsy();

                    expect(steps[2][1].entity._id).toEqual(2);
                    expect(steps[2][1].order.action).toEqual('stand');
                    expect(steps[2][1].order.direction).toEqual('W');
                    expect(steps[2][1].order.x).toEqual(10);
                    expect(steps[2][1].order.y).toEqual(8);
                    expect(steps[2][1].entityState.ap).toEqual(1);
                    expect(steps[2][1].entityState.moveHasBeenBlocked).toBeFalsy();

                    done();
                }, 200);
            });

            it("the first one wants moves in front of the second, then continues moving, facing the other", function (done) {
                setTimeout(function () {
                    console.log(currentState.pawns);
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                {
                                    action: "move",
                                    direction: "E",
                                    x: 9,
                                    y: 8
                                },
                                {
                                    action: "move",
                                    direction: "E",
                                    x: 9,
                                    y: 9
                                },
                                {
                                    action: "move",
                                    direction: "E",
                                    x: 10,
                                    y: 9
                                }
                            ]
                        }
                    ];
                    let steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].length).toEqual(2);

                    expect(steps[1][0].entity._id).toEqual(1);
                    expect(steps[1][0].order.action).toEqual('move');
                    expect(steps[1][0].order.direction).toEqual('E');
                    expect(steps[1][0].order.x).toEqual(9);
                    expect(steps[1][0].order.y).toEqual(8);
                    expect(steps[1][0].entityState.ap).toEqual(2);
                    expect(steps[1][0].entityState.hp).toEqual(4);
                    expect(steps[1][0].entityState.moveHasBeenBlocked).toBeFalsy();
                    expect(steps[1][0].entityState.positionBlocked).toEqual({});

                    expect(steps[1][1].entity._id).toEqual(2);
                    expect(steps[1][1].order.action).toEqual('stand');
                    expect(steps[1][1].order.direction).toEqual('W');
                    expect(steps[1][1].order.x).toEqual(10);
                    expect(steps[1][1].order.y).toEqual(8);
                    expect(steps[1][1].entityState.hp).toEqual(4);
                    expect(steps[1][1].entityState.moveHasBeenBlocked).toBeFalsy();
                    expect(steps[1][1].entityState.positionBlocked).toEqual({});

                    expect(steps[2][0].entity._id).toEqual(1);
                    expect(steps[2][0].order.action).toEqual('attack');
                    expect(steps[2][0].order.direction).toEqual('E');
                    expect(steps[2][0].order.x).toEqual(9);
                    expect(steps[2][0].order.y).toEqual(8);
                    expect(steps[2][0].entityState.ap).toEqual(1);
                    expect(steps[2][0].entityState.hp).toEqual(3);
                    expect(steps[2][0].entityState.moveHasBeenBlocked).toBeTruthy();
                    expect(steps[2][0].entityState.positionBlocked).toEqual({x: 9, y: 8});

                    expect(steps[2][1].entity._id).toEqual(2);
                    expect(steps[2][1].order.action).toEqual('attack');
                    expect(steps[2][1].order.direction).toEqual('W');
                    expect(steps[2][1].order.x).toEqual(10);
                    expect(steps[2][1].order.y).toEqual(8);
                    expect(steps[2][1].entityState.ap).toEqual(1);
                    expect(steps[2][1].entityState.hp).toEqual(3);
                    expect(steps[2][1].entityState.moveHasBeenBlocked).toBeFalsy();

                    expect(steps[3][0].entity._id).toEqual(1);
                    expect(steps[3][0].order.action).toEqual('attack');
                    expect(steps[3][0].order.direction).toEqual('E');
                    expect(steps[3][0].order.x).toEqual(9);
                    expect(steps[3][0].order.y).toEqual(8);
                    expect(steps[3][0].entityState.ap).toEqual(0);
                    expect(steps[3][0].entityState.hp).toEqual(2);
                    expect(steps[3][0].entityState.moveHasBeenBlocked).toBeTruthy();
                    expect(steps[3][0].entityState.positionBlocked).toEqual({x: 9, y: 8});

                    expect(steps[3][1].entity._id).toEqual(2);
                    expect(steps[3][1].order.action).toEqual('attack');
                    expect(steps[3][1].order.direction).toEqual('W');
                    expect(steps[3][1].order.x).toEqual(10);
                    expect(steps[3][1].order.y).toEqual(8);
                    expect(steps[3][1].entityState.ap).toEqual(0);
                    expect(steps[3][1].entityState.hp).toEqual(2);
                    expect(steps[3][1].entityState.moveHasBeenBlocked).toBeFalsy();

                    done();
                }, 200);
            });

            it("the first one wants moves in front of the second, then continues moving, without facing the other", function (done) {
                setTimeout(function () {
                    console.log(currentState.pawns);
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                {
                                    action: "stand",
                                    direction: "S",
                                    x: 8,
                                    y: 8
                                },
                                {
                                    action: "move",
                                    direction: "S",
                                    x: 9,
                                    y: 8
                                },
                                {
                                    action: "move",
                                    direction: "S",
                                    x: 9,
                                    y: 9
                                }
                            ]
                        }
                    ];
                    let steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].length).toEqual(2);

                    expect(steps[1][0].entity._id).toEqual(1);
                    expect(steps[1][0].order.action).toEqual('stand');
                    expect(steps[1][0].order.direction).toEqual('S');
                    expect(steps[1][0].order.x).toEqual(8);
                    expect(steps[1][0].order.y).toEqual(8);
                    expect(steps[1][0].entityState.ap).toEqual(2);
                    expect(steps[1][0].entityState.hp).toEqual(4);
                    expect(steps[1][0].entityState.moveHasBeenBlocked).toBeFalsy();
                    expect(steps[1][0].entityState.positionBlocked).toEqual({});

                    expect(steps[1][1].entity._id).toEqual(2);
                    expect(steps[1][1].order.action).toEqual('stand');
                    expect(steps[1][1].order.direction).toEqual('W');
                    expect(steps[1][1].order.x).toEqual(10);
                    expect(steps[1][1].order.y).toEqual(8);
                    expect(steps[1][1].entityState.ap).toEqual(2);
                    expect(steps[1][1].entityState.hp).toEqual(4);
                    expect(steps[1][1].entityState.moveHasBeenBlocked).toBeFalsy();
                    expect(steps[1][1].entityState.positionBlocked).toEqual({});

                    expect(steps[2][0].entity._id).toEqual(1);
                    expect(steps[2][0].order.action).toEqual('move');
                    expect(steps[2][0].order.direction).toEqual('S');
                    expect(steps[2][0].order.x).toEqual(9);
                    expect(steps[2][0].order.y).toEqual(8);
                    expect(steps[2][0].entityState.ap).toEqual(1);
                    expect(steps[2][0].entityState.hp).toEqual(4);
                    expect(steps[2][0].entityState.moveHasBeenBlocked).toBeFalsy();
                    expect(steps[2][0].entityState.positionBlocked).toEqual({});

                    expect(steps[2][1].entity._id).toEqual(2);
                    expect(steps[2][1].order.action).toEqual('stand');
                    expect(steps[2][1].order.direction).toEqual('W');
                    expect(steps[2][1].order.x).toEqual(10);
                    expect(steps[2][1].order.y).toEqual(8);
                    expect(steps[2][1].entityState.ap).toEqual(1);
                    expect(steps[2][1].entityState.hp).toEqual(4);
                    expect(steps[2][1].entityState.moveHasBeenBlocked).toBeFalsy();

                    expect(steps[3][0].entity._id).toEqual(1);
                    expect(steps[3][0].order.action).toEqual('move');
                    expect(steps[3][0].order.direction).toEqual('S');
                    expect(steps[3][0].order.x).toEqual(9);
                    expect(steps[3][0].order.y).toEqual(8);
                    expect(steps[3][0].entityState.ap).toEqual(0);
                    expect(steps[3][0].entityState.hp).toEqual(3);
                    expect(steps[3][0].entityState.moveHasBeenBlocked).toBeTruthy();
                    expect(steps[3][0].entityState.positionBlocked).toEqual({x: 9, y: 8});

                    expect(steps[3][1].entity._id).toEqual(2);
                    expect(steps[3][1].order.action).toEqual('attack');
                    expect(steps[3][1].order.direction).toEqual('W');
                    expect(steps[3][1].order.x).toEqual(10);
                    expect(steps[3][1].order.y).toEqual(8);
                    expect(steps[3][1].entityState.ap).toEqual(0);
                    expect(steps[3][1].entityState.hp).toEqual(4);
                    expect(steps[3][1].entityState.moveHasBeenBlocked).toBeFalsy();

                    done();
                }, 200);
            });

            it("the first one wants moves north then casts to the east while the other moves in the dmg area then comes cac", function (done) {
                setTimeout(function () {
                    console.log(currentState.pawns);
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                {
                                    action: "move",
                                    direction: "E",
                                    x: 8,
                                    y: 7
                                },
                                {
                                    action: "cast",
                                    direction: "E",
                                    x: 8,
                                    y: 7
                                }
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                {
                                    action: "move",
                                    direction: "W",
                                    x: 10,
                                    y: 7
                                },
                                {
                                    action: "move",
                                    direction: "W",
                                    x: 9,
                                    y: 7
                                },
                                {
                                    action: "move",
                                    direction: "W",
                                    x: 9,
                                    y: 6
                                }
                            ]
                        },
                    ];
                    let steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].length).toEqual(2);

                    expect(steps[1][0].entity._id).toEqual(1);
                    expect(steps[1][0].order.action).toEqual('move');
                    expect(steps[1][0].order.direction).toEqual('E');
                    expect(steps[1][0].order.x).toEqual(8);
                    expect(steps[1][0].order.y).toEqual(7);
                    expect(steps[1][0].entityState.ap).toEqual(2);
                    expect(steps[1][0].entityState.hp).toEqual(4);

                    expect(steps[1][1].entity._id).toEqual(2);
                    expect(steps[1][1].order.action).toEqual('move');
                    expect(steps[1][1].order.direction).toEqual('W');
                    expect(steps[1][1].order.x).toEqual(10);
                    expect(steps[1][1].order.y).toEqual(7);
                    expect(steps[1][1].entityState.ap).toEqual(2);
                    expect(steps[1][1].entityState.hp).toEqual(4);

                    expect(steps[2][0].entity._id).toEqual(1);
                    expect(steps[2][0].order.action).toEqual('cast');
                    expect(steps[2][0].order.direction).toEqual('E');
                    expect(steps[2][0].order.x).toEqual(8);
                    expect(steps[2][0].order.y).toEqual(7);
                    expect(steps[2][0].order.targets).toEqual([{entity: currentState.pawns[1], state: steps[2][1].entityState}]);
                    expect(steps[2][0].entityState.ap).toEqual(0);
                    expect(steps[2][0].entityState.hp).toEqual(4);

                    expect(steps[2][1].entity._id).toEqual(2);
                    expect(steps[2][1].order.action).toEqual('move');
                    expect(steps[2][1].order.direction).toEqual('W');
                    expect(steps[2][1].order.x).toEqual(9);
                    expect(steps[2][1].order.y).toEqual(7);
                    expect(steps[2][1].entityState.ap).toEqual(1);
                    expect(steps[2][1].entityState.hp).toEqual(2);
                    expect(steps[2][1].entityState.isBurned).toBeTruthy();

                    expect(steps[3][0].entity._id).toEqual(1);
                    expect(steps[3][0].order.action).toEqual('attack');
                    expect(steps[3][0].order.direction).toEqual('E');
                    expect(steps[3][0].order.x).toEqual(8);
                    expect(steps[3][0].order.y).toEqual(7);
                    // FIXME Ne devrait pas etre inférieur à -1 car plus de AP donc ne devrait pas attack non plus
                    expect(steps[3][0].entityState.ap).toEqual(-1);
                    expect(steps[3][0].entityState.hp).toEqual(3);

                    expect(steps[3][1].entity._id).toEqual(2);
                    expect(steps[3][1].order.action).toEqual('attack');
                    expect(steps[3][1].order.direction).toEqual('W');
                    expect(steps[3][1].order.x).toEqual(9);
                    expect(steps[3][1].order.y).toEqual(7);
                    expect(steps[3][1].entityState.ap).toEqual(0);
                    expect(steps[3][1].entityState.hp).toEqual(1);

                    done();
                }, 200);
            });
        });
    });
}