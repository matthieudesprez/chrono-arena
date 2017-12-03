/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena {
    describe("OrderManager", () => {
        var testGame, currentState;

        function testStepUnit(stepUnit: StepUnit, action, direction, orderPosition: Position, ap, hp) {
            expect(stepUnit.order.action).toEqual(action);
            expect(stepUnit.order.direction).toEqual(direction);
            expect(stepUnit.order.position.equals(orderPosition)).toEqual(true);
            expect(stepUnit.order.position.y).toEqual(orderPosition.y);
            expect(stepUnit.data.ap).toEqual(ap);
            expect(stepUnit.data.hp).toEqual(hp);
        }

        function initSpriteManager() {
            currentState.pawns.forEach( pawn => {
                currentState.spritesManager.add(pawn);
            });
        }

        beforeEach(function (done) {
            //spyOn(console, 'log').and.stub();
            spyOn(console, 'info').and.stub();
            spyOn(console, 'warn').and.stub();
            testGame = new TestGame(true);
            testGame.state.start('testpreload');
            testGame.state.onStateChange.add(function (stateName) {
                if(stateName === 'test') {
                    currentState = testGame.state.getCurrentState();
                    setTimeout(function () {
                        currentState.pawns.push(new Champion.Test(currentState, new Position(8, 8, 'E'), 1, 1));
                        currentState.pawns.push(new Champion.Test(currentState, new Position(10, 8, 'W'), 2, 2));
                        done();
                    }, 200);
                }
            });
        });

        afterEach(function () {
            testGame.destroy();
            testGame = null;
        });

        describe("methods", () => {

            it("removeOrders", function () {
                spyOn(currentState.signalManager.onOrderChange, 'dispatch').and.callThrough();
                expect(currentState.orderManager.orders).toEqual([]);
                let orders = [
                    new ChampionOrders(currentState.pawns[0], [new Order.Stand(new Position(8, 8), 'E')]),
                    new ChampionOrders(currentState.pawns[1], [new Order.Move(new Position(10, 7), 'W')]),
                ];
                currentState.orderManager.orders = orders;
                expect(currentState.orderManager.orders).toEqual(orders);
                currentState.orderManager.removeOrders(currentState.pawns[0]);
                expect(currentState.orderManager.orders).toEqual(orders.splice(-1));
                expect(currentState.signalManager.onOrderChange.dispatch).toHaveBeenCalledWith(currentState.pawns[0]);
            });

            it("hasOrder", function () {
                expect(currentState.orderManager.hasOrder(currentState.pawns[0])).toBe(false);
                expect(currentState.orderManager.hasOrder(currentState.pawns[1])).toBe(false);
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[1], [new Order.Move(new Position(10, 7), 'W')])
                ];
                expect(currentState.orderManager.hasOrder(currentState.pawns[0])).toBe(false);
                expect(currentState.orderManager.hasOrder(currentState.pawns[1])).toBe(true);
            });

            it("add / getOrders", function () {
                spyOn(currentState.signalManager.onOrderChange, 'dispatch').and.callThrough();
                expect(currentState.orderManager.getOrders(currentState.pawns[0])).toEqual([]);

                currentState.orderManager.add(currentState.pawns[0], new Order.Move(new Position(10, 7), 'W'), false);
                expect(currentState.orderManager.getOrders(currentState.pawns[0])).toEqual([new Order.Move(new Position(10, 7), 'W')]);
                expect(currentState.signalManager.onOrderChange.dispatch).not.toHaveBeenCalled();

                currentState.orderManager.add(currentState.pawns[0], new Order.Move(new Position(9, 7), 'W'));
                expect(currentState.orderManager.getOrders(currentState.pawns[0])).toEqual([
                    new Order.Move(new Position(10, 7), 'W'),
                    new Order.Move(new Position(9, 7), 'W')
                ]);
                expect(currentState.signalManager.onOrderChange.dispatch).toHaveBeenCalledWith(currentState.pawns[0]);
            });

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

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 2, 4);
            });

            it("1st one stands same position for 1 step", function () {
                currentState.orderManager.orders = [new ChampionOrders(currentState.pawns[0], [new Order.Stand(new Position(8, 8), 'E')])];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 2, 4);
            });

            it("1st one moves toward the 2nd for 2 steps", function () {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[0], [
                        new Order.Move(new Position(9, 8), 'E'),
                        new Order.Move(new Position(10, 8), 'E')
                    ])
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'move', 'E', new Position(9, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 2, 4);

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'attack', 'E', new Position(9, 8), 1, 3);
                expect(steps[2].getStepUnit(currentState.pawns[0]).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[2].getStepUnit(currentState.pawns[0]).data.positionBlocked.equals(new Position(10, 8))).toBeTruthy();
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'attack', 'W', new Position(10, 8), 1, 3);
            });

            it("both going same position then the first one wants to continue moving", function () {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[0], [
                            new Order.Move(new Position(9, 8), 'E'),
                            new Order.Move(new Position(9, 9), 'E')
                        ]
                    ),
                    new ChampionOrders(currentState.pawns[1], [
                            new Order.Move(new Position(9, 8), 'W')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'move', 'E', new Position(8, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.pawns[0]).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.pawns[0]).data.positionBlocked.equals(new Position(9, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'move', 'W', new Position(10, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.pawns[1]).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.pawns[1]).data.positionBlocked.equals(new Position(9, 8))).toBeTruthy();

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 1, 4);
            });

            it("the first one wants moves in front of the second, then continues moving, facing the other", function () {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[0], [
                            new Order.Move(new Position(9, 8), 'E'),
                            new Order.Move(new Position(9, 9), 'E'),
                            new Order.Move(new Position(10, 8), 'E')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'move', 'E', new Position(9, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 2, 4);

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'move', 'E', new Position(9, 8), 1, 3);
                expect(steps[2].getStepUnit(currentState.pawns[0]).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[2].getStepUnit(currentState.pawns[0]).data.positionBlocked.equals(new Position(9, 9))).toBeTruthy();
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'attack', 'W', new Position(10, 8), 1, 4);

                testStepUnit(steps[3].getStepUnit(currentState.pawns[0]), 'attack', 'E', new Position(9, 8), 0, 2);
                testStepUnit(steps[3].getStepUnit(currentState.pawns[1]), 'attack', 'W', new Position(10, 8), 0, 3);
            });

            it("the first one wants moves in front of the second, then continues moving, without facing the other", function () {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[0], [
                            new Order.Stand(new Position(8, 8), 'S'),
                            new Order.Move(new Position(9, 8), 'S'),
                            new Order.Move(new Position(9, 9), 'S')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'stand', 'S', new Position(8, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 2, 4);

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'move', 'S', new Position(9, 8), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 1, 4);

                testStepUnit(steps[3].getStepUnit(currentState.pawns[0]), 'move', 'S', new Position(9, 8), 0, 3);
                expect(steps[3].getStepUnit(currentState.pawns[0]).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[3].getStepUnit(currentState.pawns[0]).data.positionBlocked.equals(new Position(9, 9))).toBeTruthy();
                testStepUnit(steps[3].getStepUnit(currentState.pawns[1]), 'attack', 'W', new Position(10, 8), 0, 4);
            });

            it("the first one wants moves north then casts to the east while the other moves in the dmg area then comes cac", function () {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[0], [
                            new Order.Move(new Position(8, 7), 'E'),
                            new Order.Fire(new Position(8, 7), 'E')
                        ]
                    ),
                    new ChampionOrders(currentState.pawns[1], [
                            new Order.Move(new Position(10, 7), 'W'),
                            new Order.Move(new Position(9, 7), 'W'),
                            new Order.Move(new Position(8, 7), 'W')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'move', 'E', new Position(8, 7), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'move', 'W', new Position(10, 7), 2, 4);

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'cast', 'E', new Position(8, 7), 0, 4);
                expect(steps[2].getStepUnit(currentState.pawns[0]).order.targets).toEqual([currentState.pawns[1]._id]);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'move', 'W', new Position(9, 7), 1, 2);

                testStepUnit(steps[3].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 7), 0, 3);
                testStepUnit(steps[3].getStepUnit(currentState.pawns[1]), 'attack', 'W', new Position(9, 7), 0, 2);
                expect(steps[3].getStepUnit(currentState.pawns[1]).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[3].getStepUnit(currentState.pawns[1]).data.positionBlocked.equals(new Position(8, 7))).toBeTruthy();
            });

            it("the first one casts to the east while the other moves toward him", function () {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[0], [
                            new Order.Fire(new Position(8, 8), 'E')
                        ]
                    ),
                    new ChampionOrders(currentState.pawns[1], [
                            new Order.Move(new Position(9, 8), 'W'),
                            new Order.Move(new Position(8, 8), 'W'),
                            new Order.Move(new Position(7, 8), 'W')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'cast', 'E', new Position(8, 8), 1, 4);
                expect(steps[1].getStepUnit(currentState.pawns[0]).order.targets).toEqual([currentState.pawns[1]._id]);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'move', 'W', new Position(9, 8), 2, 2);

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'attack', 'E', new Position(8, 8), 0, 3);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'attack', 'W', new Position(9, 8), 1, 1);
                expect(steps[2].getStepUnit(currentState.pawns[1]).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[2].getStepUnit(currentState.pawns[1]).data.positionBlocked.equals(new Position(8, 8))).toBeTruthy();

                testStepUnit(steps[3].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 0, 2);
                testStepUnit(steps[3].getStepUnit(currentState.pawns[1]), 'attack', 'W', new Position(9, 8), 0, 1);
            });

            it("the first one cast_wind to the east while the other moves and get pushed to where it came from", function () {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[0], [
                            new Order.Wind(new Position(8, 8), 'E')
                        ]
                    ),
                    new ChampionOrders(currentState.pawns[1], [
                            new Order.Move(new Position(9, 8), 'W'),
                            new Order.Move(new Position(8, 8), 'W'),
                            new Order.Move(new Position(7, 8), 'W')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'cast_wind', 'E', new Position(8, 8), 1, 4);
                expect(steps[1].getStepUnit(currentState.pawns[0]).order.targets).toEqual([
                    {champion: currentState.pawns[1]._id, moved: {x: 10, y: 8, d: 1}}
                ]);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'move', 'W', new Position(9, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.pawns[1]).data.moved.equals(new Position(10, 8))).toBeTruthy();

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 1, 3);

                testStepUnit(steps[3].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 0, 3);
            });
        });


        describe("4 players / Fleerate 0%", () => {
            beforeEach(function () {
                spyOn(TacticArena.OrderManager, 'resolutionEsquive').and.callFake(() => {
                    return true;
                });
                currentState.pawns.push(new Champion.Test(currentState, new Position(7, 7, 'E'), 3, 1));
                currentState.pawns.push(new Champion.Test(currentState, new Position(12, 7, 'W'), 4, 2));
            });

            it("with 1 dead - nothing is played", function () {
                currentState.pawns[2].setHp(0);

                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[2]), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[3]), 'stand', 'W', new Position(12, 7), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[2]), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[3]), 'stand', 'W', new Position(12, 7), 2, 4);
            });

            it("with 1 dead - 4th pawn moves", function () {
                currentState.pawns[2].setHp(0);

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[3], [
                            new Order.Move(new Position(11, 7), 'W'),
                            new Order.Move(new Position(11, 6), 'W')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[2]), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[3]), 'stand', 'W', new Position(12, 7), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[2]), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[3]), 'move', 'W', new Position(11, 7), 2, 4);

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[2]), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[3]), 'move', 'W', new Position(11, 6), 1, 4);
            });

            it("the 1st one cast, the 2nd one dies so it blocks the way and sees its actions cancelled - the 4th pawn moves but is blocked", function () {
                currentState.pawns[1].setHp(2);
                currentState.pawns[1]._apMax = 4;
                currentState.pawns[3]._apMax = 4;

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[0], [
                            new Order.Fire(new Position(8, 8), 'E'),
                            new Order.Move(new Position(7, 8), 'E')
                        ]
                    ),
                    new ChampionOrders(currentState.pawns[1], [
                            new Order.Move(new Position(9, 8), 'W'),
                            new Order.Fire(new Position(9, 8), 'W'),
                            new Order.Move(new Position(9, 7), 'W')
                        ]
                    ),
                    new ChampionOrders(currentState.pawns[3], [
                            new Order.Move(new Position(11, 7), 'W'),
                            new Order.Move(new Position(10, 7), 'W'),
                            new Order.Move(new Position(9, 7), 'W'),
                            new Order.Move(new Position(9, 8), 'W')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(5);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(10, 8), 4, 2);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[2]), 'stand', 'E', new Position(7, 7), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[3]), 'stand', 'W', new Position(12, 7), 4, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'cast', 'E', new Position(8, 8), 1, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'move', 'W', new Position(9, 8), 3, 0);
                expect(steps[1].getStepUnit(currentState.pawns[1]).data.dies).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.pawns[2]), 'stand', 'E', new Position(7, 7), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[3]), 'move', 'W', new Position(11, 7), 3, 4);

                testStepUnit(steps[2].getStepUnit(currentState.pawns[0]), 'move', 'E', new Position(7, 8), 0, 4);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[1]), 'dead', 'W', new Position(9, 8), 3, 0);
                expect(steps[2].getStepUnit(currentState.pawns[1]).data.dies).toBeFalsy();
                testStepUnit(steps[2].getStepUnit(currentState.pawns[2]), 'stand', 'E', new Position(7, 7), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.pawns[3]), 'move', 'W', new Position(10, 7), 2, 4);

                testStepUnit(steps[3].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(7, 8), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.pawns[1]), 'dead', 'W', new Position(9, 8), 3, 0);
                testStepUnit(steps[3].getStepUnit(currentState.pawns[2]), 'stand', 'E', new Position(7, 7), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.pawns[3]), 'move', 'W', new Position(9, 7), 1, 4);

                testStepUnit(steps[4].getStepUnit(currentState.pawns[0]), 'stand', 'E', new Position(7, 8), 0, 4);
                testStepUnit(steps[4].getStepUnit(currentState.pawns[1]), 'dead', 'W', new Position(9, 8), 3, 0);
                testStepUnit(steps[4].getStepUnit(currentState.pawns[2]), 'stand', 'E', new Position(7, 7), 0, 4);
                testStepUnit(steps[4].getStepUnit(currentState.pawns[3]), 'move', 'W', new Position(9, 7), 0, 4);
                expect(steps[4].getStepUnit(currentState.pawns[3]).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[4].getStepUnit(currentState.pawns[3]).data.positionBlocked.equals(new Position(9, 8))).toBeTruthy();
            });

            it("3 champions on a line, with 1 dead on left, another in the middle and the 3rd on the right casting a tornado toward West", async function (done) {
                currentState.pawns[0].setPosition(new Position(6, 8)); // 1st
                currentState.pawns[1].setPosition(new Position(9, 8)); // 3rd
                currentState.pawns[2].setPosition(new Position(7, 8)); // 2nd
                currentState.pawns[3].setPosition(new Position(10, 10)); // not active
                currentState.pawns[0].setHp(0);

                initSpriteManager();

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.pawns[1], [
                            new Order.Wind(new Position(9, 8), 'W')
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.pawns[0]), 'dead', 'E', new Position(6, 8), 0, 0);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[1]), 'stand', 'W', new Position(9, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[2]), 'stand', 'E', new Position(7, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.pawns[3]), 'stand', 'W', new Position(10, 10), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.pawns[0]), 'dead', 'E', new Position(6, 8), 0, -1);
                expect(steps[1].getStepUnit(currentState.pawns[0]).data.moved.equals(new Position(5, 8))).toBeTruthy(); // dead can be moved
                testStepUnit(steps[1].getStepUnit(currentState.pawns[1]), 'cast_wind', 'W', new Position(9, 8), 1, 4);
                testStepUnit(steps[1].getStepUnit(currentState.pawns[2]), 'stand', 'E', new Position(7, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.pawns[2]).data.moved.equals(new Position(6, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.pawns[3]), 'stand', 'W', new Position(10, 10), 2, 4);

                currentState.resolveManager.init(steps);
                await currentState.resolveManager.processStep(0);
                expect(currentState.spritesManager.getReal(currentState.pawns[0]).getPosition().equals(new Position(6, 8, 'E'))).toBeTruthy();
                expect(currentState.spritesManager.getReal(currentState.pawns[2]).getPosition().equals(new Position(7, 8, 'E'))).toBeTruthy();
                await currentState.resolveManager.processStep(1);
                expect(currentState.spritesManager.getReal(currentState.pawns[0]).getPosition().equals(new Position(5, 8, 'E'))).toBeTruthy();
                expect(currentState.spritesManager.getReal(currentState.pawns[2]).getPosition().equals(new Position(6, 8, 'E'))).toBeTruthy();
                done();
            });
        });
    });
}