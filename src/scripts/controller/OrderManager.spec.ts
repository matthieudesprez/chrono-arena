/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena.Specs {
    import Main = TacticArena.State.Main;

    describe("OrderManager", () => {
        var testGame, currentState;

        function testStep(steps, i, j, entityId, action, direction, orderPosition, ap, hp, moveHasBeenBlocked, positionBlocked) {
            expect(steps[i][j].entity._id).toEqual(entityId);
            expect(steps[i][j].order.action).toEqual(action);
            expect(steps[i][j].order.direction).toEqual(direction);
            expect(steps[i][j].order.x).toEqual(orderPosition.x);
            expect(steps[i][j].order.y).toEqual(orderPosition.y);
            expect(steps[i][j].entityState.ap).toEqual(ap);
            expect(steps[i][j].entityState.hp).toEqual(hp);
            expect(steps[i][j].entityState.moveHasBeenBlocked).toEqual(moveHasBeenBlocked);
            expect(steps[i][j].entityState.positionBlocked).toEqual(positionBlocked);
        }

        beforeEach(function (done) {
            spyOn(console, 'log').and.stub();
            spyOn(console, 'info').and.stub();
            spyOn(console, 'warn').and.stub();
            testGame = new TestGame(true);
            testGame.state.start('test');
            testGame.state.onStateChange.add(function () {
                currentState = testGame.state.getCurrentState();
                setTimeout(function () {
                    currentState.pawns = [];
                    currentState.pathTilesGroup = currentState.add.group();
                    currentState.pawnsSpritesGroup = currentState.add.group();
                    currentState.pawns.push(new Entity.Pawn(currentState, 8, 8, 'E', 'skeleton', 1, false, 1, 'Eikio'));
                    currentState.pawns.push(new Entity.Pawn(currentState, 10, 8, 'W', 'skeleton', 2, false, 2, 'Dormammu'));
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
                spyOn(TacticArena.Controller.OrderManager, 'resolutionEsquive').and.callFake(() => {
                    return true;
                });
            });

            it("nothing is played", function () {
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'stand', 'E', {x: 8, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, {});
            });

            it("1st one stands same position for 1 step", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            {action: "stand", direction: "E", x: 8, y: 8}
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'stand', 'E', {x: 8, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, {});
            });

            it("1st one moves toward the 2nd for 2 steps", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            {action: "move", direction: "E", x: 9, y: 8},
                            {action: "move", direction: "E", x: 10, y: 8}
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'move', 'E', {x: 9, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, {});
                testStep(steps, 2, 0, 1, 'attack', 'E', {x: 9, y: 8}, 1, 3, true, {x: 10, y: 8});
                testStep(steps, 2, 1, 2, 'attack', 'W', {x: 10, y: 8}, 1, 3, false, {});
            });

            it("both going same position then the first one wants to continue moving", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            {action: "move", direction: "E", x: 9, y: 8},
                            {action: "move", direction: "E", x: 9, y: 9},
                        ]
                    },
                    {
                        entity: currentState.pawns[1],
                        list: [
                            {action: "move", direction: "W", x: 9, y: 8}
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'move', 'E', {x: 8, y: 8}, 2, 4, true, {x: 9, y: 8});
                testStep(steps, 1, 1, 2, 'move', 'W', {x: 10, y: 8}, 2, 4, true, {x: 9, y: 8});
                testStep(steps, 2, 0, 1, 'stand', 'E', {x: 8, y: 8}, 1, 4, false, {});
                testStep(steps, 2, 1, 2, 'stand', 'W', {x: 10, y: 8}, 1, 4, false, {});
            });

            it("the first one wants moves in front of the second, then continues moving, facing the other", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            {action: "move", direction: "E", x: 9, y: 8},
                            {action: "move", direction: "E", x: 9, y: 9},
                            {action: "move", direction: "E", x: 10, y: 9}
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'move', 'E', {x: 9, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, {});
                testStep(steps, 2, 0, 1, 'move', 'E', {x: 9, y: 8}, 1, 3, true, {x: 9, y: 9});
                testStep(steps, 2, 1, 2, 'attack', 'W', {x: 10, y: 8}, 1, 4, false, {});
                testStep(steps, 3, 0, 1, 'attack', 'E', {x: 9, y: 8}, 0, 2, false, {});
                testStep(steps, 3, 1, 2, 'attack', 'W', {x: 10, y: 8}, 0, 3, false, {});
            });

            it("the first one wants moves in front of the second, then continues moving, without facing the other", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            {action: "stand", direction: "S", x: 8, y: 8},
                            {action: "move", direction: "S", x: 9, y: 8},
                            {action: "move", direction: "S", x: 9, y: 9}
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'stand', 'S', {x: 8, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, {});
                testStep(steps, 2, 0, 1, 'move', 'S', {x: 9, y: 8}, 1, 4, false, {});
                testStep(steps, 2, 1, 2, 'stand', 'W', {x: 10, y: 8}, 1, 4, false, {});
                testStep(steps, 3, 0, 1, 'move', 'S', {x: 9, y: 8}, 0, 3, true, {x: 9, y: 9});
                testStep(steps, 3, 1, 2, 'attack', 'W', {x: 10, y: 8}, 0, 4, false, {});
            });

            it("the first one wants moves north then casts to the east while the other moves in the dmg area then comes cac", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            {action: "move", direction: "E", x: 8, y: 7},
                            {action: "cast", direction: "E", x: 8, y: 7}
                        ]
                    },
                    {
                        entity: currentState.pawns[1],
                        list: [
                            {action: "move", direction: "W", x: 10, y: 7},
                            {action: "move", direction: "W", x: 9, y: 7},
                            {action: "move", direction: "W", x: 8, y: 7}
                        ]
                    },
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'move', 'E', {x: 8, y: 7}, 2, 4, false, {});
                testStep(steps, 1, 1, 2, 'move', 'W', {x: 10, y: 7}, 2, 4, false, {});
                testStep(steps, 2, 0, 1, 'cast', 'E', {x: 8, y: 7}, 0, 4, false, {});
                expect(steps[2][0].order.targets).toEqual([currentState.pawns[1]._id]);
                testStep(steps, 2, 1, 2, 'move', 'W', {x: 9, y: 7}, 1, 2, false, {});
                testStep(steps, 3, 0, 1, 'stand', 'E', {x: 8, y: 7}, 0, 3, false, {});
                testStep(steps, 3, 1, 2, 'attack', 'W', {x: 9, y: 7}, 0, 2, true, {x: 8, y: 7});
            });

            it("the first one casts to the east while the other moves toward him", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            {action: "cast", direction: "E", x: 8, y: 8}
                        ]
                    },
                    {
                        entity: currentState.pawns[1],
                        list: [
                            {action: "move", direction: "W", x: 9, y: 8},
                            {action: "move", direction: "W", x: 8, y: 8},
                            {action: "move", direction: "W", x: 7, y: 8}
                        ]
                    },
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'cast', 'E', {x: 8, y: 8}, 1, 4, false, {});
                expect(steps[1][0].order.targets).toEqual([currentState.pawns[1]._id]);
                testStep(steps, 1, 1, 2, 'move', 'W', {x: 9, y: 8}, 2, 2, false, {});
                testStep(steps, 2, 0, 1, 'attack', 'E', {x: 8, y: 8}, 0, 3, false, {});
                testStep(steps, 2, 1, 2, 'attack', 'W', {x: 9, y: 8}, 1, 1, true, {x: 8, y: 8});
                testStep(steps, 3, 0, 1, 'stand', 'E', {x: 8, y: 8}, 0, 2, false, {});
                testStep(steps, 3, 1, 2, 'attack', 'W', {x: 9, y: 8}, 0, 1, false, {});
            });
        });


        describe("4 players / Fleerate 0%", () => {
            beforeEach(function () {
                spyOn(TacticArena.Controller.OrderManager, 'resolutionEsquive').and.callFake(() => {
                    return true;
                });

                currentState.pawns.push(new Entity.Pawn(currentState, 7, 7, 'E', 'skeleton', 3, false, 2, 'Oscar'));
                currentState.pawns.push(new Entity.Pawn(currentState, 12, 7, 'W', 'skeleton', 4, false, 1, 'Diana'));
            });

            it("with 1 dead - nothing is played", function () {
                currentState.pawns[2].setHp(0);
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].length).toEqual(4);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 2, 3, 'stand', 'E', {x: 7, y: 7}, 0, 0, false, {});
                testStep(steps, 0, 3, 4, 'stand', 'W', {x: 12, y: 7}, 3, 4, false, {});
                testStep(steps, 1, 0, 1, 'stand', 'E', {x: 8, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 2, 3, 'stand', 'E', {x: 7, y: 7}, 0, 0, false, {});
                testStep(steps, 1, 3, 4, 'stand', 'W', {x: 12, y: 7}, 2, 4, false, {});
            });

            it("with 1 dead - 4th pawn moves", function () {
                currentState.pawns[2].setHp(0);
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[3],
                        list: [
                            {action: "move", direction: "W", x: 11, y: 7},
                            {action: "move", direction: "W", x: 11, y: 6}
                        ]
                    },
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].length).toEqual(4);
                testStep(steps, 0, 0, 4, 'stand', 'W', {x: 12, y: 7}, 3, 4, false, {});
                testStep(steps, 0, 1, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 2, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, {});
                testStep(steps, 0, 3, 3, 'stand', 'E', {x: 7, y: 7}, 0, 0, false, {});

                testStep(steps, 1, 0, 4, 'move', 'W', {x: 11, y: 7}, 2, 4, false, {});
                testStep(steps, 1, 1, 1, 'stand', 'E', {x: 8, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 2, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, {});
                testStep(steps, 1, 3, 3, 'stand', 'E', {x: 7, y: 7}, 0, 0, false, {});

                testStep(steps, 2, 0, 4, 'move', 'W', {x: 11, y: 6}, 1, 4, false, {});
                testStep(steps, 2, 1, 1, 'stand', 'E', {x: 8, y: 8}, 1, 4, false, {});
                testStep(steps, 2, 2, 2, 'stand', 'W', {x: 10, y: 8}, 1, 4, false, {});
                testStep(steps, 2, 3, 3, 'stand', 'E', {x: 7, y: 7}, 0, 0, false, {});
            });

        });
    });
}