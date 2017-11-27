/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena.Specs {
    describe("OrderManager", () => {
        var testGame, currentState;

        function testStep(steps, i, j, entityId, action, direction, orderPosition, ap, hp, moveHasBeenBlocked, positionBlocked) {
            expect(steps[i].stepUnits[j].pawn._id).toEqual(entityId);
            expect(steps[i].stepUnits[j].order.action).toEqual(action);
            expect(steps[i].stepUnits[j].order.direction).toEqual(direction);
            expect(steps[i].stepUnits[j].order.position.x).toEqual(orderPosition.x);
            expect(steps[i].stepUnits[j].order.position.y).toEqual(orderPosition.y);
            expect(steps[i].stepUnits[j].data.ap).toEqual(ap);
            expect(steps[i].stepUnits[j].data.hp).toEqual(hp);
            expect(steps[i].stepUnits[j].data.moveHasBeenBlocked).toEqual(moveHasBeenBlocked);
            expect(steps[i].stepUnits[j].data.positionBlocked).toEqual(positionBlocked);
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
                    currentState.pawns.push(new Entity.Character.Test(currentState, 8, 8, 'E', 1, 1));
                    currentState.pawns.push(new Entity.Character.Test(currentState, 10, 8, 'W', 2, 2));
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
                spyOn(TacticArena.OrderManager, 'resolutionEsquive').and.callFake(() => {
                    return true;
                });
            });

            it("nothing is played", function () {
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'stand', 'E', {x: 8, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, null);
            });

            it("1st one stands same position for 1 step", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Stand(new Position(8, 8), 'E')
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'stand', 'E', {x: 8, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, null);
            });

            it("1st one moves toward the 2nd for 2 steps", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Move(new Position(9, 8), 'E'),
                            new Order.Move(new Position(10, 8), 'E')
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'move', 'E', {x: 9, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, null);
                testStep(steps, 2, 0, 1, 'attack', 'E', {x: 9, y: 8}, 1, 3, true, new Position(10, 8));
                testStep(steps, 2, 1, 2, 'attack', 'W', {x: 10, y: 8}, 1, 3, false, null);
            });

            it("both going same position then the first one wants to continue moving", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Move(new Position(9, 8), 'E'),
                            new Order.Move(new Position(9, 9), 'E')
                        ]
                    },
                    {
                        entity: currentState.pawns[1],
                        list: [
                            new Order.Move(new Position(9, 8), 'W')
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'move', 'E', {x: 8, y: 8}, 2, 4, true, new Position(9, 8));
                testStep(steps, 1, 1, 2, 'move', 'W', {x: 10, y: 8}, 2, 4, true, new Position(9, 8));
                testStep(steps, 2, 0, 1, 'stand', 'E', {x: 8, y: 8}, 1, 4, false, null);
                testStep(steps, 2, 1, 2, 'stand', 'W', {x: 10, y: 8}, 1, 4, false, null);
            });

            it("the first one wants moves in front of the second, then continues moving, facing the other", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Move(new Position(9, 8), 'E'),
                            new Order.Move(new Position(9, 9), 'E'),
                            new Order.Move(new Position(10, 8), 'E')
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'move', 'E', {x: 9, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, null);
                testStep(steps, 2, 0, 1, 'move', 'E', {x: 9, y: 8}, 1, 3, true, new Position(9, 9));
                testStep(steps, 2, 1, 2, 'attack', 'W', {x: 10, y: 8}, 1, 4, false, null);
                testStep(steps, 3, 0, 1, 'attack', 'E', {x: 9, y: 8}, 0, 2, false, null);
                testStep(steps, 3, 1, 2, 'attack', 'W', {x: 10, y: 8}, 0, 3, false, null);
            });

            it("the first one wants moves in front of the second, then continues moving, without facing the other", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Stand(new Position(8, 8), 'S'),
                            new Order.Move(new Position(9, 8), 'S'),
                            new Order.Move(new Position(9, 9), 'S')
                        ]
                    }
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'stand', 'S', {x: 8, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, null);
                testStep(steps, 2, 0, 1, 'move', 'S', {x: 9, y: 8}, 1, 4, false, null);
                testStep(steps, 2, 1, 2, 'stand', 'W', {x: 10, y: 8}, 1, 4, false, null);
                testStep(steps, 3, 0, 1, 'move', 'S', {x: 9, y: 8}, 0, 3, true, new Position(9, 9));
                testStep(steps, 3, 1, 2, 'attack', 'W', {x: 10, y: 8}, 0, 4, false, null);
            });

            it("the first one wants moves north then casts to the east while the other moves in the dmg area then comes cac", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Move(new Position(8, 7), 'E'),
                            new Order.Fire(new Position(8, 7), 'E')
                        ]
                    },
                    {
                        entity: currentState.pawns[1],
                        list: [
                            new Order.Move(new Position(10, 7), 'W'),
                            new Order.Move(new Position(9, 7), 'W'),
                            new Order.Move(new Position(8, 7), 'W')
                        ]
                    },
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'move', 'E', {x: 8, y: 7}, 2, 4, false, null);
                testStep(steps, 1, 1, 2, 'move', 'W', {x: 10, y: 7}, 2, 4, false, null);
                testStep(steps, 2, 0, 1, 'cast', 'E', {x: 8, y: 7}, 0, 4, false, null);
                expect(steps[2].stepUnits[0].order.targets).toEqual([currentState.pawns[1]._id]);
                testStep(steps, 2, 1, 2, 'move', 'W', {x: 9, y: 7}, 1, 2, false, null);
                testStep(steps, 3, 0, 1, 'stand', 'E', {x: 8, y: 7}, 0, 3, false, null);
                testStep(steps, 3, 1, 2, 'attack', 'W', {x: 9, y: 7}, 0, 2, true, new Position(8, 7));
            });

            it("the first one casts to the east while the other moves toward him", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Fire(new Position(8, 8), 'E')
                        ]
                    },
                    {
                        entity: currentState.pawns[1],
                        list: [
                            new Order.Move(new Position(9, 8), 'W'),
                            new Order.Move(new Position(8, 8), 'W'),
                            new Order.Move(new Position(7, 8), 'W')
                        ]
                    },
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'cast', 'E', {x: 8, y: 8}, 1, 4, false, null);
                expect(steps[1].stepUnits[0].order.targets).toEqual([currentState.pawns[1]._id]);
                testStep(steps, 1, 1, 2, 'move', 'W', {x: 9, y: 8}, 2, 2, false, null);
                testStep(steps, 2, 0, 1, 'attack', 'E', {x: 8, y: 8}, 0, 3, false, null);
                testStep(steps, 2, 1, 2, 'attack', 'W', {x: 9, y: 8}, 1, 1, true, new Position(8, 8));
                testStep(steps, 3, 0, 1, 'stand', 'E', {x: 8, y: 8}, 0, 2, false, null);
                testStep(steps, 3, 1, 2, 'attack', 'W', {x: 9, y: 8}, 0, 1, false, null);
            });

            it("the first one cast_wind to the east while the other moves and get pushed to where it came from", function () {
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Wind(new Position(8, 8), 'E')
                        ]
                    },
                    {
                        entity: currentState.pawns[1],
                        list: [
                            new Order.Move(new Position(9, 8), 'W'),
                            new Order.Move(new Position(8, 8), 'W'),
                            new Order.Move(new Position(7, 8), 'W')
                        ]
                    },
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'cast_wind', 'E', {x: 8, y: 8}, 1, 4, false, null);
                expect(steps[1].stepUnits[0].order.targets).toEqual([{entity: currentState.pawns[1]._id, moved: {x: 10, y: 8, d: 1}}]);
                testStep(steps, 1, 1, 2, 'move', 'W', {x: 9, y: 8}, 2, 3, false, null);
                testStep(steps, 2, 0, 1, 'stand', 'E', {x: 8, y: 8}, 0, 4, false, null);
                testStep(steps, 2, 1, 2, 'stand', 'W', {x: 10, y: 8}, 1, 3, false, null);
                testStep(steps, 3, 0, 1, 'stand', 'E', {x: 8, y: 8}, 0, 4, false, null);
                testStep(steps, 3, 1, 2, 'stand', 'W', {x: 10, y: 8}, 0, 3, false, null);
            });
        });


        describe("4 players / Fleerate 0%", () => {
            beforeEach(function () {
                spyOn(TacticArena.OrderManager, 'resolutionEsquive').and.callFake(() => {
                    return true;
                });

                currentState.pawns.push(new Entity.Pawn(currentState, 7, 7, 'E', 'skeleton', 3, 1, 'Diana'));
                currentState.pawns.push(new Entity.Pawn(currentState, 12, 7, 'W', 'skeleton', 4, 2, 'Oscar'));
            });

            it("with 1 dead - nothing is played", function () {
                currentState.pawns[2].setHp(0);
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 2, 3, 'dead', 'E', {x: 7, y: 7}, 0, 0, false, null);
                testStep(steps, 0, 3, 4, 'stand', 'W', {x: 12, y: 7}, 3, 4, false, null);
                testStep(steps, 1, 0, 1, 'stand', 'E', {x: 8, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 1, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 2, 3, 'dead', 'E', {x: 7, y: 7}, 0, 0, false, null);
                testStep(steps, 1, 3, 4, 'stand', 'W', {x: 12, y: 7}, 2, 4, false, null);
            });

            it("with 1 dead - 4th pawn moves", function () {
                currentState.pawns[2].setHp(0);
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[3],
                        list: [
                            new Order.Move(new Position(11, 7), 'W'),
                            new Order.Move(new Position(11, 6), 'W')
                        ]
                    },
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].stepUnits.length).toEqual(4);
                testStep(steps, 0, 0, 4, 'stand', 'W', {x: 12, y: 7}, 3, 4, false, null);
                testStep(steps, 0, 1, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 2, 2, 'stand', 'W', {x: 10, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 3, 3, 'dead', 'E', {x: 7, y: 7}, 0, 0, false, null);

                testStep(steps, 1, 0, 4, 'move', 'W', {x: 11, y: 7}, 2, 4, false, null);
                testStep(steps, 1, 1, 1, 'stand', 'E', {x: 8, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 2, 2, 'stand', 'W', {x: 10, y: 8}, 2, 4, false, null);
                testStep(steps, 1, 3, 3, 'dead', 'E', {x: 7, y: 7}, 0, 0, false, null);

                testStep(steps, 2, 0, 4, 'move', 'W', {x: 11, y: 6}, 1, 4, false, null);
                testStep(steps, 2, 1, 1, 'stand', 'E', {x: 8, y: 8}, 1, 4, false, null);
                testStep(steps, 2, 2, 2, 'stand', 'W', {x: 10, y: 8}, 1, 4, false, null);
                testStep(steps, 2, 3, 3, 'dead', 'E', {x: 7, y: 7}, 0, 0, false, null);
            });

            it("the 1st one cast, the 2nd one dies so it blocks the way and sees its actions cancelled - the 4th pawn moves but is blocked", function () {
                currentState.pawns[1].setHp(2);
                currentState.pawns[1]._apMax = 4;
                currentState.pawns[3]._apMax = 4;
                currentState.orderManager.orders = [
                    {
                        entity: currentState.pawns[0],
                        list: [
                            new Order.Fire(new Position(8, 8), 'E'),
                            new Order.Move(new Position(7, 8), 'E')
                        ]
                    },
                    {
                        entity: currentState.pawns[1],
                        list: [
                            new Order.Move(new Position(9, 8), 'W'),
                            new Order.Fire(new Position(9, 8), 'W'),
                            new Order.Move(new Position(9, 7), 'W')
                        ]
                    },
                    {
                        entity: currentState.pawns[3],
                        list: [
                            new Order.Move(new Position(11, 7), 'W'),
                            new Order.Move(new Position(10, 7), 'W'),
                            new Order.Move(new Position(9, 7), 'W'),
                            new Order.Move(new Position(9, 8), 'W')
                        ]
                    },
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(5);
                expect(steps[0].stepUnits.length).toEqual(4);
                testStep(steps, 0, 0, 1, 'stand', 'E', {x: 8, y: 8}, 3, 4, false, null);
                testStep(steps, 0, 1, 2, 'stand', 'W', {x: 10, y: 8}, 4, 2, false, null);
                testStep(steps, 0, 2, 4, 'stand', 'W', {x: 12, y: 7}, 4, 4, false, null);
                testStep(steps, 0, 3, 3, 'stand', 'E', {x: 7, y: 7}, 3, 4, false, null);

                testStep(steps, 1, 0, 1, 'cast', 'E', {x: 8, y: 8}, 1, 4, false, null);
                testStep(steps, 1, 1, 2, 'move', 'W', {x: 9, y: 8}, 3, 0, false, null);
                expect(steps[1].stepUnits[1].data.dies).toBeTruthy();
                testStep(steps, 1, 2, 4, 'move', 'W', {x: 11, y: 7}, 3, 4, false, null);
                testStep(steps, 1, 3, 3, 'stand', 'E', {x: 7, y: 7}, 2, 4, false, null);

                testStep(steps, 2, 0, 1, 'move', 'E', {x: 7, y: 8}, 0, 4, false, null);
                testStep(steps, 2, 1, 2, 'dead', 'W', {x: 9, y: 8}, 3, 0, false, null);
                expect(steps[2].stepUnits[1].data.dies).toBeFalsy();
                testStep(steps, 2, 2, 4, 'move', 'W', {x: 10, y: 7}, 2, 4, false, null);
                testStep(steps, 2, 3, 3, 'stand', 'E', {x: 7, y: 7}, 1, 4, false, null);

                testStep(steps, 3, 0, 1, 'stand', 'E', {x: 7, y: 8}, 0, 4, false, null);
                testStep(steps, 3, 1, 2, 'dead', 'W', {x: 9, y: 8}, 3, 0, false, null);
                testStep(steps, 3, 2, 4, 'move', 'W', {x: 9, y: 7}, 1, 4, false, null);
                testStep(steps, 3, 3, 3, 'stand', 'E', {x: 7, y: 7}, 0, 4, false, null);

                testStep(steps, 4, 0, 1, 'stand', 'E', {x: 7, y: 8}, 0, 4, false, null);
                testStep(steps, 4, 1, 2, 'dead', 'W', {x: 9, y: 8}, 3, 0, false, null);
                testStep(steps, 4, 2, 4, 'move', 'W', {x: 9, y: 7}, 0, 4, true, new Position(9, 8));
                testStep(steps, 4, 3, 3, 'stand', 'E', {x: 7, y: 7}, 0, 4, false, null);
            });
        });
    });
}