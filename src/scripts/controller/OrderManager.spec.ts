/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>

module TacticArena {
    describe("OrderManager", () => {
        var testGame, currentState, originalTimeout;

        function testStepUnit(stepUnit: StepUnit, action, direction, orderPosition: Position, ap, hp) {
            expect(stepUnit.order.action).toEqual(action);
            expect(stepUnit.order.position.d).toEqual(direction);
            expect(stepUnit.order.position.equals(orderPosition)).toEqual(true);
            expect(stepUnit.ap + ' AP').toEqual(ap + ' AP');
            expect(stepUnit.hp + ' HP').toEqual(hp + ' HP');
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
            //return;
            initSpriteManager();
            currentState.resolveManager.init(steps, 0);
            await currentState.resolveManager.processSteps(0);

        }

        beforeEach(function (done) {
            //spyOn(console, 'log').and.stub();
            spyOn(console, 'info').and.stub();
            spyOn(console, 'warn').and.stub();
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            testGame = new TestGame(true);
            testGame.state.start('testpreload');
            testGame.state.onStateChange.add(function (stateName) {
                if (stateName === 'test') {
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        describe("methods", () => {

            it("removeOrders", function () {
                spyOn(currentState.signalManager.onOrderChange, 'dispatch').and.callThrough();
                expect(currentState.orderManager.orders).toEqual([]);
                let orders = [
                    new ChampionOrders(currentState.getChampion(1), [new Order.Stand(new Position(8, 8, 'E'))]),
                    new ChampionOrders(currentState.getChampion(2), [new Order.Move(new Position(10, 7, 'W'))]),
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
                    new ChampionOrders(currentState.getChampion(2), [new Order.Move(new Position(10, 7, 'W'))])
                ];
                expect(currentState.orderManager.hasOrder(currentState.getChampion(1))).toBe(false);
                expect(currentState.orderManager.hasOrder(currentState.getChampion(2))).toBe(true);
            });

            it("add / getOrders", function () {
                spyOn(currentState.signalManager.onOrderChange, 'dispatch').and.callThrough();
                expect(currentState.orderManager.getOrders(currentState.getChampion(1))).toEqual([]);

                currentState.orderManager.add(currentState.getChampion(1), new Order.Move(new Position(10, 7, 'W')), false);
                expect(currentState.orderManager.getOrders(currentState.getChampion(1))).toEqual([new Order.Move(new Position(10, 7, 'W'))]);
                expect(currentState.signalManager.onOrderChange.dispatch).not.toHaveBeenCalled();

                currentState.orderManager.add(currentState.getChampion(1), new Order.Move(new Position(9, 7, 'W')));
                expect(currentState.orderManager.getOrders(currentState.getChampion(1))).toEqual([
                    new Order.Move(new Position(10, 7, 'W')),
                    new Order.Move(new Position(9, 7, 'W'))
                ]);
                expect(currentState.signalManager.onOrderChange.dispatch).toHaveBeenCalledWith(currentState.getChampion(1));
            });

        });

        describe("2 players", () => {

            it("nothing is played", async function (done) {
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8, 'E'), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8, 'W'), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8, 'E'), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8, 'W'), 2, 4);

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
                expect(steps[1].getStepUnit(currentState.getChampion(1)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(1)).blockedPosition.equals(new Position(9, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(10, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).blockedPosition.equals(new Position(9, 8))).toBeTruthy();

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
                expect(steps[4].getStepUnit(currentState.getChampion(1)).isBlocked()).toBeTruthy();
                expect(steps[4].getStepUnit(currentState.getChampion(1)).blockedPosition.equals(new Position(10, 8))).toBeTruthy();
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

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(9, 9), 1, 3);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'slash', 'W', new Position(10, 8), 1, 4);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(10, 9), 0, 3);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'slash', 'W', new Position(10, 8), 0, 4);

                await playAnimation(steps);
                done();
            });

            it("the first one wants to move east, he gets blocked by the other, but continue his actions from his blocked position", async function (done) {
                currentState.getChampion(1)._apMax = 4;
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(9, 8, 'E')),
                            new Order.Fire(new Position(9, 9, 'E')),
                            new Order.Move(new Position(10, 9, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(9, 8, 'W')),
                            new Order.Move(new Position(8, 8, 'W')),
                            new Order.Move(new Position(7, 8, 'W'))
                        ]
                    ),
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(4);
                expect(steps[0].stepUnits.length).toEqual(2);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 4, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(8, 8), 3, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(1)).blockedPosition.equals(new Position(9, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(10, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).blockedPosition.equals(new Position(9, 8))).toBeTruthy();

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(8, 8), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 1, 2);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(10, 8), 0, 2);

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
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([{championId: currentState.getChampion(2)._id}]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 2, 2);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 1, 2);
                expect(steps[2].getStepUnit(currentState.getChampion(2)).isBlocked()).toBeTruthy();
                expect(steps[2].getStepUnit(currentState.getChampion(2)).blockedPosition.equals(new Position(8, 8))).toBeTruthy();

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
                    {championId: currentState.getChampion(2)._id, moved: new Position(10, 8, 'W'), distance: 1}
                ]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).movedPosition.equals(new Position(10, 8, 'W'))).toBeTruthy();

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 1, 3);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(9, 8), 0, 3);
                expect(steps[3].getStepUnit(currentState.getChampion(2)).blockedPosition.equals(new Position(8, 8, 'W'))).toBeTruthy();

                await playAnimation(steps);
                done();
            });

            it("the second one cast_wind to the north while the other stands but doesn't get pushed cause there is an obstacle on the way", async function (done) {
                currentState.getChampion(2).setPosition(new Position(8, 11, 'N'));
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Wind(new Position(8, 11, 'N'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(2);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'N', new Position(8, 11), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).movedPosition).toBeNull();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'cast_wind', 'N', new Position(8, 11), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).order.targets).toEqual([
                    {championId: currentState.getChampion(1)._id, moved: null, distance: 3}
                ]);

                await playAnimation(steps);
                done();
            });
        });


        describe("4 players", () => {
            beforeEach(function () {
                currentState.pawns.push(new Champion.Test(currentState, new Position(7, 7, 'E'), 3, 1));
                currentState.pawns.push(new Champion.Test(currentState, new Position(12, 7, 'W'), 4, 2));
            });

            it("with 1 dead - nothing is played", async function (done) {
                currentState.getChampion(1).setPosition(new Position(6, 4, 'S'));
                currentState.getChampion(2).setPosition(new Position(2, 15, 'S'));
                currentState.getChampion(4).setPosition(new Position(9, 15, 'S'));
                currentState.getChampion(3).setHp(0, false, true);

                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'S', new Position(6, 4), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'S', new Position(2, 15), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'S', new Position(9, 15), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'stand', 'S', new Position(6, 4), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'stand', 'S', new Position(2, 15), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'dead', 'E', new Position(7, 7), 0, 0);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'stand', 'S', new Position(9, 15), 2, 4);

                await playAnimation(steps);
                done();
            });

            it("the 1st one cast, the 2nd one dies so it blocks the way and sees its actions cancelled - the 4th pawn moves but is blocked", async function (done) {
                currentState.getChampion(2).setHp(2, false, true);
                currentState.getChampion(2)._apMax = 4;
                currentState.getChampion(4)._apMax = 4;
                currentState.getChampion(1).setPosition(new Position(4, 9)); // 1st
                currentState.getChampion(2).setPosition(new Position(7, 9)); // 2nd
                currentState.getChampion(3).setPosition(new Position(3, 8)); // not active
                currentState.getChampion(4).setPosition(new Position(8, 8)); // 4th

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Fire(new Position(4, 9, 'E')),
                            new Order.Move(new Position(3, 9, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(6, 9, 'W')),
                            new Order.Fire(new Position(6, 9, 'W')),
                            new Order.Move(new Position(5, 9, 'W'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Move(new Position(7, 8, 'W')),
                            new Order.Move(new Position(6, 8, 'W')),
                            new Order.Move(new Position(6, 9, 'W')),
                            new Order.Move(new Position(5, 9, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(5);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(4, 9), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(7, 9), 4, 2);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(3, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(8, 8), 4, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(4, 9), 1, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(6, 9), 3, 0);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(3, 8), 2, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'move', 'W', new Position(7, 8), 3, 4);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(3, 9), 0, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(6, 9), 3, 0);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(3, 8), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(4)), 'move', 'W', new Position(6, 8), 2, 4);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(3, 9), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(6, 9), 3, 0);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(3, 8), 0, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(4)), 'move', 'W', new Position(6, 8), 1, 4);
                expect(steps[3].getStepUnit(currentState.getChampion(4)).isBlocked()).toBeTruthy();
                expect(steps[3].getStepUnit(currentState.getChampion(4)).blockedPosition.equals(new Position(6, 9))).toBeTruthy();

                testStepUnit(steps[4].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(3, 9), 0, 4);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(6, 9), 3, 0);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(3, 8), 0, 4);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(6, 8), 0, 4);

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

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'dead', 'E', new Position(6, 8), 0, 0);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).movedPosition.equals(new Position(5, 8))).toBeTruthy(); // dead can be moved
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'cast_wind', 'W', new Position(9, 8), 1, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).movedPosition.equals(new Position(6, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(10, 10), 2, 4);

                initSpriteManager();
                currentState.resolveManager.init(steps, 0);
                await currentState.resolveManager.processStep(0);
                expect(currentState.spritesManager.getReal(currentState.getChampion(1)).getPosition().equals(new Position(6, 8, 'E'))).toBeTruthy();
                expect(currentState.spritesManager.getReal(currentState.getChampion(3)).getPosition().equals(new Position(7, 8, 'E'))).toBeTruthy();
                await currentState.resolveManager.processStep(1);
                expect(currentState.spritesManager.getReal(currentState.getChampion(1)).getPosition().equals(new Position(5, 8, 'E'))).toBeTruthy();
                expect(currentState.spritesManager.getReal(currentState.getChampion(3)).getPosition().equals(new Position(6, 8, 'E'))).toBeTruthy();
                done();
            });

            it("4 champions trying to move, all should be blocked", async function (done) {
                currentState.getChampion(1).setPosition(new Position(6, 8)); // 1st
                currentState.getChampion(2).setPosition(new Position(8, 8)); // 3rd
                currentState.getChampion(3).setPosition(new Position(7, 8)); // 2nd
                currentState.getChampion(4).setPosition(new Position(6, 9)); // 4rth

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(7, 8, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Move(new Position(8, 8, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(7, 8, 'W'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Move(new Position(6, 8, 'N'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(6, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(7, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(6, 9), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(6, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(1)).blockedPosition.equals(new Position(7, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(8, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).blockedPosition.equals(new Position(7, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'move', 'E', new Position(7, 8), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(3)).blockedPosition.equals(new Position(8, 8))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'move', 'N', new Position(6, 9), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(4)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(4)).blockedPosition.equals(new Position(6, 8))).toBeTruthy();

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
                expect(steps[1].getStepUnit(currentState.getChampion(1)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(1)).blockedPosition.equals(new Position(6, 5))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'S', new Position(6, 5), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).blockedPosition.equals(new Position(6, 6))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'move', 'W', new Position(6, 6), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(3)).blockedPosition.equals(new Position(5, 6))).toBeTruthy();
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
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([{championId: currentState.getChampion(2)._id, moved: new Position(7, 5, 'S'), distance: 1}]);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).movedPosition.equals(new Position(5, 4, 'E'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'cast_wind', 'S', new Position(6, 5), 1, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).order.targets).toEqual([{championId: currentState.getChampion(3)._id, moved: new Position(6, 7, 'W'), distance: 1}]);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).movedPosition.equals(new Position(7, 5, 'S'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'cast_wind', 'W', new Position(6, 6), 1, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).order.targets).toEqual([{championId: currentState.getChampion(4)._id, moved: new Position(4, 6, 'N'), distance: 1}]);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).movedPosition.equals(new Position(6, 7, 'W'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'cast_wind', 'N', new Position(5, 6), 1, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(4)).order.targets).toEqual([{championId: currentState.getChampion(1)._id, moved: new Position(5, 4, 'E'), distance: 1}]);
                expect(steps[1].getStepUnit(currentState.getChampion(4)).movedPosition.equals(new Position(4, 6, 'E'))).toBeTruthy();

                await playAnimation(steps);
                done();
            });

            it("3 champions on left & right cast a tornado on the middle one", async function (done) {
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
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([{championId: currentState.getChampion(2)._id, moved: new Position(7, 6, 'W'), distance: 3}]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(6, 6), 2, 1);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).movedPosition.equals(new Position(6, 5, 'W'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'cast_wind', 'W', new Position(9, 5), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).order.targets).toEqual([{championId: currentState.getChampion(2)._id, moved: new Position(6, 5, 'W'), distance: 4}]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'cast_wind', 'N', new Position(6, 9), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(4)).order.targets).toEqual([{championId: currentState.getChampion(2)._id, moved: new Position(7, 5, 'W'), distance: 3}]);

                await playAnimation(steps);
                done();
            });

            it("2 champions on each side, one casting fire while the other one is healing him", async function (done) {
                currentState.getChampion(1)._apMax = 10;
                currentState.getChampion(2)._apMax = 10;
                currentState.getChampion(3)._apMax = 10;
                currentState.getChampion(4)._apMax = 10;
                currentState.getChampion(1).setPosition(new Position(4, 8));
                currentState.getChampion(2).setPosition(new Position(4, 9));
                currentState.getChampion(3).setPosition(new Position(8, 8));
                currentState.getChampion(4).setPosition(new Position(8, 9));

                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Fire(new Position(4, 8, 'E')),
                            new Order.Fire(new Position(4, 8, 'E')),
                            new Order.Fire(new Position(4, 8, 'E')),
                            new Order.Fire(new Position(4, 8, 'E')),
                            new Order.Fire(new Position(4, 8, 'E')),
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Heal(new Position(4, 9, 'N')),
                            new Order.Heal(new Position(4, 9, 'N')),
                            new Order.Heal(new Position(4, 9, 'N')),
                            new Order.Heal(new Position(4, 9, 'N')),
                            new Order.Heal(new Position(4, 9, 'N')),
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Fire(new Position(8, 8, 'W')),
                            new Order.Fire(new Position(8, 8, 'W')),
                            new Order.Fire(new Position(8, 8, 'W')),
                            new Order.Fire(new Position(8, 8, 'W')),
                            new Order.Fire(new Position(8, 8, 'W')),
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Heal(new Position(8, 9, 'N')),
                            new Order.Heal(new Position(8, 9, 'N')),
                            new Order.Heal(new Position(8, 9, 'N')),
                            new Order.Heal(new Position(8, 9, 'N')),
                            new Order.Heal(new Position(8, 9, 'N')),
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(6);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(4, 8), 10, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(4, 9), 10, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(8, 8), 10, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(8, 9), 10, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(4, 8), 8, 3);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'heal', 'N', new Position(4, 9), 9, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'cast', 'W', new Position(8, 8), 8, 3);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'heal', 'N', new Position(8, 9), 9, 4);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(4, 8), 6, 2);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'heal', 'N', new Position(4, 9), 8, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(3)), 'cast', 'W', new Position(8, 8), 6, 2);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(4)), 'heal', 'N', new Position(8, 9), 8, 4);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(4, 8), 4, 1);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'heal', 'N', new Position(4, 9), 7, 4);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(3)), 'cast', 'W', new Position(8, 8), 4, 1);
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(4)), 'heal', 'N', new Position(8, 9), 7, 4);

                testStepUnit(steps[4].getStepUnit(currentState.getChampion(1)), 'cast', 'E', new Position(4, 8), 2, 0);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(2)), 'heal', 'N', new Position(4, 9), 6, 4);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(3)), 'cast', 'W', new Position(8, 8), 2, 0);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(4)), 'heal', 'N', new Position(8, 9), 6, 4);

                testStepUnit(steps[5].getStepUnit(currentState.getChampion(1)), 'dead', 'E', new Position(4, 8), 2, 0);
                testStepUnit(steps[5].getStepUnit(currentState.getChampion(2)), 'heal', 'N', new Position(4, 9), 5, 4);
                testStepUnit(steps[5].getStepUnit(currentState.getChampion(3)), 'dead', 'W', new Position(8, 8), 2, 0);
                testStepUnit(steps[5].getStepUnit(currentState.getChampion(4)), 'heal', 'N', new Position(8, 9), 5, 4);

                await playAnimation(steps);
                done();
            });

            it("the first one cast_wind to the west while the other moves west and gets blocked by the third", async function (done) {
                currentState.getChampion(2).setPosition(new Position(6, 8, 'W'));
                currentState.getChampion(3).setPosition(new Position(5, 8, 'E'));
                currentState.getChampion(4).setPosition(new Position(10, 10)); // not active
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Wind(new Position(8, 8, 'W'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(5, 8, 'W'))
                        ]
                    )
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(8, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(6, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(5, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(10, 10), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast_wind', 'W', new Position(8, 8), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([
                    {championId: currentState.getChampion(3)._id, moved: new Position(4, 8, 'E'), distance: 3},
                    {championId: currentState.getChampion(2)._id, moved: new Position(5, 8, 'W'), distance: 2}
                ]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(6, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).blockedPosition.equals(new Position(5, 8))).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).movedPosition.equals(new Position(5, 8, 'W'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(5, 8), 2, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).movedPosition.equals(new Position(4, 8, 'E'))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(10, 10), 2, 4);

                await playAnimation(steps);
                done();
            });

            it("the first one cast wind south to 2nd while the other cast fire", async function (done) {
                currentState.getChampion(1).setPosition(new Position(7, 8, 'S'));
                currentState.getChampion(2).setPosition(new Position(8, 10, 'W'));
                currentState.getChampion(3).setPosition(new Position(5, 10, 'E'));
                currentState.getChampion(4).setPosition(new Position(9, 11, 'W'));
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Wind(new Position(7, 8, 'S'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Move(new Position(7, 10, 'W'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Fire(new Position(5, 10, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Fire(new Position(9, 11, 'W'))
                        ]
                    ),
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'S', new Position(7, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(8, 10), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(5, 10), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(9, 11), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast_wind', 'S', new Position(7, 8), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([
                    {championId: currentState.getChampion(2)._id, moved: new Position(7, 11, 'W'), distance: 2},
                ]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'move', 'W', new Position(7, 10), 2, 1);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).isMoved()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).movedPosition.equals(new Position(7, 11, 'W'), true)).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'cast', 'E', new Position(5, 10), 1, 4);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'cast', 'W', new Position(9, 11), 1, 4);

                await playAnimation(steps);
                done();
            });

            it("the first one cast wind south to 2nd while he cast fire", async function (done) {
                currentState.getChampion(1).setPosition(new Position(7, 8, 'S'));
                currentState.getChampion(2).setPosition(new Position(7, 10, 'W'));
                currentState.getChampion(3).setPosition(new Position(5, 10, 'E'));
                currentState.getChampion(4).setPosition(new Position(5, 11, 'E'));
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Wind(new Position(7, 8, 'S'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(2), [
                            new Order.Fire(new Position(7, 10, 'W'))
                        ]
                    ),
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(2);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'S', new Position(7, 8), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'stand', 'W', new Position(7, 10), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(5, 10), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'E', new Position(5, 11), 3, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'cast_wind', 'S', new Position(7, 8), 1, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).order.targets).toEqual([
                    {championId: currentState.getChampion(2)._id, moved: new Position(7, 11, 'W'), distance: 2},
                ]);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'cast', 'W', new Position(7, 10), 1, 3);
                expect(steps[1].getStepUnit(currentState.getChampion(2)).isMoved()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(2)).movedPosition.equals(new Position(7, 11, 'W'), true)).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(5, 10), 2, 2);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'stand', 'E', new Position(5, 11), 2, 4);

                await playAnimation(steps);
                done();
            });

            it("the 4th one cast wind west to 2nd dead and 3rd & 4th after moving", async function (done) {
                currentState.getChampion(1).setPosition(new Position(5, 9, 'E'));
                currentState.getChampion(2).setPosition(new Position(7, 9, 'W'));
                currentState.getChampion(2).setHp(0, false, true);
                currentState.getChampion(3).setPosition(new Position(6, 9, 'E'));
                currentState.getChampion(4).setPosition(new Position(8, 8, 'W'));
                currentState.getChampion(4)._apMax = 4;
                currentState.orderManager.orders = [
                    new ChampionOrders(currentState.getChampion(1), [
                            new Order.Move(new Position(6, 9, 'E')),
                            new Order.Move(new Position(7, 9, 'E')),
                            new Order.Move(new Position(7, 8, 'E')),
                            new Order.Move(new Position(8, 8, 'E'))
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(3), [
                            new Order.Move(new Position(7, 9, 'E')),
                            new Order.Move(new Position(7, 8, 'E')),
                            new Order.Move(new Position(8, 8, 'E')),
                        ]
                    ),
                    new ChampionOrders(currentState.getChampion(4), [
                            new Order.Move(new Position(8, 9, 'W')),
                            new Order.Heal(new Position(8, 9, 'W')),
                            new Order.Wind(new Position(8, 9, 'W'))
                        ]
                    ),
                ];
                let steps = currentState.orderManager.getSteps();
                expect(steps.length).toEqual(5);
                expect(steps[0].stepUnits.length).toEqual(4);

                testStepUnit(steps[0].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(5, 9), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(7, 9), 0, 0);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(6, 9), 3, 4);
                testStepUnit(steps[0].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(8, 8), 4, 4);

                testStepUnit(steps[1].getStepUnit(currentState.getChampion(1)), 'move', 'E', new Position(5, 9), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(1)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(1)).blockedPosition.equals(new Position(6, 9))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(7, 9), 0, 0);
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(3)), 'move', 'E', new Position(6, 9), 2, 4);
                expect(steps[1].getStepUnit(currentState.getChampion(3)).isBlocked()).toBeTruthy();
                expect(steps[1].getStepUnit(currentState.getChampion(3)).blockedPosition.equals(new Position(7, 9))).toBeTruthy();
                testStepUnit(steps[1].getStepUnit(currentState.getChampion(4)), 'move', 'W', new Position(8, 9), 3, 4);

                testStepUnit(steps[2].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(5, 9), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(7, 9), 0, 0);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(6, 9), 1, 4);
                testStepUnit(steps[2].getStepUnit(currentState.getChampion(4)), 'heal', 'W', new Position(8, 9), 2, 4);

                testStepUnit(steps[3].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(5, 9), 0, 3);
                expect(steps[3].getStepUnit(currentState.getChampion(1)).isMoved()).toBeTruthy();
                expect(steps[3].getStepUnit(currentState.getChampion(1)).movedPosition.equals(new Position(4, 9, 'E'), true)).toBeTruthy();
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(7, 9), 0, 0);
                expect(steps[3].getStepUnit(currentState.getChampion(2)).isMoved()).toBeTruthy();
                expect(steps[3].getStepUnit(currentState.getChampion(2)).movedPosition.equals(new Position(6, 9, 'W'), true)).toBeTruthy();
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(6, 9), 0, 3);
                expect(steps[3].getStepUnit(currentState.getChampion(3)).isMoved()).toBeTruthy();
                expect(steps[3].getStepUnit(currentState.getChampion(3)).movedPosition.equals(new Position(5, 9, 'E'), true)).toBeTruthy();
                testStepUnit(steps[3].getStepUnit(currentState.getChampion(4)), 'cast_wind', 'W', new Position(8, 9), 0, 4);
                expect(steps[3].getStepUnit(currentState.getChampion(4)).order.targets).toEqual([
                    {championId: currentState.getChampion(1)._id, moved: new Position(4, 9, 'E'), distance: 3},
                    {championId: currentState.getChampion(3)._id, moved: new Position(5, 9, 'E'), distance: 2},
                    {championId: currentState.getChampion(2)._id, moved: new Position(6, 9, 'W'), distance: 1}
                ]);

                testStepUnit(steps[4].getStepUnit(currentState.getChampion(1)), 'stand', 'E', new Position(4, 9), 0, 3);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(2)), 'dead', 'W', new Position(6, 9), 0, 0);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(3)), 'stand', 'E', new Position(5, 9), 0, 3);
                testStepUnit(steps[4].getStepUnit(currentState.getChampion(4)), 'stand', 'W', new Position(8, 9), 0, 4);

                await playAnimation(steps);
                done();
            });
        });
    });
}