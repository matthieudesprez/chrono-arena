var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
if (typeof window != "undefined") {
    window.describe = window.describe || function () { };
}
var TacticArena;
(function (TacticArena) {
    var Specs;
    (function (Specs) {
        describe("MainUI", function () {
            it("must works", function () {
                var result = true;
                expect(result).toBe(true);
            });
        });
    })(Specs = TacticArena.Specs || (TacticArena.Specs = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="./definitions/phaser.comments.d.ts"/>
/// <reference path="./definitions/jasmine.d.ts"/>
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jqueryui.d.ts" />
/// <reference path="./definitions/easystarjs.d.ts"/>
var TacticArena;
(function (TacticArena) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(headless) {
            if (headless === void 0) { headless = false; }
            var _this = _super.call(this, {
                width: 640,
                height: 640,
                renderer: headless ? Phaser.HEADLESS : Phaser.AUTO,
                parent: 'game-container'
            }) || this;
            _this.state.add('boot', TacticArena.State.Boot);
            _this.state.add('preload', TacticArena.State.Preload);
            _this.state.add('main', TacticArena.State.Main);
            _this.state.start('boot');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    TacticArena.Game = Game;
})(TacticArena || (TacticArena = {}));
/// <reference path="./definitions/phaser.comments.d.ts"/>
/// <reference path="./definitions/jasmine.d.ts"/>
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jqueryui.d.ts" />
/// <reference path="./definitions/easystarjs.d.ts"/>
var TacticArena;
(function (TacticArena) {
    var Specs;
    (function (Specs) {
        var TestGame = (function (_super) {
            __extends(TestGame, _super);
            function TestGame(headless) {
                if (headless === void 0) { headless = false; }
                var _this = _super.call(this, {
                    width: 640,
                    height: 640,
                    renderer: headless ? Phaser.HEADLESS : Phaser.AUTO,
                    parent: 'game-container'
                }) || this;
                _this.state.add('test', TacticArena.State.Test);
                _this.state.onCreateCallback = function () {
                };
                _this.state.start('test');
                return _this;
            }
            return TestGame;
        }(Phaser.Game));
        Specs.TestGame = TestGame;
    })(Specs = TacticArena.Specs || (TacticArena.Specs = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Controller;
    (function (Controller) {
        var AiManager = (function () {
            function AiManager(game) {
                this.game = game;
            }
            AiManager.prototype.getClosestPawn = function (position) {
                var result = null;
                for (var i = 0; i < this.game.pawns.length; i++) {
                    var p = this.game.pawns[i];
                    var distance = this.game.stageManager.getNbTilesBetween(position, p.getPosition());
                    if (distance > 0) {
                        result = p;
                    }
                }
                return result;
            };
            AiManager.prototype.getDirection = function (p1, p2) {
                if (p1.x > p2.x) {
                    return 'W';
                }
                else if (p1.x < p2.x) {
                    return 'E';
                }
                else if (p1.y > p2.y) {
                    return 'N';
                }
                else if (p1.y < p2.y) {
                    return 'S';
                }
            };
            AiManager.prototype.play = function (pawn) {
                var self = this;
                var p = pawn.getPosition();
                var target = this.getClosestPawn(p);
                if (target) {
                    var targetPosition_1 = target.getPosition();
                    var direction_1 = self.getDirection(p, targetPosition_1);
                    if (pawn.getDirection() != direction_1) {
                        this.game.orderManager.add('stand', pawn, p.x, p.y, direction_1);
                        pawn.setAp(pawn.getAp() - 1);
                    }
                    var lastDirection_1 = pawn.getDirection();
                    this.game.pathfinder.findPath(p.x, p.y, targetPosition_1.x, targetPosition_1.y, function (path) {
                        if (path && path.length > 0) {
                            path.shift();
                            for (var i = 0; i < path.length; i++) {
                                if (pawn.getAp() > 0) {
                                    direction_1 = self.getDirection(p, targetPosition_1);
                                    self.game.orderManager.add('move', pawn, path[i].x, path[i].y, direction_1);
                                    pawn.setAp(pawn.getAp() - 1);
                                    if (lastDirection_1 != direction_1 || i >= path.length - 1) {
                                        lastDirection_1 = direction_1;
                                        self.game.orderManager.add('stand', pawn, path[i].x, path[i].y, direction_1);
                                        pawn.setAp(pawn.getAp() - 1);
                                    }
                                }
                            }
                        }
                        //self.game.uiManager.endOrderPhase();
                    });
                    this.game.pathfinder.calculate();
                }
            };
            return AiManager;
        }());
        Controller.AiManager = AiManager;
    })(Controller = TacticArena.Controller || (TacticArena.Controller = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Controller;
    (function (Controller) {
        var LogManager = (function () {
            //[
            //    turnIndex: [
            //        stepIndex: {step}
            //    ]
            //]
            function LogManager(game) {
                this.logs = [];
                this.game = game;
            }
            LogManager.prototype.add = function (steps) {
                this.logs.push(steps);
            };
            LogManager.prototype.get = function (turnIndex, stepIndex) {
                return this.logs[turnIndex][stepIndex];
            };
            return LogManager;
        }());
        Controller.LogManager = LogManager;
    })(Controller = TacticArena.Controller || (TacticArena.Controller = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>
var TacticArena;
(function (TacticArena) {
    var Specs;
    (function (Specs) {
        describe("OrderManager", function () {
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
                testGame = new Specs.TestGame(true);
                testGame.state.start('test');
                testGame.state.onStateChange.add(function () {
                    currentState = testGame.state.getCurrentState();
                    setTimeout(function () {
                        currentState.pawns = [];
                        currentState.pathTilesGroup = currentState.add.group();
                        currentState.pawnsSpritesGroup = currentState.add.group();
                        currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 8, 8, 'E', 'skeleton', 1, false, 'Eikio'));
                        currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 10, 8, 'W', 'skeleton', 2, false, 'Dormammu'));
                        done();
                    }, 200);
                });
            });
            afterEach(function () {
                testGame.destroy();
                testGame = null;
            });
            describe("2 players / Fleerate 0%", function () {
                beforeEach(function () {
                    spyOn(currentState.orderManager, 'resolutionEsquive').and.callFake(function () {
                        return true;
                    });
                });
                it("nothing is played", function () {
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(2);
                    expect(steps[0].length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, {});
                });
                it("1st one stands same position for 1 step", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                { action: "stand", direction: "E", x: 8, y: 8 }
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(2);
                    expect(steps[0].length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, {});
                });
                it("1st one moves toward the 2nd for 2 steps", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                { action: "move", direction: "E", x: 9, y: 8 },
                                { action: "move", direction: "E", x: 10, y: 8 }
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(3);
                    expect(steps[0].length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'move', 'E', { x: 9, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, {});
                    testStep(steps, 2, 0, 1, 'attack', 'E', { x: 9, y: 8 }, 1, 3, true, { x: 10, y: 8 });
                    testStep(steps, 2, 1, 2, 'attack', 'W', { x: 10, y: 8 }, 1, 3, false, {});
                });
                it("both going same position then the first one wants to continue moving", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                { action: "move", direction: "E", x: 9, y: 8 },
                                { action: "move", direction: "E", x: 9, y: 9 },
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                { action: "move", direction: "W", x: 9, y: 8 }
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(3);
                    expect(steps[0].length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'move', 'E', { x: 8, y: 8 }, 2, 4, true, { x: 9, y: 8 });
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 10, y: 8 }, 2, 4, true, { x: 9, y: 8 });
                    testStep(steps, 2, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 1, 4, false, {});
                    testStep(steps, 2, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 1, 4, false, {});
                });
                it("the first one wants moves in front of the second, then continues moving, facing the other", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                { action: "move", direction: "E", x: 9, y: 8 },
                                { action: "move", direction: "E", x: 9, y: 9 },
                                { action: "move", direction: "E", x: 10, y: 9 }
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'move', 'E', { x: 9, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, {});
                    testStep(steps, 2, 0, 1, 'move', 'E', { x: 9, y: 8 }, 1, 3, true, { x: 9, y: 9 });
                    testStep(steps, 2, 1, 2, 'attack', 'W', { x: 10, y: 8 }, 1, 4, false, {});
                    testStep(steps, 3, 0, 1, 'attack', 'E', { x: 9, y: 8 }, 0, 2, false, {});
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 10, y: 8 }, 0, 3, false, {});
                });
                it("the first one wants moves in front of the second, then continues moving, without facing the other", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                { action: "stand", direction: "S", x: 8, y: 8 },
                                { action: "move", direction: "S", x: 9, y: 8 },
                                { action: "move", direction: "S", x: 9, y: 9 }
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'stand', 'S', { x: 8, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, {});
                    testStep(steps, 2, 0, 1, 'move', 'S', { x: 9, y: 8 }, 1, 4, false, {});
                    testStep(steps, 2, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 1, 4, false, {});
                    testStep(steps, 3, 0, 1, 'move', 'S', { x: 9, y: 8 }, 0, 3, true, { x: 9, y: 9 });
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 10, y: 8 }, 0, 4, false, {});
                });
                it("the first one wants moves north then casts to the east while the other moves in the dmg area then comes cac", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                { action: "move", direction: "E", x: 8, y: 7 },
                                { action: "cast", direction: "E", x: 8, y: 7 }
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                { action: "move", direction: "W", x: 10, y: 7 },
                                { action: "move", direction: "W", x: 9, y: 7 },
                                { action: "move", direction: "W", x: 8, y: 7 }
                            ]
                        },
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'move', 'E', { x: 8, y: 7 }, 2, 4, false, {});
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 10, y: 7 }, 2, 4, false, {});
                    testStep(steps, 2, 0, 1, 'cast', 'E', { x: 8, y: 7 }, 0, 4, false, {});
                    expect(steps[2][0].order.targets).toEqual([currentState.pawns[1]]);
                    testStep(steps, 2, 1, 2, 'move', 'W', { x: 9, y: 7 }, 1, 2, false, {});
                    testStep(steps, 3, 0, 1, 'stand', 'E', { x: 8, y: 7 }, 0, 3, false, {});
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 9, y: 7 }, 0, 2, true, { x: 8, y: 7 });
                });
                it("the first one casts to the east while the other moves toward him", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                { action: "cast", direction: "E", x: 8, y: 8 }
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                { action: "move", direction: "W", x: 9, y: 8 },
                                { action: "move", direction: "W", x: 8, y: 8 },
                                { action: "move", direction: "W", x: 7, y: 8 }
                            ]
                        },
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'cast', 'E', { x: 8, y: 8 }, 1, 4, false, {});
                    expect(steps[1][0].order.targets).toEqual([currentState.pawns[1]]);
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 9, y: 8 }, 2, 2, false, {});
                    testStep(steps, 2, 0, 1, 'attack', 'E', { x: 8, y: 8 }, 0, 3, false, {});
                    testStep(steps, 2, 1, 2, 'attack', 'W', { x: 9, y: 8 }, 1, 1, true, { x: 8, y: 8 });
                    testStep(steps, 3, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 0, 2, false, {});
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 9, y: 8 }, 0, 1, false, {});
                });
            });
        });
    })(Specs = TacticArena.Specs || (TacticArena.Specs = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Controller;
    (function (Controller) {
        var OrderManager = (function () {
            function OrderManager(game) {
                this.orders = [];
                this.game = game;
                this.alteredPawns = [];
            }
            OrderManager.prototype.removeEntityOrder = function (pawn) {
                var id = pawn._id;
                var result = [];
                for (var i = 0; i < this.orders.length; i++) {
                    if (this.orders[i].entity._id != id) {
                        result.push(this.orders[i]);
                    }
                }
                this.orders = result;
                this.game.signalManager.onOrderChange.dispatch(pawn);
            };
            OrderManager.prototype.hasOrder = function (id) {
                for (var i = 0; i < this.orders.length; i++) {
                    if (this.orders[i].entity._id == id) {
                        return true;
                    }
                }
                return false;
            };
            OrderManager.prototype.add = function (action, entity, x, y, direction, triggerDispatch) {
                if (direction === void 0) { direction = null; }
                if (triggerDispatch === void 0) { triggerDispatch = true; }
                if (!this.hasOrder(entity._id)) {
                    this.orders.push({
                        'entity': entity,
                        'list': []
                    });
                }
                for (var i = 0; i < this.orders.length; i++) {
                    if (this.orders[i].entity._id == entity._id) {
                        var order = {
                            action: action,
                            x: x,
                            y: y,
                            direction: direction
                        };
                        this.orders[i].list.push(order);
                    }
                }
                if (triggerDispatch) {
                    this.game.signalManager.onOrderChange.dispatch(entity);
                }
            };
            OrderManager.prototype.getOrders = function (entity_id) {
                for (var i = 0; i < this.orders.length; i++) {
                    if (this.orders[i].entity._id == entity_id) {
                        return this.orders[i].list;
                    }
                }
                return [];
            };
            OrderManager.prototype.getMaxOrderListLength = function () {
                var max = 0;
                for (var i = 0; i < this.orders.length; i++) {
                    if (this.orders[i].list.length > max) {
                        max = this.orders[i].list.length;
                    }
                }
                return max;
            };
            OrderManager.prototype.getDefaultOrder = function (position, direction) {
                return {
                    'action': 'stand',
                    'x': position.x,
                    'y': position.y,
                    'direction': direction
                };
            };
            OrderManager.prototype.formatOrders = function () {
                for (var i = 0; i < this.game.pawns.length; i++) {
                    var p = this.game.pawns[i];
                    if (!this.hasOrder(p._id)) {
                        var position = p.getPosition();
                        this.game.orderManager.add('stand', p, position.x, position.y, p.getDirection(), false);
                    }
                }
            };
            OrderManager.prototype.getInitialStep = function () {
                var step = [];
                for (var i = 0; i < this.game.pawns.length; i++) {
                    var state = this.getDefaultEntityState();
                    var pawn = this.game.pawns[i];
                    state['ap'] = pawn._apMax;
                    state['hp'] = pawn.getHp();
                    step.push({
                        entity: pawn,
                        entityState: state,
                        order: this.getDefaultOrder(pawn.getPosition(), pawn.getDirection())
                    });
                }
                return step;
            };
            OrderManager.prototype.resolutionEsquive = function (fleeRate) {
                return (Math.floor(Math.random() * 100) > fleeRate);
            };
            OrderManager.prototype.blockEntity = function (steps, startI, j, order, entity) {
                steps[startI][j].entityState.positionBlocked = { x: steps[startI][j].order.x, y: steps[startI][j].order.y };
                for (var i = startI; i < steps.length; i++) {
                    if (steps[i][j].order) {
                        if (i > startI && steps[i][j].order.action == 'move') {
                            steps[i][j].order = order;
                        }
                        steps[i][j].order.x = order.x;
                        steps[i][j].order.y = order.y;
                    }
                }
                this.alteredPawns.push(entity._id);
                entity.destroyProjection();
                return steps;
            };
            OrderManager.prototype.getSteps = function () {
                this.alteredPawns = [];
                this.formatOrders();
                var steps = new Array(this.getMaxOrderListLength());
                for (var j = 0; j < steps.length; j++) {
                    steps[j] = [];
                    for (var i = 0; i < this.orders.length; i++) {
                        var entity = this.orders[i].entity;
                        entity.show();
                        steps[j].push({
                            'entity': entity,
                            'order': this.orders[i].list[j] ? this.orders[i].list[j] : null
                        });
                    }
                }
                steps.unshift(this.getInitialStep());
                this.orders = [];
                return this.processOrders(steps);
            };
            OrderManager.prototype.getDefaultEntityState = function () {
                return {
                    moveHasBeenBlocked: false,
                    positionBlocked: {}
                };
            };
            OrderManager.prototype.processOrders = function (steps) {
                for (var l = 1; l < steps.length; l++) {
                    var step = steps[l];
                    var previousStep = steps[l - 1];
                    for (var i = 0; i < step.length; i++) {
                        step[i].entityState = this.getDefaultEntityState();
                        // Dans le cas où une entité à moins d'actions à jouer que les autres
                        // On lui en assigne un par défaut pour qu'elle ne soit pas inactive
                        if (step[i].order == null) {
                            step[i].order = this.getDefaultOrder(previousStep[i].order, previousStep[i].order.direction);
                        }
                    }
                    // check actions before for each entity in step
                    for (var i = 0; i < step.length; i++) {
                        var entityA = step[i].entity;
                        var entityAState = step[i].entityState;
                        // foreach entities except A
                        for (var j = 0; j < step.length; j++) {
                            var entityB = step[j].entity;
                            if (entityA._id == entityB._id)
                                continue; // Pas d'interaction avec soi-même
                            var entityBState = step[j].entityState;
                            var orderA = step[i].order;
                            var orderB = step[j].order;
                            var actionA = orderA.action;
                            var actionB = orderB.action;
                            var positionB = { x: orderB.x, y: orderB.y };
                            var directionABeforeOrder = previousStep[i].order.direction;
                            var positionABeforeOrder = { x: previousStep[i].order.x, y: previousStep[i].order.y };
                            var positionBBeforeOrder = { x: previousStep[j].order.x, y: previousStep[j].order.y };
                            var aIsFacingB = this.game.stageManager.isFacing(positionABeforeOrder, orderA.direction, positionBBeforeOrder);
                            var aWasNextToB = this.game.stageManager.getNbTilesBetween(positionABeforeOrder, positionBBeforeOrder) == 1;
                            var fleeRate = 100;
                            var entityAApCost = 1;
                            var entityBHpLost = 0;
                            var aIsActive = previousStep[i].entityState['ap'] > 0; // INACTIF = stand mais pas le droit d'attaquer
                            if (['stand', 'move'].indexOf(actionA) >= 0 && aWasNextToB && aIsFacingB && aIsActive) {
                                // Possible cases :
                                // [  ][A v][  ]
                                // [A>][ B ][<A]
                                // [  ][ A^][  ]
                                var keepDirection = (directionABeforeOrder == orderA.direction);
                                var keepPosition = (orderA.x == positionABeforeOrder.x && orderA.y == positionABeforeOrder.y);
                                // Si A reste dans sa direction (aIsFacingB), et ne va pas pas se détourner de B
                                // ET si A reste adjacent à B OU si A va vers B (en lui faisant face)
                                if (keepDirection && (keepPosition || this.game.stageManager.equalPositions(orderA, orderB))) {
                                    var entityBIsDodge = true;
                                    if (this.resolutionEsquive(fleeRate)) {
                                        entityBHpLost += 1;
                                        entityBIsDodge = false;
                                        if (this.alteredPawns.indexOf(entityB._id) < 0) {
                                            entityBState.moveHasBeenBlocked = (actionB == 'move');
                                        }
                                    }
                                    orderA.action = 'attack';
                                    orderA.target = { entity: entityB, dodge: entityBIsDodge };
                                }
                            }
                            if (orderA.x == orderB.x && orderA.y == orderB.y) {
                                // Si A veut aller sur la même case que B (qu'il y soit déjà où qu'il veuille y aller)
                                if (this.alteredPawns.indexOf(entityA._id) < 0)
                                    entityAState.moveHasBeenBlocked = (actionA == 'move');
                                if (this.alteredPawns.indexOf(entityB._id) < 0)
                                    entityBState.moveHasBeenBlocked = (actionB == 'move');
                            }
                            if (entityBState.moveHasBeenBlocked && this.alteredPawns.indexOf(entityB._id) < 0) {
                                this.blockEntity(steps, l, j, this.getDefaultOrder(previousStep[j].order, previousStep[j].order.direction), entityB);
                            }
                            if (entityAState.moveHasBeenBlocked && this.alteredPawns.indexOf(entityA._id) < 0) {
                                this.blockEntity(steps, l, i, this.getDefaultOrder(previousStep[i].order, previousStep[i].order.direction), entityA);
                            }
                            if (actionA == 'cast') {
                                entityAApCost++;
                                var path = this.game.stageManager.getLinearPath(entityA, 4, orderA.direction, orderA);
                                var targets = [];
                                for (var k = 0; k < path.length; k++) {
                                    var targetPosition = entityBState.moveHasBeenBlocked ? positionBBeforeOrder : positionB;
                                    if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                                        targets.push(entityB);
                                        entityBHpLost += 2;
                                    }
                                }
                                orderA.targets = targets;
                            }
                            entityBState.hp = previousStep[j].entityState['hp'] - entityBHpLost;
                            entityAState.ap = aIsActive ? previousStep[i].entityState['ap'] - entityAApCost : 0;
                        }
                    }
                }
                return steps;
            };
            return OrderManager;
        }());
        Controller.OrderManager = OrderManager;
    })(Controller = TacticArena.Controller || (TacticArena.Controller = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="../TestGame.ts"/>
// / <reference path="../state/Main.ts"/>
var TacticArena;
(function (TacticArena) {
    var Specs;
    (function (Specs) {
        describe("ResolveManager", function () {
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
                var pawn = currentState.pawns[index];
                expect(pawn.getPosition()).toEqual(position);
                expect(pawn.getAp()).toEqual(ap);
                expect(pawn.getHp()).toEqual(hp);
            }
            beforeEach(function (done) {
                spyOn(console, 'log').and.stub();
                spyOn(console, 'info').and.stub();
                spyOn(console, 'warn').and.stub();
                testGame = new Specs.TestGame(true);
                testGame.state.start('test');
                testGame.state.onStateChange.add(function () {
                    currentState = testGame.state.getCurrentState();
                    setTimeout(function () {
                        currentState.pawns = [];
                        currentState.pathTilesGroup = currentState.add.group();
                        currentState.pawnsSpritesGroup = currentState.add.group();
                        currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 8, 8, 'E', 'skeleton', 1, false, 'Eikio'));
                        currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 10, 8, 'W', 'skeleton', 2, false, 'Dormammu'));
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
                currentState.resolveManager.init([
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
                ]);
                currentState.resolveManager.processStep(0).then(function (res) {
                }).then(function (res) {
                }, function (res) {
                    testStepResolution(0, { x: 8, y: 8 }, 3, 4);
                    testStepResolution(1, { x: 10, y: 8 }, 3, 4);
                    currentState.resolveManager.processStep(1).then(function (res) {
                    }, function (res) {
                        testStepResolution(0, { x: 9, y: 8 }, 2, 4);
                        testStepResolution(1, { x: 10, y: 8 }, 2, 4);
                        done();
                    });
                });
            });
            it("attack from 1st pawn", function (done) {
                currentState.resolveManager.init([
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
                ]);
                currentState.resolveManager.processStep(0).then(function (res) {
                }).then(function (res) {
                }, function (res) {
                    testStepResolution(0, { x: 8, y: 8 }, 3, 4);
                    testStepResolution(1, { x: 10, y: 8 }, 3, 4);
                    currentState.resolveManager.processStep(1).then(function (res) {
                    }, function (res) {
                        testStepResolution(0, { x: 9, y: 8 }, 2, 4);
                        testStepResolution(1, { x: 10, y: 8 }, 2, 4);
                        currentState.resolveManager.processStep(2).then(function (res) {
                        }, function (res) {
                            testStepResolution(0, { x: 9, y: 8 }, 1, 4);
                            testStepResolution(1, { x: 10, y: 8 }, 1, 3);
                            done();
                        });
                    });
                });
            });
            it("move then cast from 1st pawn while 2nd move", function (done) {
                currentState.resolveManager.init([
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
                            order: { action: "cast", direction: "E", x: 8, y: 7, targets: [currentState.pawns[1]] },
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
                            order: { action: "stand", direction: "E", x: 8, y: 7, targets: [currentState.pawns[1]] },
                            entityState: getEntityState(0, 3)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: { action: "move", direction: "W", x: 9, y: 7, target: { entity: currentState.pawns[0], dodge: false } },
                            entityState: getEntityState(0, 2)
                        }
                    ]
                ]);
                currentState.resolveManager.processStep(0).then(function (res) {
                }).then(function (res) {
                }, function (res) {
                    testStepResolution(0, { x: 8, y: 8 }, 3, 4);
                    testStepResolution(1, { x: 10, y: 8 }, 3, 4);
                    currentState.resolveManager.processStep(1).then(function (res) {
                    }, function (res) {
                        testStepResolution(0, { x: 8, y: 7 }, 2, 4);
                        testStepResolution(1, { x: 10, y: 7 }, 2, 4);
                        currentState.resolveManager.processStep(2).then(function (res) {
                        }, function (res) {
                            testStepResolution(0, { x: 8, y: 7 }, 0, 4);
                            testStepResolution(1, { x: 9, y: 7 }, 1, 2);
                            currentState.resolveManager.processStep(3).then(function (res) {
                            }, function (res) {
                                testStepResolution(0, { x: 8, y: 7 }, 0, 3);
                                testStepResolution(1, { x: 9, y: 7 }, 0, 2);
                                done();
                            });
                        });
                    });
                });
            });
        });
    })(Specs = TacticArena.Specs || (TacticArena.Specs = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Controller;
    (function (Controller) {
        var ResolveManager = (function () {
            function ResolveManager(game) {
                this.steps = [];
                this.game = game;
                this.currentIndex = 0;
                this.processing = false;
                this.active = false;
            }
            ResolveManager.prototype.createPromiseMove = function (entity, x, y, animate, direction) {
                var _this = this;
                if (direction === void 0) { direction = null; }
                return entity.moveTo(x, y, null, animate).then(function (res) {
                    if (direction) {
                        _this.createPromiseStand(entity, direction).then(function (res) {
                            return true;
                        });
                    }
                    else {
                        return res;
                    }
                });
            };
            ResolveManager.prototype.createPromiseBlock = function (entity, initialPosition, targetPosition, animate) {
                if (animate) {
                    return entity.moveTo(targetPosition.x, targetPosition.y).then(function (res) {
                        entity.blocked();
                        entity.moveTo(initialPosition.x, initialPosition.y).then(function (res) {
                            return res;
                        });
                    });
                }
                else {
                    return this.createPromiseStand(entity, entity.getDirection());
                }
            };
            ResolveManager.prototype.createPromiseAttack = function (entity, target) {
                return entity.attack(target).then(function (res) {
                    return res;
                });
            };
            ResolveManager.prototype.createPromiseStand = function (entity, direction) {
                return new Promise(function (resolve, reject) {
                    entity.faceDirection(direction);
                    setTimeout(function () {
                        resolve(true);
                    }, 250);
                });
            };
            ResolveManager.prototype.init = function (steps) {
                console.info(steps);
                this.steps = steps;
                this.manageProjectionDislay(steps[0], true);
                this.currentIndex = 0;
            };
            ResolveManager.prototype.handleBackwardPromise = function (promise, entity, order, position, animate) {
                var resultPromise;
                if (position.x != order.x || position.y != order.y) {
                    resultPromise = entity.moveTo(order.x, order.y, null, false).then(function (res) {
                        return true;
                    });
                    resultPromise.then(function (res) {
                        promise.then(function (res) {
                            return true;
                        });
                    });
                }
                else {
                    resultPromise = promise;
                }
                return resultPromise;
            };
            ResolveManager.prototype.processSteps = function (index, animate, backward) {
                var _this = this;
                if (animate === void 0) { animate = true; }
                if (backward === void 0) { backward = false; }
                this.processing = true;
                this.active = true;
                this.processStep(index, animate, backward).then(function (res) {
                    _this.game.signalManager.resolvePhaseFinished.dispatch();
                }, function (res) {
                });
            };
            ResolveManager.prototype.processStep = function (index, animate, backward) {
                var _this = this;
                if (animate === void 0) { animate = true; }
                if (backward === void 0) { backward = false; }
                return new Promise(function (resolve, reject) {
                    if (index >= _this.steps.length) {
                        resolve(true);
                        return true;
                    }
                    _this.currentIndex = index;
                    _this.game.signalManager.stepResolutionIndexChange.dispatch(index);
                    var step = _this.steps[index];
                    var previousStep = index > 0 ? _this.steps[index - 1] : null;
                    console.info('processStep', index, step);
                    var promisesOrders = [];
                    for (var i = 0; i < step.length; i++) {
                        var o = step[i].order;
                        var e = step[i].entity;
                        var s = step[i].entityState;
                        var p = null;
                        var position = e.getPosition();
                        e.setAp(s.ap);
                        e.setHp(s.hp);
                        if (o.action == 'move') {
                            if (s.moveHasBeenBlocked) {
                                p = _this.createPromiseBlock(e, { x: o.x, y: o.y }, s.positionBlocked, animate);
                            }
                            else {
                                if (backward && position.x == o.x && position.y == o.y) {
                                    var direction = previousStep ? previousStep[i].order.direction : e.getDirection();
                                    p = _this.createPromiseStand(e, direction);
                                }
                                else {
                                    p = _this.createPromiseMove(e, o.x, o.y, animate);
                                }
                            }
                        }
                        else if (o.action == 'attack') {
                            p = _this.handleBackwardPromise(_this.createPromiseAttack(e, o.target), e, o, position, animate);
                        }
                        else if (o.action == 'cast') {
                            p = _this.handleBackwardPromise(e.cast(o.targets, o.direction), e, o, position, animate);
                        }
                        else if (o.action == 'stand') {
                            p = _this.handleBackwardPromise(_this.createPromiseStand(e, o.direction), e, o, position, animate);
                        }
                        promisesOrders.push(p);
                    }
                    _this.manageProjectionDislay(step);
                    Promise.all(promisesOrders).then(function (res) {
                        if (!backward) {
                            _this.manageProjectionDislay(step);
                        }
                        _this.game.signalManager.stepResolutionFinished.dispatch(index);
                        if (_this.steps.length > (index + 1) && !_this.game.isPaused) {
                            _this.processStep(index + 1).then(function (res) {
                                resolve(res);
                            }, function (res) {
                            }); // recursive
                        }
                        else {
                            _this.processing = false;
                            reject(false);
                        }
                    });
                });
            };
            ResolveManager.prototype.manageProjectionDislay = function (step, compareActualEntity) {
                if (compareActualEntity === void 0) { compareActualEntity = false; }
                for (var i = 0; i < step.length; i++) {
                    var entityA = step[i].entity;
                    var order = step[i].order;
                    var position = entityA.getProjectionOrReal().getPosition();
                    if (entityA.projection) {
                        var condition = false;
                        if (compareActualEntity) {
                            condition = (JSON.stringify(entityA.getPosition()) == JSON.stringify(entityA.getProjectionOrReal().getPosition()));
                        }
                        else {
                            condition = (order.x == position.x && order.y == position.y);
                        }
                        if (condition) {
                            entityA.projection.hide();
                        }
                        else {
                            entityA.projection.show(0.7);
                        }
                    }
                }
            };
            return ResolveManager;
        }());
        Controller.ResolveManager = ResolveManager;
    })(Controller = TacticArena.Controller || (TacticArena.Controller = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Controller;
    (function (Controller) {
        var SignalManager = (function () {
            function SignalManager(game) {
                this.game = game;
                this.onApChange = new Phaser.Signal();
                this.onHpChange = new Phaser.Signal();
                this.onOrderChange = new Phaser.Signal();
                this.onActionPlayed = new Phaser.Signal();
                this.turnInitialized = new Phaser.Signal();
                this.stepResolutionFinished = new Phaser.Signal();
                this.resolvePhaseFinished = new Phaser.Signal();
                this.stepResolutionIndexChange = new Phaser.Signal();
                this.onTurnEnded = new Phaser.Signal();
                this.onActivePawnChange = new Phaser.Signal();
            }
            SignalManager.prototype.init = function () {
                var self = this;
                this.onApChange.add(function () {
                    self.game.uiManager.pawnsinfosUI.updateInfos();
                });
                this.onHpChange.add(function () {
                    self.game.uiManager.pawnsinfosUI.updateInfos();
                });
                this.onOrderChange.add(function (pawn) {
                    self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(pawn._id).length - 1);
                });
                this.onActionPlayed.add(function (pawn) {
                    self.game.pointer.update();
                });
                this.turnInitialized.add(function (pawn) {
                    self.game.process = false;
                    if (pawn.isBot) {
                        self.game.aiManager.play(pawn);
                    }
                    else {
                        self.game.selecting = true;
                    }
                });
                this.stepResolutionFinished.add(function (stepIndex) {
                    self.game.uiManager.process = false;
                });
                this.resolvePhaseFinished.add(function () {
                    self.game.isGameReadyPromise().then(function (res) {
                        self.game.uiManager.endResolvePhase();
                    });
                });
                this.stepResolutionIndexChange.add(function (stepIndex) {
                    self.game.uiManager.notificationsUI.update(stepIndex);
                    self.game.uiManager.timelineUI.update(stepIndex);
                });
                this.onTurnEnded.add(function (activePawn) {
                    self.game.uiManager.ordersnotificationsUI.clean();
                });
                this.onActivePawnChange.add(function (activePawn) {
                    self.game.uiManager.ordersnotificationsUI.clean();
                    //this.consolelogsUI.write('au tour du joueur ' + activePawn._id);
                    self.game.uiManager.pawnsinfosUI.select(activePawn._id);
                    self.game.uiManager.directionUI.init(activePawn.getDirection());
                    self.game.uiManager.actionUI.select('walk');
                });
            };
            return SignalManager;
        }());
        Controller.SignalManager = SignalManager;
    })(Controller = TacticArena.Controller || (TacticArena.Controller = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Controller;
    (function (Controller) {
        var StageManager = (function () {
            function StageManager(game) {
                this.game = game;
                this.map = null;
                this.layer = null;
                this.grid = [];
            }
            StageManager.prototype.init = function () {
                this.map = this.game.add.tilemap('map');
                this.map.addTilesetImage('tiles-collection');
                this.map.createLayer('Background');
                this.layer = this.map.createLayer('Foreground');
                this.map.createLayer('Decorations');
                this.map.createLayer('Decorations2');
                for (var i = 0; i < this.map.layers[2].data.length; i++) {
                    this.grid[i] = [];
                    for (var j = 0; j < this.map.layers[2].data[i].length; j++) {
                        this.grid[i][j] = this.map.layers[2].data[i][j].index;
                    }
                }
            };
            StageManager.prototype.addDecorations = function () {
                this.map.createLayer('Decorations3');
            };
            StageManager.prototype.canMove = function (entity, x, y, ap) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.equalPositions(entity.getPosition(), { x: x, y: y });
                    _this.game.pathfinder.findPath(entity.getPosition().x, entity.getPosition().y, x, y, function (path) {
                        if (path && path.length > 0) {
                            path.shift();
                            if (path.length > ap) {
                                reject(path);
                            }
                            else {
                                resolve(path);
                            }
                        }
                        else {
                            reject(path);
                        }
                    });
                    _this.game.pathfinder.calculate();
                });
            };
            StageManager.prototype.getLinearPath = function (pawn, distance, direction, position) {
                if (direction === void 0) { direction = null; }
                if (position === void 0) { position = null; }
                var p = position ? position : pawn.getPosition();
                var d = direction ? direction : pawn.getDirection();
                var path = [];
                for (var x = 0; x < this.map.width; x++) {
                    for (var y = 0; y < this.map.height; y++) {
                        if ((d == 'W' && p.x > x && p.y == y ||
                            d == 'E' && p.x < x && p.y == y ||
                            d == 'N' && p.x == x && p.y > y ||
                            d == 'S' && p.x == x && p.y < y) &&
                            this.getNbTilesBetween(p, { 'x': x, 'y': y }) <= distance) {
                            path.push({ 'x': x, 'y': y });
                        }
                    }
                }
                return path;
            };
            StageManager.prototype.showPossibleLinearTrajectories = function (path) {
                this.clearPossibleMove();
                for (var i = 0; i < path.length; i++) {
                    var tile = this.map.getTile(path[i].x, path[i].y, this.map.layer[0], true);
                    tile.alpha = 0.7;
                }
                this.map.layers[0].dirty = true;
            };
            StageManager.prototype.showPossibleMove = function (position, ap) {
                for (var x = 0; x < this.map.width; x++) {
                    for (var y = 0; y < this.map.height; y++) {
                        var tile = this.map.getTile(x, y, this.map.layer[0], true);
                        tile.alpha = ap > 0 && this.getNbTilesBetween(position, { 'x': x, 'y': y }) <= ap ? 0.7 : 1;
                    }
                }
                this.map.layers[0].dirty = true;
            };
            StageManager.prototype.clearPossibleMove = function () {
                for (var x = 0; x < this.map.width; x++) {
                    for (var y = 0; y < this.map.height; y++) {
                        var tile = this.map.getTile(x, y, this.map.layer[0], true);
                        tile.alpha = 1;
                    }
                }
                this.map.layers[0].dirty = true;
            };
            StageManager.prototype.showPath = function (path, group, tint) {
                if (tint === void 0) { tint = null; }
                for (var i = 0; i < path.length; i++) {
                    var tile = this.map.getTile(path[i].x, path[i].y, this.map.layer[0], true);
                    var tileSprite = new Phaser.Sprite(this.game, tile.x * this.game.tileSize, tile.y * this.game.tileSize, 'path-tile', '');
                    if (tint) {
                        tileSprite.tint = tint;
                    }
                    group.add(tileSprite);
                }
            };
            StageManager.prototype.clearPath = function (group) {
                group.removeAll();
            };
            StageManager.prototype.clearHelp = function () {
                this.clearPossibleMove();
                this.clearPath(this.game.pathTilesGroup);
            };
            StageManager.prototype.getNbTilesBetween = function (coordsA, coordsB) {
                return Math.abs(coordsA.x - coordsB.x) + Math.abs(coordsA.y - coordsB.y);
            };
            StageManager.prototype.isFacing = function (coordsA, directionA, coordsB) {
                return (coordsA.x == coordsB.x && ((coordsA.y == coordsB.y + 1 && directionA == 'N') || (coordsA.y == coordsB.y - 1 && directionA == 'S')) ||
                    coordsA.y == coordsB.y && ((coordsA.x == coordsB.x + 1 && directionA == 'W') || (coordsA.x == coordsB.x - 1 && directionA == 'E')));
            };
            StageManager.prototype.equalPositions = function (p1, p2) {
                return p1.x == p2.x && p1.y == p2.y;
            };
            return StageManager;
        }());
        Controller.StageManager = StageManager;
    })(Controller = TacticArena.Controller || (TacticArena.Controller = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Controller;
    (function (Controller) {
        var TurnManager = (function () {
            function TurnManager(game) {
                this.game = game;
                this.currentTurnIndex = -1;
            }
            TurnManager.prototype.init = function (pawn, firstTurnCall) {
                var _this = this;
                if (firstTurnCall === void 0) { firstTurnCall = false; }
                return new Promise(function (resolve, reject) {
                    if (firstTurnCall) {
                        for (var i = 0; i < _this.game.pawns.length; i++) {
                            _this.game.pawns[i].setAp(3);
                            _this.game.pawns[i].ghost = null;
                        }
                        _this.currentTurnIndex++;
                    }
                    _this.setActivePawn(pawn);
                    resolve(true);
                });
            };
            TurnManager.prototype.endTurn = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var nextIndex = 0;
                    for (var i = 0; i < _this.game.pawns.length; i++) {
                        if (_this.game.pawns[i].active && (i + 1) < _this.game.pawns.length) {
                            nextIndex = i + 1;
                        }
                    }
                    resolve(_this.game.pawns[nextIndex]);
                });
            };
            TurnManager.prototype.getActivePawn = function () {
                for (var i = 0; i < this.game.pawns.length; i++) {
                    if (this.game.pawns[i].active) {
                        return this.game.pawns[i];
                    }
                }
                return null;
            };
            TurnManager.prototype.setActivePawn = function (pawn) {
                for (var i = 0; i < this.game.pawns.length; i++) {
                    this.game.pawns[i].active = (this.game.pawns[i]._id == pawn._id);
                }
                this.currentTeam = pawn.team;
                this.game.signalManager.onActivePawnChange.dispatch(pawn);
            };
            return TurnManager;
        }());
        Controller.TurnManager = TurnManager;
    })(Controller = TacticArena.Controller || (TacticArena.Controller = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Pawn = (function () {
            function Pawn(game, x, y, ext, type, id, bot, team, name) {
                if (name === void 0) { name = ""; }
                this.game = game;
                this._id = id;
                this._name = name;
                this.type = type;
                this.projection = null;
                this._parent = null;
                if (type) {
                    this.sprite = new Entity.Sprite(game, x, y, ext, type, this, 64);
                    this.game.pawnsSpritesGroup.add(this.sprite);
                    this.sprite.stand();
                }
                this._hp = 4;
                this._hpMax = 4;
                this._apMax = 3;
                this.selected = false;
                this.isBot = bot;
                this.team = team;
            }
            Pawn.prototype.getReal = function () {
                return this._parent ? this._parent : this;
            };
            Pawn.prototype.getProjectionOrReal = function () {
                return this.projection ? this.projection : this;
            };
            Pawn.prototype.getPosition = function () {
                return {
                    x: (this.sprite.position.x + this.sprite._size / 4) / this.game.tileSize,
                    y: (this.sprite.position.y + this.sprite._size / 2) / this.game.tileSize
                };
            };
            Pawn.prototype.attack = function (target) {
                var _this = this;
                var that = this;
                return new Promise(function (resolve, reject) {
                    _this.sprite.attack(target, function () {
                        that.sprite.stand();
                        resolve(true);
                    });
                });
            };
            Pawn.prototype.hurt = function (hp) {
                if (hp === void 0) { hp = 1; }
                this.sprite.hurt();
                this.destroyProjection();
                var label_dmg = this.game.add.text(20, 10, "-" + hp, { font: '12px Press Start 2P', fill: "#ff021b", stroke: '#000000', strokeThickness: 6 });
                var t = this.game.add.tween(label_dmg).to({ x: 20, y: -20, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () { label_dmg.destroy(); }, this);
                this.sprite.addChild(label_dmg);
            };
            Pawn.prototype.halfcast = function () {
                this.sprite.halfcast();
            };
            Pawn.prototype.cast = function (targets, direction) {
                var _this = this;
                var that = this;
                return new Promise(function (resolve, reject) {
                    if (_this.projection) {
                        _this.projection.hide();
                    }
                    _this.faceDirection(direction);
                    _this.sprite.cast(targets, function () {
                        that.sprite.stand();
                        resolve(true);
                    });
                });
            };
            Pawn.prototype.dodge = function () {
                var label = this.game.add.text(20, 10, "miss", { font: '8px Press Start 2P', fill: "#ffffff" });
                var t = this.game.add.tween(label).to({ x: 20, y: -20, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () { label.destroy(); }, this);
                this.sprite.addChild(label);
            };
            Pawn.prototype.blocked = function () {
                var label = this.game.add.text(20, 10, "block", { font: '8px Press Start 2P', fill: "#ffffff" });
                var t = this.game.add.tween(label).to({ x: 20, y: -20, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () {
                    label.destroy();
                }, this);
                this.sprite.addChild(label);
            };
            Pawn.prototype.moveTo = function (x, y, path, animate) {
                var _this = this;
                if (animate === void 0) { animate = true; }
                return new Promise(function (resolve, reject) {
                    var tile_y, tile_x;
                    if (path != undefined && path.length > 0) {
                        tile_y = path[0].y;
                        tile_x = path[0].x;
                        path.shift();
                    }
                    else {
                        tile_y = Math.floor(y);
                        tile_x = Math.floor(x);
                    }
                    var tile = _this.game.stageManager.map.layers[1].data[tile_y][tile_x];
                    var newX = tile.x * _this.game.tileSize - _this.sprite._size / 4;
                    var newY = tile.y * _this.game.tileSize - _this.sprite._size / 2;
                    if (animate) {
                        _this.sprite.walk();
                        var t = _this.game.add.tween(_this.sprite).to({ x: newX, y: newY }, _this.sprite._speed, Phaser.Easing.Linear.None, true);
                        t.onComplete.add(function () {
                            if (path != undefined && path.length > 0) {
                                this.moveTo(0, 0, path).then(function (res) {
                                    resolve(res);
                                }); // recursive
                            }
                            else {
                                this.sprite.stand();
                                resolve(true);
                            }
                        }, _this);
                    }
                    else {
                        _this.sprite.x = newX;
                        _this.sprite.y = newY;
                        resolve(true);
                    }
                });
            };
            Pawn.prototype.createProjection = function () {
                if (this.projection == null) {
                    this.projection = new Entity.Pawn(this.game, this.getPosition().x, this.getPosition().y, this.sprite._ext, this.type, null, false, this.team);
                    this.projection.parent = this;
                    this.projection.sprite.alpha = 0.7;
                }
            };
            Pawn.prototype.destroyProjectionIfSamePosition = function () {
                if (this.projection) {
                    var p1 = this.getPosition();
                    var p2_1 = this.projection.getPosition();
                    if (p1.x == p2_1.x && p1.y == p2_1.y) {
                        this.destroyProjection();
                    }
                }
            };
            Pawn.prototype.destroyProjection = function () {
                if (this.projection) {
                    this.projection.sprite.kill();
                    this.projection = null;
                }
            };
            Pawn.prototype.getDirection = function () {
                return this.sprite._ext;
            };
            Pawn.prototype.faceDirection = function (direction) {
                this.sprite._ext = direction;
                this.sprite.stand();
            };
            Pawn.prototype.hide = function () {
                this.sprite.alpha = 0;
            };
            Pawn.prototype.show = function (alpha) {
                if (alpha === void 0) { alpha = 1; }
                this.sprite.alpha = alpha;
            };
            Pawn.prototype.isFacing = function (position) {
                // x,y 1,0 2,0
                // 0,1 1,1 2,1
                // 0,2 1,2 2,2
                var pawnPosition = this.getPosition();
                return (pawnPosition.x == position.x && ((pawnPosition.y == position.y + 1 && this.getDirection() == 'N')
                    || (pawnPosition.y == position.y - 1 && this.getDirection() == 'S'))
                    || pawnPosition.y == position.y && ((pawnPosition.x == position.x + 1 && this.getDirection() == 'W')
                        || (pawnPosition.x == position.x - 1 && this.getDirection() == 'E')));
            };
            Pawn.prototype.getAp = function () {
                return this._ap;
            };
            Pawn.prototype.setAp = function (ap) {
                this._ap = ap;
                this.game.signalManager.onApChange.dispatch(this._ap);
            };
            Pawn.prototype.getHp = function () {
                return this._hp;
            };
            Pawn.prototype.setHp = function (hp) {
                this._hp = hp;
                this.game.signalManager.onHpChange.dispatch(this._hp);
            };
            return Pawn;
        }());
        Entity.Pawn = Pawn;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Sprite = (function (_super) {
            __extends(Sprite, _super);
            function Sprite(game, x, y, ext, type, parent, size) {
                var _this = _super.call(this, game.game, game.tileSize * x - (size / 4), game.tileSize * y - (size / 2), type) || this;
                _this._parent = parent;
                _this._ext = ext;
                _this._speed = 200;
                _this._size = size;
                _this.setAnimations();
                _this._animationCompleteCallback = null;
                return _this;
            }
            Sprite.prototype.setAnimations = function () {
                this.animations.add('standS', ["walkS1"], 6, false);
                this.animations.add('standN', ["walkN1"], 6, false);
                this.animations.add('standW', ["walkW1"], 6, false);
                this.animations.add('standE', ["walkE1"], 6, false);
                this.animations.add('walkS', ["walkS2", "walkS3", "walkS4", "walkS5", "walkS6", "walkS7", "walkS8", "walkS9"], 12, false);
                this.animations.add('walkN', ["walkN2", "walkN3", "walkN4", "walkN5", "walkN6", "walkN7", "walkN8", "walkN9"], 12, false);
                this.animations.add('walkW', ["walkW1", "walkW2", "walkW3", "walkW4", "walkW5", "walkW6", "walkW7", "walkW8", "walkW9"], 12, false);
                this.animations.add('walkE', ["walkE1", "walkE2", "walkE3", "walkE4", "walkE5", "walkE6", "walkE7", "walkE8", "walkE9"], 12, false);
                this.animations.add('attackS', ["attackS1", "attackS2", "attackS3", "attackS4", "attackS5", "attackS6"], 12, false);
                this.animations.add('attackN', ["attackN1", "attackN2", "attackN3", "attackN4", "attackN5", "attackN6"], 12, false);
                this.animations.add('attackW', ["attackW1", "attackW2", "attackW3", "attackW4", "attackW5", "attackW6"], 12, false);
                this.animations.add('attackE', ["attackE1", "attackE2", "attackE3", "attackE4", "attackE5", "attackE6"], 12, false);
                this.animations.add('castS', ["castS1", "castS2", "castS3", "castS3", "castS3", "castS4", "castS5", "castS6", "castS7"], 10, false);
                this.animations.add('castN', ["castN1", "castN2", "castN3", "castN3", "castN3", "castN4", "castN5", "castN6", "castN7"], 10, false);
                this.animations.add('castW', ["castW1", "castW2", "castW3", "castW3", "castW3", "castW4", "castW5", "castW6", "castW7"], 10, false);
                this.animations.add('castE', ["castE1", "castE2", "castE3", "castE3", "castE3", "castE4", "castE5", "castE6", "castE7"], 10, false);
                this.animations.add('halfcastS', ["castS1", "castS2", "castS3"], 10, false);
                this.animations.add('halfcastN', ["castN1", "castN2", "castN3"], 10, false);
                this.animations.add('halfcastW', ["castW1", "castW2", "castW3"], 10, false);
                this.animations.add('halfcastE', ["castE1", "castE2", "castE3"], 10, false);
                this.events.onAnimationComplete.add(this.animationComplete, this);
            };
            Sprite.prototype.animationComplete = function () {
                if (this._animationCompleteCallback) {
                    this._animationCompleteCallback();
                    this._animationCompleteCallback = null;
                }
                var animationName = this.animations.currentAnim.name;
                if (animationName.indexOf('attack') >= 0) {
                    this.stand();
                }
            };
            Sprite.prototype.playAnimation = function (animation) {
                this.animations.play(animation);
            };
            Sprite.prototype.update = function () {
                if (this._parent.game.selecting && this._parent.projection != null) {
                    var p1 = this._parent.getPosition();
                    var p2_2 = this._parent.projection.getPosition();
                    if (p1.x == p2_2.x && p1.y == p2_2.y) {
                        this._parent.hide();
                    }
                    else {
                        this._parent.show();
                    }
                }
            };
            Sprite.prototype.faceTo = function (x, y) {
                if (this.position.x < x) {
                    this._ext = 'E';
                }
                else if (this.position.x > x) {
                    this._ext = 'W';
                }
                if (this.position.y < y) {
                    this._ext = 'S';
                }
                else if (this.position.y > y) {
                    this._ext = 'N';
                }
            };
            Sprite.prototype.walk = function () {
                this.playAnimation('walk' + this._ext);
            };
            Sprite.prototype.stand = function () {
                this.playAnimation('stand' + this._ext);
            };
            Sprite.prototype.halfcast = function () {
                this.playAnimation('halfcast' + this._ext);
            };
            Sprite.prototype.cast = function (targets, callback) {
                var self = this;
                this._animationCompleteCallback = callback;
                this.playAnimation('cast' + this._ext);
                setTimeout(function () {
                    var initialX = 0;
                    var initialY = 0;
                    var targetX = 0;
                    var targetY = 0;
                    var scaleX = 1;
                    var angle = 0;
                    if (self._ext == 'W' || self._ext == 'E') {
                        initialY = self.position.y + 40;
                        targetY = initialY;
                        initialX = self.position.x - 40;
                        targetX = initialX - 45;
                        if (self._ext == 'E') {
                            initialX = self.position.x + 110;
                            targetX = initialX + 45;
                            scaleX = -1;
                        }
                    }
                    else if (self._ext == 'N' || self._ext == 'S') {
                        initialX = self.position.x + 33;
                        targetX = initialX;
                        initialY = self.position.y - 40;
                        targetY = initialY - 45;
                        angle = 90;
                        if (self._ext == 'S') {
                            initialY = self.position.y + 110;
                            targetY = initialY + 50;
                            angle = 270;
                        }
                    }
                    var fireball = self._parent.game.add.sprite(initialX, initialY, 'fireball');
                    self._parent.game.pawnsSpritesGroup.add(fireball);
                    fireball.anchor.setTo(.5, .5);
                    fireball.scale.x *= scaleX;
                    fireball.angle += angle;
                    fireball.animations.add('fire', ["fireball_04", "fireball_03", "fireball_02", "fireball_01", "fireball_02", "fireball_03", "fireball_04"], 10, false);
                    fireball.animations.play('fire');
                    if (targets) {
                        for (var i = 0; i < targets.length; i++) {
                            targets[i].hurt(2);
                        }
                    }
                    var t = self._parent.game.add.tween(fireball).to({ x: targetX, y: targetY }, 700, Phaser.Easing.Linear.None, true);
                    t.onComplete.add(function () { fireball.kill(); }, self);
                }, 500);
            };
            Sprite.prototype.attack = function (target, callback) {
                this._animationCompleteCallback = callback;
                this.playAnimation('attack' + this._ext);
                if (target.dodge) {
                    target.entity.dodge();
                }
                else {
                    target.entity.hurt();
                }
            };
            Sprite.prototype.hurt = function () {
                this.game.add.tween(this).to({
                    tint: 0.65 * 0xffffff,
                    alpha: 0.5
                }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
            };
            return Sprite;
        }(Phaser.Sprite));
        Entity.Sprite = Sprite;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Boot.prototype.preload = function () {
                this.load.image('preload-bar', 'assets/images/preloader.gif');
            };
            Boot.prototype.create = function () {
                this.game.stage.backgroundColor = 0xFFFFFF;
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                this.game.state.start('preload');
            };
            return Boot;
        }(Phaser.State));
        State.Boot = Boot;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Main.prototype.create = function () {
                var self = this;
                this.process = true;
                this.selecting = false;
                this.tileSize = 32;
                this.isPaused = false;
                this.stageManager = new TacticArena.Controller.StageManager(this);
                this.stageManager.init();
                this.pointer = new TacticArena.UI.Pointer(this);
                this.pawns = [];
                this.pathTilesGroup = this.add.group();
                this.pathOrdersTilesGroup = this.add.group();
                this.pawnsSpritesGroup = this.add.group();
                this.pawns.push(new TacticArena.Entity.Pawn(this, 8, 8, 'E', 'redhead', this.getUniqueId(), false, 1, 'Eikio'));
                this.pawns.push(new TacticArena.Entity.Pawn(this, 7, 7, 'E', 'blondy', this.getUniqueId(), false, 1, 'Diana'));
                this.pawns.push(new TacticArena.Entity.Pawn(this, 10, 8, 'W', 'skeleton', this.getUniqueId(), false, 2, 'Dormammu'));
                this.stageManager.addDecorations();
                this.pathfinder = new EasyStar.js();
                this.pathfinder.setAcceptableTiles([-1]);
                this.pathfinder.disableDiagonals();
                this.pathfinder.disableSync();
                this.pathfinder.setGrid(this.stageManager.grid);
                this.signalManager = new TacticArena.Controller.SignalManager(this);
                this.signalManager.init();
                this.logManager = new TacticArena.Controller.LogManager(this);
                this.orderManager = new TacticArena.Controller.OrderManager(this);
                this.resolveManager = new TacticArena.Controller.ResolveManager(this);
                this.aiManager = new TacticArena.Controller.AiManager(this);
                this.turnManager = new TacticArena.Controller.TurnManager(this);
                this.uiManager = new TacticArena.UI.UIManager(this);
                self.uiManager.initOrderPhase(this.pawns[0], true);
            };
            Main.prototype.update = function () {
                this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
                this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
                this.world.bringToTop(this.pointer.marker);
                this.world.bringToTop(this.pawnsSpritesGroup);
            };
            Main.prototype.isGameReadyPromise = function () {
                var self = this;
                return new Promise(function (resolve, reject) {
                    (function isGameReady() {
                        if (!self.isPaused)
                            return resolve();
                        setTimeout(isGameReady, 300);
                    })();
                });
            };
            Main.prototype.getUniqueId = function () {
                var id = 0; //Math.floor(Math.random() * 1000);
                var isUnique = false;
                while (!isUnique) {
                    isUnique = true;
                    id++;
                    for (var i = 0; i < this.pawns.length; i++) {
                        if (this.pawns[i]._id && this.pawns[i]._id == id) {
                            isUnique = false;
                            break;
                        }
                    }
                }
                return id;
            };
            return Main;
        }(Phaser.State));
        State.Main = Main;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var Preload = (function (_super) {
            __extends(Preload, _super);
            function Preload() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Preload.prototype.preload = function () {
                /* this.preloadBar = this.add.sprite(290, 290, 'preload-bar');
                 this.load.setPreloadSprite(this.preloadBar);*/
                this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles-collection', 'assets/images/maptiles.png');
                this.load.image('path-tile', 'assets/images/path_tile.png');
                this.load.atlasJSONArray('player', 'assets/images/character.png', 'assets/images/character.json');
                this.load.atlasJSONArray('orc', 'assets/images/orc.png', 'assets/images/orc.json');
                this.load.atlasJSONArray('redhead', 'assets/images/redhead.png', 'assets/images/redhead.json');
                this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
                this.load.atlasJSONArray('blondy', 'assets/images/blondy.png', 'assets/images/blondy.json');
                this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
            };
            Preload.prototype.create = function () {
                var that = this;
                $(document).ready(function () {
                    that.game.state.start('main');
                });
            };
            return Preload;
        }(Phaser.State));
        State.Preload = Preload;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Test.prototype.preload = function () {
                this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles-collection', 'assets/images/maptiles.png');
                this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
                this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
            };
            Test.prototype.create = function () {
                this.process = true;
                this.selecting = false;
                this.tileSize = 32;
                this.isPaused = false;
                this.stageManager = new TacticArena.Controller.StageManager(this);
                this.stageManager.init();
                this.pointer = new TacticArena.UI.Pointer(this);
                this.pawns = [];
                this.pathTilesGroup = this.add.group();
                this.pawnsSpritesGroup = this.add.group();
                this.stageManager.addDecorations();
                this.pathfinder = new EasyStar.js();
                this.pathfinder.setAcceptableTiles([-1]);
                this.pathfinder.disableDiagonals();
                this.pathfinder.disableSync();
                this.pathfinder.setGrid(this.stageManager.grid);
                this.signalManager = new TacticArena.Controller.SignalManager(this);
                this.logManager = new TacticArena.Controller.LogManager(this);
                this.orderManager = new TacticArena.Controller.OrderManager(this);
                this.resolveManager = new TacticArena.Controller.ResolveManager(this);
                this.aiManager = new TacticArena.Controller.AiManager(this);
                this.turnManager = new TacticArena.Controller.TurnManager(this);
            };
            return Test;
        }(Phaser.State));
        State.Test = Test;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var Action = (function () {
            function Action(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('' +
                    '<div class="ui-menu-container">' +
                    '<ul class="ui-menu">' +
                    '<li class="cancel"></li>' +
                    '<li class="fire"></li>' +
                    '<li class="walk"></li>' +
                    '<li class="submit">Confirm</li>' +
                    '</ul>' +
                    '</div>');
                this.element = this.menu.element.find('.ui-menu');
                this.element.find('.submit').on('click', function () {
                    self.menu.endOrderPhase();
                });
                this.element.find('.cancel').on('click', function () {
                    self.menu.cancelAction();
                });
                this.element.find('.walk').on('click', function () {
                    self.select('walk');
                });
                this.element.find('.fire').on('click', function () {
                    self.select('fire');
                });
                this.element.find('.walk').trigger('click');
            }
            Action.prototype.deselectAll = function () {
                this.element.find('li').removeClass('selected');
            };
            Action.prototype.select = function (name) {
                this.deselectAll();
                this.element.find('.' + name).addClass('selected');
            };
            Action.prototype.canOrderMove = function () {
                return this.element.find('.walk').hasClass('selected');
            };
            Action.prototype.canOrderFire = function () {
                return this.element.find('.fire').hasClass('selected');
            };
            Action.prototype.clean = function () {
                $('.ui-menu-container').fadeOut();
            };
            Action.prototype.show = function () {
                $('.ui-menu-container').fadeIn();
            };
            return Action;
        }());
        UI.Action = Action;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var ConsoleLogs = (function () {
            function ConsoleLogs(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<div class="ui-logs"></div>');
                this.element = this.menu.element.find('.ui-logs');
            }
            ConsoleLogs.prototype.write = function (msg) {
                this.element.append(msg + '<br/>');
                this.element.scrollTop(this.element[0].scrollHeight - this.element.height());
            };
            return ConsoleLogs;
        }());
        UI.ConsoleLogs = ConsoleLogs;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var Direction = (function () {
            function Direction(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<div class="ui-direction"><a class="compass"></a><a class="north"></a><a class="south"></a><a class="east"></a><a class="west"></a></div>');
                this.element = this.menu.element.find('.ui-direction');
                this.matching = { 'N': 'north', 'E': 'east', 'S': 'south', 'W': 'west' };
                $('.compass').on('click', function () {
                    self.changeDirection(self.savedDirection);
                });
                $('.north').on('click', function () {
                    self.changeDirection('N');
                });
                $('.east').on('click', function () {
                    self.changeDirection('E');
                });
                $('.south').on('click', function () {
                    self.changeDirection('S');
                });
                $('.west').on('click', function () {
                    self.changeDirection('W');
                });
            }
            Direction.prototype.init = function (direction) {
                this.savedDirection = direction;
                this.select(this.matching[direction]);
            };
            Direction.prototype.select = function (name) {
                this.deselectAll();
                this.element.find('.' + name).addClass('selected');
            };
            Direction.prototype.deselectAll = function () {
                this.element.find('a').removeClass('selected');
            };
            Direction.prototype.update = function (direction) {
                this.select(this.matching[direction]);
            };
            Direction.prototype.changeDirection = function (direction) {
                var activePawn = this.menu.game.turnManager.getActivePawn();
                if (!this.menu.game.process && activePawn.getAp() > 0) {
                    activePawn.createProjection();
                    activePawn.getProjectionOrReal().faceDirection(direction);
                    var position = activePawn.getProjectionOrReal().getPosition();
                    this.menu.game.orderManager.add('stand', activePawn, position.x, position.y, direction);
                    activePawn.setAp(activePawn.getAp() - 1);
                    this.menu.game.signalManager.onActionPlayed.dispatch(activePawn);
                    this.select(this.matching[direction]);
                }
                else {
                }
            };
            Direction.prototype.clean = function () {
                this.element.fadeOut();
            };
            Direction.prototype.show = function () {
                this.element.fadeIn();
            };
            return Direction;
        }());
        UI.Direction = Direction;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var KeyManager = (function () {
            function KeyManager(menu) {
                this.menu = menu;
                this.enterKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
                this.enterKey.onDown.add(this.enterKeyPressed, this, 0, this.menu);
                this.spacebarKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
                this.spacebarKey.onDown.add(this.pauseResolve, this, 0, this.menu);
                this.leftKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
                this.leftKey.onDown.add(this.leftKeyPressed, this, 0, this.menu);
                this.rightKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
                this.rightKey.onDown.add(this.rightKeyPressed, this, 0, this.menu);
                this.downKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
                this.downKey.onDown.add(this.downKeyPressed, this, 0, this.menu);
                this.upKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.UP);
                this.upKey.onDown.add(this.upKeyPressed, this, 0, this.menu);
                this.backKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
                this.backKey.onDown.add(this.backKeyPressed, this, 0, this.menu);
            }
            KeyManager.prototype.leftKeyPressed = function (self, uiManager) {
                if (uiManager.process)
                    return false;
                if (uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                    uiManager.timeUI.goBackward();
                }
                else if (!uiManager.game.process) {
                    uiManager.directionUI.changeDirection('W');
                }
            };
            KeyManager.prototype.rightKeyPressed = function (self, uiManager) {
                if (uiManager.process)
                    return false;
                if (uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                    uiManager.timeUI.goForward();
                }
                else if (!uiManager.game.process) {
                    uiManager.directionUI.changeDirection('E');
                }
            };
            KeyManager.prototype.upKeyPressed = function (self, uiManager) {
                if (uiManager.process)
                    return false;
                if (!uiManager.game.process) {
                    uiManager.directionUI.changeDirection('N');
                }
            };
            KeyManager.prototype.downKeyPressed = function (self, uiManager) {
                if (uiManager.process)
                    return false;
                if (!uiManager.game.process) {
                    uiManager.directionUI.changeDirection('S');
                }
            };
            KeyManager.prototype.enterKeyPressed = function (self, uiManager) {
                if (uiManager.process) {
                    uiManager.transitionUI.hide(200);
                    return false;
                }
                if (uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                    uiManager.process = true;
                    uiManager.game.isPaused = false;
                    uiManager.timeUI.goForward();
                }
                else if (!uiManager.game.process) {
                    uiManager.endOrderPhase();
                }
            };
            KeyManager.prototype.backKeyPressed = function (self, uiManager) {
                uiManager.cancelAction();
            };
            KeyManager.prototype.pauseResolve = function (self, uiManager) {
                uiManager.timeUI.togglePause();
            };
            return KeyManager;
        }());
        UI.KeyManager = KeyManager;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var Notifications = (function () {
            function Notifications(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<div class="ui-notifications ui-steps-notifications"></div>');
                this.element = this.menu.element.find('.ui-steps-notifications');
                this.directionMapping = {
                    'W': "l'Ouest",
                    'E': "l'Est",
                    'N': "le Nord",
                    'S': "le Sud"
                };
            }
            Notifications.prototype.clean = function () {
                this.remove(this.element.find('div[class*="item-"]'));
            };
            Notifications.prototype.remove = function (elements) {
                if (elements.length > 0) {
                    var self_1 = this;
                    $(elements[elements.length - 1]).animate({ opacity: 0, marginRight: -200 }, 150, function () {
                        $(this).remove();
                        self_1.remove(elements.slice(0, -1));
                    });
                }
            };
            Notifications.prototype.update = function (index) {
                this.remove(this.element.find('div[class*="item-"]:gt(' + index + ')'));
                if ($('.item-' + index).length > 0) {
                    return;
                }
                var steps = [];
                for (var i = index; i > this.element.children().length - 1; i--) {
                    steps.push($('<div class="item-' + index + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(i) + '</div>'));
                }
                this.add(steps);
            };
            Notifications.prototype.add = function (elements) {
                if (elements.length > 0) {
                    var self_2 = this;
                    $(elements[elements.length - 1]).appendTo(this.element)
                        .animate({ opacity: 1, marginRight: 0 }, 150, function () {
                        self_2.add(elements.slice(0, -1));
                    });
                }
            };
            Notifications.prototype.getMessage = function (index) {
                var result = [];
                var step = this.menu.game.logManager.get(this.menu.game.turnManager.currentTurnIndex, index);
                for (var i = 0; i < step.length; i++) {
                    var e = step[i].entity;
                    var o = step[i].order;
                    var s = step[i].entityState;
                    var logColor = '#ffffff';
                    //let logColor = '#78dd77';
                    // logColor = '#f45d62';
                    var msg = '<b>' + e._name + '</b>';
                    if (s.moveHasBeenBlocked) {
                        msg += ' essaie de se déplacer en ' + s.positionBlocked.x + ', ' + s.positionBlocked.y + ', ' + ' mais se retrouve bloqué en ' + o.x + ', ' + o.y;
                    }
                    else if (o.action == 'move') {
                        msg += ' se déplace en ' + o.x + ', ' + o.y;
                    }
                    else if (o.action == 'cast') {
                        msg += ' lance une boule de feu vers ' + this.directionMapping[o.direction];
                    }
                    else if (o.action == 'stand') {
                        msg += ' reste en position ' + o.x + ', ' + o.y + ' et surveille vers ' + this.directionMapping[o.direction];
                    }
                    result.push('<span style="color:' + logColor + ';">' + msg + '</span>');
                }
                return result.join('<br/><br/>');
            };
            return Notifications;
        }());
        UI.Notifications = Notifications;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var OrdersNotifications = (function () {
            function OrdersNotifications(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<div class="ui-notifications ui-orders-notifications"></div>');
                this.element = this.menu.element.find('.ui-orders-notifications');
                this.directionMapping = {
                    'W': "l'Ouest",
                    'E': "l'Est",
                    'N': "le Nord",
                    'S': "le Sud"
                };
            }
            OrdersNotifications.prototype.clean = function () {
                this.remove(this.element.find('div[class*="item-"]'));
                this.menu.game.stageManager.clearPath(this.menu.game.pathOrdersTilesGroup);
            };
            OrdersNotifications.prototype.remove = function (elements) {
                if (elements.length > 0) {
                    var self_3 = this;
                    $(elements[elements.length - 1]).animate({ opacity: 0, marginRight: -200 }, 150, function () {
                        $(this).remove();
                        self_3.remove(elements.slice(0, -1));
                    });
                }
            };
            OrdersNotifications.prototype.update = function (index) {
                console.log(index);
                if (index >= 0) {
                    this.add($('<div class="item-' + index + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(index) + '</div>'));
                }
                else {
                    this.clean();
                }
            };
            OrdersNotifications.prototype.add = function (elements) {
                if (elements.length > 0) {
                    var self_4 = this;
                    $(elements[elements.length - 1]).appendTo(this.element)
                        .animate({ opacity: 1, marginRight: 0 }, 150, function () {
                        self_4.add(elements.slice(0, -1));
                    });
                }
            };
            OrdersNotifications.prototype.getMessage = function (index) {
                var activePawn = this.menu.game.turnManager.getActivePawn();
                var order = this.menu.game.orderManager.getOrders(activePawn._id)[index];
                console.log(order);
                this.menu.game.stageManager.showPath([order], this.menu.game.pathOrdersTilesGroup, 0xffffff);
                var o = order;
                var msg = '<b>' + activePawn._name + '</b>';
                if (order.action == 'move') {
                    msg += ' se déplacera en ' + o.x + ', ' + o.y;
                }
                else if (o.action == 'cast') {
                    msg += ' lancera une boule de feu vers ' + this.directionMapping[o.direction];
                }
                else if (o.action == 'stand') {
                    msg += ' restera en position ' + o.x + ', ' + o.y + ' et surveillera vers ' + this.directionMapping[o.direction];
                }
                console.log(msg);
                return '<span style="color:#ffffff;">' + msg + '</span>';
            };
            OrdersNotifications.prototype.hilightPath = function (position) {
            };
            return OrdersNotifications;
        }());
        UI.OrdersNotifications = OrdersNotifications;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var PawnsInfos = (function () {
            function PawnsInfos(menu) {
                this.menu = menu;
                var self = this;
                var html = '<div class="ui-pawns-infos">';
                for (var i = 0; i < this.menu.game.pawns.length; i++) {
                    html += '<div pawn-index="' + i + '" class="pawn pawn0' + this.menu.game.pawns[i]._id + ' ' + this.menu.game.pawns[i].type + ' team-' + this.menu.game.pawns[i].team + '">' +
                        '<div class="avatar"><div class="picture shiny"></div></div>' +
                        '<div class="name">' + this.menu.game.pawns[i]._name + '</div>' +
                        //'<div class="orders"></div> ' +
                        '<div class="infos">' +
                        '<div class="hp">' +
                        '<div class="bar">' +
                        '<div class="content"></div>' +
                        '<div class="text"><span class="value"></span> / ' + this.menu.game.pawns[i]._hpMax + ' HP</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="ap">' +
                        '<div class="bar">' +
                        '<div class="content"></div>' +
                        '<div class="text"><span class="value"></span> / ' + this.menu.game.pawns[i]._apMax + ' AP</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
                html += '</div>';
                this.menu.element.append(html);
                this.element = this.menu.element.find('.ui-pawns-infos');
                this.element.find('.pawn').on('click', function () {
                    var selectedPawn = self.menu.game.pawns[parseInt($(this).attr('pawn-index'))];
                    if (selectedPawn.team == self.menu.game.turnManager.currentTeam) {
                        self.menu.game.turnManager.setActivePawn(selectedPawn);
                    }
                });
            }
            PawnsInfos.prototype.select = function (id) {
                this.deselectAll();
                this.element.find('.pawn0' + id).addClass('active');
            };
            PawnsInfos.prototype.deselectAll = function () {
                this.element.find('.pawn').removeClass('active');
            };
            PawnsInfos.prototype.selectAll = function () {
                this.element.find('.pawn').addClass('active');
            };
            PawnsInfos.prototype.updateInfos = function () {
                for (var i = 0; i < this.menu.game.pawns.length; i++) {
                    var entity = this.menu.game.pawns[i];
                    this.element.find('.pawn0' + entity._id + ' .infos .hp .value').html(entity.getHp());
                    this.element.find('.pawn0' + entity._id + ' .infos .hp .bar .content').css('width', ((entity.getHp() / entity._hpMax) * 100) + '%');
                    this.element.find('.pawn0' + entity._id + ' .infos .ap .value').html(entity.getAp());
                    this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .content').css('width', ((entity.getAp() / entity._apMax) * 100) + '%');
                }
            };
            PawnsInfos.prototype.updateOrders = function (pawn, orders) {
                //let orders_list = '';
                //for(var i=0; i < orders.length; i++) {
                //    if(orders[i].entity._id == pawn._id) {
                //        for(var j = 0; j < orders[i].list.length; j++) {
                //            let o = orders[i].list[j];
                //            orders_list += '<div class="order"><span class="' + o.action + '"></span><span class="coordinates">' + o.x + ',' + o.y + '</span></div>';
                //        }
                //    }
                //}
                //this.element.find('.pawn0' + pawn._id + ' .orders').html(orders_list);
            };
            PawnsInfos.prototype.cleanOrders = function () {
                // this.element.find('.orders').html('');
            };
            return PawnsInfos;
        }());
        UI.PawnsInfos = PawnsInfos;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var Pointer = (function () {
            function Pointer(game) {
                this.game = game;
                this.marker = this.game.add.graphics(-this.game.tileSize, -this.game.tileSize);
                this.marker.lineStyle(2, 0xffffff, 1);
                this.marker.drawRect(0, 0, this.game.tileSize, this.game.tileSize);
                this.game.input.addMoveCallback(this.update, this);
                this.game.input.onDown.add(this.onGridClick, this);
            }
            Pointer.prototype.getPosition = function () {
                return {
                    x: this.game.stageManager.layer.getTileX(this.game.input.activePointer.worldX),
                    y: this.game.stageManager.layer.getTileY(this.game.input.activePointer.worldY)
                };
            };
            Pointer.prototype.update = function () {
                var _this = this;
                var self = this;
                var pointerPosition = this.getPosition();
                this.marker.x = pointerPosition.x * this.game.tileSize;
                this.marker.y = pointerPosition.y * this.game.tileSize;
                this.game.stageManager.clearHelp();
                if (!self.game.process) {
                    var activePawn_1 = this.game.turnManager.getActivePawn();
                    var position = activePawn_1.getProjectionOrReal().getPosition();
                    var distance = this.game.stageManager.getNbTilesBetween({ 'x': pointerPosition.x, 'y': pointerPosition.y }, { 'x': position.x, 'y': position.y });
                    if (self.game.uiManager.actionUI.canOrderMove()) {
                        this.game.stageManager.canMove(activePawn_1.getProjectionOrReal(), pointerPosition.x, pointerPosition.y, activePawn_1.getAp()).then(function (path) {
                            _this.game.stageManager.showPath(path, self.game.pathTilesGroup);
                            _this.game.stageManager.showPossibleMove(activePawn_1.getProjectionOrReal().getPosition(), activePawn_1.getReal().getAp());
                        }, function (res) {
                        });
                    }
                    else if (self.game.uiManager.actionUI.canOrderFire() && activePawn_1.getAp() >= 2) {
                        if (distance <= 4) {
                            var path = this.game.stageManager.getLinearPath(activePawn_1.getProjectionOrReal(), 4);
                            this.game.stageManager.showPossibleLinearTrajectories(path);
                            var isInPath = false;
                            for (var i = 0; i < path.length; i++) {
                                if (path[i].x == pointerPosition.x && path[i].y == pointerPosition.y) {
                                    isInPath = true;
                                }
                            }
                            if (isInPath) {
                                this.game.stageManager.showPath(path, self.game.pathTilesGroup, 0xfc000f);
                            }
                        }
                    }
                }
            };
            Pointer.prototype.onGridClick = function () {
                var self = this;
                if (!this.game.process) {
                    var activePawn = this.game.turnManager.getActivePawn();
                    var targetX = this.marker.x / this.game.tileSize;
                    var targetY = this.marker.y / this.game.tileSize;
                    var position = activePawn.getProjectionOrReal().getPosition();
                    var distance = this.game.stageManager.getNbTilesBetween({ 'x': targetX, 'y': targetY }, { 'x': position.x, 'y': position.y });
                    if (this.game.uiManager.actionUI.canOrderMove()) {
                        this.game.stageManager.canMove(activePawn.getProjectionOrReal(), targetX, targetY, activePawn.getAp()).then(function (path) {
                            self.game.process = true;
                            activePawn.createProjection();
                            var resultPath = JSON.parse(JSON.stringify(path));
                            activePawn.projection.moveTo(0, 0, path).then(function (res) {
                                activePawn.setAp(activePawn.getAp() - distance);
                                for (var i = 0; i < resultPath.length; i++) {
                                    self.game.orderManager.add('move', activePawn, resultPath[i].x, resultPath[i].y, activePawn.getProjectionOrReal().getDirection());
                                }
                                self.game.process = false;
                                self.game.signalManager.onActionPlayed.dispatch(activePawn.getProjectionOrReal());
                            });
                        }, function (res) {
                        });
                    }
                    else if (this.game.uiManager.actionUI.canOrderFire() && activePawn.getAp() >= 2) {
                        if (distance <= 4) {
                            var path = this.game.stageManager.getLinearPath(activePawn.getProjectionOrReal(), 4);
                            this.game.stageManager.showPossibleLinearTrajectories(path);
                            var isInPath = false;
                            var maxX = null;
                            var maxY = null;
                            for (var i = 0; i < path.length; i++) {
                                if (path[i].x == targetX && path[i].y == targetY) {
                                    isInPath = true;
                                }
                                if (this.game.stageManager.getNbTilesBetween({ 'x': path[i].x, 'y': path[i].y }, { 'x': position.x, 'y': position.y }) == 4) {
                                    maxX = path[i].x;
                                    maxY = path[i].y;
                                }
                            }
                            if (isInPath) {
                                activePawn.createProjection();
                                activePawn.getProjectionOrReal().halfcast();
                                activePawn.setAp(activePawn.getAp() - 2);
                                this.game.orderManager.add('cast', activePawn, position.x, position.y, activePawn.getProjectionOrReal().getDirection());
                            }
                        }
                    }
                }
            };
            Pointer.prototype.hide = function () {
                this.marker.visible = false;
            };
            Pointer.prototype.show = function () {
                this.marker.x = -this.game.tileSize;
                this.marker.y = -this.game.tileSize;
                this.marker.visible = true;
            };
            Pointer.prototype.dealWith = function (element) {
                var self = this;
                element.on('mouseover', function () {
                    self.hide();
                });
                element.on('mouseout', function () {
                    self.show();
                });
            };
            return Pointer;
        }());
        UI.Pointer = Pointer;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var Time = (function () {
            function Time(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<ul class="ui-menu ui-time-menu"><li class="pause"></li><li class="play"></li></ul>');
                this.element = this.menu.element.find('.ui-time-menu');
                this.element.find('.pause').on('click', function () {
                    self.pause();
                });
                this.element.find('.play').on('click', function () {
                    self.deselectAll();
                    self.select('play');
                    self.menu.game.isPaused = false;
                    self.goForward();
                });
                this.pause();
            }
            Time.prototype.goForward = function () {
                if (this.menu.game.resolveManager.active && !this.menu.game.resolveManager.processing) {
                    var nextIndex = this.menu.game.resolveManager.currentIndex + 1;
                    if (nextIndex >= this.menu.game.resolveManager.steps.length) {
                        this.menu.game.isPaused = false;
                    }
                    this.menu.game.resolveManager.processSteps(nextIndex);
                }
            };
            Time.prototype.pause = function () {
                this.deselectAll();
                this.select('pause');
                this.menu.game.isPaused = true;
            };
            Time.prototype.goBackward = function () {
                if (this.menu.game.resolveManager.active && !this.menu.game.resolveManager.processing) {
                    this.pause();
                    var previousIndex = this.menu.game.resolveManager.currentIndex - 1;
                    if (previousIndex >= 0) {
                        this.menu.game.resolveManager.processSteps(previousIndex, true, true);
                    }
                }
            };
            Time.prototype.togglePause = function () {
                if (this.menu.game.isPaused) {
                    this.element.find('.play').trigger('click');
                }
                else {
                    this.pause();
                }
            };
            Time.prototype.deselectAll = function () {
                this.element.find('li').removeClass('selected');
            };
            Time.prototype.select = function (name) {
                this.element.find('.' + name).addClass('selected');
            };
            Time.prototype.update = function () {
                if (this.menu.game.isPaused) {
                    this.deselectAll();
                    this.select('pause');
                }
                else {
                    this.deselectAll();
                    this.select('play');
                }
            };
            Time.prototype.updatePauseFromSelected = function () {
                this.menu.game.isPaused = this.element.find('.pause').hasClass('selected');
            };
            return Time;
        }());
        UI.Time = Time;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var TimeLine = (function () {
            function TimeLine(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<div class="timeline-container"></div>');
                this.container = this.menu.element.find('.timeline-container');
                this.container.append('<ul class="ui-timeline-menu"></ul>');
                this.container.append('<a class="prev inactive"><</a><a class="next">></a>');
                this.element = this.menu.element.find('.ui-timeline-menu');
                //this.build(4);
                this.container.find('.prev').on('click', function () {
                    self.menu.timeUI.goBackward();
                });
                this.container.find('.next').on('click', function () {
                    self.menu.timeUI.goForward();
                });
            }
            TimeLine.prototype.deselectAll = function () {
                this.element.find('li').removeClass('selected').removeClass('previous');
            };
            TimeLine.prototype.select = function (query) {
                this.element.find(query).addClass('selected');
            };
            TimeLine.prototype.clean = function () {
                var self = this;
                this.container.fadeOut(500, function () {
                    self.container.find('.prev, .next').css('opacity', '0');
                    self.element.html('');
                });
            };
            TimeLine.prototype.update = function (index) {
                this.deselectAll();
                this.select('[timeline-index=' + index + ']');
                for (var i = index - 1; i >= 0; i--) {
                    this.element.find('[timeline-index=' + i + ']').addClass('previous');
                }
                if (index == 0) {
                    this.container.find('.prev').css('opacity', '0.2');
                }
                else {
                    this.container.find('.prev').css('opacity', '1');
                }
                if (index == this.menu.game.resolveManager.steps.length - 1) {
                    this.container.find('.next').html('Confirm');
                }
                else {
                    this.container.find('.next').html('>');
                }
            };
            TimeLine.prototype.build = function (length) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var self = _this;
                    var timeline = '';
                    for (var i = 0; i < length; i++) {
                        timeline += '<li timeline-index="' + i + '" class="timeline-item"><div class="line"></div><div class="square">' + i + '</div></li>';
                    }
                    _this.element.html(timeline);
                    _this.element.find('.timeline-item').on('click', function () {
                        var index = parseInt($(this).attr('timeline-index'));
                        if (index != self.menu.game.resolveManager.currentIndex) {
                            self.menu.timeUI.pause();
                            self.menu.game.resolveManager.processSteps(index, false, index < self.menu.game.resolveManager.currentIndex);
                        }
                    });
                    $('.timeline-item .square').css('opacity', '0');
                    $('.timeline-item .line').css('width', '0px');
                    $('.timeline-container .prev, .timeline-container .next').css('opacity', '0');
                    _this.container.show();
                    _this.display($('.timeline-item')).then(function () {
                        resolve(true);
                    });
                });
            };
            TimeLine.prototype.display = function (elements) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (elements.length > 0) {
                        var self_5 = _this;
                        $(elements[0]).find('.line').animate({ width: '91px' }, 200, function () {
                            $(elements[0]).find('.square').animate({ opacity: 1 }, 100, function () {
                                self_5.display(elements.slice(1)).then(function () {
                                    resolve(true);
                                });
                            });
                        });
                    }
                    else {
                        $('.timeline-container .prev').css('opacity', '0.2');
                        $('.timeline-container .next').css('opacity', '1');
                        resolve(true);
                    }
                });
            };
            return TimeLine;
        }());
        UI.TimeLine = TimeLine;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var Transition = (function () {
            function Transition(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<div class="ui-transition"><div class="glowing"></div></div>');
                this.element = this.menu.element.find('.ui-transition');
                this.elementText = this.element.find('.glowing');
                this.element.on('click', function () {
                    $(self.element).fadeOut();
                });
            }
            Transition.prototype.hide = function () {
                var self = this;
                $(self.elementText).animate({ right: '800px' }, 800, 'easeInBack', function () {
                    $(self.element).hide();
                    self.menu.process = false;
                });
            };
            Transition.prototype.clean = function () {
                this.element.html('');
            };
            Transition.prototype.show = function (message) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var self = _this;
                    _this.menu.process = true;
                    self.element.show();
                    _this.elementText.html('');
                    _this.elementText.css('right', '-800px');
                    _this.elementText.html(message);
                    _this.elementText.animate({ right: '0px' }, 800, 'easeOutBack', function () {
                        setTimeout(function () {
                            self.hide();
                            resolve(true);
                        }, 800);
                    });
                });
            };
            return Transition;
        }());
        UI.Transition = Transition;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var TurnIndicator = (function () {
            function TurnIndicator(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<div class="ui-turn-indicator"></div>');
                this.element = this.menu.element.find('.ui-turn-indicator');
            }
            TurnIndicator.prototype.write = function (turn) {
                this.element.html('Tour ' + ("0" + Number(turn)).slice(-2));
            };
            return TurnIndicator;
        }());
        UI.TurnIndicator = TurnIndicator;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var UIManager = (function () {
            function UIManager(game) {
                var self = this;
                this.game = game;
                this.element = $('#content');
                //this.consolelogsUI = new UI.ConsoleLogs(this);
                this.directionUI = new UI.Direction(this);
                this.actionUI = new UI.Action(this);
                this.timeUI = new UI.Time(this);
                this.timelineUI = new UI.TimeLine(this);
                this.pawnsinfosUI = new UI.PawnsInfos(this);
                this.keyManager = new UI.KeyManager(this);
                this.notificationsUI = new UI.Notifications(this);
                this.ordersnotificationsUI = new UI.OrdersNotifications(this);
                this.transitionUI = new UI.Transition(this);
                this.turnIndicatorUI = new UI.TurnIndicator(this);
                //this.game.pointer.dealWith(this.consolelogsUI.element);
                this.game.pointer.dealWith(this.actionUI.element);
                this.game.pointer.dealWith(this.timeUI.element);
                this.game.pointer.dealWith(this.timelineUI.element);
                this.game.pointer.dealWith(this.directionUI.element);
                this.process = false;
                //this.consolelogsUI.element.ready(function() {
                //    self.consolelogsUI.write('##################');
                //    self.consolelogsUI.write('<b># Tactical <span style="color:orangered;">A</span>' +
                //        '<span style="color:limegreen;">r</span>' +
                //        '<span style="color:cyan;">e</span>' +
                //        '<span style="color:yellow;">n</span>' +
                //        '<span style="color:orangered;">a</span> #</b>');
                //    self.consolelogsUI.write('##################<br/>');
                //});
            }
            UIManager.prototype.init = function () {
                var activePawn = this.game.turnManager.getActivePawn();
            };
            UIManager.prototype.initOrderPhase = function (pawn, first) {
                var _this = this;
                this.game.turnManager.init(pawn, first).then(function (data) {
                    if (first) {
                        _this.turnIndicatorUI.write(_this.game.turnManager.currentTurnIndex + 1);
                        _this.transitionUI.show('Phase de commandement').then(function (res) {
                            _this.actionUI.show();
                            _this.directionUI.show();
                            return true;
                        });
                    }
                    _this.init();
                    _this.game.signalManager.turnInitialized.dispatch(pawn);
                });
            };
            UIManager.prototype.endOrderPhase = function () {
                var _this = this;
                var activePawn = this.game.turnManager.getActivePawn();
                if (!this.game.process) {
                    this.game.stageManager.clearPossibleMove();
                    this.game.stageManager.clearPath(this.game.pathTilesGroup);
                    this.game.process = true;
                    this.game.selecting = false;
                    this.game.turnManager.endTurn().then(function (nextPawn) {
                        _this.game.signalManager.onTurnEnded.dispatch(activePawn);
                        if (activePawn._id == _this.game.pawns[_this.game.pawns.length - 1]._id) {
                            _this.actionUI.clean();
                            _this.directionUI.clean();
                            var steps_1 = _this.game.orderManager.getSteps();
                            _this.game.resolveManager.init(steps_1);
                            _this.transitionUI.show('Phase de Résolution').then(function (res) {
                                return true;
                            }).then(function (res) {
                                _this.pawnsinfosUI.selectAll();
                                _this.game.logManager.add(steps_1);
                                _this.timelineUI.build(steps_1.length).then(function (res) {
                                    _this.game.resolveManager.processSteps(0);
                                });
                            });
                        }
                        else {
                            _this.initOrderPhase(nextPawn, false);
                        }
                    });
                }
            };
            UIManager.prototype.endResolvePhase = function () {
                var self = this;
                for (var i = 0; i < this.game.pawns.length; i++) {
                    this.game.pawns[i].destroyProjection();
                }
                this.game.resolveManager.active = false;
                this.pawnsinfosUI.cleanOrders();
                setTimeout(function () {
                    self.notificationsUI.clean();
                }, 500);
                this.timelineUI.clean();
                this.timeUI.updatePauseFromSelected();
                this.initOrderPhase(this.game.pawns[0], true);
            };
            UIManager.prototype.cancelAction = function () {
                if (!this.game.process) {
                    var activePawn = this.game.turnManager.getActivePawn();
                    activePawn.show();
                    activePawn.destroyProjection();
                    activePawn.setAp(3);
                    activePawn.getProjectionOrReal().faceDirection(this.directionUI.savedDirection);
                    this.directionUI.init(this.directionUI.savedDirection);
                    this.game.orderManager.removeEntityOrder(activePawn);
                    this.game.signalManager.onActionPlayed.dispatch(activePawn);
                }
            };
            return UIManager;
        }());
        UI.UIManager = UIManager;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
//# sourceMappingURL=app.js.map