/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena {
    describe("OrderManager", () => {
        var testGame, currentState;

        function testStepUnit(stepUnit: StepUnit, action, direction, orderPosition: Position, ap, hp) {
            expect(stepUnit.order.action).toEqual(action);
            expect(stepUnit.order.position.d).toEqual(direction);
            expect(stepUnit.order.position.equals(orderPosition)).toEqual(true);
            expect(stepUnit.data.ap).toEqual(ap);
            expect(stepUnit.data.hp).toEqual(hp);
        }

        function initSpriteManager() {
            currentState.pawns.forEach(pawn => {
                currentState.spritesManager.add(pawn);
                currentState.spritesManager.getReal(pawn).addChild(new Phaser.Text(currentState.game, 25, 10, pawn._id, {
                    font: '12px Press Start 2P', fill: '#ffffff', stroke: '#000000', strokeThickness: 2
                }));
            });
        }

        async function playAnimation(steps) {
            initSpriteManager();
            currentState.resolveManager.init(steps);
            for (var i = 0; i < steps.length; i++) {
                await currentState.resolveManager.processStep(i);
            }
        }

        beforeEach(function (done) {
            //spyOn(console, 'log').and.stub();
            spyOn(console, 'info').and.stub();
            spyOn(console, 'warn').and.stub();
            testGame = new TestGame(true);
            testGame.state.start('testpreload');
            testGame.state.onStateChange.add(function (stateName) {
                if (stateName === 'test') {
                    currentState = testGame.state.getCurrentState();
                    setTimeout(function () {
                        currentState.pawns.push(new Champion.Test(currentState, currentState.map.startPositions[0][0], 1, 1));
                        currentState.pawns.push(new Champion.Test(currentState, currentState.map.startPositions[1][0], 2, 2));
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
                    new ChampionOrders(currentState.getChampion(1), [new Order.Stand(currentState.map.startPositions[0][0])]),
                    new ChampionOrders(currentState.getChampion(2), [new Order.Move(currentState.map.startPositions[1][0].translate(0, -1))]),
                ];
                currentState.orderManager.orders = orders;
                expect(currentState.orderManager.orders).toEqual(orders);
                currentState.orderManager.removeOrders(currentState.getChampion(1));
                expect(currentState.orderManager.orders).toEqual(orders.splice(-1));
                expect(currentState.signalManager.onOrderChange.dispatch).toHaveBeenCalledWith(currentState.getChampion(1));
            });

            it("hasOrder", function () {
                expect(currentState.orderManager.hasOrder(currentState.getChampion(1))).toBe(false);
                expect(currentState.orderManager.hasOrder(currentState.getChampion(2))).toBe(false);
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(2), [new Order.Move(currentState.map.startPositions[1][0].translate(0, -1))])
                ];
                expect(currentState.orderManager.hasOrder(currentState.getChampion(1))).toBe(false);
                expect(currentState.orderManager.hasOrder(currentState.getChampion(2))).toBe(true);
            });

            it("add / getOrders", function () {
                spyOn(currentState.signalManager.onOrderChange, 'dispatch').and.callThrough();
                expect(currentState.orderManager.getOrders(currentState.getChampion(1))).toEqual([]);

                currentState.orderManager.add(currentState.getChampion(1), new Order.Move(currentState.map.startPositions[1][0].translate(0, -1)), false);
                expect(currentState.orderManager.getOrders(currentState.getChampion(1))).toEqual([new Order.Move(currentState.map.startPositions[1][0].translate(0, -1))]);
                expect(currentState.signalManager.onOrderChange.dispatch).not.toHaveBeenCalled();

                currentState.orderManager.add(currentState.getChampion(1), new Order.Move(currentState.map.startPositions[1][0].translate(-1, -1)));
                expect(currentState.orderManager.getOrders(currentState.getChampion(1))).toEqual([
                    new Order.Move(currentState.map.startPositions[1][0].translate(0, -1)),
                    new Order.Move(currentState.map.startPositions[1][0].translate(-1, -1))
                ]);
                expect(currentState.signalManager.onOrderChange.dispatch).toHaveBeenCalledWith(currentState.getChampion(1));
            });

        });

        describe("2 players", () => {

            it("nothing is played", async function (done) {
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', currentState.map.startPositions[0][0], 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', currentState.map.startPositions[1][0], 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'stand', 'E', currentState.map.startPositions[0][0], 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'stand', 'W', currentState.map.startPositions[1][0], 2, 4);

                await playAnimation(steps);
                done();
            });

            it("both going same position then the first one wants to continue moving", async function (done) {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(9, 8, 'E')),
                            new Order.Move(new Position(9, 9, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(9, 8, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(3);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(8, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(1)).data.positionBlocked.equals(new Position(9, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(10, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).data.positionBlocked.equals(new Position(9, 8))).toBeTruthy();

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 1, 4);

                await playAnimation(steps);
                done();
            });

            it("the first one wants to move in front of the second, then continues moving, facing him", async function (done) {
                currentState.getChampion(1)._apMax = 4;
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(9, 8, 'E')),
                            new Order.Move(new Position(9, 9, 'E')),
                            new Order.Move(new Position(10, 9, 'E')),
                            new Order.Move(new Position(10, 8, 'E'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(5);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 4, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(9, 8), 3, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 2, 4);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(9, 9), 2, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 1, 4);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(10, 9), 1, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 0, 4);

                testStepUnit(steps[4].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(10, 9), 0, 4);
                expect(steps[4].getStepUnit(currentState.getChampion(1)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[4].getStepUnit(currentState.getChampion(1)).data.positionBlocked.equals(new Position(10, 8))).toBeTruthy();
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 0, 4);

                await playAnimation(steps);
                done();
            });

            it("the first one wants to move in front of the second, then continues moving, facing him, while he attacks", async function (done) {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(9, 8, 'E')),
                            new Order.Move(new Position(9, 9, 'E')),
                            new Order.Move(new Position(10, 9, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Slash(new Position(10, 8, 'W')),
                            new Order.Slash(new Position(10, 8, 'W')),
                            new Order.Slash(new Position(10, 8, 'W'))
                        ]
                    ),
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(9, 8), 2, 3);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'slash', 'W', new Position(10, 8), 2, 4);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(9, 8), 1, 2);
                expect(steps[2].getStepUnit(currentState.getChampion(1)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[2].getStepUnit(currentState.getChampion(1)).data.positionBlocked.equals(new Position(9, 8))).toBeTruthy();
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'slash', 'W', new Position(10, 8), 1, 4);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(9, 8), 0, 1);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'slash', 'W', new Position(10, 8), 0, 4);

                await playAnimation(steps);
                done();
            });

            it("the first one wants moves north then casts to the east while the other moves in the dmg area then comes cac", async function (done) {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(8, 7, 'E')),
                            new Order.Fire(new Position(8, 7, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(10, 7, 'W')),
                            new Order.Move(new Position(9, 7, 'W')),
                            new Order.Move(new Position(8, 7, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(8, 7), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(10, 7), 2, 4);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(8, 7), 0, 4);
                expect(steps[2].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([currentState.getChampion(2)._id]);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 7), 1, 2);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 7), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 7), 0, 2);
                expect(steps[3].getStepUnit(currentState.getChampion(2)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[3].getStepUnit(currentState.getChampion(2)).data.positionBlocked.equals(new Position(8, 7))).toBeTruthy();

                await playAnimation(steps);
                done();
            });

            it("the first one casts to the east while the other moves toward him", async function (done) {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Fire(new Position(8, 8, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(9, 8, 'W')),
                            new Order.Move(new Position(8, 8, 'W')),
                            new Order.Move(new Position(7, 8, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(8, 8), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([currentState.getChampion(2)._id]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 2, 2);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 1, 2);
                expect(steps[2].getStepUnit(currentState.getChampion(2)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[2].getStepUnit(currentState.getChampion(2)).data.positionBlocked.equals(new Position(8, 8))).toBeTruthy();

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(9, 8), 0, 2);

                await playAnimation(steps);
                done();
            });

            it("the first one cast_wind to the east while the other moves and get pushed to where it came from", async function (done) {
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Wind(new Position(8, 8, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(9, 8, 'W')),
                            new Order.Move(new Position(8, 8, 'W')),
                            new Order.Move(new Position(7, 8, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast_wind', 'E', new Position(8, 8), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([
                    {champion: currentState.getChampion(2)._id, moved: new Position(10, 8, 'W'), distance: 1}
                ]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).data.moved.equals(new Position(10, 8, 'W'))).toBeTruthy();

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 1, 3);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 0, 3);

                await playAnimation(steps);
                done();
            });
        });


        describe("4 players", () => {
            beforeEach(function () {
                currentState.pawns.push(new Champion.Test(currentState, currentState.map.startPositions[0][1], 3, 1));
                currentState.pawns.push(new Champion.Test(currentState, currentState.map.startPositions[1][1], 4, 2));
            });

            it("with 1 dead - nothing is played", async function (done) {
                currentState.getChampion(3).setHp(0, false, true);

                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(12, 7), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(12, 7), 2, 4);

                await playAnimation(steps);
                done();
            });

            it("the 1st one cast, the 2nd one dies so it blocks the way and sees its actions cancelled - the 4th pawn moves but is blocked", async function (done) {
                currentState.getChampion(2).setHp(2, false, true);
                currentState.getChampion(2)._apMax = 4;
                currentState.getChampion(4)._apMax = 4;

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Fire(new Position(8, 8, 'E')),
                            new Order.Move(new Position(7, 8, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(9, 8, 'W')),
                            new Order.Fire(new Position(9, 8, 'W')),
                            new Order.Move(new Position(9, 7, 'W'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Move(new Position(11, 7, 'W')),
                            new Order.Move(new Position(10, 7, 'W')),
                            new Order.Move(new Position(9, 7, 'W')),
                            new Order.Move(new Position(9, 8, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(5);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 4, 2);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 7), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(12, 7), 4, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(8, 8), 1, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 3, 0);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 7), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'move', 'W', new Position(11, 7), 3, 4);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(7, 8), 0, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(9, 8), 3, 0);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 7), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(4)), 'move', 'W', new Position(10, 7), 2, 4);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(7, 8), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(9, 8), 3, 0);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 7), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(4)), 'move', 'W', new Position(9, 7), 1, 4);

                testStepUnit(steps[4].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(7, 8), 0, 4);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(9, 8), 3, 0);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 7), 0, 4);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(4)), 'move', 'W', new Position(9, 7), 0, 4);
                expect(steps[4].getStepUnit(currentState.getChampion(4)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[4].getStepUnit(currentState.getChampion(4)).data.positionBlocked.equals(new Position(9, 8))).toBeTruthy();

                await playAnimation(steps);
                done();
            });

            it("3 champions on a line, with 1 dead on left, another in the middle and the 3rd on the right casting a tornado toward West", async function (done) {
                currentState.getChampion(1).setPosition(new Position(6, 8)); // 1st
                currentState.getChampion(2).setPosition(new Position(9, 8)); // 3rd
                currentState.getChampion(3).setPosition(new Position(7, 8)); // 2nd
                currentState.getChampion(4).setPosition(new Position(10, 10)); // not active
                currentState.getChampion(1).setHp(0, false, true);

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Wind(new Position(9, 8, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'dead', 'E', new Position(6, 8), 0, 0);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(9, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(10, 10), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'dead', 'E', new Position(6, 8), 0, -1);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).data.moved.equals(new Position(5, 8))).toBeTruthy(); // dead can be moved
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'cast_wind', 'W', new Position(9, 8), 1, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).data.moved.equals(new Position(6, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(10, 10), 2, 4);

                initSpriteManager();
                currentState.resolveManager.init(steps);
                await currentState.resolveManager.processStep(0);
                expect(currentState.spritesManager.getReal(currentState.getChampion(1)).getPosition().equals(new Position(6, 8, 'E'))).toBeTruthy();
                expect(currentState.spritesManager.getReal(currentState.getChampion(3)).getPosition().equals(new Position(7, 8, 'E'))).toBeTruthy();
                await currentState.resolveManager.processStep(1);
                expect(currentState.spritesManager.getReal(currentState.getChampion(1)).getPosition().equals(new Position(5, 8, 'E'))).toBeTruthy();
                expect(currentState.spritesManager.getReal(currentState.getChampion(3)).getPosition().equals(new Position(6, 8, 'E'))).toBeTruthy();
                done();
            });

            it("3 champions on a line, the two on the left go right and should be blocked", async function (done) {
                currentState.getChampion(1).setPosition(new Position(6, 8)); // 1st
                currentState.getChampion(2).setPosition(new Position(8, 8)); // 3rd
                currentState.getChampion(3).setPosition(new Position(7, 8)); // 2nd
                currentState.getChampion(4).setPosition(new Position(10, 10)); // not active

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(7, 8, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Move(new Position(8, 8, 'E'))
                        ]
                    ),
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(6, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(10, 10), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(6, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(1)).data.positionBlocked.equals(new Position(7, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(8, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'move', 'E', new Position(7, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(3)).data.positionBlocked.equals(new Position(8, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(10, 10), 2, 4);

                await playAnimation(steps);
                done();
            });

            it("4 champions in square, each one wants to go clockwise", async function (done) {
                currentState.getChampion(1).setPosition(new Position(5, 5));
                currentState.getChampion(2).setPosition(new Position(6, 5));
                currentState.getChampion(3).setPosition(new Position(6, 6));
                currentState.getChampion(4).setPosition(new Position(5, 6));

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(6, 5, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(6, 6, 'S'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Move(new Position(5, 6, 'W'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Move(new Position(5, 5, 'N'))
                        ]
                    ),
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(5, 5), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(6, 5), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(6, 6), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(5, 6), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(6, 5), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'S', new Position(6, 6), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'move', 'W', new Position(5, 6), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'move', 'N', new Position(5, 5), 2, 4);

                await playAnimation(steps);
                done();
            });

            it("4 champions in square, each one wants to go clockwise but one stands", async function (done) {
                currentState.getChampion(1).setPosition(new Position(5, 5));
                currentState.getChampion(2).setPosition(new Position(6, 5));
                currentState.getChampion(3).setPosition(new Position(6, 6));
                currentState.getChampion(4).setPosition(new Position(5, 6));

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(6, 5, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(6, 6, 'S'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Move(new Position(5, 6, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(5, 5), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(6, 5), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(6, 6), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(5, 6), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(5, 5), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(1)).data.positionBlocked.equals(new Position(6, 5))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'S', new Position(6, 5), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).data.positionBlocked.equals(new Position(6, 6))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'move', 'W', new Position(6, 6), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).data.moveHasBeenBlocked).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(3)).data.positionBlocked.equals(new Position(5, 6))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(5, 6), 2, 4);

                await playAnimation(steps);
                done();
            });

            it("4 champions in square, each one casts a tornado in front of himself", async function (done) {
                currentState.getChampion(1).setPosition(new Position(5, 5));
                currentState.getChampion(2).setPosition(new Position(6, 5));
                currentState.getChampion(3).setPosition(new Position(6, 6));
                currentState.getChampion(4).setPosition(new Position(5, 6));

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Wind(new Position(5, 5, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Wind(new Position(6, 5, 'S'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Wind(new Position(6, 6, 'W'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Wind(new Position(5, 6, 'N'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(5, 5), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(6, 5), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(6, 6), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(5, 6), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast_wind', 'E', new Position(5, 5), 1, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([{champion: currentState.getChampion(2)._id, moved: new Position(7, 5, 'S'), distance: 1}]);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).data.moved.equals(new Position(5, 4, 'E'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'cast_wind', 'S', new Position(6, 5), 1, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).order.targets).toEqual([{champion: currentState.getChampion(3)._id, moved: new Position(6, 7, 'W'), distance: 1}]);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).data.moved.equals(new Position(7, 5, 'S'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'cast_wind', 'W', new Position(6, 6), 1, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).order.targets).toEqual([{champion: currentState.getChampion(4)._id, moved: new Position(4, 6, 'N'), distance: 1}]);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).data.moved.equals(new Position(6, 7, 'W'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'cast_wind', 'N', new Position(5, 6), 1, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(4)).order.targets).toEqual([{champion: currentState.getChampion(1)._id, moved: new Position(5, 4, 'E'), distance: 1}]);
                expect(steps[1].getStepUnit(currentState.getChampion(4)).data.moved.equals(new Position(4, 6, 'E'))).toBeTruthy();

                await playAnimation(steps);
                done();
            });

            it("3 champions in line, 2 tiles between each, the two at extrem left & right cast a tornado on the middle one", async function (done) {
                currentState.getChampion(1).setPosition(new Position(3, 6));
                currentState.getChampion(2).setPosition(new Position(6, 6));
                currentState.getChampion(3).setPosition(new Position(9, 5));
                currentState.getChampion(4).setPosition(new Position(6, 9));

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Wind(new Position(3, 6, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Wind(new Position(9, 5, 'W'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Wind(new Position(6, 9, 'N'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(3, 6), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(6, 6), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(9, 5), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(6, 9), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast_wind', 'E', new Position(3, 6), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([{champion: currentState.getChampion(2)._id, moved: new Position(7, 6, 'W'), distance: 3}]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(6, 6), 2, 1);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).data.moved.equals(new Position(6, 5, 'W'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'cast_wind', 'W', new Position(9, 5), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).order.targets).toEqual([{champion: currentState.getChampion(2)._id, moved: new Position(6, 5, 'W'), distance: 4}]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'cast_wind', 'N', new Position(6, 9), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(4)).order.targets).toEqual([{champion: currentState.getChampion(2)._id, moved: new Position(7, 5, 'W'), distance: 3}]);


                await playAnimation(steps);
                done();
            });
        });
    });
}