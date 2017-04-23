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
/// <reference path="./definitions/jquery.contextMenu.d.ts" />
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
            _this.state.add('menu', TacticArena.State.Menu);
            _this.state.add('lobby', TacticArena.State.Lobby);
            _this.state.add('options', TacticArena.State.Options);
            _this.state.add('main', TacticArena.State.Main);
            _this.state.add('mainmultiplayeronline', TacticArena.State.MainMultiplayerOnline);
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
                        currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 8, 8, 'E', 'skeleton', 1, false, 1, 'Eikio'));
                        currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 10, 8, 'W', 'skeleton', 2, false, 2, 'Dormammu'));
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
                    spyOn(TacticArena.Controller.OrderManager, 'resolutionEsquive').and.callFake(function () {
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
                    expect(steps[2][0].order.targets).toEqual([currentState.pawns[1]._id]);
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
                    expect(steps[1][0].order.targets).toEqual([currentState.pawns[1]._id]);
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 9, y: 8 }, 2, 2, false, {});
                    testStep(steps, 2, 0, 1, 'attack', 'E', { x: 8, y: 8 }, 0, 3, false, {});
                    testStep(steps, 2, 1, 2, 'attack', 'W', { x: 9, y: 8 }, 1, 1, true, { x: 8, y: 8 });
                    testStep(steps, 3, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 0, 2, false, {});
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 9, y: 8 }, 0, 1, false, {});
                });
            });
            describe("4 players / Fleerate 0%", function () {
                beforeEach(function () {
                    spyOn(TacticArena.Controller.OrderManager, 'resolutionEsquive').and.callFake(function () {
                        return true;
                    });
                    currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 7, 7, 'E', 'skeleton', 3, false, 2, 'Oscar'));
                    currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 12, 7, 'W', 'skeleton', 4, false, 1, 'Diana'));
                });
                it("with 1 dead - nothing is played", function () {
                    currentState.pawns[2].setHp(0);
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(2);
                    expect(steps[0].length).toEqual(4);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 2, 3, 'stand', 'E', { x: 7, y: 7 }, 0, 0, false, {});
                    testStep(steps, 0, 3, 4, 'stand', 'W', { x: 12, y: 7 }, 3, 4, false, {});
                    testStep(steps, 1, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 2, 3, 'stand', 'E', { x: 7, y: 7 }, 0, 0, false, {});
                    testStep(steps, 1, 3, 4, 'stand', 'W', { x: 12, y: 7 }, 2, 4, false, {});
                });
                it("with 1 dead - 4th pawn moves", function () {
                    currentState.pawns[2].setHp(0);
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[3],
                            list: [
                                { action: "move", direction: "W", x: 11, y: 7 },
                                { action: "move", direction: "W", x: 11, y: 6 }
                            ]
                        },
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(3);
                    expect(steps[0].length).toEqual(4);
                    testStep(steps, 0, 0, 4, 'stand', 'W', { x: 12, y: 7 }, 3, 4, false, {});
                    testStep(steps, 0, 1, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 2, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, {});
                    testStep(steps, 0, 3, 3, 'stand', 'E', { x: 7, y: 7 }, 0, 0, false, {});
                    testStep(steps, 1, 0, 4, 'move', 'W', { x: 11, y: 7 }, 2, 4, false, {});
                    testStep(steps, 1, 1, 1, 'stand', 'E', { x: 8, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 2, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, {});
                    testStep(steps, 1, 3, 3, 'stand', 'E', { x: 7, y: 7 }, 0, 0, false, {});
                    testStep(steps, 2, 0, 4, 'move', 'W', { x: 11, y: 6 }, 1, 4, false, {});
                    testStep(steps, 2, 1, 1, 'stand', 'E', { x: 8, y: 8 }, 1, 4, false, {});
                    testStep(steps, 2, 2, 2, 'stand', 'W', { x: 10, y: 8 }, 1, 4, false, {});
                    testStep(steps, 2, 3, 3, 'stand', 'E', { x: 7, y: 7 }, 0, 0, false, {});
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
            OrderManager.prototype.getPlayerOrders = function (teamId) {
                var result = [];
                for (var i = 0; i < this.orders.length; i++) {
                    if (this.orders[i].entity.team == teamId) {
                        result.push({
                            entityId: this.orders[i].entity._id,
                            list: this.orders[i].list
                        });
                    }
                }
                return result;
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
            OrderManager.getDefaultOrder = function (position, direction) {
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
                        this.add('stand', p, position.x, position.y, p.getDirection(), false);
                    }
                }
            };
            OrderManager.prototype.getInitialStep = function () {
                var step = [];
                for (var i = 0; i < this.orders.length; i++) {
                    var state = OrderManager.getDefaultEntityState();
                    var pawn = this.orders[i].entity;
                    var hp = pawn.getHp();
                    state['ap'] = hp > 0 ? pawn._apMax : 0;
                    state['hp'] = hp;
                    step.push({
                        entity: pawn,
                        entityState: state,
                        order: OrderManager.getDefaultOrder(pawn.getPosition(), pawn.getDirection())
                    });
                }
                return step;
            };
            OrderManager.resolutionEsquive = function (fleeRate) {
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
            OrderManager.getDefaultEntityState = function () {
                return {
                    moveHasBeenBlocked: false,
                    positionBlocked: {}
                };
            };
            OrderManager.prototype.getPawn = function (id) {
                //return this.game.pawns.find( p => {
                //    console.log(p._id, id);
                //    return p._id == id;
                //});
                var result = null;
                this.game.pawns.forEach(function (p) {
                    if (p._id == id) {
                        result = p;
                    }
                });
                return result;
            };
            OrderManager.prototype.processOrders = function (steps) {
                for (var l = 1; l < steps.length; l++) {
                    var step = steps[l];
                    var previousStep = steps[l - 1];
                    for (var i = 0; i < step.length; i++) {
                        step[i].entityState = OrderManager.getDefaultEntityState();
                        // Dans le cas où une entité à moins d'actions à jouer que les autres
                        // On lui en assigne un par défaut pour qu'elle ne soit pas inactive
                        // Mais si elle n'a plus de AP elle ne fera rien à part rester dans sa position
                        if (step[i].order == null) {
                            step[i].order = OrderManager.getDefaultOrder(previousStep[i].order, previousStep[i].order.direction);
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
                            var positionB = { x: orderB.x, y: orderB.y };
                            var positionABeforeOrder = { x: previousStep[i].order.x, y: previousStep[i].order.y };
                            var positionBBeforeOrder = { x: previousStep[j].order.x, y: previousStep[j].order.y };
                            var aWasFacingB = this.game.stageManager.isFacing(positionABeforeOrder, previousStep[i].order.direction, positionBBeforeOrder);
                            var aWasNextToB = this.game.stageManager.getNbTilesBetween(positionABeforeOrder, positionBBeforeOrder) == 1;
                            var fleeRate = 100;
                            var entityAApCost = 1;
                            var entityBHpLost = 0;
                            var aIsActive = previousStep[i].entityState['ap'] > 0; // INACTIF = stand mais pas le droit d'attaquer
                            var keepDirection = (previousStep[i].order.direction == orderA.direction);
                            var keepPosition = (orderA.x == positionABeforeOrder.x && orderA.y == positionABeforeOrder.y);
                            var equalPositions = this.game.stageManager.equalPositions(orderA, orderB);
                            var differentTeams = entityA.team != entityB.team;
                            if (equalPositions) {
                                // Si A veut aller sur la même case que B (qu'il y soit déjà où qu'il veuille y aller)
                                if (this.alteredPawns.indexOf(entityA._id) < 0)
                                    entityAState.moveHasBeenBlocked = (orderA.action == 'move');
                                if (this.alteredPawns.indexOf(entityB._id) < 0)
                                    entityBState.moveHasBeenBlocked = (orderB.action == 'move');
                            }
                            // Possible cases :
                            // [  ][A v][  ]
                            // [A>][ B ][<A]
                            // [  ][ A^][  ]
                            // IF A was next to B
                            // AND IF A was facing B
                            // AND IF A is active (ap > 0)
                            // AND IF A & B are not in the same team
                            // AND IF A keeps its direction (aIsFacingB) (et ne va donc pas pas se détourner de B)
                            // AND IF A stays next to B OR IF A moves toward B (equalPositions) (en lui faisant face)
                            if (['stand', 'move'].indexOf(orderA.action) >= 0 && aWasNextToB && aWasFacingB && aIsActive &&
                                differentTeams && keepDirection && (keepPosition || equalPositions)) {
                                var entityBIsDodging = true;
                                if (OrderManager.resolutionEsquive(fleeRate)) {
                                    entityBHpLost += 1;
                                    entityBIsDodging = false;
                                    if (this.alteredPawns.indexOf(entityB._id) < 0) {
                                        entityBState.moveHasBeenBlocked = (orderB.action == 'move');
                                    }
                                }
                                orderA.action = 'attack';
                                orderA.target = { entityId: entityB._id, dodge: entityBIsDodging };
                            }
                            if (entityAState.moveHasBeenBlocked && this.alteredPawns.indexOf(entityA._id) < 0) {
                                this.blockEntity(steps, l, i, OrderManager.getDefaultOrder(previousStep[i].order, previousStep[i].order.direction), entityA);
                            }
                            if (entityBState.moveHasBeenBlocked && this.alteredPawns.indexOf(entityB._id) < 0) {
                                this.blockEntity(steps, l, j, OrderManager.getDefaultOrder(previousStep[j].order, previousStep[j].order.direction), entityB);
                            }
                            if (orderA.action == 'cast') {
                                entityAApCost++;
                                var path = this.game.stageManager.getLinearPath(entityA, 4, orderA.direction, orderA);
                                orderA.targets = orderA.targets || [];
                                for (var k = 0; k < path.length; k++) {
                                    var targetPosition = entityBState.moveHasBeenBlocked ? positionBBeforeOrder : positionB;
                                    if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                                        orderA.targets.push(entityB._id);
                                        entityBHpLost += 2;
                                    }
                                }
                            }
                            entityBState.hp = typeof entityBState.hp !== 'undefined' ? entityBState.hp : previousStep[j].entityState['hp'];
                            entityBState.hp -= entityBHpLost;
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
                        currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 8, 8, 'E', 'skeleton', 1, false, 1, 'Eikio'));
                        currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 10, 8, 'W', 'skeleton', 2, false, 2, 'Dormammu'));
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
                                action: "attack", direction: "E", x: 9, y: 8, target: { entityId: currentState.pawns[1]._id, dodge: false }
                            },
                            entityState: getEntityState(1, 4)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: {
                                action: "attack", direction: "W", x: 10, y: 8, target: { entityId: currentState.pawns[0]._id, dodge: true }
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
                            order: { action: "cast", direction: "E", x: 8, y: 7, targets: [currentState.pawns[1]._id] },
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
                            order: { action: "stand", direction: "E", x: 8, y: 7, targets: [currentState.pawns[1]._id] },
                            entityState: getEntityState(0, 3)
                        },
                        {
                            entity: currentState.pawns[1],
                            order: { action: "move", direction: "W", x: 9, y: 7, target: { entity: currentState.pawns[0]._id, dodge: false } },
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
            ResolveManager.prototype.createPromiseDie = function (entity) {
                return new Promise(function (resolve, reject) {
                    entity.die();
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
                var self = this;
                return new Promise(function (resolve, reject) {
                    if (index >= _this.steps.length) {
                        resolve(true);
                        return true;
                    }
                    _this.currentIndex = index;
                    _this.game.signalManager.stepResolutionIndexChange.dispatch(index);
                    var step = _this.steps[index];
                    var previousStep = index > 0 ? _this.steps[index - 1] : null;
                    console.log('processStep', index, step);
                    var promisesOrders = [];
                    var _loop_1 = function () {
                        o = step[i].order;
                        e = step[i].entity;
                        s = step[i].entityState;
                        p = null;
                        var position = e.getPosition();
                        e.setAp(s.ap);
                        if (s.hp <= 0) {
                            //p = this.handleBackwardPromise(this.createPromiseDie(e), e, o, position, animate);
                        }
                        else if (o.action == 'move') {
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
                            o.target.entity = _this.game.orderManager.getPawn(o.target.entityId);
                            p = _this.handleBackwardPromise(_this.createPromiseAttack(e, o.target), e, o, position, animate);
                        }
                        else if (o.action == 'cast') {
                            var targets_1 = [];
                            o.targets.forEach(function (t) {
                                targets_1.push(self.game.orderManager.getPawn(t));
                            });
                            console.log('ids', targets_1);
                            p = _this.handleBackwardPromise(e.cast(targets_1, o.direction), e, o, position, animate);
                        }
                        else if (o.action == 'stand') {
                            p = _this.handleBackwardPromise(_this.createPromiseStand(e, o.direction), e, o, position, animate);
                        }
                        promisesOrders.push(p);
                    };
                    var o, e, s, p;
                    for (var i = 0; i < step.length; i++) {
                        _loop_1();
                    }
                    _this.manageProjectionDislay(step);
                    Promise.all(promisesOrders).then(function (res) {
                        if (!backward) {
                            _this.manageProjectionDislay(step);
                        }
                        step.forEach(function (s) {
                            s.entity.setHp(s.entityState.hp);
                        });
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
        var ServerManager = (function () {
            function ServerManager(game, login, onChatMessageReceptionCallback, onPlayersListUpdateCallback, onDuelAskReceptionCallback, onDuelAcceptedCallback, onDuelStartCallback) {
                this.game = game;
                this.url = 'wss://polar-fortress-51758.herokuapp.com';
                //this.url = 'ws://localhost:3000';
                this.login = login;
                this.token = '';
                this.socketId = null;
                this.playersList = [];
                this.onChatMessageReceptionCallback = onChatMessageReceptionCallback;
                this.onPlayersListUpdateCallback = onPlayersListUpdateCallback;
                this.onDuelAskReceptionCallback = onDuelAskReceptionCallback;
                this.onDuelAcceptedCallback = onDuelAcceptedCallback;
                this.onDuelStartCallback = onDuelStartCallback;
                this.intervalCount = 0;
                this.connect();
                this.request('NEW_CONNECTION', ' ', this.login);
            }
            ServerManager.prototype.connect = function () {
                var self = this;
                this.socket = new WebSocket(this.url);
                this.socket.onmessage = function (message) {
                    var data = JSON.parse(message.data).data;
                    console.log(data);
                    var server_msg = data.type == 'SERVER_NOTIFICATION';
                    if (data.type == 'SERVER_PLAYERS_LIST') {
                        self.onPlayersListUpdateCallback(data);
                    }
                    else if (data.type == 'SERVER_TOKEN') {
                        self.token = data.content;
                    }
                    else if (data.type == 'ASK_DUEL') {
                        self.onDuelAskReceptionCallback(data.content, data.name);
                    }
                    else if (data.type == 'DECLINE_DUEL') {
                        self.onChatMessageReceptionCallback(data, true);
                    }
                    else if (data.type == 'ACCEPT_DUEL') {
                        self.onChatMessageReceptionCallback(data, true);
                        self.onDuelAcceptedCallback(data);
                    }
                    else if (data.type == 'START_DUEL') {
                        self.onChatMessageReceptionCallback({ content: 'Début du duel' }, true);
                        self.onDuelStartCallback(data);
                    }
                    else if (data.type == 'PROCESS_ORDERS') {
                        var orders = [];
                        for (var i = 0; i < data.content.length; i++) {
                            if (data.content[i].orders) {
                                for (var j = 0; j < data.content[i].orders.length; j++) {
                                    if (data.content[i].orders[j].entityId) {
                                        data.content[i].orders[j].entity = self.game.orderManager.getPawn(data.content[i].orders[j].entityId);
                                    }
                                    orders = orders.concat(data.content[i].orders[j]);
                                }
                            }
                        }
                        self.game.orderManager.orders = orders;
                        var steps = self.game.orderManager.getSteps();
                        console.log(steps);
                        var serializedSteps = [];
                        for (var i = 0; i < steps.length; i++) {
                            serializedSteps.push([]);
                            for (var j = 0; j < steps[i].length; j++) {
                                var s = {
                                    entityId: steps[i][j].entity._id,
                                    entityState: steps[i][j].entityState,
                                    order: steps[i][j].order,
                                };
                                serializedSteps[i].push(s);
                            }
                        }
                        self.request('PROCESSED_ORDERS', serializedSteps);
                    }
                    else if (data.type == 'PROCESSED_ORDERS') {
                        var serializedSteps_1 = data.content;
                        var steps = [];
                        for (var i = 0; i < serializedSteps_1.length; i++) {
                            steps.push([]);
                            for (var j = 0; j < serializedSteps_1[i].length; j++) {
                                var s = {
                                    entity: self.game.pawns.find(function (o) { return o._id == serializedSteps_1[i][j].entityId; }),
                                    entityState: serializedSteps_1[i][j].entityState,
                                    order: serializedSteps_1[i][j].order,
                                };
                                steps[i].push(s);
                            }
                        }
                        self.game.signalManager.onProcessedOrders.dispatch(steps);
                    }
                    else {
                        self.onChatMessageReceptionCallback(data, server_msg);
                    }
                };
                this.socket.onclose = function (e) {
                    console.log('close', e);
                };
                this.socket.onerror = function (e) {
                    console.log('error', e);
                };
                this.socket.onopen = function (e) {
                    console.log('open', e);
                };
                $(window).on('beforeunload', function () {
                    console.log('disconnect');
                    self.socket.close();
                });
            };
            ServerManager.prototype.send = function (message, callback) {
                if (callback === void 0) { callback = null; }
                var self = this;
                return new Promise(function (resolve, reject) {
                    self.waitForConnection(function () {
                        self.socket.send(JSON.stringify(message));
                        if (typeof callback === "function") {
                            callback();
                        }
                        resolve(true);
                    }, 1000);
                });
            };
            ServerManager.prototype.waitForConnection = function (callback, interval) {
                if (this.socket.readyState === 1) {
                    this.intervalCount = 0;
                    callback();
                }
                else {
                    this.intervalCount++;
                    var that = this;
                    // optional: implement backoff for interval here
                    if (this.intervalCount > 2) {
                        this.intervalCount = 0;
                        this.connect();
                    }
                    else {
                        setTimeout(function () {
                            that.waitForConnection(callback, interval);
                        }, interval);
                    }
                }
            };
            ;
            ServerManager.prototype.request = function (type, content, name) {
                if (name === void 0) { name = null; }
                var self = this;
                this.send({ type: type, name: (name ? name : self.token), content: content }).then(function (res) {
                });
            };
            return ServerManager;
        }());
        Controller.ServerManager = ServerManager;
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
                this.onTeamChange = new Phaser.Signal();
                this.onChatMessageReception = new Phaser.Signal();
                this.onProcessedOrders = new Phaser.Signal();
            }
            SignalManager.prototype.init = function () {
                var self = this;
                this.onApChange.add(function () {
                    self.game.uiManager.pawnsinfosUI.updateInfos();
                });
                this.onHpChange.add(function (pawn) {
                    self.game.uiManager.pawnsinfosUI.updateInfos();
                    self.game.stageManager.handleTile(pawn);
                });
                this.onOrderChange.add(function (pawn) {
                    self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(pawn._id));
                });
                this.onActionPlayed.add(function (pawn) {
                    self.game.pointer.update();
                    self.game.uiManager.actionUI.update(pawn.getAp());
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
                    self.game.uiSpritesGroup.removeAll();
                });
                this.onActivePawnChange.add(function (activePawn) {
                    self.game.uiManager.ordersnotificationsUI.clean();
                    self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(activePawn._id));
                    self.game.uiManager.pawnsinfosUI.select(activePawn._id);
                    self.game.uiManager.directionUI.init(activePawn.getDirection());
                    self.game.uiManager.actionUI.update(activePawn.getAp());
                    self.game.uiManager.actionUI.select('walk');
                    var position = activePawn.getPosition();
                    self.game.uiSpritesGroup.removeAll();
                    var s = self.game.uiSpritesGroup.create(position.x * self.game.tileSize - 1, position.y * self.game.tileSize + 15, 'circle');
                    s.animations.add('turn', ["selected_circle_01", "selected_circle_02"], 4, true);
                    s.play('turn');
                    //this.consolelogsUI.write('au tour du joueur ' + activePawn._id);
                });
                this.onTeamChange.add(function () {
                    if (self.game.hideProjections) {
                        self.game.pawns.forEach(function (pawn) {
                            pawn.destroyProjection();
                        });
                    }
                });
                this.onChatMessageReception.add(function (data) {
                    self.game.uiManager.chatUI.write(data.name + ': ' + data.message);
                });
                this.onProcessedOrders.add(function (steps) {
                    self.game.uiManager.initResolvePhase(steps);
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
            StageManager.prototype.handleTile = function (pawn) {
                var p = pawn.getPosition();
                this.grid[p.y][p.x] = pawn.isAlive() ? -1 : 3;
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
                this.playedPawns = [];
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
                        _this.playedPawns = [];
                        _this.game.orderManager.orders = [];
                    }
                    _this.setActivePawn(pawn);
                    resolve(true);
                });
            };
            TurnManager.prototype.getRemainingPawns = function (teamId) {
                var _this = this;
                if (teamId === void 0) { teamId = null; }
                return this.game.pawns.filter(function (pawn) {
                    var condition = pawn.isAlive() && _this.playedPawns.indexOf(pawn._id) < 0;
                    if (teamId !== null) {
                        condition = condition && pawn.team == teamId;
                    }
                    return condition;
                });
            };
            TurnManager.prototype.endTurn = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.setActivePawnAsPlayed();
                    var nextPawn;
                    var remainingPawns = _this.getRemainingPawns();
                    if (remainingPawns.length > 0) {
                        nextPawn = remainingPawns[0];
                        if (nextPawn.team != _this.currentTeam) {
                            _this.game.signalManager.onTeamChange.dispatch();
                        }
                    }
                    resolve(nextPawn);
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
                var activePawn = this.getActivePawn();
                if (pawn.isAlive() && (!activePawn || pawn._id != activePawn._id)) {
                    for (var i = 0; i < this.game.pawns.length; i++) {
                        this.game.pawns[i].active = (this.game.pawns[i]._id == pawn._id);
                    }
                    this.currentTeam = pawn.team;
                    this.game.signalManager.onActivePawnChange.dispatch(pawn);
                }
            };
            TurnManager.prototype.setActivePawnAsPlayed = function () {
                this.playedPawns.push(this.getActivePawn()._id);
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
                var tint = null; //team != this.game.playerTeam ? this.game.teamColors[team-1] : null;
                if (type) {
                    this.sprite = new Entity.Sprite(game, x, y, ext, type, this, 64, tint);
                    this.game.pawnsSpritesGroup.add(this.sprite);
                    this.sprite.stand();
                }
                this._hp = 4;
                this._hpMax = 4;
                this._apMax = 3;
                this.selected = false;
                this.isBot = bot;
                this.team = team;
                this.hurting = 0;
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
                var self = this;
                self.hurting++;
                var timeOut = self.hurting * 300;
                setTimeout(function () {
                    if (self.hurting == 1) {
                        self.sprite.hurt();
                    }
                    self.destroyProjection();
                    var label_dmg = self.game.add.text(20, 10, "-" + hp, {
                        font: '12px Press Start 2P',
                        fill: "#ff021b",
                        stroke: '#000000',
                        strokeThickness: 6
                    }, self.game.pawnsSpritesGroup);
                    var t = self.game.add.tween(label_dmg).to({
                        x: 20,
                        y: -20,
                        alpha: 0
                    }, 1000, Phaser.Easing.Linear.None, true);
                    t.onComplete.add(function () {
                        label_dmg.destroy();
                    }, self);
                    self.sprite.addChild(label_dmg);
                    self.hurting--;
                }, timeOut);
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
            Pawn.prototype.isAlive = function () {
                return this._hp > 0;
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
                if (this.isAlive() && hp <= 0) {
                    this.sprite.die();
                }
                this._hp = hp;
                this.game.signalManager.onHpChange.dispatch(this);
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
            function Sprite(game, x, y, ext, type, parent, size, tint) {
                if (tint === void 0) { tint = null; }
                var _this = _super.call(this, game.game, game.tileSize * x - (size / 4), game.tileSize * y - (size / 2), type) || this;
                _this._parent = parent;
                _this._ext = ext;
                _this._speed = 200;
                _this._size = size;
                _this.setAnimations();
                _this._animationCompleteCallback = null;
                if (tint) {
                    _this.tint = tint;
                }
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
                this.animations.add('dying', ["dying1", "dying2", "dying3", "dying4", "dying5", "dying6"], 10, false);
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
            Sprite.prototype.die = function () {
                this.playAnimation('dying');
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
        var BaseState = (function (_super) {
            __extends(BaseState, _super);
            function BaseState() {
                return _super.call(this) || this;
            }
            BaseState.prototype.init = function (data, server, chat) {
                this.game.stage.backgroundColor = 0x333333;
                $('[class*="ui-"]').remove();
                $('#game-menu').remove();
                _super.prototype.init.call(this);
            };
            BaseState.prototype.createMenu = function () {
                $('#game-container').append('' +
                    '<div id="game-menu">' +
                    '<div class="logo"></div>' +
                    ' <div class="ui"></div>' +
                    '</div>');
            };
            return BaseState;
        }(Phaser.State));
        State.BaseState = BaseState;
    })(State = TacticArena.State || (TacticArena.State = {}));
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
                this.load.image('loading', 'assets/images/loading.png');
            };
            Boot.prototype.create = function () {
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                this.game.state.start('preload');
            };
            return Boot;
        }(TacticArena.State.BaseState));
        State.Boot = Boot;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var Lobby = (function (_super) {
            __extends(Lobby, _super);
            function Lobby() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Lobby.prototype.create = function () {
                var self = this;
                _super.prototype.createMenu.call(this);
                this.generator = new TacticArena.Utils.Generator();
                $('#game-menu .ui').html('<div><h2>Entrez un login :</h2></div>' +
                    '<div><input type="text" class="login-input" value="' + this.generator.generate() + '"/></div>' +
                    '<div class="button submit-login"><a>Confirmer</a></div>');
                $('#game-menu .ui .submit-login').bind('click', function (e) {
                    self.initChat($('#game-menu .ui .login-input').val());
                });
                $('#game-menu .ui .login-input').on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        self.initChat($('#game-menu .ui .login-input').val());
                    }
                });
            };
            Lobby.prototype.initChat = function (login) {
                $('#game-menu .ui').html('');
                var self = this;
                this.serverManager = new TacticArena.Controller.ServerManager(this, login, function (data, server) {
                    if (server === void 0) { server = false; }
                    console.log(data);
                    var msg = server ? '<span class="notification">' + data.content + '</span>' : data.name + ': ' + data.content;
                    self.chatUI.write(msg);
                }, function (data) {
                    self.chatUI.updatePlayersList(data);
                }, function (message, token) {
                    self.dialogUI.show('Duel !', message, 'Accepter', 'Décliner', function () {
                        self.serverManager.request('ACCEPT_DUEL', token);
                        self.showFactionSelection();
                        $(this).dialog("close");
                    }, function () {
                        self.serverManager.request('DECLINE_DUEL', token);
                        $(this).dialog("close");
                    });
                }, function (data) {
                    self.showFactionSelection();
                }, function (data) {
                    self.game.state.start('mainmultiplayeronline', true, false, data, self.serverManager, self.chatUI);
                });
                this.chatUI = new TacticArena.UI.Chat(this, this.serverManager);
                this.dialogUI = new TacticArena.UI.Dialog(this);
            };
            Lobby.prototype.showFactionSelection = function () {
                var self = this;
                $('#game-menu .ui').html('<div><h2>Choisissez votre faction :</h2></div>' +
                    '<div class="faction-selector">' +
                    '   <span class="control left fa fa-chevron-left"></span>' +
                    '   <span class="control right fa fa-chevron-right"></span>' +
                    '   <div class="faction human"><span class="name">Human</span></div>' +
                    '   <div class="faction undead"><span class="name">Undead</span></div>' +
                    '</div>' +
                    '<div class="button submit-faction"><a>Confirmer</a></div>');
                $('#game-menu .ui .control').on('click', function () {
                    $('#game-menu .ui .faction.human').toggle();
                    $('#game-menu .ui .faction.undead').toggle();
                });
                $('#game-menu .ui .submit-faction').on('click', function () {
                    self.selected_faction = $('#game-menu .ui .faction.human').is(':visible') ? 'human' : 'undead';
                    $(this).hide();
                    $('#game-menu .ui .control').hide();
                    $('#game-menu .ui h2').html('En attente de votre adversaire');
                    self.serverManager.request('FACTION_CHOSEN', self.selected_faction);
                });
                $('#game-menu .ui .faction.human').trigger('click');
            };
            return Lobby;
        }(TacticArena.State.BaseState));
        State.Lobby = Lobby;
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
                this.game.stage.backgroundColor = 0xffffff;
                var self = this;
                this.process = true;
                this.selecting = false;
                this.tileSize = 32;
                this.isPaused = false;
                this.hideProjections = false;
                this.teamColors = ['0x8ad886', '0xd68686', '0x87bfdb', '0xcdd385'];
                this.playerTeam = 1;
                this.teams = {};
                this.signalManager = new TacticArena.Controller.SignalManager(this);
                this.signalManager.init();
                //this.serverManager = new Controller.ServerManager(this, function(data) {
                //    self.signalManager.onChatMessageReception.dispatch(data);
                //});
                this.stageManager = new TacticArena.Controller.StageManager(this);
                this.stageManager.init();
                this.pointer = new TacticArena.UI.Pointer(this);
                this.pawns = [];
                this.pathTilesGroup = this.add.group();
                this.pathOrdersTilesGroup = this.add.group();
                this.uiSpritesGroup = this.add.group();
                this.pawnsSpritesGroup = this.add.group();
                this.pawns.push(new TacticArena.Entity.Pawn(this, 8, 8, 'E', 'redhead', this.getUniqueId(), false, 1, 'Eikio'));
                this.pawns.push(new TacticArena.Entity.Pawn(this, 7, 7, 'E', 'blondy', this.getUniqueId(), false, 1, 'Diana'));
                this.pawns.push(new TacticArena.Entity.Pawn(this, 11, 8, 'W', 'skeleton', this.getUniqueId(), false, 2, 'Fétide'));
                this.pawns.push(new TacticArena.Entity.Pawn(this, 12, 7, 'W', 'skeleton', this.getUniqueId(), false, 2, 'Oscar'));
                this.stageManager.addDecorations();
                this.pathfinder = new EasyStar.js();
                this.pathfinder.setAcceptableTiles([-1]);
                this.pathfinder.disableDiagonals();
                this.pathfinder.disableSync();
                this.pathfinder.setGrid(this.stageManager.grid);
                this.logManager = new TacticArena.Controller.LogManager(this);
                this.orderManager = new TacticArena.Controller.OrderManager(this);
                this.resolveManager = new TacticArena.Controller.ResolveManager(this);
                this.aiManager = new TacticArena.Controller.AiManager(this);
                this.turnManager = new TacticArena.Controller.TurnManager(this);
                this.uiManager = new TacticArena.UI.UIManager(this);
                self.uiManager.initOrderPhase(this.pawns[0], true);
                this.pawns[2].setHp(0);
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
            Main.prototype.isOver = function () {
                var _this = this;
                //let everyoneElseIsDead = true;
                var ennemyPawnAlive = false;
                var allyPawnAlive = false;
                this.pawns.forEach(function (pawn) {
                    _this.teams[pawn.team] = true; //this.teams[pawn.team] || pawn.isAlive();
                    //if(pawn.team != this.playerTeam) {
                    //    everyoneElseIsDead = everyoneElseIsDead && !this.teams[pawn.team];
                    //}
                    if (pawn.team != _this.playerTeam) {
                        if (pawn.isAlive()) {
                            ennemyPawnAlive = true;
                        }
                    }
                    else {
                        if (pawn.isAlive()) {
                            allyPawnAlive = true;
                        }
                    }
                });
                console.log(ennemyPawnAlive, allyPawnAlive);
                if (!allyPawnAlive) {
                    this.teams[this.playerTeam] = false;
                }
                return (!allyPawnAlive || !ennemyPawnAlive);
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
        }(TacticArena.State.BaseState));
        State.Main = Main;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var MainMultiplayerOnline = (function (_super) {
            __extends(MainMultiplayerOnline, _super);
            function MainMultiplayerOnline() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MainMultiplayerOnline.prototype.init = function (data, serverManager, chatUI) {
                var _this = this;
                _super.prototype.init.call(this);
                console.log(data);
                this.playMode = 'online';
                this.game.stage.backgroundColor = 0xffffff;
                var self = this;
                this.process = true;
                this.selecting = false;
                this.tileSize = 32;
                this.isPaused = false;
                this.hideProjections = false;
                this.teamColors = ['0x8ad886', '0xd68686', '0x87bfdb', '0xcdd385'];
                this.teams = {};
                this.serializer = new TS.Serializer(TacticArena);
                this.signalManager = new TacticArena.Controller.SignalManager(this);
                this.signalManager.init();
                this.stageManager = new TacticArena.Controller.StageManager(this);
                this.stageManager.init();
                this.pointer = new TacticArena.UI.Pointer(this);
                this.pawns = [];
                this.pathTilesGroup = this.add.group();
                this.pathOrdersTilesGroup = this.add.group();
                this.uiSpritesGroup = this.add.group();
                this.pawnsSpritesGroup = this.add.group();
                this.generator = new TacticArena.Utils.Generator();
                this.chatUI = chatUI;
                this.serverManager = serverManager;
                this.serverManager.game = this;
                this.players = data.content.players;
                var startPositions = [[{ x: 8, y: 8, d: 'E' }, { x: 7, y: 7, d: 'E' }], [{ x: 11, y: 8, d: 'W' }, { x: 12, y: 7, d: 'W' }]];
                this.players.forEach(function (p, k) {
                    if (p.token == self.serverManager.token) {
                        _this.playerTeam = k;
                    }
                    if (p.faction == 'human') {
                        _this.pawns.push(new TacticArena.Entity.Pawn(_this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'redhead', _this.getUniqueId(), false, k, _this.generator.generate()));
                        _this.pawns.push(new TacticArena.Entity.Pawn(_this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'blondy', _this.getUniqueId(), false, k, _this.generator.generate()));
                    }
                    else {
                        _this.pawns.push(new TacticArena.Entity.Pawn(_this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'evil', _this.getUniqueId(), false, k, _this.generator.generate()));
                        _this.pawns.push(new TacticArena.Entity.Pawn(_this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'skeleton', _this.getUniqueId(), false, k, _this.generator.generate()));
                    }
                });
            };
            MainMultiplayerOnline.prototype.create = function () {
                var self = this;
                this.stageManager.addDecorations();
                this.pathfinder = new EasyStar.js();
                this.pathfinder.setAcceptableTiles([-1]);
                this.pathfinder.disableDiagonals();
                this.pathfinder.disableSync();
                this.pathfinder.setGrid(this.stageManager.grid);
                this.logManager = new TacticArena.Controller.LogManager(this);
                this.orderManager = new TacticArena.Controller.OrderManager(this);
                this.resolveManager = new TacticArena.Controller.ResolveManager(this);
                //this.aiManager = new Controller.AiManager(this);
                this.turnManager = new TacticArena.Controller.TurnManager(this);
                this.uiManager = new TacticArena.UI.UIManager(this);
                this.chatUI.menu = this.uiManager;
                var playerPawns = this.pawns.filter(function (pawn) { return pawn.team == self.playerTeam; });
                this.uiManager.initOrderPhase(playerPawns[0], true);
            };
            MainMultiplayerOnline.prototype.update = function () {
                this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
                this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
                this.world.bringToTop(this.pointer.marker);
                this.world.bringToTop(this.pawnsSpritesGroup);
            };
            MainMultiplayerOnline.prototype.isGameReadyPromise = function () {
                var self = this;
                return new Promise(function (resolve, reject) {
                    (function isGameReady() {
                        if (!self.isPaused)
                            return resolve();
                        setTimeout(isGameReady, 300);
                    })();
                });
            };
            MainMultiplayerOnline.prototype.isOver = function () {
                var _this = this;
                //let everyoneElseIsDead = true;
                var ennemyPawnAlive = false;
                var allyPawnAlive = false;
                this.pawns.forEach(function (pawn) {
                    _this.teams[pawn.team] = true; //this.teams[pawn.team] || pawn.isAlive();
                    //if(pawn.team != this.playerTeam) {
                    //    everyoneElseIsDead = everyoneElseIsDead && !this.teams[pawn.team];
                    //}
                    if (pawn.team != _this.playerTeam) {
                        if (pawn.isAlive()) {
                            ennemyPawnAlive = true;
                        }
                    }
                    else {
                        if (pawn.isAlive()) {
                            allyPawnAlive = true;
                        }
                    }
                });
                console.log(ennemyPawnAlive, allyPawnAlive);
                if (!allyPawnAlive) {
                    this.teams[this.playerTeam] = false;
                }
                return (!allyPawnAlive || !ennemyPawnAlive);
            };
            MainMultiplayerOnline.prototype.getUniqueId = function () {
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
            return MainMultiplayerOnline;
        }(TacticArena.State.BaseState));
        State.MainMultiplayerOnline = MainMultiplayerOnline;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var Menu = (function (_super) {
            __extends(Menu, _super);
            function Menu() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Menu.prototype.create = function () {
                var that = this;
                _super.prototype.createMenu.call(this);
                $('#game-menu .ui').html('<div class="button singleplayer"><a>Single Player</a></div>' +
                    //'<div class="button multiplayerlocal"><a>Multi Player Local</a></div>' +
                    '<div class="button multiplayeronline"><a>Multi Player Online</a></div>' +
                    '<div class="button options"><a>Options</a></div>');
                $('.singleplayer').click(function () { that.game.state.start('main'); });
                $('.multiplayerlocal').click(function () { that.game.state.start('main'); });
                $('.multiplayeronline').click(function () { that.game.state.start('lobby'); });
                $('.options').click(function () { that.game.state.start('options'); });
            };
            return Menu;
        }(TacticArena.State.BaseState));
        State.Menu = Menu;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var Options = (function (_super) {
            __extends(Options, _super);
            function Options() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Options.prototype.create = function () {
                var that = this;
                _super.prototype.createMenu.call(this);
                $('#game-menu .ui').html('<div class="button back"><a>Back</a></div>');
                $('.back').click(function () {
                    that.game.state.start('menu');
                });
            };
            return Options;
        }(TacticArena.State.BaseState));
        State.Options = Options;
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
                this.game.add.text(0, 0, "f", { font: '1px Press Start 2P', fill: "#333333" });
                _super.prototype.createMenu.call(this);
                this.status = this.add.text(640 / 2, this.game.world.centerY / 2 + 200, 'Loading...', { fill: 'white' });
                this.status.anchor.setTo(0.5);
                this.preloadBar = this.add.image(640 / 2, this.game.world.centerY / 2 + 150, "loading");
                this.preloadBar.anchor.setTo(0.5);
                this.load.setPreloadSprite(this.preloadBar);
                this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles-collection', 'assets/images/maptiles.png');
                this.load.image('path-tile', 'assets/images/path_tile.png');
                this.load.atlasJSONArray('player', 'assets/images/character.png', 'assets/images/character.json');
                this.load.atlasJSONArray('orc', 'assets/images/orc.png', 'assets/images/orc.json');
                this.load.atlasJSONArray('redhead', 'assets/images/redhead.png', 'assets/images/redhead.json');
                this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
                this.load.atlasJSONArray('blondy', 'assets/images/blondy.png', 'assets/images/blondy.json');
                this.load.atlasJSONArray('evil', 'assets/images/evil.png', 'assets/images/evil.json');
                this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
                this.load.atlasJSONArray('circle', 'assets/images/circle.png', 'assets/images/circle.json');
                this.load.start();
            };
            Preload.prototype.create = function () {
                var that = this;
                //$(document).ready(function() {
                //  that.game.state.start('main');
                //});
                //
                this.status.setText('Ready!');
                //setTimeout(function () {
                //    that.game.state.start("menu");
                //}, 1000);
                //that.game.state.start("main");
                that.game.state.start("lobby");
            };
            return Preload;
        }(TacticArena.State.BaseState));
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
            Test.prototype.init = function () {
            };
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
        }(TacticArena.State.BaseState));
        State.Test = Test;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TS;
(function (TS) {
    describe("Iterators", function () {
        function check(iterator) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            values.forEach(function (value) {
                var _a = iterator(), head = _a[0], tail = _a[1];
                expect(head).toEqual(value);
                iterator = tail;
            });
        }
        function checkarray(iterator, values) {
            expect(TS.imaterialize(iterator)).toEqual(values);
        }
        it("calls a function for each yielded value", function () {
            var iterator = TS.iarray([1, 2, 3]);
            var result = [];
            TS.iforeach(iterator, TS.bound(result, "push"));
            expect(result).toEqual([1, 2, 3]);
            result = [];
            TS.iforeach(iterator, function (i) {
                result.push(i);
                if (i == 2) {
                    return null;
                }
                else {
                    return undefined;
                }
            });
            expect(result).toEqual([1, 2]);
            result = [];
            TS.iforeach(iterator, function (i) {
                result.push(i);
                return i;
            }, 2);
            expect(result).toEqual([1, 2]);
        });
        it("creates an iterator from an array", function () {
            check(TS.iarray([]), null, null, null);
            check(TS.iarray([1, 2, 3]), 1, 2, 3, null, null, null);
        });
        it("creates an iterator from a single value", function () {
            checkarray(TS.isingle(1), [1]);
            checkarray(TS.isingle("a"), ["a"]);
        });
        it("finds the first item passing a predicate", function () {
            expect(TS.ifirst(TS.iarray([]), function (i) { return i % 2 == 0; })).toBe(null);
            expect(TS.ifirst(TS.iarray([1, 2, 3]), function (i) { return i % 2 == 0; })).toBe(2);
            expect(TS.ifirst(TS.iarray([1, 3, 5]), function (i) { return i % 2 == 0; })).toBe(null);
        });
        it("finds the first item mapping to a value", function () {
            var predicate = function (i) { return i % 2 == 0 ? (i * 4).toString() : null; };
            expect(TS.ifirstmap(TS.iarray([]), predicate)).toBe(null);
            expect(TS.ifirstmap(TS.iarray([1, 2, 3]), predicate)).toBe("8");
            expect(TS.ifirstmap(TS.iarray([1, 3, 5]), predicate)).toBe(null);
        });
        it("materializes an array from an iterator", function () {
            expect(TS.imaterialize(TS.iarray([1, 2, 3]))).toEqual([1, 2, 3]);
            expect(function () { return TS.imaterialize(TS.iarray([1, 2, 3, 4, 5]), 2); }).toThrowError("Length limit on iterator materialize");
        });
        it("creates an iterator in a range of integers", function () {
            checkarray(TS.irange(4), [0, 1, 2, 3]);
            checkarray(TS.irange(4, 1), [1, 2, 3, 4]);
            checkarray(TS.irange(5, 3, 2), [3, 5, 7, 9, 11]);
            check(TS.irange(), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
        });
        it("uses a step iterator to scan numbers", function () {
            check(TS.istep(), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
            check(TS.istep(3), 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);
            checkarray(TS.istep(3, TS.irepeat(1, 4)), [3, 4, 5, 6, 7]);
            checkarray(TS.istep(8, TS.IEMPTY), [8]);
            check(TS.istep(1, TS.irange()), 1, 1, 2, 4, 7, 11, 16);
        });
        it("skips a number of values", function () {
            checkarray(TS.iskip(TS.irange(7), 3), [3, 4, 5, 6]);
            checkarray(TS.iskip(TS.irange(7), 12), []);
            checkarray(TS.iskip(TS.IEMPTY, 3), []);
        });
        it("gets a value at an iterator position", function () {
            expect(TS.iat(TS.irange(), -1)).toEqual(null);
            expect(TS.iat(TS.irange(), 0)).toEqual(0);
            expect(TS.iat(TS.irange(), 8)).toEqual(8);
            expect(TS.iat(TS.irange(5), 8)).toEqual(null);
            expect(TS.iat(TS.IEMPTY, 0)).toEqual(null);
        });
        it("chains iterators", function () {
            checkarray(TS.ichain(), []);
            checkarray(TS.ichain(TS.irange(3)), [0, 1, 2]);
            checkarray(TS.ichain(TS.iarray([1, 2]), TS.iarray([]), TS.iarray([3, 4, 5])), [1, 2, 3, 4, 5]);
        });
        it("chains iterator of iterators", function () {
            checkarray(TS.ichainit(TS.IEMPTY), []);
            checkarray(TS.ichainit(TS.iarray([TS.iarray([1, 2, 3]), TS.iarray([]), TS.iarray([4, 5])])), [1, 2, 3, 4, 5]);
        });
        it("repeats a value", function () {
            check(TS.irepeat("a"), "a", "a", "a", "a");
            checkarray(TS.irepeat("a", 3), ["a", "a", "a"]);
        });
        it("loops an iterator", function () {
            checkarray(TS.iloop(TS.irange(3), 2), [0, 1, 2, 0, 1, 2]);
            check(TS.iloop(TS.irange(1)), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            var onloop = jasmine.createSpy("onloop");
            var iterator = TS.iloop(TS.irange(2), 3, onloop);
            function next() {
                var value;
                _a = iterator(), value = _a[0], iterator = _a[1];
                return value;
                var _a;
            }
            expect(next()).toBe(0);
            expect(onloop).toHaveBeenCalledTimes(0);
            expect(next()).toBe(1);
            expect(onloop).toHaveBeenCalledTimes(0);
            expect(next()).toBe(0);
            expect(onloop).toHaveBeenCalledTimes(1);
            expect(next()).toBe(1);
            expect(onloop).toHaveBeenCalledTimes(1);
            expect(next()).toBe(0);
            expect(onloop).toHaveBeenCalledTimes(2);
            expect(next()).toBe(1);
            expect(onloop).toHaveBeenCalledTimes(2);
            expect(next()).toBe(null);
            expect(onloop).toHaveBeenCalledTimes(2);
        });
        it("maps an iterator", function () {
            checkarray(TS.imap(TS.IEMPTY, function (i) { return i * 2; }), []);
            checkarray(TS.imap(TS.irange(3), function (i) { return i * 2; }), [0, 2, 4]);
        });
        it("filters an iterator", function () {
            checkarray(TS.imap(TS.IEMPTY, function (i) { return i % 3 == 0; }), []);
            checkarray(TS.ifilter(TS.irange(12), function (i) { return i % 3 == 0; }), [0, 3, 6, 9]);
        });
        it("combines iterators", function () {
            var iterator = TS.icombine(TS.iarray([1, 2, 3]), TS.iarray(["a", "b"]));
            checkarray(iterator, [[1, "a"], [1, "b"], [2, "a"], [2, "b"], [3, "a"], [3, "b"]]);
        });
        it("zips iterators", function () {
            checkarray(TS.izip(TS.IEMPTY, TS.IEMPTY), []);
            checkarray(TS.izip(TS.iarray([1, 2, 3]), TS.iarray(["a", "b"])), [[1, "a"], [2, "b"]]);
            checkarray(TS.izipg(TS.IEMPTY, TS.IEMPTY), []);
            checkarray(TS.izipg(TS.iarray([1, 2, 3]), TS.iarray(["a", "b"])), [[1, "a"], [2, "b"], [3, null]]);
        });
        it("partitions iterators", function () {
            var _a = TS.ipartition(TS.IEMPTY, function () { return true; }), it1 = _a[0], it2 = _a[1];
            checkarray(it1, []);
            checkarray(it2, []);
            _b = TS.ipartition(TS.irange(5), function (i) { return i % 2 == 0; }), it1 = _b[0], it2 = _b[1];
            checkarray(it1, [0, 2, 4]);
            checkarray(it2, [1, 3]);
            var _b;
        });
        it("returns unique items", function () {
            checkarray(TS.iunique(TS.IEMPTY), []);
            checkarray(TS.iunique(TS.iarray([5, 3, 2, 3, 4, 5])), [5, 3, 2, 4]);
            checkarray(TS.iunique(TS.iarray([5, 3, 2, 3, 4, 5]), 4), [5, 3, 2, 4]);
            expect(function () { return TS.imaterialize(TS.iunique(TS.iarray([5, 3, 2, 3, 4, 5]), 3)); }).toThrowError("Unique count limit on iterator");
        });
        it("uses ireduce for some common functions", function () {
            expect(TS.isum(TS.IEMPTY)).toEqual(0);
            expect(TS.isum(TS.irange(4))).toEqual(6);
            expect(TS.icat(TS.IEMPTY)).toEqual("");
            expect(TS.icat(TS.iarray(["a", "bc", "d"]))).toEqual("abcd");
            expect(TS.imin(TS.IEMPTY)).toEqual(Infinity);
            expect(TS.imin(TS.iarray([3, 8, 2, 4]))).toEqual(2);
            expect(TS.imax(TS.IEMPTY)).toEqual(-Infinity);
            expect(TS.imax(TS.iarray([3, 8, 2, 4]))).toEqual(8);
        });
    });
})(TS || (TS = {}));
/**
 * Lazy iterators to work on dynamic data sets without materializing them.
 *
 * They allow to work on infinite streams of values, with limited memory consumption.
 *
 * Functions in this file that do not return an Iterator are "materializing", meaning that they
 * may consume iterators up to the end, and will not work well on infinite iterators.
 */
var TS;
(function (TS) {
    function _getIEND() {
        return [null, _getIEND];
    }
    /**
     * IEND is a return value for iterators, indicating end of iteration.
     */
    TS.IEND = [null, _getIEND];
    /**
     * Empty iterator, returning IEND
     */
    TS.IEMPTY = function () { return TS.IEND; };
    /**
     * Equivalent of Array.forEach for lazy iterators.
     *
     * If the callback returns *stopper*, the iteration is stopped.
     */
    function iforeach(iterator, callback, stopper) {
        if (stopper === void 0) { stopper = null; }
        var value;
        _a = iterator(), value = _a[0], iterator = _a[1];
        while (value !== null) {
            var returned = callback(value);
            if (returned === stopper) {
                return;
            }
            _b = iterator(), value = _b[0], iterator = _b[1];
        }
        var _a, _b;
    }
    TS.iforeach = iforeach;
    /**
     * Get an iterator on an array
     *
     * The iterator will yield the next value each time it is called, then null when the array's end is reached.
     */
    function iarray(array, offset) {
        if (offset === void 0) { offset = 0; }
        return function () {
            if (offset < array.length) {
                return [array[offset], iarray(array, offset + 1)];
            }
            else {
                return TS.IEND;
            }
        };
    }
    TS.iarray = iarray;
    /**
     * Get an iterator yielding a single value
     */
    function isingle(value) {
        return iarray([value]);
    }
    TS.isingle = isingle;
    /**
     * Returns the first item passing a predicate
     */
    function ifirst(iterator, predicate) {
        var result = null;
        iforeach(iterator, function (item) {
            if (predicate(item)) {
                result = item;
                return null;
            }
            else {
                return undefined;
            }
        });
        return result;
    }
    TS.ifirst = ifirst;
    /**
     * Returns the first non-null result of a value-yielding predicate, applied to each iterator element
     */
    function ifirstmap(iterator, predicate) {
        var result = null;
        iforeach(iterator, function (item) {
            var mapped = predicate(item);
            if (mapped) {
                result = mapped;
                return null;
            }
            else {
                return undefined;
            }
        });
        return result;
    }
    TS.ifirstmap = ifirstmap;
    /**
     * Materialize an array from consuming an iterator
     *
     * To avoid materializing infinite iterators (and bursting memory), the item count is limited to 1 million, and an
     * exception is thrown when this limit is reached.
     */
    function imaterialize(iterator, limit) {
        if (limit === void 0) { limit = 1000000; }
        var result = [];
        iforeach(iterator, function (value) {
            result.push(value);
            if (result.length >= limit) {
                throw new Error("Length limit on iterator materialize");
            }
        });
        return result;
    }
    TS.imaterialize = imaterialize;
    /**
     * Iterate over natural integers
     *
     * If *count* is not specified, the iterator is infinite
     */
    function irange(count, start, step) {
        if (count === void 0) { count = -1; }
        if (start === void 0) { start = 0; }
        if (step === void 0) { step = 1; }
        return function () { return (count != 0) ? [start, irange(count - 1, start + step, step)] : TS.IEND; };
    }
    TS.irange = irange;
    /**
     * Iterate over numbers, by applying a step taken from an other iterator
     *
     * This iterator stops when the "step iterator" stops
     *
     * With no argument, istep() == irange()
     */
    function istep(start, step) {
        if (start === void 0) { start = 0; }
        if (step === void 0) { step = irepeat(1); }
        return function () {
            var _a = step(), value = _a[0], iterator = _a[1];
            return [start, value === null ? TS.IEMPTY : istep(start + value, iterator)];
        };
    }
    TS.istep = istep;
    /**
     * Skip a given number of values from an iterator, discarding them.
     */
    function iskip(iterator, count) {
        if (count === void 0) { count = 1; }
        var value;
        while (count--) {
            _a = iterator(), value = _a[0], iterator = _a[1];
        }
        return iterator;
        var _a;
    }
    TS.iskip = iskip;
    /**
     * Return the value at a given position in the iterator
     */
    function iat(iterator, position) {
        if (position < 0) {
            return null;
        }
        else {
            if (position > 0) {
                iterator = iskip(iterator, position);
            }
            return iterator()[0];
        }
    }
    TS.iat = iat;
    /**
     * Chain an iterator of iterators.
     *
     * This will yield values from the first yielded iterator, then the second one, and so on...
     */
    function ichainit(iterators) {
        return function () {
            var _a = iterators(), iterators_head = _a[0], iterators_tail = _a[1];
            if (iterators_head == null) {
                return TS.IEND;
            }
            else {
                var _b = iterators_head(), head = _b[0], tail = _b[1];
                while (head == null) {
                    _c = iterators_tail(), iterators_head = _c[0], iterators_tail = _c[1];
                    if (iterators_head == null) {
                        break;
                    }
                    _d = iterators_head(), head = _d[0], tail = _d[1];
                }
                return [head, ichain(tail, ichainit(iterators_tail))];
            }
            var _c, _d;
        };
    }
    TS.ichainit = ichainit;
    /**
     * Chain iterators.
     *
     * This will yield values from the first iterator, then the second one, and so on...
     */
    function ichain() {
        var iterators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            iterators[_i] = arguments[_i];
        }
        if (iterators.length == 0) {
            return TS.IEMPTY;
        }
        else {
            return ichainit(iarray(iterators));
        }
    }
    TS.ichain = ichain;
    /**
     * Wrap an iterator, calling *onstart* when the first value of the wrapped iterator is yielded.
     */
    function ionstart(iterator, onstart) {
        return function () {
            var _a = iterator(), head = _a[0], tail = _a[1];
            if (head !== null) {
                onstart();
            }
            return [head, tail];
        };
    }
    /**
     * Iterator that repeats the same value.
     */
    function irepeat(value, count) {
        if (count === void 0) { count = -1; }
        return iloop(iarray([value]), count);
    }
    TS.irepeat = irepeat;
    /**
     * Loop an iterator for a number of times.
     *
     * If count is negative, if will loop forever (infinite iterator).
     *
     * onloop may be used to know when the iterator resets.
     */
    function iloop(base, count, onloop) {
        if (count === void 0) { count = -1; }
        if (count == 0) {
            return TS.IEMPTY;
        }
        else {
            var next_1 = onloop ? ionstart(base, onloop) : base;
            return ichainit(function () { return [base, iarray([iloop(next_1, count - 1)])]; });
        }
    }
    TS.iloop = iloop;
    /**
     * Iterator version of "map".
     */
    function imap(iterator, mapfunc) {
        return function () {
            var _a = iterator(), head = _a[0], tail = _a[1];
            if (head === null) {
                return TS.IEND;
            }
            else {
                return [mapfunc(head), imap(tail, mapfunc)];
            }
        };
    }
    TS.imap = imap;
    /**
     * Iterator version of "reduce".
     */
    function ireduce(iterator, reduce, init) {
        var result = init;
        iforeach(iterator, function (item) {
            result = reduce(result, item);
        });
        return result;
    }
    TS.ireduce = ireduce;
    /**
     * Iterator version of "filter".
     */
    function ifilter(iterator, filterfunc) {
        return function () {
            var value;
            _a = iterator(), value = _a[0], iterator = _a[1];
            while (value !== null && !filterfunc(value)) {
                _b = iterator(), value = _b[0], iterator = _b[1];
            }
            return [value, ifilter(iterator, filterfunc)];
            var _a, _b;
        };
    }
    TS.ifilter = ifilter;
    /**
     * Combine two iterators.
     *
     * This iterates through the second one several times, so if one iterator may be infinite,
     * it should be the first one.
     */
    function icombine(it1, it2) {
        return ichainit(imap(it1, function (v1) { return imap(it2, function (v2) { return [v1, v2]; }); }));
    }
    TS.icombine = icombine;
    /**
     * Advance two iterators at the same time, yielding item pairs
     *
     * Iteration will stop at the first of the two iterators that stops.
     */
    function izip(it1, it2) {
        return function () {
            var _a = it1(), val1 = _a[0], nit1 = _a[1];
            var _b = it2(), val2 = _b[0], nit2 = _b[1];
            if (val1 !== null && val2 !== null) {
                return [[val1, val2], izip(nit1, nit2)];
            }
            else {
                return TS.IEND;
            }
        };
    }
    TS.izip = izip;
    /**
     * Advance two iterators at the same time, yielding item pairs (greedy version)
     *
     * Iteration will stop when both iterators are consumed, returning partial couples (null in the peer) if needed.
     */
    function izipg(it1, it2) {
        return function () {
            var _a = it1(), val1 = _a[0], nit1 = _a[1];
            var _b = it2(), val2 = _b[0], nit2 = _b[1];
            if (val1 === null && val2 === null) {
                return TS.IEND;
            }
            else {
                return [[val1, val2], izipg(nit1, nit2)];
            }
        };
    }
    TS.izipg = izipg;
    /**
     * Partition in two iterators, one with values that pass the predicate, the other with values that don't
     */
    function ipartition(it, predicate) {
        return [ifilter(it, predicate), ifilter(it, function (x) { return !predicate(x); })];
    }
    TS.ipartition = ipartition;
    /**
     * Yield items from an iterator only once.
     *
     * Beware that even if this function is not materializing, it keeps track of yielded item, and may choke on
     * infinite or very long streams. Thus, no more than *limit* items will be yielded (an error is thrown
     * when this limit is reached).
     *
     * This function is O(n²)
     */
    function iunique(it, limit) {
        if (limit === void 0) { limit = 1000000; }
        var done = [];
        return ifilter(it, function (item) {
            if (TS.contains(done, item)) {
                return false;
            }
            else if (done.length >= limit) {
                throw new Error("Unique count limit on iterator");
            }
            else {
                done.push(item);
                return true;
            }
        });
    }
    TS.iunique = iunique;
    /**
     * Common reduce shortcuts
     */
    TS.isum = function (iterator) { return ireduce(iterator, function (a, b) { return a + b; }, 0); };
    TS.icat = function (iterator) { return ireduce(iterator, function (a, b) { return a + b; }, ""); };
    TS.imin = function (iterator) { return ireduce(iterator, Math.min, Infinity); };
    TS.imax = function (iterator) { return ireduce(iterator, Math.max, -Infinity); };
})(TS || (TS = {}));
var TS;
(function (TS) {
    describe("RandomGenerator", function () {
        it("produces floats", function () {
            var gen = new TS.RandomGenerator();
            var i = 100;
            while (i--) {
                var value = gen.random();
                expect(value).not.toBeLessThan(0);
                expect(value).toBeLessThan(1);
            }
        });
        it("produces integers", function () {
            var gen = new TS.RandomGenerator();
            var i = 100;
            while (i--) {
                var value = gen.randInt(5, 12);
                expect(Math.round(value)).toEqual(value);
                expect(value).toBeGreaterThan(4);
                expect(value).toBeLessThan(13);
            }
        });
        it("chooses from an array", function () {
            var gen = new TS.RandomGenerator();
            expect(gen.choice([5])).toEqual(5);
            var i = 100;
            while (i--) {
                var value = gen.choice(["test", "thing"]);
                expect(["thing", "test"]).toContain(value);
            }
        });
        it("samples from an array", function () {
            var gen = new TS.RandomGenerator();
            var i = 100;
            while (i-- > 1) {
                var input = [1, 2, 3, 4, 5];
                var sample = gen.sample(input, i % 5 + 1);
                expect(sample.length).toBe(i % 5 + 1);
                sample.forEach(function (num, idx) {
                    expect(input).toContain(num);
                    expect(sample.filter(function (ival, iidx) { return iidx != idx; })).not.toContain(num);
                });
            }
        });
        it("choose from weighted ranges", function () {
            var gen = new TS.RandomGenerator();
            expect(gen.weighted([])).toEqual(-1);
            expect(gen.weighted([1])).toEqual(0);
            expect(gen.weighted([0, 1, 0])).toEqual(1);
            expect(gen.weighted([0, 12, 0])).toEqual(1);
            gen = new TS.SkewedRandomGenerator([0, 0.5, 0.7, 0.8, 0.9999]);
            expect(gen.weighted([4, 3, 0, 2, 1])).toEqual(0);
            expect(gen.weighted([4, 3, 0, 2, 1])).toEqual(1);
            expect(gen.weighted([4, 3, 0, 2, 1])).toEqual(3);
            expect(gen.weighted([4, 3, 0, 2, 1])).toEqual(3);
            expect(gen.weighted([4, 3, 0, 2, 1])).toEqual(4);
        });
        it("can be skewed", function () {
            var gen = new TS.SkewedRandomGenerator([0, 0.5, 0.2, 0.9]);
            expect(gen.random()).toEqual(0);
            expect(gen.random()).toEqual(0.5);
            expect(gen.randInt(4, 8)).toEqual(5);
            expect(gen.random()).toEqual(0.9);
            var value = gen.random();
            expect(value).not.toBeLessThan(0);
            expect(value).toBeLessThan(1);
            gen = new TS.SkewedRandomGenerator([0.7], true);
            expect(gen.random()).toEqual(0.7);
            expect(gen.random()).toEqual(0.7);
            expect(gen.random()).toEqual(0.7);
        });
    });
})(TS || (TS = {}));
var TS;
(function (TS) {
    /*
     * Random generator.
     */
    var RandomGenerator = (function () {
        function RandomGenerator() {
            /**
             * Get a random number in the (0.0 included -> 1.0 excluded) range
             */
            this.random = Math.random;
        }
        RandomGenerator.prototype.postUnserialize = function () {
            this.random = Math.random;
        };
        /**
         * Get a random number in the (*from* included -> *to* included) range
         */
        RandomGenerator.prototype.randInt = function (from, to) {
            return Math.floor(this.random() * (to - from + 1)) + from;
        };
        /**
         * Choose a random item in an array
         */
        RandomGenerator.prototype.choice = function (input) {
            return input[this.randInt(0, input.length - 1)];
        };
        /**
         * Choose a random sample of items from an array
         */
        RandomGenerator.prototype.sample = function (input, count) {
            var minput = input.slice();
            var result = [];
            while (count--) {
                var idx = this.randInt(0, minput.length - 1);
                result.push(minput[idx]);
                minput.splice(idx, 1);
            }
            return result;
        };
        /**
         * Get a random boolean (coin toss)
         */
        RandomGenerator.prototype.bool = function () {
            return this.randInt(0, 1) == 0;
        };
        /**
         * Get the range in which the number falls, ranges being weighted
         */
        RandomGenerator.prototype.weighted = function (weights) {
            if (weights.length == 0) {
                return -1;
            }
            var total = TS.sum(weights);
            if (total == 0) {
                return 0;
            }
            else {
                var cumul_1 = 0;
                weights = weights.map(function (weight) {
                    cumul_1 += weight / total;
                    return cumul_1;
                });
                var r = this.random();
                for (var i = 0; i < weights.length; i++) {
                    if (r < weights[i]) {
                        return i;
                    }
                }
                return weights.length - 1;
            }
        };
        return RandomGenerator;
    }());
    RandomGenerator.global = new RandomGenerator();
    TS.RandomGenerator = RandomGenerator;
    /*
     * Random generator that produces a series of fixed numbers before going back to random ones.
     */
    var SkewedRandomGenerator = (function (_super) {
        __extends(SkewedRandomGenerator, _super);
        function SkewedRandomGenerator(suite, loop) {
            if (loop === void 0) { loop = false; }
            var _this = _super.call(this) || this;
            _this.i = 0;
            _this.random = function () {
                var result = _this.suite[_this.i];
                _this.i += 1;
                if (_this.loop && _this.i == _this.suite.length) {
                    _this.i = 0;
                }
                return (typeof result == "undefined") ? Math.random() : result;
            };
            _this.suite = suite;
            _this.loop = loop;
            return _this;
        }
        return SkewedRandomGenerator;
    }(RandomGenerator));
    TS.SkewedRandomGenerator = SkewedRandomGenerator;
})(TS || (TS = {}));
var TS;
(function (TS) {
    var Specs;
    (function (Specs) {
        var TestSerializerObj1 = (function () {
            function TestSerializerObj1(a) {
                if (a === void 0) { a = 0; }
                this.a = a;
            }
            return TestSerializerObj1;
        }());
        Specs.TestSerializerObj1 = TestSerializerObj1;
        var TestSerializerObj2 = (function () {
            function TestSerializerObj2() {
                this.a = function () { return 1; };
                this.b = [function (obj) { return 2; }];
            }
            return TestSerializerObj2;
        }());
        Specs.TestSerializerObj2 = TestSerializerObj2;
        var TestSerializerObj3 = (function () {
            function TestSerializerObj3() {
                this.a = [1, 2];
            }
            TestSerializerObj3.prototype.postUnserialize = function () {
                TS.remove(this.a, 2);
            };
            return TestSerializerObj3;
        }());
        Specs.TestSerializerObj3 = TestSerializerObj3;
        describe("Serializer", function () {
            function checkReversability(obj, namespace) {
                if (namespace === void 0) { namespace = TS.Specs; }
                var serializer = new TS.Serializer(TS.Specs);
                var data = serializer.serialize(obj);
                serializer = new TS.Serializer(TS.Specs);
                var loaded = serializer.unserialize(data);
                expect(loaded).toEqual(obj);
                return loaded;
            }
            it("serializes simple objects", function () {
                var obj = {
                    "a": 5,
                    "b": null,
                    "c": [{ "a": 2 }, "test"]
                };
                checkReversability(obj);
            });
            it("restores objects constructed from class", function () {
                var loaded = checkReversability(new TestSerializerObj1(5));
                expect(loaded.a).toEqual(5);
                expect(loaded instanceof TestSerializerObj1).toBe(true, "not a TestSerializerObj1 instance");
            });
            it("stores one version of the same object", function () {
                var a = new TestSerializerObj1(8);
                var b = new TestSerializerObj1(8);
                var c = {
                    'r': a,
                    's': ["test", a],
                    't': a,
                    'u': b
                };
                var loaded = checkReversability(c);
                expect(loaded.t).toBe(loaded.r);
                expect(loaded.s[1]).toBe(loaded.r);
                expect(loaded.u).not.toBe(loaded.r);
            });
            it("handles circular references", function () {
                var a = { b: {} };
                a.b.c = a;
                var loaded = checkReversability(a);
            });
            it("ignores some classes", function () {
                var serializer = new TS.Serializer(TS.Specs);
                serializer.addIgnoredClass("TestSerializerObj1");
                var data = serializer.serialize({ a: 5, b: new TestSerializerObj1() });
                var loaded = serializer.unserialize(data);
                expect(loaded).toEqual({ a: 5, b: undefined });
            });
            it("ignores functions", function () {
                var serializer = new TS.Serializer(TS.Specs);
                var data = serializer.serialize({ obj: new TestSerializerObj2() });
                var loaded = serializer.unserialize(data);
                var expected = new TestSerializerObj2();
                expected.a = undefined;
                expected.b[0] = undefined;
                expect(loaded).toEqual({ obj: expected });
            });
            it("calls specific postUnserialize", function () {
                var serializer = new TS.Serializer(TS.Specs);
                var data = serializer.serialize({ obj: new TestSerializerObj3() });
                var loaded = serializer.unserialize(data);
                var expected = new TestSerializerObj3();
                expected.a = [1];
                expect(loaded).toEqual({ obj: expected });
            });
            it("finds TS namespace, even from sub-namespace", function () {
                checkReversability(new TS.Timer());
                checkReversability(new TS.RandomGenerator());
            });
        });
    })(Specs = TS.Specs || (TS.Specs = {}));
})(TS || (TS = {}));
var TS;
(function (TS) {
    function isObject(value) {
        return value instanceof Object && !Array.isArray(value);
    }
    /**
     * A typescript object serializer.
     */
    var Serializer = (function () {
        function Serializer(namespace) {
            if (namespace === void 0) { namespace = TS; }
            this.ignored = [];
            this.namespace = namespace;
        }
        /**
         * Add a class to the ignore list
         */
        Serializer.prototype.addIgnoredClass = function (name) {
            this.ignored.push(name);
        };
        /**
         * Construct an object from a constructor name
         */
        Serializer.prototype.constructObject = function (ctype) {
            if (ctype == "Object") {
                return {};
            }
            else {
                var cl = this.namespace[ctype];
                if (cl) {
                    return Object.create(cl.prototype);
                }
                else {
                    cl = TS[ctype];
                    if (cl) {
                        return Object.create(cl.prototype);
                    }
                    else {
                        console.error("Can't find class", ctype);
                        return {};
                    }
                }
            }
        };
        /**
         * Serialize an object to a string
         */
        Serializer.prototype.serialize = function (obj) {
            var _this = this;
            // Collect objects
            var objects = [];
            var stats = {};
            TS.crawl(obj, function (value) {
                if (isObject(value)) {
                    var vtype = TS.classname(value);
                    if (vtype != "" && _this.ignored.indexOf(vtype) < 0) {
                        stats[vtype] = (stats[vtype] || 0) + 1;
                        TS.add(objects, value);
                        return value;
                    }
                    else {
                        return TS.STOP_CRAWLING;
                    }
                }
                else {
                    return value;
                }
            });
            //console.log("Serialize stats", stats);
            // Serialize objects list, transforming deeper objects to links
            var fobjects = objects.map(function (value) { return ({ $c: TS.classname(value), $f: TS.merge({}, value) }); });
            return JSON.stringify(fobjects, function (key, value) {
                if (key != "$f" && isObject(value) && !value.hasOwnProperty("$c") && !value.hasOwnProperty("$i")) {
                    return { $i: objects.indexOf(value) };
                }
                else {
                    return value;
                }
            });
        };
        /**
         * Unserialize a string to an object
         */
        Serializer.prototype.unserialize = function (data) {
            var _this = this;
            // Unserialize objects list
            var fobjects = JSON.parse(data);
            // Reconstruct objects
            var objects = fobjects.map(function (objdata) { return TS.merge(_this.constructObject(objdata['$c']), objdata['$f']); });
            // Reconnect links
            TS.crawl(objects, function (value) {
                if (value instanceof Object && value.hasOwnProperty('$i')) {
                    return objects[value['$i']];
                }
                else {
                    return value;
                }
            }, true);
            // Post unserialize hooks
            TS.crawl(objects[0], function (value) {
                if (value instanceof Object && typeof value.postUnserialize == "function") {
                    value.postUnserialize();
                }
            });
            // First object was the root
            return objects[0];
        };
        return Serializer;
    }());
    TS.Serializer = Serializer;
})(TS || (TS = {}));
var TS;
(function (TS) {
    var Specs;
    (function (Specs) {
        describe("Timer", function () {
            beforeEach(function () {
                jasmine.clock().install();
            });
            afterEach(function () {
                jasmine.clock().uninstall();
            });
            it("schedules and cancels future calls", function () {
                var timer = new TS.Timer();
                var called = [];
                var callback = function (item) { return called.push(item); };
                var s1 = timer.schedule(50, function () { return callback(1); });
                var s2 = timer.schedule(150, function () { return callback(2); });
                var s3 = timer.schedule(250, function () { return callback(3); });
                expect(called).toEqual([]);
                jasmine.clock().tick(100);
                expect(called).toEqual([1]);
                timer.cancel(s1);
                expect(called).toEqual([1]);
                jasmine.clock().tick(100);
                expect(called).toEqual([1, 2]);
                timer.cancel(s3);
                jasmine.clock().tick(100);
                expect(called).toEqual([1, 2]);
                jasmine.clock().tick(1000);
                expect(called).toEqual([1, 2]);
            });
            it("may cancel all scheduled", function () {
                var timer = new TS.Timer();
                var called = [];
                var callback = function (item) { return called.push(item); };
                timer.schedule(150, function () { return callback(1); });
                timer.schedule(50, function () { return callback(2); });
                timer.schedule(500, function () { return callback(3); });
                expect(called).toEqual([]);
                jasmine.clock().tick(100);
                expect(called).toEqual([2]);
                jasmine.clock().tick(100);
                expect(called).toEqual([2, 1]);
                timer.cancelAll();
                jasmine.clock().tick(1000);
                expect(called).toEqual([2, 1]);
                timer.schedule(50, function () { return callback(4); });
                timer.schedule(150, function () { return callback(5); });
                jasmine.clock().tick(100);
                expect(called).toEqual([2, 1, 4]);
                timer.cancelAll(true);
                jasmine.clock().tick(100);
                expect(called).toEqual([2, 1, 4]);
                timer.schedule(50, function () { return callback(6); });
                jasmine.clock().tick(100);
                expect(called).toEqual([2, 1, 4]);
            });
            it("may switch to synchronous mode", function () {
                var timer = new TS.Timer(true);
                var called = [];
                var callback = function (item) { return called.push(item); };
                timer.schedule(50, function () { return callback(1); });
                expect(called).toEqual([1]);
            });
        });
    })(Specs = TS.Specs || (TS.Specs = {}));
})(TS || (TS = {}));
var TS;
(function (TS) {
    /**
     * Timing utility.
     *
     * This extends the standard setTimeout feature.
     */
    var Timer = (function () {
        function Timer(sync) {
            if (sync === void 0) { sync = false; }
            this.sync = false;
            this.locked = false;
            this.scheduled = [];
            this.sync = sync;
        }
        /**
         * Return true if the timer is synchronous
         */
        Timer.prototype.isSynchronous = function () {
            return this.sync;
        };
        /**
         * Cancel all scheduled calls.
         *
         * If lock=true, no further scheduling will be allowed.
         */
        Timer.prototype.cancelAll = function (lock) {
            if (lock === void 0) { lock = false; }
            this.locked = lock;
            var scheduled = this.scheduled;
            this.scheduled = [];
            scheduled.forEach(function (handle) { return clearTimeout(handle); });
        };
        /**
         * Cancel a scheduled callback.
         */
        Timer.prototype.cancel = function (scheduled) {
            if (TS.remove(this.scheduled, scheduled)) {
                clearTimeout(scheduled);
            }
        };
        /**
         * Schedule a callback to be called later.
         */
        Timer.prototype.schedule = function (delay, callback) {
            var _this = this;
            if (this.locked) {
                return null;
            }
            else if (this.sync || delay <= 0) {
                callback();
                return null;
            }
            else {
                var handle_1 = setTimeout(function () {
                    TS.remove(_this.scheduled, handle_1);
                    callback();
                }, delay);
                TS.add(this.scheduled, handle_1);
                return handle_1;
            }
        };
        Timer.prototype.postUnserialize = function () {
            this.scheduled = [];
        };
        return Timer;
    }());
    // Global timer shared by the whole project
    Timer.global = new Timer();
    // Global synchronous timer for unit tests
    Timer.synchronous = new Timer(true);
    TS.Timer = Timer;
})(TS || (TS = {}));
var TS;
(function (TS) {
    describe("Tools", function () {
        it("checks for null value", function () {
            var value = 5;
            expect(TS.nn(value)).toBe(5);
            value = 0;
            expect(TS.nn(value)).toBe(0);
            value = null;
            expect(function () { return TS.nn(value); }).toThrowError("Null value");
        });
        it("removes null values from arrays", function () {
            var value = [];
            expect(TS.nna(value)).toEqual([]);
            value = [1, 2];
            expect(TS.nna(value)).toEqual([1, 2]);
            value = [1, null, 3];
            expect(TS.nna(value)).toEqual([1, 3]);
        });
        it("compare values", function () {
            expect(TS.cmp(8, 5)).toBe(1);
            expect(TS.cmp(5, 8)).toBe(-1);
            expect(TS.cmp(5, 5)).toBe(0);
            expect(TS.cmp("c", "b")).toBe(1);
            expect(TS.cmp("b", "c")).toBe(-1);
            expect(TS.cmp("b", "b")).toBe(0);
        });
        it("clamp values in a range", function () {
            expect(TS.clamp(5, 3, 8)).toBe(5);
            expect(TS.clamp(1, 3, 8)).toBe(3);
            expect(TS.clamp(10, 3, 8)).toBe(8);
        });
        it("interpolates values linearly", function () {
            expect(TS.lerp(0, 0, 4)).toBe(0);
            expect(TS.lerp(0.5, 0, 4)).toBe(2);
            expect(TS.lerp(1, 0, 4)).toBe(4);
            expect(TS.lerp(2, 0, 4)).toBe(8);
            expect(TS.lerp(-1, 0, 4)).toBe(-4);
            expect(TS.lerp(0.5, 3, 4)).toBe(3.5);
            expect(TS.lerp(0.5, 3, 3)).toBe(3);
            expect(TS.lerp(0.5, 3, 2)).toBe(2.5);
        });
        it("copies arrays", function () {
            var array = [1, 2, "test", null, { "a": 5 }];
            var copied = TS.acopy(array);
            expect(copied).toEqual(array);
            expect(copied).not.toBe(array);
            expect(copied[4]).toBe(array[4]);
            expect(array[2]).toEqual("test");
            expect(copied[2]).toEqual("test");
            array[2] = "notest";
            expect(array[2]).toEqual("notest");
            expect(copied[2]).toEqual("test");
            copied[2] = "ok";
            expect(array[2]).toEqual("notest");
            expect(copied[2]).toEqual("ok");
            expect(array.length).toBe(5);
            expect(copied.length).toBe(5);
            TS.remove(copied, 2);
            expect(array.length).toBe(5);
            expect(copied.length).toBe(4);
        });
        it("iterates through sorted arrays", function () {
            var result = [];
            TS.itersorted([1, 2, 3], function (item) { return item; }, function (item) { return result.push(item); });
            expect(result).toEqual([1, 2, 3]);
            result = [];
            TS.itersorted([1, 2, 3], function (item) { return -item; }, function (item) { return result.push(item); });
            expect(result).toEqual([3, 2, 1]);
        });
        it("checks if an array contains an item", function () {
            expect(TS.contains([], 5)).toBe(false);
            expect(TS.contains([3, 5, 8], 5)).toBe(true);
            expect(TS.contains([3, 5, 8], 4)).toBe(false);
            expect(TS.contains([5, 5, 5], 5)).toBe(true);
            expect(TS.contains([3, null, 8], null)).toBe(true);
            expect(TS.contains(["a", "b"], "b")).toBe(true);
            expect(TS.contains(["a", "b"], "c")).toBe(false);
        });
        it("capitalizes strings", function () {
            expect(TS.capitalize("test")).toEqual("Test");
            expect(TS.capitalize("test second")).toEqual("Test second");
        });
        it("produces range of numbers", function () {
            expect(TS.range(-1)).toEqual([]);
            expect(TS.range(0)).toEqual([]);
            expect(TS.range(1)).toEqual([0]);
            expect(TS.range(2)).toEqual([0, 1]);
            expect(TS.range(5)).toEqual([0, 1, 2, 3, 4]);
        });
        it("zips arrays", function () {
            expect(TS.zip([], [])).toEqual([]);
            expect(TS.zip([], [1])).toEqual([]);
            expect(TS.zip([0], [1])).toEqual([[0, 1]]);
            expect(TS.zip([0, 2, 4], [1, 3])).toEqual([[0, 1], [2, 3]]);
            expect(TS.zip([0, 1], ["a", "b"])).toEqual([[0, "a"], [1, "b"]]);
        });
        it("partitions arrays by a predicate", function () {
            expect(TS.binpartition([], function (i) { return i % 2 == 0; })).toEqual([[], []]);
            expect(TS.binpartition([1, 2, 3, 4], function (i) { return i % 2 == 0; })).toEqual([[2, 4], [1, 3]]);
        });
        it("produces neighbor tuples from array", function () {
            expect(TS.neighbors([])).toEqual([]);
            expect(TS.neighbors([1])).toEqual([]);
            expect(TS.neighbors([1, 2])).toEqual([[1, 2]]);
            expect(TS.neighbors([1, 2, 3])).toEqual([[1, 2], [2, 3]]);
            expect(TS.neighbors([1, 2, 3, 4])).toEqual([[1, 2], [2, 3], [3, 4]]);
            expect(TS.neighbors([], true)).toEqual([]);
            expect(TS.neighbors([1], true)).toEqual([[1, 1]]);
            expect(TS.neighbors([1, 2], true)).toEqual([[1, 2], [2, 1]]);
            expect(TS.neighbors([1, 2, 3], true)).toEqual([[1, 2], [2, 3], [3, 1]]);
            expect(TS.neighbors([1, 2, 3, 4], true)).toEqual([[1, 2], [2, 3], [3, 4], [4, 1]]);
        });
        it("counts items in array", function () {
            expect(TS.counter([])).toEqual([]);
            expect(TS.counter(["a"])).toEqual([["a", 1]]);
            expect(TS.counter(["a", "b"])).toEqual([["a", 1], ["b", 1]]);
            expect(TS.counter(["a", "b", "a"])).toEqual([["a", 2], ["b", 1]]);
        });
        it("find the first array item to pass a predicate", function () {
            expect(TS.first([1, 2, 3], function (i) { return i % 2 == 0; })).toBe(2);
            expect(TS.first([1, 2, 3], function (i) { return i % 4 == 0; })).toBeNull();
            expect(TS.any([1, 2, 3], function (i) { return i % 2 == 0; })).toBe(true);
            expect(TS.any([1, 2, 3], function (i) { return i % 4 == 0; })).toBe(false);
        });
        it("iterates an object keys and values", function () {
            var array = {
                "a": 1,
                "c": [2.5],
                "b": null
            };
            expect(TS.keys(array)).toEqual(["a", "c", "b"]);
            expect(TS.values(array)).toEqual([1, [2.5], null]);
            var result = {};
            TS.iteritems(array, function (key, value) { result[key] = value; });
            expect(result).toEqual(array);
        });
        it("iterates an enum", function () {
            var Test;
            (function (Test) {
                Test[Test["ZERO"] = 0] = "ZERO";
                Test[Test["ONE"] = 1] = "ONE";
                Test[Test["TWO"] = 2] = "TWO";
            })(Test || (Test = {}));
            ;
            var result = [];
            TS.iterenum(Test, function (item) { return result.push(item); });
            expect(result).toEqual([0, 1, 2]);
        });
        it("create an index from an array", function () {
            expect(TS.index([2, 3, 4], function (i) { return (i - 1).toString(); })).toEqual({ "1": 2, "2": 3, "3": 4 });
        });
        it("add an item in an array", function () {
            var result;
            var array = [1];
            result = TS.add(array, 8);
            expect(array).toEqual([1, 8]);
            expect(result).toBe(true);
            result = TS.add(array, 2);
            expect(array).toEqual([1, 8, 2]);
            expect(result).toBe(true);
            result = TS.add(array, 8);
            expect(array).toEqual([1, 8, 2]);
            expect(result).toBe(false);
        });
        it("removes an item from an array", function () {
            var array = [1, 2, 3];
            var result = TS.remove(array, 1);
            expect(array).toEqual([2, 3]);
            expect(result).toBe(true);
            result = TS.remove(array, 1);
            expect(array).toEqual([2, 3]);
            expect(result).toBe(false);
            result = TS.remove(array, 2);
            expect(array).toEqual([3]);
            expect(result).toBe(true);
            result = TS.remove(array, 3);
            expect(array).toEqual([]);
            expect(result).toBe(true);
            result = TS.remove(array, 3);
            expect(array).toEqual([]);
            expect(result).toBe(false);
        });
        it("checks objects equality", function () {
            expect(TS.equals({}, {})).toBe(true);
            expect(TS.equals({ "a": 1 }, { "a": 1 })).toBe(true);
            expect(TS.equals({ "a": 1 }, { "a": 2 })).toBe(false);
            expect(TS.equals({ "a": 1 }, { "b": 1 })).toBe(false);
            expect(TS.equals({ "a": 1 }, { "a": null })).toBe(false);
        });
        it("combinate filters", function () {
            var filter = TS.andfilter(function (item) { return item > 5; }, function (item) { return item < 12; });
            expect(filter(4)).toBe(false);
            expect(filter(5)).toBe(false);
            expect(filter(6)).toBe(true);
            expect(filter(8)).toBe(true);
            expect(filter(11)).toBe(true);
            expect(filter(12)).toBe(false);
            expect(filter(13)).toBe(false);
        });
        it("get a class name", function () {
            var Test = (function () {
                function Test() {
                }
                return Test;
            }());
            var a = new Test();
            expect(TS.classname(a)).toEqual("Test");
        });
        it("find lowest item of an array", function () {
            expect(TS.lowest(["aaa", "b", "cc"], function (s) { return s.length; })).toBe("b");
        });
        it("binds callbacks", function () {
            var Test = (function () {
                function Test() {
                    this.prop = 5;
                }
                Test.prototype.meth = function () {
                    return this.prop + 1;
                };
                return Test;
            }());
            var inst = new Test();
            var double = function (getter) { return getter() * 2; };
            expect(double(inst.meth)).toBeNaN();
            expect(double(TS.bound(inst, "meth"))).toEqual(12);
        });
        it("computes progress between two boundaries", function () {
            expect(TS.progress(-1.0, 0.0, 1.0)).toEqual(0.0);
            expect(TS.progress(0.0, 0.0, 1.0)).toEqual(0.0);
            expect(TS.progress(0.4, 0.0, 1.0)).toEqual(0.4);
            expect(TS.progress(1.8, 0.0, 1.0)).toEqual(1.0);
            expect(TS.progress(1.5, 0.5, 2.5)).toEqual(0.5);
        });
        it("copies full javascript objects", function () {
            var TestObj = (function () {
                function TestObj() {
                    this.a = "test";
                    this.b = { c: 5.1, d: ["unit", "test", 5] };
                }
                TestObj.prototype.get = function () {
                    return this.a;
                };
                return TestObj;
            }());
            var ini = new TestObj();
            var cop = TS.copy(ini);
            expect(cop).not.toBe(ini);
            expect(cop).toEqual(ini);
            expect(cop.get()).toEqual("test");
        });
        it("merges objects", function () {
            expect(TS.merge({}, {})).toEqual({});
            expect(TS.merge({ "a": 1 }, { "b": 2 })).toEqual({ "a": 1, "b": 2 });
            expect(TS.merge({ "a": 1 }, { "a": 3, "b": 2 })).toEqual({ "a": 3, "b": 2 });
        });
        it("crawls through objects", function () {
            var obj = {
                "a": 1,
                "b": "test",
                "c": {
                    "a": [2, "thing", { "a": 3, "b": {} }],
                    "b": null,
                    "c": undefined,
                    "d": false
                }
            };
            /*(<any>obj).jasmineToString = () => "obj1";
            (<any>obj.c).jasmineToString = () => "obj2";
            (<any>obj.c.a[2]).jasmineToString = () => "obj3";
            (<any>obj.c.a[2].b).jasmineToString = () => "obj4";
            (<any>obj.c.a).jasmineToString = () => "array1";*/
            var crawled = [];
            TS.crawl(obj, function (val) { return crawled.push(val); });
            expect(crawled).toEqual([obj, 1, "test", obj.c, obj.c.a, 2, "thing", obj.c.a[2], 3, obj.c.a[2].b, false]);
            expect(obj.a).toEqual(1);
            // replace mode
            TS.crawl(obj, function (val) { return typeof val == "number" ? 5 : val; }, true);
            expect(obj).toEqual({ a: 5, b: "test", c: { a: [5, "thing", { a: 5, b: {} }], b: null, c: undefined, d: false } });
        });
        it("get minimal item of an array", function () {
            expect(TS.min([5, 1, 8])).toEqual(1);
        });
        it("get maximal item of an array", function () {
            expect(TS.max([5, 12, 8])).toEqual(12);
        });
        it("get sum of an array", function () {
            expect(TS.sum([5, 1, 8])).toEqual(14);
        });
        it("get average of an array", function () {
            expect(TS.avg([4, 2, 9])).toEqual(5);
        });
        it("converts to same sign", function () {
            expect(TS.samesign(2, 1)).toEqual(2);
            expect(TS.samesign(2, -1)).toEqual(-2);
            expect(TS.samesign(-2, 1)).toEqual(2);
            expect(TS.samesign(-2, -1)).toEqual(-2);
        });
    });
})(TS || (TS = {}));
/**
 * Various utility functions.
 */
var TS;
(function (TS) {
    /**
     * Check if a value if null, throwing an exception if its the case
     */
    function nn(value) {
        if (value === null) {
            throw new Error("Null value");
        }
        else {
            return value;
        }
    }
    TS.nn = nn;
    /**
     * Remove null values from an array
     */
    function nna(array) {
        return array.filter(function (item) { return item !== null; });
    }
    TS.nna = nna;
    /**
     * Compare operator, that can be used in sort() calls.
     */
    function cmp(a, b) {
        if (a > b) {
            return 1;
        }
        else if (a < b) {
            return -1;
        }
        else {
            return 0;
        }
    }
    TS.cmp = cmp;
    /**
     * Clamp a value in a range.
     */
    function clamp(value, min, max) {
        if (value < min) {
            return min;
        }
        else if (value > max) {
            return max;
        }
        else {
            return value;
        }
    }
    TS.clamp = clamp;
    /**
     * Perform a linear interpolation between two values (factor is between 0 and 1).
     */
    function lerp(factor, min, max) {
        return min + (max - min) * factor;
    }
    TS.lerp = lerp;
    /**
     * Make a shallow copy of an array.
     */
    function acopy(input) {
        return input.slice();
    }
    TS.acopy = acopy;
    /**
     * Call a function for each member of an array, sorted by a key.
     */
    function itersorted(input, keyfunc, callback) {
        var array = acopy(input);
        array.sort(function (item1, item2) { return cmp(keyfunc(item1), keyfunc(item2)); });
        array.forEach(callback);
    }
    TS.itersorted = itersorted;
    /**
     * Capitalize the first letter of an input string.
     */
    function capitalize(input) {
        return input.charAt(0).toLocaleUpperCase() + input.slice(1);
    }
    TS.capitalize = capitalize;
    ;
    /**
     * Check if an array contains an item.
     */
    function contains(array, item) {
        return array.indexOf(item) >= 0;
    }
    TS.contains = contains;
    /**
     * Produce an n-sized array, with integers counting from 0
     */
    function range(n) {
        var result = [];
        for (var i = 0; i < n; i++) {
            result.push(i);
        }
        return result;
    }
    TS.range = range;
    /**
     * Produce an array of couples, build from the common length of two arrays
     */
    function zip(array1, array2) {
        var result = [];
        var n = (array1.length > array2.length) ? array2.length : array1.length;
        for (var i = 0; i < n; i++) {
            result.push([array1[i], array2[i]]);
        }
        return result;
    }
    TS.zip = zip;
    /**
     * Partition a list by a predicate, returning the items that pass the predicate, then the ones that don't pass it
     */
    function binpartition(array, predicate) {
        var pass = [];
        var fail = [];
        array.forEach(function (item) { return (predicate(item) ? pass : fail).push(item); });
        return [pass, fail];
    }
    TS.binpartition = binpartition;
    /**
     * Yields the neighbors tuple list
     */
    function neighbors(array, wrap) {
        if (wrap === void 0) { wrap = false; }
        var result = [];
        if (array.length > 0) {
            var previous = array[0];
            for (var i = 1; i < array.length; i++) {
                result.push([previous, array[i]]);
                previous = array[i];
            }
            if (wrap) {
                result.push([previous, array[0]]);
            }
            return result;
        }
        else {
            return [];
        }
    }
    TS.neighbors = neighbors;
    /**
     * Count each element in an array
     */
    function counter(array, equals) {
        if (equals === void 0) { equals = function (a, b) { return a === b; }; }
        var result = [];
        array.forEach(function (item) {
            var found = first(result, function (iter) { return equals(iter[0], item); });
            if (found) {
                found[1]++;
            }
            else {
                result.push([item, 1]);
            }
        });
        return result;
    }
    TS.counter = counter;
    /**
     * Return the first element of the array that matches the predicate, null if not found
     */
    function first(array, predicate) {
        for (var i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                return array[i];
            }
        }
        return null;
    }
    TS.first = first;
    /**
     * Return whether if any element in the array matches the predicate
     */
    function any(array, predicate) {
        return first(array, predicate) != null;
    }
    TS.any = any;
    /**
     * Iterate a list of (key, value) in an object.
     */
    function iteritems(obj, func) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                func(key, obj[key]);
            }
        }
    }
    TS.iteritems = iteritems;
    /**
     * Return the list of keys from an object.
     */
    function keys(obj) {
        var result = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(key);
            }
        }
        return result;
    }
    TS.keys = keys;
    /**
     * Return the list of values from an object.
     */
    function values(obj) {
        var result = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(obj[key]);
            }
        }
        return result;
    }
    TS.values = values;
    /**
     * Iterate an enum values.
     */
    function iterenum(obj, callback) {
        for (var val in obj) {
            var parsed = parseInt(val, 10);
            if (!isNaN(parsed)) {
                callback(parsed);
            }
        }
    }
    TS.iterenum = iterenum;
    /**
     * Create a dictionnary index from a list of objects
     */
    function index(array, keyfunc) {
        var result = {};
        array.forEach(function (obj) { return result[keyfunc(obj)] = obj; });
        return result;
    }
    TS.index = index;
    /**
     * Add an item in a list, only if not already there
     */
    function add(array, item) {
        if (!contains(array, item)) {
            array.push(item);
            return true;
        }
        else {
            return false;
        }
    }
    TS.add = add;
    /**
     * Remove an item from a list if found. Return true if changed.
     */
    function remove(array, item) {
        var idx = array.indexOf(item);
        if (idx >= 0) {
            array.splice(idx, 1);
            return true;
        }
        else {
            return false;
        }
    }
    TS.remove = remove;
    /**
     * Check if two standard objects are equal.
     */
    function equals(obj1, obj2) {
        return JSON.stringify(obj1) == JSON.stringify(obj2);
    }
    TS.equals = equals;
    /**
     * Call a function on any couple formed from combining two arrays.
     */
    function combicall(array1, array2, callback) {
        array1.forEach(function (item1) { return array2.forEach(function (item2) { return callback(item1, item2); }); });
    }
    TS.combicall = combicall;
    /**
     * Combinate two filter functions (predicates), with a boolean and.
     */
    function andfilter(filt1, filt2) {
        return function (item) { return filt1(item) && filt2(item); };
    }
    TS.andfilter = andfilter;
    /**
     * Get the class name of an object.
     */
    function classname(obj) {
        return obj.constructor.name;
    }
    TS.classname = classname;
    /**
     * Get the lowest item of an array, using a mapping function.
     */
    function lowest(array, rating) {
        var rated = array.map(function (item) { return [item, rating(item)]; });
        rated.sort(function (a, b) { return cmp(a[1], b[1]); });
        return rated[0][0];
    }
    TS.lowest = lowest;
    /**
     * Return a function bound to an object.
     *
     * This is useful to pass the bound function as callback directly.
     */
    function bound(obj, func) {
        var attr = obj[func];
        if (attr instanceof Function) {
            return attr.bind(obj);
        }
        else {
            return function () { return attr; };
        }
    }
    TS.bound = bound;
    /**
     * Return a 0.0-1.0 factor of progress between two limits.
     */
    function progress(value, min, max) {
        var result = (value - min) / (max - min);
        return clamp(result, 0.0, 1.0);
    }
    TS.progress = progress;
    /**
     * Copy all fields of an object in another (shallow copy)
     */
    function copyfields(src, dest) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                dest[key] = src[key];
            }
        }
    }
    TS.copyfields = copyfields;
    /**
     * Copy an object (only a shallow copy of immediate properties)
     */
    function copy(object) {
        var objectCopy = Object.create(object.constructor.prototype);
        copyfields(object, objectCopy);
        return objectCopy;
    }
    TS.copy = copy;
    /**
     * Merge an object into another
     */
    function merge(base, incoming) {
        var result = copy(base);
        copyfields(incoming, result);
        return result;
    }
    TS.merge = merge;
    TS.STOP_CRAWLING = {};
    /**
     * Recursively crawl through an object, yielding any defined value found along the way
     *
     * If *replace* is set to true, the current object is replaced (in array or object attribute) by the result of the callback
     *
     * *memo* is used to prevent circular references to be traversed
     */
    function crawl(obj, callback, replace, memo) {
        if (replace === void 0) { replace = false; }
        if (memo === void 0) { memo = []; }
        if (obj instanceof Object && !Array.isArray(obj)) {
            if (memo.indexOf(obj) >= 0) {
                return obj;
            }
            else {
                memo.push(obj);
            }
        }
        if (obj !== undefined && obj !== null && typeof obj != "function") {
            var result = callback(obj);
            if (result === TS.STOP_CRAWLING) {
                return;
            }
            if (Array.isArray(obj)) {
                var subresult = obj.map(function (value) { return crawl(value, callback, replace, memo); });
                if (replace) {
                    subresult.forEach(function (value, index) {
                        obj[index] = value;
                    });
                }
            }
            else if (obj instanceof Object) {
                var subresult_1 = {};
                iteritems(obj, function (key, value) {
                    subresult_1[key] = crawl(value, callback, replace, memo);
                });
                if (replace) {
                    copyfields(subresult_1, obj);
                }
            }
            return result;
        }
        else {
            return obj;
        }
    }
    TS.crawl = crawl;
    /**
     * Return the minimal value of an array
     */
    function min(array) {
        return array.reduce(function (a, b) { return a < b ? a : b; });
    }
    TS.min = min;
    /**
     * Return the maximal value of an array
     */
    function max(array) {
        return array.reduce(function (a, b) { return a > b ? a : b; });
    }
    TS.max = max;
    /**
     * Return the sum of an array
     */
    function sum(array) {
        return array.reduce(function (a, b) { return a + b; }, 0);
    }
    TS.sum = sum;
    /**
     * Return the average of an array
     */
    function avg(array) {
        return sum(array) / array.length;
    }
    TS.avg = avg;
    /**
     * Return value, with the same sign as base
     */
    function samesign(value, base) {
        return Math.abs(value) * (base < 0 ? -1 : 1);
    }
    TS.samesign = samesign;
})(TS || (TS = {}));
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
                    '<li class="walk" min-cost="1">1' +
                    ' <span class="tooltip">Move<br/>Cost: 1 AP / case</span>' +
                    '</li>' +
                    '<li class="fire" min-cost="2">2' +
                    '<span class="tooltip">Fireball<br/>Cost: 2 AP<br/>Range: 4</span>' +
                    '</li>' +
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
                if (this.element.find('.' + name).hasClass('disabled'))
                    return;
                this.deselectAll();
                this.element.find('.' + name).addClass('selected');
                this.menu.game.pointer.update();
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
            Action.prototype.update = function (cost) {
                this.element.find('li').removeClass('disabled');
                this.element.find('li').each(function (e) {
                    if (parseInt($(this).attr('min-cost')) > 0 && parseInt($(this).attr('min-cost')) > cost) {
                        $(this).addClass('disabled');
                    }
                });
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
        var Chat = (function () {
            function Chat(menu, serverManager) {
                var self = this;
                this.menu = menu;
                this.serverManager = serverManager;
                $('body').append('<div class="main-chat"><div class="channels-list"></div><div class="content"></div><input id="main-chat-input" type="text"/></div>');
                this.element = $('.main-chat');
                this.element.find('input').on('focus', function () {
                    self.menu.game.input.enabled = false;
                });
                this.element.find('input').focusout(function () {
                    self.menu.game.input.enabled = true;
                });
                this.element.find('input').on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        self.send();
                    }
                });
                this.element.ready(function () {
                    self.write('################');
                    self.write('<b># Chrono <span style="color:orangered;">A</span>' +
                        '<span style="color:limegreen;">r</span>' +
                        '<span style="color:cyan;">e</span>' +
                        '<span style="color:yellow;">n</span>' +
                        '<span style="color:orangered;">a</span> #</b>');
                    self.write('################<br/>');
                });
                this.currentChannel = 'general';
            }
            Chat.prototype.write = function (msg) {
                this.element.find('.content').append(msg + '<br/>');
                this.element.find('.content').scrollTop(this.element.find('.content')[0].scrollHeight - this.element.find('.content').height());
            };
            Chat.prototype.updatePlayersList = function (data) {
                var self = this;
                var playersList = '<li class="channel-general">General</li>';
                data.content.forEach(function (p) {
                    if (p.token != self.serverManager.token) {
                        playersList += '<li class="channel-player" id="' + p.token + '">' + p.name + '</li>';
                    }
                });
                this.element.find('.channels-list').html('<ul>' + playersList + '</ul>');
                //this.element.find('.channel-player').on('click', function() {
                //
                //});
                $.contextMenu({
                    selector: ".channel-player",
                    items: {
                        duel: {
                            name: "Provoquer en duel", callback: function (key, opt) {
                                var token = opt.$trigger.attr("id");
                                self.serverManager.request('ASK_DUEL', token);
                                self.write('<span class="notification">La demande a été envoyée à ' + opt.$trigger.html() + '</span>');
                            }
                        }
                    }
                });
                this.selectChannel(this.currentChannel);
            };
            Chat.prototype.send = function () {
                var self = this;
                this.serverManager.send({
                    name: self.serverManager.login,
                    content: this.element.find('input').val()
                }).then(function (res) {
                    self.element.find('input').val('');
                });
            };
            Chat.prototype.selectChannel = function (name) {
                this.element.find('.channels-list').find('li').removeClass('selected');
                this.element.find('.channels-list').find('.channel-' + name).addClass('selected');
            };
            return Chat;
        }());
        UI.Chat = Chat;
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
        var Dialog = (function () {
            function Dialog(menu) {
                var self = this;
                this.menu = menu;
                $('body').append('<div id="dialog-confirm" class="ui-dialog" title=""><p></p></div>');
                this.element = $('#dialog-confirm');
            }
            Dialog.prototype.show = function (title, message, confirmTitle, cancelTitle, confirmFunction, cancelFunction) {
                $("#dialog-confirm").attr('title', title);
                $("#dialog-confirm p").html(message);
                $("#dialog-confirm").dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: [
                        {
                            text: confirmTitle,
                            click: confirmFunction
                        },
                        {
                            text: cancelTitle,
                            click: cancelFunction
                        }
                    ]
                });
            };
            return Dialog;
        }());
        UI.Dialog = Dialog;
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
        var IngameMenu = (function () {
            function IngameMenu(menu) {
                var self = this;
                this.menu = menu;
                this.menu.element.append('<div class="ui-ingame-menu"><a class="menu-icon"></a></div>');
                this.element = this.menu.element.find('.ui-ingame-menu');
                this.element.find('.menu-icon').on('click', function () {
                    self.showOverlay();
                    self.menu.element.append('<div class="ui-popin">' +
                        '<a class="close">x</a>' +
                        '<a class="button quit">Quit</a>' +
                        '</div>');
                    self.menu.element.find('.close').on('click', function () {
                        self.menu.element.find('.ui-overlay').remove();
                        self.menu.element.find('.ui-popin').remove();
                    });
                    self.menu.element.find('.button.quit').on('click', function () {
                        self.menu.game.state.start('menu');
                    });
                });
            }
            IngameMenu.prototype.showOverlay = function () {
                this.menu.element.append('<div class="ui-overlay"></div>');
            };
            IngameMenu.prototype.gameOver = function (msg) {
                var self = this;
                this.showOverlay();
                this.menu.element.append('<div class="ui-popin">' +
                    '<a class="button">' + msg + '</a>' +
                    '<a class="button">-</a>' +
                    '<a class="button quit">Quit</a>' +
                    '</div>');
                this.menu.element.find('.button.quit').on('click', function () {
                    self.menu.game.state.start('menu');
                });
            };
            IngameMenu.prototype.show = function (msg) {
                var self = this;
                this.showOverlay();
                this.menu.element.append('<div class="ui-popin">' +
                    '<a class="button">' + msg + '</a>' +
                    '</div>');
                this.menu.element.find('.button.quit').on('click', function () {
                    self.menu.game.state.start('menu');
                });
            };
            IngameMenu.prototype.close = function () {
                this.menu.element.find('.ui-overlay').remove();
                this.menu.element.find('.ui-popin').remove();
            };
            return IngameMenu;
        }());
        UI.IngameMenu = IngameMenu;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var KeyManager = (function () {
            function KeyManager(menu) {
                this.menu = menu;
                this.setEvents();
            }
            KeyManager.prototype.setEvents = function () {
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
                this.pKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.P);
                this.pKey.onDown.add(this.pKeyPress, this, 0, this.menu);
                this.oneKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.ONE);
                this.oneKey.onDown.add(this.oneKeyPress, this, 0, this.menu);
                this.twoKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.TWO);
                this.twoKey.onDown.add(this.twoKeyPress, this, 0, this.menu);
            };
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
            KeyManager.prototype.pKeyPress = function (self, uiManager) {
                if (self.altKey) {
                    uiManager.game.hideProjections = !uiManager.game.hideProjections;
                }
            };
            KeyManager.prototype.oneKeyPress = function (self, uiManager) {
                if (self.altKey) {
                    $('.pawn01').trigger('click');
                }
                else {
                    uiManager.actionUI.select('walk');
                }
            };
            KeyManager.prototype.twoKeyPress = function (self, uiManager) {
                if (self.altKey) {
                    $('.pawn02').trigger('click');
                }
                else {
                    uiManager.actionUI.select('fire');
                }
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
                //this.remove(this.element.find('div[class*="item-"]'));
                this.element.html('');
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
            OrdersNotifications.prototype.update = function (orders) {
                if (orders.length > 0) {
                    for (var i = 0; i < orders.length; i++) {
                        if (this.element.find('.item-' + i).length == 0) {
                            this.add($('<div class="item-' + i + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(orders[i]) + '</div>'));
                        }
                    }
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
            OrdersNotifications.prototype.getMessage = function (order) {
                var activePawn = this.menu.game.turnManager.getActivePawn();
                if (!this.menu.game.stageManager.equalPositions(activePawn.getPosition(), order)) {
                    this.menu.game.stageManager.showPath([order], this.menu.game.pathOrdersTilesGroup, 0xffffff);
                }
                var msg = '<b>' + activePawn._name + '</b>';
                if (order.action == 'move') {
                    msg += ' se déplacera en ' + order.x + ', ' + order.y;
                }
                else if (order.action == 'cast') {
                    msg += ' lancera une boule de feu vers ' + this.directionMapping[order.direction];
                }
                else if (order.action == 'stand') {
                    msg += ' restera en position ' + order.x + ', ' + order.y + ' et surveillera vers ' + this.directionMapping[order.direction];
                }
                return '<span style="color:#ffffff;">' + msg + '</span>';
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
                // sort for displaying player pawns on top
                var pawns = this.menu.game.pawns.sort(function (p) { return p.team != self.menu.game.playerTeam; });
                for (var i = 0; i < pawns.length; i++) {
                    var pawn = pawns[i];
                    var classColor = pawn.team == self.menu.game.playerTeam ? 0 : 1;
                    html += '<div pawn-index="' + i + '" class="pawn pawn0' + pawn._id + ' ' + pawn.type + ' team-' + classColor + '">' +
                        '<div class="avatar"><div class="picture shiny"></div></div>' +
                        '<div class="name">' + pawn._name + '</div>' +
                        '<div class="infos">' +
                        '<div class="hp">' +
                        '<div class="bar">' +
                        '<div class="content current"></div>' +
                        '<div class="text"><span class="value"></span> / ' + pawn._hpMax + ' HP</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="ap">' +
                        '<div class="bar">' +
                        '<div class="content remaining"></div>' +
                        '<div class="content current"></div>' +
                        '<div class="text"><span class="value"></span> / ' + pawn._apMax + ' AP</div>' +
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
                    this.element.find('.pawn0' + entity._id).toggleClass('dead', !entity.isAlive());
                    this.element.find('.pawn0' + entity._id + ' .infos .hp .value').html(entity.getHp());
                    this.element.find('.pawn0' + entity._id + ' .infos .hp .bar .current').css('width', ((entity.getHp() / entity._hpMax) * 100) + '%');
                    this.element.find('.pawn0' + entity._id + ' .infos .ap .value').html(entity.getAp());
                    this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .current').css('width', ((entity.getAp() / entity._apMax) * 100) + '%');
                    this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .remaining').css('width', '0%');
                }
            };
            PawnsInfos.prototype.showApCost = function (pawn, apCost) {
                var percentRemaining = apCost > 0 ? ((pawn.getAp() / pawn._apMax) * 100) : 0;
                this.element.find('.pawn0' + pawn._id + ' .infos .ap .bar .current').css('width', (((pawn.getAp() - apCost) / pawn._apMax) * 100) + '%');
                this.element.find('.pawn0' + pawn._id + ' .infos .ap .bar .remaining').css('width', percentRemaining + '%');
                this.element.find('.pawn0' + pawn._id + ' .infos .ap .value').html(pawn.getAp() - apCost);
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
            Pointer.prototype.clearHelp = function () {
                var activePawn = this.game.turnManager.getActivePawn();
                this.game.stageManager.clearHelp();
                this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 0);
            };
            Pointer.prototype.update = function () {
                var _this = this;
                var self = this;
                var pointerPosition = this.getPosition();
                this.marker.x = pointerPosition.x * this.game.tileSize;
                this.marker.y = pointerPosition.y * this.game.tileSize;
                if (!self.game.process) {
                    var activePawn_1 = this.game.turnManager.getActivePawn();
                    var position = activePawn_1.getProjectionOrReal().getPosition();
                    var distance = this.game.stageManager.getNbTilesBetween({ 'x': pointerPosition.x, 'y': pointerPosition.y }, { 'x': position.x, 'y': position.y });
                    if (self.game.uiManager.actionUI.canOrderMove()) {
                        this.game.stageManager.canMove(activePawn_1.getProjectionOrReal(), pointerPosition.x, pointerPosition.y, activePawn_1.getAp()).then(function (path) {
                            _this.clearHelp();
                            _this.game.stageManager.showPath(path, self.game.pathTilesGroup);
                            _this.game.stageManager.showPossibleMove(activePawn_1.getProjectionOrReal().getPosition(), activePawn_1.getReal().getAp());
                            _this.game.uiManager.pawnsinfosUI.showApCost(activePawn_1, path.length);
                        }, function (res) {
                            _this.clearHelp();
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
                            this.game.stageManager.clearPath(self.game.pathTilesGroup);
                            if (isInPath) {
                                this.game.stageManager.showPath(path, self.game.pathTilesGroup, 0xfc000f);
                                this.game.uiManager.pawnsinfosUI.showApCost(activePawn_1, 2);
                            }
                        }
                        else {
                            this.clearHelp();
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
                                self.game.signalManager.onActionPlayed.dispatch(activePawn);
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
                                this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 0);
                                this.game.orderManager.add('cast', activePawn, position.x, position.y, activePawn.getProjectionOrReal().getDirection());
                                this.clearHelp();
                                self.game.signalManager.onActionPlayed.dispatch(activePawn);
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
                this.menu.element.append('<div class="ui-timeline-container"></div>');
                this.container = this.menu.element.find('.ui-timeline-container');
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
                    $('.ui-timeline-container .prev, .ui-timeline-container .next').css('opacity', '0');
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
                        $('.ui-timeline-container .prev').css('opacity', '0.2');
                        $('.ui-timeline-container .next').css('opacity', '1');
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
                this.ingamemenuUI = new UI.IngameMenu(this);
                //this.game.pointer.dealWith(this.consolelogsUI.element);
                this.game.pointer.dealWith(this.actionUI.element);
                this.game.pointer.dealWith(this.timeUI.element);
                this.game.pointer.dealWith(this.timelineUI.element);
                this.game.pointer.dealWith(this.directionUI.element);
                this.process = false;
            }
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
                    _this.game.signalManager.turnInitialized.dispatch(pawn);
                });
            };
            UIManager.prototype.endOrderPhase = function () {
                var _this = this;
                if (!this.game.process) {
                    this.game.process = true;
                    this.game.selecting = false;
                    this.game.stageManager.clearPossibleMove();
                    this.game.stageManager.clearPath(this.game.pathTilesGroup);
                    var activePawn_2 = this.game.turnManager.getActivePawn();
                    this.game.turnManager.endTurn().then(function (nextPawn) {
                        _this.game.signalManager.onTurnEnded.dispatch(activePawn_2);
                        if (_this.game.playMode == 'online' && _this.game.turnManager.getRemainingPawns(_this.game.playerTeam).length == 0) {
                            // s'il reste plus de pawn à jouer du playerteam
                            // alors on signale au serveur qu'on a fini la phase de commandement
                            // en lui envoyant les ordres
                            _this.game.serverManager.request('VALID_ORDER_PHASE', {
                                turn: _this.game.turnManager.currentTurnIndex,
                                orders: _this.game.orderManager.getPlayerOrders(_this.game.playerTeam)
                            });
                            _this.ingamemenuUI.show('Waiting for opponent move');
                        }
                        else {
                            if (_this.game.turnManager.getRemainingPawns().length == 0) {
                                var steps = _this.game.orderManager.getSteps();
                                _this.initResolvePhase(steps);
                            }
                            else {
                                _this.initOrderPhase(nextPawn, false);
                            }
                        }
                    });
                }
            };
            UIManager.prototype.initResolvePhase = function (steps) {
                var _this = this;
                this.ingamemenuUI.close();
                this.actionUI.clean();
                this.directionUI.clean();
                this.game.resolveManager.init(steps);
                this.transitionUI.show('Phase de Résolution').then(function (res) {
                    return true;
                }).then(function (res) {
                    _this.pawnsinfosUI.selectAll();
                    _this.game.logManager.add(steps);
                    _this.timelineUI.build(steps.length).then(function (res) {
                        _this.game.resolveManager.processSteps(0);
                    });
                });
            };
            UIManager.prototype.endResolvePhase = function () {
                var self = this;
                for (var i = 0; i < this.game.pawns.length; i++) {
                    this.game.pawns[i].destroyProjection();
                }
                this.game.resolveManager.active = false;
                setTimeout(function () {
                    self.notificationsUI.clean();
                }, 500);
                this.timelineUI.clean();
                this.timeUI.updatePauseFromSelected();
                if (this.game.isOver()) {
                    var msg = this.game.teams[this.game.playerTeam] ? 'You win' : 'You lose';
                    this.ingamemenuUI.gameOver(msg);
                }
                else {
                    this.initOrderPhase(this.game.pawns[0], true);
                }
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
var TacticArena;
(function (TacticArena) {
    var Utils;
    (function (Utils) {
        var Generator = (function () {
            function Generator() {
            }
            Generator.prototype.generate = function (n) {
                if (n === void 0) { n = 5; }
                var letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
                var consonant = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
                var vowel = ['a', 'e', 'i', 'o', 'u'];
                var name = [];
                var numLetters = n;
                var selected;
                var result = '';
                for (var i = 0; i < numLetters; i++) {
                    selected = Math.floor(Math.random() * 26);
                    if (name.length > 2) {
                        var lastLetter = name.length - 1;
                        var penultLetter = name.length - 2;
                        while (name[lastLetter] == selected && name[penultLetter] == selected)
                            selected = Math.floor(Math.random() * 26);
                        if (consonant.indexOf(name[lastLetter]) != -1 && consonant.indexOf(name[penultLetter]) != -1) {
                            selected = Math.floor(Math.random() * 5);
                            name[i] = vowel[selected];
                            continue;
                        }
                    }
                    else {
                        if (vowel.indexOf(name[0]) != -1) {
                            selected = Math.floor(Math.random() * 21);
                            name[i] = consonant[selected];
                            continue;
                        }
                        else if (consonant.indexOf(name[0]) != -1) {
                            selected = Math.floor(Math.random() * 5);
                            name[i] = vowel[selected];
                            continue;
                        }
                    }
                    name[i] = letter[selected];
                }
                if (consonant.indexOf(name[name.length - 1]) != -1 && consonant.indexOf(name[name.length - 2]) != -1) {
                    selected = Math.floor(Math.random() * 5);
                    name[name.length - 1] = vowel[selected];
                }
                result = name.join('');
                result = result.substr(0, 1).toUpperCase() + result.substr(1);
                return result;
            };
            Generator.prototype.serialize = function () {
            };
            return Generator;
        }());
        Utils.Generator = Generator;
    })(Utils = TacticArena.Utils || (TacticArena.Utils = {}));
})(TacticArena || (TacticArena = {}));
//# sourceMappingURL=app.js.map