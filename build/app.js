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
            var _this = this;
            //console.log(window.screen.availHeight * window.devicePixelRatio);
            //Math.round((window.screen.availHeight * window.devicePixelRatio / 1.667) / 32) * 32
            //let height = Math.min(window.screen.availHeight * window.devicePixelRatio, 832);
            var height = window.screen.availHeight * window.devicePixelRatio;
            _this = _super.call(this, {
                width: height / 1.667,
                height: height,
                renderer: headless ? Phaser.HEADLESS : Phaser.AUTO,
                parent: 'game-container'
            }) || this;
            _this.state.add('boot', TacticArena.State.Boot);
            _this.state.add('preload', TacticArena.State.Preload);
            _this.state.add('menu', TacticArena.State.Menu);
            _this.state.add('lobby', TacticArena.State.Lobby);
            _this.state.add('options', TacticArena.State.Options);
            _this.state.add('mainadventure', TacticArena.State.MainAdventure);
            _this.state.add('mainadventurebattle', TacticArena.State.MainAdventureBattle);
            _this.state.add('mainsolooffline', TacticArena.State.MainSoloOffline);
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
    var AiManager = (function () {
        function AiManager(game, team) {
            this.game = game;
            this.team = team;
        }
        AiManager.prototype.getClosestPawn = function (position, enemy) {
            if (enemy === void 0) { enemy = true; }
            var result = null;
            var min_distance = Infinity;
            for (var i = 0; i < this.game.pawns.length; i++) {
                var p = this.game.pawns[i];
                var distance = this.game.stageManager.getNbTilesBetween(position, p.getPosition());
                if (distance > 0 && distance < min_distance && ((p.team != this.team && p.isAlive()) || !enemy)) {
                    result = p;
                    min_distance = distance;
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
                    this.game.orderManager.add(pawn, new TacticArena.Order.Stand(p, direction_1));
                    pawn.setAp(pawn.getAp() - 1);
                }
                if (self.game.stageManager.isFacingAway(p, pawn.getDirection(), targetPosition_1)) {
                    this.game.orderManager.add(pawn, new TacticArena.Order.Fire(p, pawn.getDirection()));
                    pawn.setAp(pawn.getAp() - 2);
                }
                var lastDirection_1 = pawn.getDirection();
                this.game.pathfinder.findPath(p.x, p.y, targetPosition_1.x, targetPosition_1.y, function (path) {
                    if (path && path.length > 0) {
                        path.shift();
                        for (var i = 0; i < path.length; i++) {
                            if (pawn.getAp() > 0) {
                                direction_1 = self.getDirection(p, targetPosition_1);
                                self.game.orderManager.add(pawn, new TacticArena.Order.Move(new TacticArena.Position(path[i].x, path[i].y), direction_1));
                                pawn.setAp(pawn.getAp() - 1);
                                if (lastDirection_1 != direction_1 || i >= path.length - 1) {
                                    lastDirection_1 = direction_1;
                                    self.game.orderManager.add(pawn, new TacticArena.Order.Stand(new TacticArena.Position(path[i].x, path[i].y), direction_1));
                                    pawn.setAp(pawn.getAp() - 1);
                                }
                            }
                        }
                    }
                    //Action.ConfirmOrder.process();
                });
                this.game.pathfinder.calculate();
            }
        };
        return AiManager;
    }());
    TacticArena.AiManager = AiManager;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
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
    TacticArena.LogManager = LogManager;
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
                    spyOn(TacticArena.OrderManager, 'resolutionEsquive').and.callFake(function () {
                        return true;
                    });
                });
                it("nothing is played", function () {
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(2);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, null);
                });
                it("1st one stands same position for 1 step", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Stand(new TacticArena.Position(8, 8), 'E')
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(2);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, null);
                });
                it("1st one moves toward the 2nd for 2 steps", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'E'),
                                new TacticArena.Order.Move(new TacticArena.Position(10, 8), 'E')
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(3);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'move', 'E', { x: 9, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, null);
                    testStep(steps, 2, 0, 1, 'attack', 'E', { x: 9, y: 8 }, 1, 3, true, new TacticArena.Position(10, 8));
                    testStep(steps, 2, 1, 2, 'attack', 'W', { x: 10, y: 8 }, 1, 3, false, null);
                });
                it("both going same position then the first one wants to continue moving", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'E'),
                                new TacticArena.Order.Move(new TacticArena.Position(9, 9), 'E')
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'W')
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(3);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'move', 'E', { x: 8, y: 8 }, 2, 4, true, new TacticArena.Position(9, 8));
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 10, y: 8 }, 2, 4, true, new TacticArena.Position(9, 8));
                    testStep(steps, 2, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 1, 4, false, null);
                    testStep(steps, 2, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 1, 4, false, null);
                });
                it("the first one wants moves in front of the second, then continues moving, facing the other", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'E'),
                                new TacticArena.Order.Move(new TacticArena.Position(9, 9), 'E'),
                                new TacticArena.Order.Move(new TacticArena.Position(10, 8), 'E')
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'move', 'E', { x: 9, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, null);
                    testStep(steps, 2, 0, 1, 'move', 'E', { x: 9, y: 8 }, 1, 3, true, new TacticArena.Position(9, 9));
                    testStep(steps, 2, 1, 2, 'attack', 'W', { x: 10, y: 8 }, 1, 4, false, null);
                    testStep(steps, 3, 0, 1, 'attack', 'E', { x: 9, y: 8 }, 0, 2, false, null);
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 10, y: 8 }, 0, 3, false, null);
                });
                it("the first one wants moves in front of the second, then continues moving, without facing the other", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Stand(new TacticArena.Position(8, 8), 'S'),
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'S'),
                                new TacticArena.Order.Move(new TacticArena.Position(9, 9), 'S')
                            ]
                        }
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'stand', 'S', { x: 8, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, null);
                    testStep(steps, 2, 0, 1, 'move', 'S', { x: 9, y: 8 }, 1, 4, false, null);
                    testStep(steps, 2, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 1, 4, false, null);
                    testStep(steps, 3, 0, 1, 'move', 'S', { x: 9, y: 8 }, 0, 3, true, new TacticArena.Position(9, 9));
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 10, y: 8 }, 0, 4, false, null);
                });
                it("the first one wants moves north then casts to the east while the other moves in the dmg area then comes cac", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(8, 7), 'E'),
                                new TacticArena.Order.Fire(new TacticArena.Position(8, 7), 'E')
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(10, 7), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(9, 7), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(8, 7), 'W')
                            ]
                        },
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'move', 'E', { x: 8, y: 7 }, 2, 4, false, null);
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 10, y: 7 }, 2, 4, false, null);
                    testStep(steps, 2, 0, 1, 'cast', 'E', { x: 8, y: 7 }, 0, 4, false, null);
                    expect(steps[2].stepUnits[0].order.targets).toEqual([currentState.pawns[1]._id]);
                    testStep(steps, 2, 1, 2, 'move', 'W', { x: 9, y: 7 }, 1, 2, false, null);
                    testStep(steps, 3, 0, 1, 'stand', 'E', { x: 8, y: 7 }, 0, 3, false, null);
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 9, y: 7 }, 0, 2, true, new TacticArena.Position(8, 7));
                });
                it("the first one casts to the east while the other moves toward him", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Fire(new TacticArena.Position(8, 8), 'E')
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(8, 8), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(7, 8), 'W')
                            ]
                        },
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'cast', 'E', { x: 8, y: 8 }, 1, 4, false, null);
                    expect(steps[1].stepUnits[0].order.targets).toEqual([currentState.pawns[1]._id]);
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 9, y: 8 }, 2, 2, false, null);
                    testStep(steps, 2, 0, 1, 'attack', 'E', { x: 8, y: 8 }, 0, 3, false, null);
                    testStep(steps, 2, 1, 2, 'attack', 'W', { x: 9, y: 8 }, 1, 1, true, new TacticArena.Position(8, 8));
                    testStep(steps, 3, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 0, 2, false, null);
                    testStep(steps, 3, 1, 2, 'attack', 'W', { x: 9, y: 8 }, 0, 1, false, null);
                });
                it("the first one cast_wind to the east while the other moves and get pushed to where it came from", function () {
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Wind(new TacticArena.Position(8, 8), 'E')
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(8, 8), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(7, 8), 'W')
                            ]
                        },
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(4);
                    expect(steps[0].stepUnits.length).toEqual(2);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'cast_wind', 'E', { x: 8, y: 8 }, 1, 4, false, null);
                    expect(steps[1].stepUnits[0].order.targets).toEqual([{ entity: currentState.pawns[1]._id, moved: { x: 10, y: 8, d: 1 } }]);
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 9, y: 8 }, 2, 3, false, null);
                    testStep(steps, 2, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 0, 4, false, null);
                    testStep(steps, 2, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 1, 3, false, null);
                    testStep(steps, 3, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 0, 4, false, null);
                    testStep(steps, 3, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 0, 3, false, null);
                });
            });
            describe("4 players / Fleerate 0%", function () {
                beforeEach(function () {
                    spyOn(TacticArena.OrderManager, 'resolutionEsquive').and.callFake(function () {
                        return true;
                    });
                    currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 7, 7, 'E', 'skeleton', 3, false, 1, 'Diana'));
                    currentState.pawns.push(new TacticArena.Entity.Pawn(currentState, 12, 7, 'W', 'skeleton', 4, false, 2, 'Oscar'));
                });
                it("with 1 dead - nothing is played", function () {
                    currentState.pawns[2].setHp(0);
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(2);
                    expect(steps[0].stepUnits.length).toEqual(4);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 2, 3, 'dead', 'E', { x: 7, y: 7 }, 0, 0, false, null);
                    testStep(steps, 0, 3, 4, 'stand', 'W', { x: 12, y: 7 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 2, 3, 'dead', 'E', { x: 7, y: 7 }, 0, 0, false, null);
                    testStep(steps, 1, 3, 4, 'stand', 'W', { x: 12, y: 7 }, 2, 4, false, null);
                });
                it("with 1 dead - 4th pawn moves", function () {
                    currentState.pawns[2].setHp(0);
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[3],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(11, 7), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(11, 6), 'W')
                            ]
                        },
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(3);
                    expect(steps[0].stepUnits.length).toEqual(4);
                    testStep(steps, 0, 0, 4, 'stand', 'W', { x: 12, y: 7 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 2, 2, 'stand', 'W', { x: 10, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 3, 3, 'dead', 'E', { x: 7, y: 7 }, 0, 0, false, null);
                    testStep(steps, 1, 0, 4, 'move', 'W', { x: 11, y: 7 }, 2, 4, false, null);
                    testStep(steps, 1, 1, 1, 'stand', 'E', { x: 8, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 2, 2, 'stand', 'W', { x: 10, y: 8 }, 2, 4, false, null);
                    testStep(steps, 1, 3, 3, 'dead', 'E', { x: 7, y: 7 }, 0, 0, false, null);
                    testStep(steps, 2, 0, 4, 'move', 'W', { x: 11, y: 6 }, 1, 4, false, null);
                    testStep(steps, 2, 1, 1, 'stand', 'E', { x: 8, y: 8 }, 1, 4, false, null);
                    testStep(steps, 2, 2, 2, 'stand', 'W', { x: 10, y: 8 }, 1, 4, false, null);
                    testStep(steps, 2, 3, 3, 'dead', 'E', { x: 7, y: 7 }, 0, 0, false, null);
                });
                it("the 1st one cast, the 2nd one dies so it blocks the way and sees its actions cancelled - the 4th pawn moves but is blocked", function () {
                    currentState.pawns[1].setHp(2);
                    currentState.pawns[1]._apMax = 4;
                    currentState.pawns[3]._apMax = 4;
                    currentState.orderManager.orders = [
                        {
                            entity: currentState.pawns[0],
                            list: [
                                new TacticArena.Order.Fire(new TacticArena.Position(8, 8), 'E'),
                                new TacticArena.Order.Move(new TacticArena.Position(7, 8), 'E')
                            ]
                        },
                        {
                            entity: currentState.pawns[1],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'W'),
                                new TacticArena.Order.Fire(new TacticArena.Position(9, 8), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(9, 7), 'W')
                            ]
                        },
                        {
                            entity: currentState.pawns[3],
                            list: [
                                new TacticArena.Order.Move(new TacticArena.Position(11, 7), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(10, 7), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(9, 7), 'W'),
                                new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'W')
                            ]
                        },
                    ];
                    var steps = currentState.orderManager.getSteps();
                    expect(steps.length).toEqual(5);
                    expect(steps[0].stepUnits.length).toEqual(4);
                    testStep(steps, 0, 0, 1, 'stand', 'E', { x: 8, y: 8 }, 3, 4, false, null);
                    testStep(steps, 0, 1, 2, 'stand', 'W', { x: 10, y: 8 }, 4, 2, false, null);
                    testStep(steps, 0, 2, 4, 'stand', 'W', { x: 12, y: 7 }, 4, 4, false, null);
                    testStep(steps, 0, 3, 3, 'stand', 'E', { x: 7, y: 7 }, 3, 4, false, null);
                    testStep(steps, 1, 0, 1, 'cast', 'E', { x: 8, y: 8 }, 1, 4, false, null);
                    testStep(steps, 1, 1, 2, 'move', 'W', { x: 9, y: 8 }, 3, 0, false, null);
                    expect(steps[1].stepUnits[1].data.dies).toBeTruthy();
                    testStep(steps, 1, 2, 4, 'move', 'W', { x: 11, y: 7 }, 3, 4, false, null);
                    testStep(steps, 1, 3, 3, 'stand', 'E', { x: 7, y: 7 }, 2, 4, false, null);
                    testStep(steps, 2, 0, 1, 'move', 'E', { x: 7, y: 8 }, 0, 4, false, null);
                    testStep(steps, 2, 1, 2, 'dead', 'W', { x: 9, y: 8 }, 3, 0, false, null);
                    expect(steps[2].stepUnits[1].data.dies).toBeFalsy();
                    testStep(steps, 2, 2, 4, 'move', 'W', { x: 10, y: 7 }, 2, 4, false, null);
                    testStep(steps, 2, 3, 3, 'stand', 'E', { x: 7, y: 7 }, 1, 4, false, null);
                    testStep(steps, 3, 0, 1, 'stand', 'E', { x: 7, y: 8 }, 0, 4, false, null);
                    testStep(steps, 3, 1, 2, 'dead', 'W', { x: 9, y: 8 }, 3, 0, false, null);
                    testStep(steps, 3, 2, 4, 'move', 'W', { x: 9, y: 7 }, 1, 4, false, null);
                    testStep(steps, 3, 3, 3, 'stand', 'E', { x: 7, y: 7 }, 0, 4, false, null);
                    testStep(steps, 4, 0, 1, 'stand', 'E', { x: 7, y: 8 }, 0, 4, false, null);
                    testStep(steps, 4, 1, 2, 'dead', 'W', { x: 9, y: 8 }, 3, 0, false, null);
                    testStep(steps, 4, 2, 4, 'move', 'W', { x: 9, y: 7 }, 0, 4, true, new TacticArena.Position(9, 8));
                    testStep(steps, 4, 3, 3, 'stand', 'E', { x: 7, y: 7 }, 0, 4, false, null);
                });
            });
        });
    })(Specs = TacticArena.Specs || (TacticArena.Specs = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
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
        OrderManager.prototype.add = function (entity, order, triggerDispatch) {
            if (triggerDispatch === void 0) { triggerDispatch = true; }
            if (!this.hasOrder(entity._id)) {
                this.orders.push({ entity: entity, list: [] });
            }
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id == entity._id) {
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
        OrderManager.prototype.formatOrders = function () {
            for (var i = 0; i < this.game.pawns.length; i++) {
                var p = this.game.pawns[i];
                if (!this.hasOrder(p._id)) {
                    var position = p.getPosition();
                    this.add(p, new TacticArena.Order.Stand(position, p.getDirection()), false);
                }
            }
        };
        OrderManager.prototype.getInitialStep = function () {
            var step = new TacticArena.Entity.Step();
            for (var i = 0; i < this.orders.length; i++) {
                var pawn = this.orders[i].entity;
                step.stepUnits.push(new TacticArena.Entity.StepUnit(pawn, new TacticArena.Entity.StepUnitData((pawn.getHp() > 0 ? pawn._apMax : 0), pawn.getHp()), (pawn.getHp() <= 0) ? new TacticArena.Order.Dead(pawn.getPosition(), pawn.getDirection()) : new TacticArena.Order.Stand(pawn.getPosition(), pawn.getDirection())));
            }
            return step;
        };
        OrderManager.resolutionEsquive = function (fleeRate) {
            return (Math.floor(Math.random() * 100) > fleeRate);
        };
        OrderManager.prototype.blockEntity = function (steps, startI, j, order, entity) {
            steps[startI].stepUnits[j].data.positionBlocked = steps[startI].stepUnits[j].order.position;
            for (var i = startI; i < steps.length; i++) {
                if (steps[i].stepUnits[j].order) {
                    if (i > startI && steps[i].stepUnits[j].order.action == 'move') {
                        steps[i].stepUnits[j].order = order;
                    }
                    steps[i].stepUnits[j].order.position = order.position;
                }
            }
            this.alteredPawns.push(entity._id);
            entity.destroyProjection();
            return steps;
        };
        OrderManager.prototype.pacifyEntity = function (steps, startI, j, order, entity, state) {
            for (var i = startI; i < steps.length; i++) {
                steps[i].stepUnits[j].order = new TacticArena.Order.Stand(new TacticArena.Position(state.moved.x, state.moved.y), order.direction);
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
                steps[j] = new TacticArena.Entity.Step();
                for (var i = 0; i < this.orders.length; i++) {
                    var pawn = this.orders[i].entity;
                    pawn.show(); // TODO ugly
                    steps[j].stepUnits.push(new TacticArena.Entity.StepUnit(pawn, new TacticArena.Entity.StepUnitData(), this.orders[i].list[j] ? this.orders[i].list[j] : null));
                }
            }
            steps.unshift(this.getInitialStep());
            this.orders = [];
            return this.processOrders(steps);
        };
        OrderManager.prototype.getPawn = function (id) {
            var result = null;
            this.game.pawns.forEach(function (p) {
                if (p._id == id) {
                    result = p;
                }
            });
            return result;
        };
        OrderManager.prototype.tileIsFree = function (stepUnits, position) {
            for (var i = 0; i < stepUnits.length; i++) {
                if ((typeof stepUnits[i].data.moved === 'undefined' && position.equals(stepUnits[i].order.position)) ||
                    (stepUnits[i].data.moved && stepUnits[i].data.moved.equals(position))) {
                    return false;
                }
            }
            return true;
        };
        OrderManager.prototype.processOrders = function (steps) {
            for (var l = 1; l < steps.length; l++) {
                var stepUnits = steps[l].stepUnits;
                var previousStepUnit = steps[l - 1].stepUnits;
                for (var i = 0; i < stepUnits.length; i++) {
                    stepUnits[i].data = new TacticArena.Entity.StepUnitData(previousStepUnit[i].data.ap, previousStepUnit[i].data.hp);
                    // In case a pawn has less actions to play than the others he got a default one but if he has 0 AP he won't do anything
                    if (stepUnits[i].order == null) {
                        stepUnits[i].order = new TacticArena.Order.Stand(previousStepUnit[i].order.position, previousStepUnit[i].order.direction);
                    }
                }
                // check actions for each entity in step
                for (var i = 0; i < stepUnits.length; i++) {
                    // foreach entities except A
                    for (var j = 0; j < stepUnits.length; j++) {
                        if (stepUnits[i].pawn._id == stepUnits[j].pawn._id)
                            continue; // Pas d'interaction avec soi-même
                        var positionBBeforeOrder = previousStepUnit[j].data.moved ? previousStepUnit[j].data.moved : previousStepUnit[j].order.position;
                        stepUnits[i].data.aWasFacingB = previousStepUnit[i].order.position.faces(positionBBeforeOrder, previousStepUnit[i].order.direction);
                        stepUnits[i].data.aWasNextToB = previousStepUnit[i].order.position.getDistanceFrom(positionBBeforeOrder) == 1;
                        stepUnits[i].data.entityAApCost = 1;
                        stepUnits[i].data.entityBHpLost = 0;
                        stepUnits[i].data.aIsActive = previousStepUnit[i].data.ap > 0; // INACTIF = stand mais pas le droit d'attaquer
                        stepUnits[i].data.aIsAlive = previousStepUnit[i].data.hp > 0;
                        stepUnits[i].data.keepDirection = (previousStepUnit[i].order.direction == stepUnits[i].order.direction);
                        stepUnits[i].data.keepPosition = stepUnits[i].order.position.equals(previousStepUnit[i].order.position);
                        stepUnits[i].data.equalPositions = stepUnits[i].order.position.equals(stepUnits[j].order.position);
                        stepUnits[i].data.differentTeams = stepUnits[i].pawn.team != stepUnits[j].pawn.team;
                        stepUnits[i].data.alteredEntityB = this.alteredPawns.indexOf(stepUnits[j].pawn._id) < 0;
                        stepUnits[i].data.positionBBeforeOrder = positionBBeforeOrder;
                        stepUnits[i].data.hp = typeof stepUnits[i].data.hp !== 'undefined' ? stepUnits[i].data.hp : previousStepUnit[i].data.hp;
                        if (!stepUnits[i].data.aIsAlive) {
                            stepUnits[i].order = new TacticArena.Order.Dead(previousStepUnit[i].order.position, previousStepUnit[i].order.direction);
                            stepUnits[i].data.ap = previousStepUnit[i].data.ap;
                            stepUnits[i].data.hp = 0;
                            previousStepUnit[i].data.dies = !(previousStepUnit[i].order instanceof TacticArena.Order.Dead);
                            continue;
                        }
                        if (stepUnits[i].data.equalPositions) {
                            // Si A veut aller sur la même case que B (qu'il y soit déjà statique où qu'il veuille y aller)
                            if (this.alteredPawns.indexOf(stepUnits[i].pawn._id) < 0)
                                stepUnits[i].data.moveHasBeenBlocked = stepUnits[i].order instanceof TacticArena.Order.Move;
                            if (this.alteredPawns.indexOf(stepUnits[j].pawn._id) < 0)
                                stepUnits[j].data.moveHasBeenBlocked = stepUnits[j].order instanceof TacticArena.Order.Move;
                        }
                        stepUnits[i].order = stepUnits[i].order.process(this, steps, l, i, j);
                        stepUnits[j].data.hp -= stepUnits[i].data.entityBHpLost;
                        stepUnits[i].data.ap = stepUnits[i].data.aIsActive ? previousStepUnit[i].data.ap - stepUnits[i].data.entityAApCost : 0;
                        if (stepUnits[i].data.moveHasBeenBlocked && this.alteredPawns.indexOf(stepUnits[i].pawn._id) < 0) {
                            this.blockEntity(steps, l, i, new TacticArena.Order.Stand(previousStepUnit[i].order.position, previousStepUnit[i].order.direction), stepUnits[i].pawn);
                        }
                        if (stepUnits[j].data.moveHasBeenBlocked && this.alteredPawns.indexOf(stepUnits[j].pawn._id) < 0) {
                            this.blockEntity(steps, l, j, new TacticArena.Order.Stand(previousStepUnit[j].order.position, previousStepUnit[j].order.direction), stepUnits[j].pawn);
                        }
                    }
                }
            }
            return steps;
        };
        return OrderManager;
    }());
    TacticArena.OrderManager = OrderManager;
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
                var result = new TacticArena.Entity.Step([
                    new TacticArena.Entity.StepUnit(currentState.pawns[0], new TacticArena.Entity.StepUnitData(3, 4), new TacticArena.Order.Stand(new TacticArena.Position(8, 8), 'E')),
                    new TacticArena.Entity.StepUnit(currentState.pawns[1], new TacticArena.Entity.StepUnitData(3, 4), new TacticArena.Order.Stand(new TacticArena.Position(10, 8), 'W'))
                ]);
                return result;
            }
            function testStepResolution(index, position, ap, hp, direction) {
                var pawn = currentState.pawns[index];
                expect(pawn.getPosition().equals(position)).toEqual(true);
                expect(pawn.getAp()).toEqual(ap);
                expect(pawn.getHp()).toEqual(hp);
                expect(pawn.getDirection()).toEqual(direction);
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
                    new TacticArena.Entity.Step([
                        new TacticArena.Entity.StepUnit(currentState.pawns[0], new TacticArena.Entity.StepUnitData(2, 4), new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'E')),
                        new TacticArena.Entity.StepUnit(currentState.pawns[1], new TacticArena.Entity.StepUnitData(2, 4), new TacticArena.Order.Stand(new TacticArena.Position(10, 8), 'W'))
                    ])
                ]);
                currentState.resolveManager.processStep(0).then(function () {
                    testStepResolution(0, { x: 8, y: 8 }, 3, 4, 'E');
                    testStepResolution(1, { x: 10, y: 8 }, 3, 4, 'W');
                    return currentState.resolveManager.processStep(1);
                }).then(function () {
                    testStepResolution(0, { x: 9, y: 8 }, 2, 4, 'E');
                    testStepResolution(1, { x: 10, y: 8 }, 2, 4, 'W');
                    done();
                });
            });
            it("attack from 1st pawn", function (done) {
                currentState.resolveManager.init([
                    getInitialStep(),
                    new TacticArena.Entity.Step([
                        new TacticArena.Entity.StepUnit(currentState.pawns[0], new TacticArena.Entity.StepUnitData(2, 4), new TacticArena.Order.Move(new TacticArena.Position(9, 8), 'E')),
                        new TacticArena.Entity.StepUnit(currentState.pawns[1], new TacticArena.Entity.StepUnitData(2, 4), new TacticArena.Order.Stand(new TacticArena.Position(10, 8), 'W'))
                    ]),
                    new TacticArena.Entity.Step([
                        new TacticArena.Entity.StepUnit(currentState.pawns[0], new TacticArena.Entity.StepUnitData(1, 4), new TacticArena.Order.Attack(new TacticArena.Position(9, 8), 'E', [{ entityId: currentState.pawns[1]._id, dodge: false }])),
                        new TacticArena.Entity.StepUnit(currentState.pawns[1], new TacticArena.Entity.StepUnitData(1, 3), new TacticArena.Order.Attack(new TacticArena.Position(10, 8), 'W', [{ entityId: currentState.pawns[0]._id, dodge: true }]))
                    ])
                ]);
                currentState.resolveManager.processStep(0).then(function () {
                }).then(function () {
                    testStepResolution(0, { x: 8, y: 8 }, 3, 4, 'E');
                    testStepResolution(1, { x: 10, y: 8 }, 3, 4, 'W');
                    return currentState.resolveManager.processStep(1);
                }).then(function () {
                    testStepResolution(0, { x: 9, y: 8 }, 2, 4, 'E');
                    testStepResolution(1, { x: 10, y: 8 }, 2, 4, 'W');
                    return currentState.resolveManager.processStep(2);
                }).then(function () {
                    testStepResolution(0, { x: 9, y: 8 }, 1, 4, 'E');
                    testStepResolution(1, { x: 10, y: 8 }, 1, 3, 'W');
                    done();
                });
            });
            it("move then cast from 1st pawn while 2nd move", function (done) {
                currentState.resolveManager.init([
                    getInitialStep(),
                    new TacticArena.Entity.Step([
                        new TacticArena.Entity.StepUnit(currentState.pawns[0], new TacticArena.Entity.StepUnitData(2, 4), new TacticArena.Order.Move(new TacticArena.Position(8, 7), 'E')),
                        new TacticArena.Entity.StepUnit(currentState.pawns[1], new TacticArena.Entity.StepUnitData(2, 4), new TacticArena.Order.Move(new TacticArena.Position(10, 7), 'W'))
                    ]),
                    new TacticArena.Entity.Step([
                        new TacticArena.Entity.StepUnit(currentState.pawns[0], new TacticArena.Entity.StepUnitData(0, 4), new TacticArena.Order.Fire(new TacticArena.Position(8, 7), 'E', [currentState.pawns[1]._id])),
                        new TacticArena.Entity.StepUnit(currentState.pawns[1], new TacticArena.Entity.StepUnitData(1, 2), new TacticArena.Order.Move(new TacticArena.Position(9, 7), 'W'))
                    ]),
                    new TacticArena.Entity.Step([
                        new TacticArena.Entity.StepUnit(currentState.pawns[0], new TacticArena.Entity.StepUnitData(0, 3), new TacticArena.Order.Stand(new TacticArena.Position(8, 7), 'E', [currentState.pawns[1]._id])),
                        new TacticArena.Entity.StepUnit(currentState.pawns[1], new TacticArena.Entity.StepUnitData(0, 2), new TacticArena.Order.Move(new TacticArena.Position(9, 7), 'W', { entity: currentState.pawns[0]._id, dodge: false }))
                    ])
                ]);
                currentState.resolveManager.processStep(0).then(function () {
                }).then(function () {
                    testStepResolution(0, { x: 8, y: 8 }, 3, 4, 'E');
                    testStepResolution(1, { x: 10, y: 8 }, 3, 4, 'W');
                    return currentState.resolveManager.processStep(1);
                }).then(function () {
                    testStepResolution(0, { x: 8, y: 7 }, 2, 4, 'E');
                    testStepResolution(1, { x: 10, y: 7 }, 2, 4, 'W');
                    return currentState.resolveManager.processStep(2);
                }).then(function () {
                    testStepResolution(0, { x: 8, y: 7 }, 0, 4, 'E');
                    testStepResolution(1, { x: 9, y: 7 }, 1, 2, 'W');
                    return currentState.resolveManager.processStep(3);
                }).then(function () {
                    testStepResolution(0, { x: 8, y: 7 }, 0, 3, 'E');
                    testStepResolution(1, { x: 9, y: 7 }, 0, 2, 'W');
                    done();
                });
            });
        });
    })(Specs = TacticArena.Specs || (TacticArena.Specs = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var ResolveManager = (function () {
        function ResolveManager(game) {
            this.steps = [];
            this.game = game;
            this.currentIndex = 0;
            this.processing = false;
            this.active = false;
        }
        ResolveManager.prototype.init = function (steps) {
            this.steps = steps;
            this.manageProjectionDislay(steps[0], true);
            this.currentIndex = 0;
        };
        /*
         * Call processStep
         */
        ResolveManager.prototype.processSteps = function (index, animate, backward) {
            var _this = this;
            if (animate === void 0) { animate = true; }
            if (backward === void 0) { backward = false; }
            this.processing = true;
            this.active = true;
            var self = this;
            this.processStep(index, animate, backward).then(function (res) {
                if (index >= self.steps.length) {
                    return _this.game.signalManager.resolvePhaseFinished.dispatch();
                }
                _this.game.signalManager.stepResolutionFinished.dispatch(index);
                if (!_this.game.isPaused) {
                    self.processSteps(index + 1, animate, backward); // recursive
                }
            }, function (res) {
                console.log(res, 'something failed during animation');
            });
        };
        /*
         * Retourne une promesse qui est résolue lorsque toutes les animations de this.steps[index] sont résolues
         */
        ResolveManager.prototype.processStep = function (index, animate, backward) {
            if (animate === void 0) { animate = true; }
            if (backward === void 0) { backward = false; }
            if (index >= this.steps.length)
                return Promise.resolve(true);
            var self = this;
            this.setCurrentIndex(index);
            var previousStep = index > 0 ? this.steps[index - 1] : null;
            var promisesOrders = [];
            this.steps[index].stepUnits.forEach(function (stepUnit, i) {
                stepUnit.pawn.setAp(stepUnit.data.ap); // met à jour le nombre d'AP du pawn
                promisesOrders.push(stepUnit.order.resolve(stepUnit.pawn, stepUnit.data, previousStep, animate, backward, i, self.game)); //lance l'animation
            });
            this.manageProjectionDislay(this.steps[index]);
            return Promise.all(promisesOrders).then(function (res) {
                if (!backward) {
                    self.manageProjectionDislay(self.steps[index]);
                }
                self.steps[index].stepUnits.forEach(function (stepUnit) {
                    var forceAnimation = typeof stepUnit.data.dies !== 'undefined' && stepUnit.data.dies;
                    stepUnit.pawn.setHp(stepUnit.data.hp, forceAnimation);
                });
            });
        };
        ResolveManager.prototype.manageProjectionDislay = function (step, compareActualEntity) {
            if (compareActualEntity === void 0) { compareActualEntity = false; }
            step.stepUnits.forEach(function (stepUnit, i) {
                var entityA = stepUnit.pawn;
                var order = stepUnit.order;
                var position = entityA.getProjectionOrReal().getPosition();
                if (entityA.projection) {
                    var condition = false;
                    if (compareActualEntity) {
                        condition = (JSON.stringify(entityA.getPosition()) == JSON.stringify(entityA.getProjectionOrReal().getPosition()));
                    }
                    else {
                        condition = order.position.equals(position);
                    }
                    if (condition) {
                        entityA.projection.hide();
                        entityA.show();
                    }
                    else {
                        entityA.projection.show(0.7);
                        //entityA.hide();
                    }
                }
            });
        };
        ResolveManager.prototype.setCurrentIndex = function (index) {
            this.currentIndex = index;
            this.game.signalManager.stepResolutionIndexChange.dispatch(index);
        };
        return ResolveManager;
    }());
    TacticArena.ResolveManager = ResolveManager;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
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
                    var serializedSteps = [];
                    for (var i = 0; i < steps.length; i++) {
                        serializedSteps.push([]);
                        for (var j = 0; j < steps[i].length; j++) {
                            var s = {
                                entityId: steps[i].stepUnits[j].pawn._id,
                                stepUnitState: steps[i].stepUnits[j].stepUnitData,
                                order: steps[i].stepUnits[j].order,
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
                                entity: self.game.pawns.find(function (o) { return o._id == serializedSteps_1[i].stepUnits[j].entityId; }),
                                stepUnitState: serializedSteps_1[i].stepUnits[j].stepUnitData,
                                order: serializedSteps_1[i].stepUnits[j].order,
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
                setInterval(function () {
                    self.request('KEEP_ALIVE', 'keep me alive');
                }, 30000);
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
    TacticArena.ServerManager = ServerManager;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
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
                //self.game.uiManager.actionUI.update(pawn.getAp());
            });
            this.turnInitialized.add(function (pawn) {
                self.game.process = false;
                self.game.selecting = true;
                if (pawn.isBot) {
                    self.game.aiManager.play(pawn);
                }
                else {
                    //self.game.selecting = true;
                }
            });
            this.stepResolutionFinished.add(function (stepIndex) {
                self.game.uiManager.process = false;
                self.game.resolveManager.processing = false; // On repasse process à false pour regagner la main sur le ResolveManager
            });
            this.resolvePhaseFinished.add(function () {
                self.game.isGameReadyPromise().then(function (res) {
                    TacticArena.Action.ConfirmResolve.process(self.game);
                });
            });
            this.stepResolutionIndexChange.add(function (stepIndex) {
                //self.game.uiManager.notificationsUI.update(stepIndex);
                self.game.uiManager.timelineUI.update(stepIndex);
            });
            this.onTurnEnded.add(function (activePawn) {
                self.game.uiManager.ordersnotificationsUI.clean();
                self.game.uiSpritesGroup.removeAll();
                if (self.game.uiManager.actionMenu) {
                    self.game.uiManager.actionMenu.clean();
                }
            });
            this.onActivePawnChange.add(function (activePawn) {
                //self.game.uiManager.ordersnotificationsUI.clean();
                //self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(activePawn._id));
                //self.game.uiManager.pawnsinfosUI.select(activePawn._id);
                //self.game.uiManager.actionUI.update(activePawn.getAp());
                //self.game.uiManager.actionUI.select('walk');
                var position = activePawn.getPosition();
                self.game.uiSpritesGroup.removeAll();
                var s = self.game.uiSpritesGroup.create(position.x * self.game.tileSize - 1, position.y * self.game.tileSize + 15, 'circle');
                s.animations.add('turn', ["selected_circle_01", "selected_circle_02"], 4, true);
                s.play('turn');
                //this.consolelogsUI.write('au tour du joueur ' + activePawn._id);
                self.game.uiManager.actionMenu = new TacticArena.UI.ActionMenu(self.game, activePawn);
                self.game.uiManager.actionMenu.initDirection(activePawn.getDirection());
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
    TacticArena.SignalManager = SignalManager;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var StageManager = (function () {
        function StageManager(game) {
            this.game = game;
            this.map = null;
            this.backgroundLayer = null;
            this.uiLayer = null;
            this.foregroundLayer = null;
            this.decorationLayer1 = null;
            this.decorationLayer2 = null;
            this.decorationLayer3 = null;
            this.collisionLayer = null;
            this.blackLayer = null;
            this.grid = [];
            this.initialGrid = [];
        }
        StageManager.prototype.init = function (name) {
            if (name === void 0) { name = 'mapmobile'; }
            this.map = this.game.make.tilemap(name);
            this.map.addTilesetImage('tiles-collection', 'tiles-collection', this.game.tileSize, this.game.tileSize, 0, 0);
            //this.parallaxLayer = this.game.mapGroup.add(this.map.createLayer('Parallax'));
            if (this.parallaxLayer) {
                this.parallaxLayer.scrollFactorX = 0.5;
                this.parallaxLayer.scrollFactorY = 0.5;
            }
            this.backgroundLayer = this.game.mapGroup.add(this.map.createLayer('Background'));
            this.uiLayer = this.game.mapGroup.add(this.map.createBlankLayer('UI', this.backgroundLayer.layer.data[0].length, this.backgroundLayer.layer.data.length, this.game.tileSize, this.game.tileSize));
            this.foregroundLayer = this.game.mapGroup.add(this.map.createLayer('Foreground'));
            this.collisionLayer = this.game.mapGroup.add(this.map.createLayer('Collision'));
            //this.collisionLayer.debug = true;
            this.decorationLayer1 = this.game.mapGroup.add(this.map.createLayer('Decorations'));
            this.decorationLayer2 = this.game.mapGroup.add(this.map.createLayer('Decorations2'));
            this.initGrid();
            this.backgroundLayer.resizeWorld();
        };
        StageManager.prototype.initFromArray = function (data, width, height, start) {
            if (width === void 0) { width = 160; }
            if (height === void 0) { height = 160; }
            if (start === void 0) { start = { x: 0, y: 0 }; }
            this.map = this.game.add.tilemap();
            width = data.background.layer.width;
            height = data.background.layer.height;
            this.map.addTilesetImage('tiles-collection', 'tiles-collection', this.game.tileSize, this.game.tileSize, 0, 0, 1);
            this.parallaxLayer = this.map.create('Parallax', width, height, this.game.tileSize, this.game.tileSize);
            this.parallaxLayer.scrollFactorX = 0.5;
            this.parallaxLayer.scrollFactorY = 0.5;
            this.backgroundLayer = this.map.createBlankLayer('Background', width, height, this.game.tileSize, this.game.tileSize);
            this.uiLayer = this.map.createBlankLayer('UI', width, height, this.game.tileSize, this.game.tileSize);
            this.foregroundLayer = this.map.createBlankLayer('Foreground', width, height, this.game.tileSize, this.game.tileSize);
            this.collisionLayer = this.map.createBlankLayer('Collision', width, height, this.game.tileSize, this.game.tileSize);
            //this.collisionLayer.debug = true;
            this.decorationLayer1 = this.map.createBlankLayer('Decorations', width, height, this.game.tileSize, this.game.tileSize);
            this.decorationLayer2 = this.map.createBlankLayer('Decorations2', width, height, this.game.tileSize, this.game.tileSize);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.parallax), this.parallaxLayer);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.background), this.backgroundLayer);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.foreground), this.foregroundLayer);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.collision), this.collisionLayer);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.decoration1), this.decorationLayer1);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.decoration2), this.decorationLayer2);
            //for (var i = 0; i < data.background.layer.data.length; i++) {
            //    for (var j = 0; j < data.background.layer.data[i].length; j++) {
            //        console.log(data.background.layer.data[i][j]);
            //        this.map.putTile(data.background.layer.data[i][j].index, j, i, this.backgroundLayer);
            //    }
            //}
            this.initGrid();
            this.backgroundLayer.resizeWorld();
        };
        StageManager.prototype.initGrid = function () {
            for (var i = 0; i < this.collisionLayer.layer.data.length; i++) {
                this.grid[i] = [];
                for (var j = 0; j < this.collisionLayer.layer.data[i].length; j++) {
                    this.grid[i][j] = this.collisionLayer.layer.data[i][j].index;
                }
            }
            for (var i = 0; i < this.grid.length; i++) {
                this.initialGrid[i] = this.grid[i].slice();
            }
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    //this.map.removeTile(x, y, 'Collision');
                    var tile = this.map.getTile(x, y, this.collisionLayer, true);
                    tile.alpha = 0;
                }
            }
            this.collisionLayer.layer.dirty = true;
        };
        StageManager.prototype.addDecorations = function () {
            this.decorationLayer3 = this.game.mapGroup.add(this.map.createLayer('Decorations3'));
        };
        StageManager.prototype.addDecorationsFromData = function (data) {
            var width = data.stage.background.layer.width;
            var height = data.stage.background.layer.height;
            this.decorationLayer3 = this.map.createBlankLayer('Decorations3', width, height, this.game.tileSize, this.game.tileSize);
            this.map.paste(0, 0, data.stage.background.map.copy(0, 0, width, height, data.stage.decoration3), this.decorationLayer3);
        };
        StageManager.prototype.addBlackLayer = function (data) {
            var width = data.stage.background.layer.width;
            var height = data.stage.background.layer.height;
            this.blackLayer = this.map.createBlankLayer('Black', width, height, this.game.tileSize, this.game.tileSize);
            var endX = data.startPosition.x + data.gridWidth;
            var endY = data.startPosition.y + data.gridHeight;
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    if (x < data.startPosition.x || x > endX || y < data.startPosition.y || y > endY) {
                        var tile = this.map.putTile(9, x, y, this.blackLayer);
                        if (tile) {
                            tile.alpha = 0.8;
                            this.grid[y][x] = 1;
                        }
                    }
                }
            }
        };
        StageManager.prototype.fillBlack = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var width = _this.backgroundLayer.layer.width;
                var height = _this.backgroundLayer.layer.height;
                _this.blackLayer = _this.map.createBlankLayer('Black', width, height, _this.game.tileSize, _this.game.tileSize);
                var startX = Math.floor(Math.abs(_this.game.world.position.x) / _this.game.tileSize);
                var startY = Math.floor(Math.abs(_this.game.world.position.y) / _this.game.tileSize);
                var endX = startX + 20;
                var endY = startY + 19;
                var self = _this;
                var x = startX;
                var y = startY;
                var interval = setInterval(function () {
                    if (y >= endY) {
                        clearInterval(interval);
                        resolve(true);
                    }
                    if (x >= endX) {
                        x = startX;
                        y++;
                    }
                    self.map.putTile(9, x, y, self.blackLayer);
                    self.blackLayer.layer.dirty = true;
                    x++;
                }, 5);
            });
        };
        StageManager.prototype.getLayers = function () {
            return {
                parallax: this.parallaxLayer,
                background: this.backgroundLayer,
                foreground: this.foregroundLayer,
                collision: this.collisionLayer,
                decoration1: this.decorationLayer1,
                decoration2: this.decorationLayer2,
                decoration3: this.decorationLayer3
            };
        };
        StageManager.prototype.isObstacle = function (position) {
            return this.grid[position.y][position.x] != -1;
        };
        StageManager.prototype.handleTile = function (pawn) {
            var p = pawn.getPosition();
            this.grid[p.y][p.x] = pawn.isAlive() ? -1 : 3;
        };
        StageManager.prototype.canMove = function (entity, x, y, ap) {
            var _this = this;
            if (ap === void 0) { ap = Infinity; }
            return new Promise(function (resolve, reject) {
                //this.equalPositions(entity.getPosition(), {x: x, y: y});
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
        StageManager.prototype.getFrontTile = function (pawn, direction, position) {
            if (direction === void 0) { direction = null; }
            if (position === void 0) { position = null; }
            var p = position ? position : pawn.getPosition();
            var d = direction ? direction : pawn.getDirection();
            var path = [];
            if (d == 'W') {
                path.push({ 'x': p.x - 1, 'y': p.y });
            }
            else if (d == 'E') {
                path.push({ 'x': p.x + 1, 'y': p.y });
            }
            else if (d == 'S') {
                path.push({ 'x': p.x, 'y': p.y + 1 });
            }
            else if (d == 'N') {
                path.push({ 'x': p.x, 'y': p.y - 1 });
            }
            return path;
        };
        StageManager.prototype.showPossibleLinearTrajectories = function (path) {
            this.clearPossibleMove();
            for (var i = 0; i < path.length; i++) {
                //let tile = this.map.getTile(path[i].x, path[i].y, this.backgroundLayer, true);
                var tile = this.map.putTile(2105, path[i].x, path[i].y, this.uiLayer);
                tile.alpha = 0.5;
            }
            this.backgroundLayer.layer.dirty = true;
        };
        StageManager.prototype.showPossibleMove = function (position, ap) {
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    //let tile = this.map.getTile(x, y, this.backgroundLayer, true);
                    //tile.alpha = ap > 0 && this.getNbTilesBetween(position, {'x': x, 'y': y}) <= ap ? 0.7 : 1;
                    if (this.getNbTilesBetween(position, { 'x': x, 'y': y }) <= ap &&
                        this.grid[y][x] == -1 &&
                        this.backgroundLayer.layer.data[y][x].index > -1) {
                        var tile = this.map.putTile(2105, x, y, this.uiLayer);
                        tile.alpha = 0.5;
                    }
                }
            }
            this.backgroundLayer.layer.dirty = true;
        };
        StageManager.prototype.clearPossibleMove = function () {
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    //let tile = this.map.getTile(x, y, this.backgroundLayer, true);
                    //tile.alpha = 1;
                    this.map.removeTile(x, y, this.uiLayer);
                }
            }
            this.backgroundLayer.layer.dirty = true;
        };
        StageManager.prototype.showPath = function (path, group, tint) {
            if (tint === void 0) { tint = null; }
            for (var i = 0; i < path.length; i++) {
                var tile = this.map.getTile(path[i].x, path[i].y, this.backgroundLayer, true);
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
        StageManager.prototype.isFacingAway = function (coordsA, directionA, coordsB) {
            return ((coordsA.x == coordsB.x && (directionA == 'N' || directionA == 'S')) ||
                (coordsA.y == coordsB.y && (directionA == 'W' || directionA == 'E')));
        };
        StageManager.prototype.equalPositions = function (p1, p2) {
            return p1.x == p2.x && p1.y == p2.y;
        };
        StageManager.prototype.differenceBetweenPositions = function (p1, p2) {
            return { x: Math.abs(p1.x - p2.x), y: Math.abs(p1.y - p2.y) };
        };
        StageManager.prototype.markPawns = function () {
            for (var i = 0; i < this.initialGrid.length; i++) {
                this.grid[i] = this.initialGrid[i].slice();
            }
            for (var i = 0; i < this.game.pawns.length; i++) {
                var p = this.game.pawns[i].getPosition();
                this.grid[p.y][p.x] = 0;
            }
        };
        return StageManager;
    }());
    TacticArena.StageManager = StageManager;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
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
    TacticArena.TurnManager = TurnManager;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var BaseAnimation = (function () {
        function BaseAnimation(pawn, order, position) {
            this.pawn = pawn;
            this.order = order;
            this.position = position;
        }
        BaseAnimation.prototype.get = function () {
            return null;
        };
        BaseAnimation.prototype.handleBackward = function (animation) {
            var result;
            if (this.position.x != this.order.position.x || this.position.y != this.order.position.y) {
                result = this.pawn.moveTo(this.order.position.x, this.order.position.y, null, false);
                result.then(function (res) {
                    return animation;
                });
            }
            else {
                result = animation;
            }
            return result;
        };
        return BaseAnimation;
    }());
    TacticArena.BaseAnimation = BaseAnimation;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var BaseOrder = (function () {
        function BaseOrder(action, position, direction, targets) {
            if (targets === void 0) { targets = []; }
            this.action = action;
            this.position = position;
            this.direction = direction;
            this.targets = targets;
        }
        BaseOrder.prototype.process = function (ordermanager, steps, stepIndex, aIndex, bIndex) {
            return this;
        };
        return BaseOrder;
    }());
    TacticArena.BaseOrder = BaseOrder;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var BaseSkill = (function () {
            function BaseSkill(state, pawn) {
                this.state = state;
                this.pawn = pawn;
                this.id = '';
                this.name = '';
                this.description = '';
                this.icon = null;
                this.minCost = 0;
                this.selected = false;
            }
            BaseSkill.prototype.canOrder = function () {
                return this.selected && this.pawn.getAp() >= this.minCost;
            };
            BaseSkill.prototype.updateUI = function () {
            };
            BaseSkill.prototype.order = function () {
            };
            return BaseSkill;
        }());
        Entity.BaseSkill = BaseSkill;
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
                _this.anchor.set(0);
                return _this;
            }
            Sprite.prototype.setAnimations = function () {
                this.animations.add('standS', ["walkS1"], 6, false);
                this.animations.add('standN', ["walkN1"], 6, false);
                this.animations.add('standW', ["walkW1"], 6, false);
                this.animations.add('standE', ["walkE1"], 6, false);
                this.animations.add('walkS', ["walkS2", "walkS3", "walkS4", "walkS5", "walkS6", "walkS7", "walkS8", "walkS9"], 12, true);
                this.animations.add('walkN', ["walkN2", "walkN3", "walkN4", "walkN5", "walkN6", "walkN7", "walkN8", "walkN9"], 12, true);
                this.animations.add('walkW', ["walkW1", "walkW2", "walkW3", "walkW4", "walkW5", "walkW6", "walkW7", "walkW8", "walkW9"], 12, true);
                this.animations.add('walkE', ["walkE1", "walkE2", "walkE3", "walkE4", "walkE5", "walkE6", "walkE7", "walkE8", "walkE9"], 12, true);
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
                    var p2_1 = this._parent.projection.getPosition();
                    if (p1.x == p2_1.x && p1.y == p2_1.y) {
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
            Sprite.prototype.castTornado = function (targets, callback) {
                var self = this;
                this._animationCompleteCallback = callback;
                this.playAnimation('cast' + this._ext);
                setTimeout(function () {
                    var initialX = 0;
                    var initialY = 0;
                    var targetX = 0;
                    var targetY = 0;
                    var scaleX = 1;
                    if (self._ext == 'W' || self._ext == 'E') {
                        initialY = self.position.y + 40;
                        targetY = initialY;
                        initialX = self.position.x;
                        targetX = initialX - 100;
                        if (self._ext == 'E') {
                            initialX = self.position.x + 65;
                            targetX = initialX + 100;
                            scaleX = -1;
                        }
                    }
                    else if (self._ext == 'N' || self._ext == 'S') {
                        initialX = self.position.x + 30;
                        targetX = initialX;
                        initialY = self.position.y + 5;
                        targetY = initialY - 110;
                        if (self._ext == 'S') {
                            initialY = self.position.y + 65;
                            targetY = initialY + 110;
                        }
                    }
                    var tornado = self._parent.game.add.sprite(initialX, initialY, 'wind');
                    self._parent.game.pawnsSpritesGroup.add(tornado);
                    tornado.anchor.setTo(.5, .5);
                    tornado.scale.x *= scaleX;
                    tornado.animations.add('wind', ["wind_01", "wind_02", "wind_03", "wind_04", "wind_05", "wind_06", "wind_07"], 7, false);
                    tornado.animations.play('wind');
                    if (targets) {
                        var _loop_1 = function () {
                            var target = targets[i];
                            setTimeout(function () {
                                target.entity.hurt(1);
                                if (target.moved) {
                                    target.entity.moveTo(target.moved.x, target.moved.y);
                                }
                            }, target.moved.d * 100);
                        };
                        for (var i = 0; i < targets.length; i++) {
                            _loop_1();
                        }
                    }
                    var t = self._parent.game.add.tween(tornado).to({ x: targetX, y: targetY }, 1000, Phaser.Easing.Linear.None, true);
                    t.onComplete.add(function () { tornado.kill(); }, self);
                }, 500);
            };
            Sprite.prototype.attack = function (target, callback) {
                this._animationCompleteCallback = callback;
                this.playAnimation('attack' + this._ext);
                if (target) {
                    if (target.dodge) {
                        target.entity.dodge();
                    }
                    else {
                        target.entity.hurt(target.damages);
                    }
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
/// <reference path="Sprite.ts"/>
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var MobSprite = (function (_super) {
            __extends(MobSprite, _super);
            function MobSprite(game, x, y, ext, type, parent, size, tint) {
                if (tint === void 0) { tint = null; }
                return _super.call(this, game, x, y, ext, type, parent, size, tint = null) || this;
            }
            MobSprite.prototype.setAnimations = function () {
                this.animations.add('standS', ['stand_01', 'stand_02', 'stand_03', 'stand_04', 'stand_05', 'stand_06', 'stand_07', 'stand_08', 'stand_09', 'stand_10'], 6, true);
                this.animations.add('standN', ['stand_01', 'stand_02', 'stand_03', 'stand_04', 'stand_05', 'stand_06', 'stand_07', 'stand_08', 'stand_09', 'stand_10'], 6, true);
                this.animations.add('standW', ['stand_01_mirror', 'stand_02_mirror', 'stand_03_mirror', 'stand_04_mirror', 'stand_05_mirror', 'stand_06_mirror', 'stand_07_mirror', 'stand_08_mirror', 'stand_09_mirror', 'stand_10_mirror'], 6, true);
                this.animations.add('standE', ['stand_01', 'stand_02', 'stand_03', 'stand_04', 'stand_05', 'stand_06', 'stand_07', 'stand_08', 'stand_09', 'stand_10'], 6, true);
                this.animations.add('walkS', ['walk_01', 'walk_02', 'walk_03', 'walk_04', 'walk_05', 'walk_06', 'walk_07', 'walk_08', 'walk_09', 'walk_10'], 12, false);
                this.animations.add('walkN', ['walk_01', 'walk_02', 'walk_03', 'walk_04', 'walk_05', 'walk_06', 'walk_07', 'walk_08', 'walk_09', 'walk_10'], 12, false);
                this.animations.add('walkW', ['walk_01_mirror', 'walk_02_mirror', 'walk_03_mirror', 'walk_04_mirror', 'walk_05_mirror', 'walk_06_mirror', 'walk_07_mirror', 'walk_08_mirror', 'walk_09_mirror', 'walk_10_mirror'], 12, false);
                this.animations.add('walkE', ['walk_01', 'walk_02', 'walk_03', 'walk_04', 'walk_05', 'walk_06', 'walk_07', 'walk_08', 'walk_09', 'walk_10'], 12, false);
                this.animations.add('attackS', ['attack_01', 'attack_02', 'attack_03', 'attack_04', 'attack_05', 'attack_06', 'attack_07', 'attack_08', 'attack_09', 'attack_10'], 12, false);
                this.animations.add('attackN', ['attack_01', 'attack_02', 'attack_03', 'attack_04', 'attack_05', 'attack_06', 'attack_07', 'attack_08', 'attack_09', 'attack_10'], 12, false);
                this.animations.add('attackW', ['attack_01_mirror', 'attack_02_mirror', 'attack_03_mirror', 'attack_04_mirror', 'attack_05_mirror', 'attack_06_mirror', 'attack_07_mirror', 'attack_08_mirror', 'attack_09_mirror', 'attack_10_mirror'], 12, false);
                this.animations.add('attackE', ['attack_01', 'attack_02', 'attack_03', 'attack_04', 'attack_05', 'attack_06', 'attack_07', 'attack_08', 'attack_09', 'attack_10'], 12, false);
                this.animations.add('castS', ['gesture_01', 'gesture_02', 'gesture_03', 'gesture_04', 'gesture_05', 'gesture_06', 'gesture_07', 'gesture_08', 'gesture_09', 'gesture_10'], 10, false);
                this.animations.add('castN', ['gesture_01', 'gesture_02', 'gesture_03', 'gesture_04', 'gesture_05', 'gesture_06', 'gesture_07', 'gesture_08', 'gesture_09', 'gesture_10'], 10, false);
                this.animations.add('castW', ['gesture_01_mirror', 'gesture_02_mirror', 'gesture_03_mirror', 'gesture_04_mirror', 'gesture_05_mirror', 'gesture_06_mirror', 'gesture_07_mirror', 'gesture_08_mirror', 'gesture_09_mirror', 'gesture_10_mirror'], 10, false);
                this.animations.add('castE', ['gesture_01', 'gesture_02', 'gesture_03', 'gesture_04', 'gesture_05', 'gesture_06', 'gesture_07', 'gesture_08', 'gesture_09', 'gesture_10'], 10, false);
                this.animations.add('halfcastS', ['gesture_01', 'gesture_02', 'gesture_03'], 10, false);
                this.animations.add('halfcastN', ['gesture_01', 'gesture_02', 'gesture_03'], 10, false);
                this.animations.add('halfcastW', ['gesture_01_mirror', 'gesture_02_mirror', 'gesture_03_mirror'], 10, false);
                this.animations.add('halfcastE', ['gesture_01', 'gesture_02', 'gesture_03'], 10, false);
                this.animations.add('dying', ['dying_01', 'dying_02', 'dying_03', 'dying_04', 'dying_05', 'dying_06', 'dying_07', 'dying_08', 'dying_09', 'dying_10'], 10, false);
                this.events.onAnimationComplete.add(this.animationComplete, this);
            };
            return MobSprite;
        }(TacticArena.Entity.Sprite));
        Entity.MobSprite = MobSprite;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="Sprite.ts"/>
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var MobSpriteSimple = (function (_super) {
            __extends(MobSpriteSimple, _super);
            function MobSpriteSimple(game, x, y, ext, type, parent, size, tint) {
                if (tint === void 0) { tint = null; }
                var _this = _super.call(this, game, x, y, ext, type, parent, size, tint = null) || this;
                _this.anchor.set(-0.5);
                return _this;
            }
            MobSpriteSimple.prototype.setAnimations = function () {
                this.animations.add('standS', ['move_s_01', 'move_s_02', 'move_s_03'], 6, true);
                this.animations.add('standN', ['move_n_01', 'move_n_02', 'move_n_03'], 6, true);
                this.animations.add('standW', ['move_w_01', 'move_w_02', 'move_w_03'], 6, true);
                this.animations.add('standE', ['move_e_01', 'move_e_02', 'move_e_03'], 6, true);
                this.animations.add('walkS', ['move_s_01', 'move_s_02', 'move_s_03'], 12, false);
                this.animations.add('walkN', ['move_n_01', 'move_n_02', 'move_n_03'], 12, false);
                this.animations.add('walkW', ['move_w_01', 'move_w_02', 'move_w_03'], 12, false);
                this.animations.add('walkE', ['move_e_01', 'move_e_02', 'move_e_03'], 12, false);
                this.animations.add('attackS', ['move_s_01', 'move_s_02', 'move_s_03'], 12, false);
                this.animations.add('attackN', ['move_n_01', 'move_n_02', 'move_n_03'], 12, false);
                this.animations.add('attackW', ['move_w_01', 'move_w_02', 'move_w_03'], 12, false);
                this.animations.add('attackE', ['move_e_01', 'move_e_02', 'move_e_03'], 12, false);
                this.animations.add('castS', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
                this.animations.add('castN', ['move_n_01', 'move_n_02', 'move_n_03'], 10, false);
                this.animations.add('castW', ['move_w_01', 'move_w_02', 'move_w_03'], 10, false);
                this.animations.add('castE', ['move_e_01', 'move_e_02', 'move_e_03'], 10, false);
                this.animations.add('halfcastS', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
                this.animations.add('halfcastN', ['move_n_01', 'move_n_02', 'move_n_03'], 10, false);
                this.animations.add('halfcastW', ['move_w_01', 'move_w_02', 'move_w_03'], 10, false);
                this.animations.add('halfcastE', ['move_e_01', 'move_e_02', 'move_e_03'], 10, false);
                this.animations.add('dying', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
                this.events.onAnimationComplete.add(this.animationComplete, this);
            };
            MobSpriteSimple.prototype.attack = function (target, callback) {
                var self = this;
                _super.prototype.attack.call(this, target, callback);
                var newX = self.position.x;
                var newY = self.position.y;
                if (this._ext == 'E') {
                    newX += 10;
                }
                else if (this._ext == 'W') {
                    newX -= 10;
                }
                else if (this._ext == 'N') {
                    newY -= 10;
                }
                else if (this._ext == 'S') {
                    newY += 10;
                }
                this.game.add.tween(this).to({
                    x: newX,
                    y: newY
                }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
            };
            return MobSpriteSimple;
        }(TacticArena.Entity.Sprite));
        Entity.MobSpriteSimple = MobSpriteSimple;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="Sprite.ts"/>
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var MobSpriteSimpleBis = (function (_super) {
            __extends(MobSpriteSimpleBis, _super);
            function MobSpriteSimpleBis(game, x, y, ext, type, parent, size, tint) {
                if (tint === void 0) { tint = null; }
                var _this = _super.call(this, game, x, y, ext, type, parent, size, tint = null) || this;
                _this.anchor.set(-0.6);
                return _this;
            }
            MobSpriteSimpleBis.prototype.setAnimations = function () {
                this.animations.add('standS', ['move_s_02'], 6, true);
                this.animations.add('standN', ['move_n_02'], 6, true);
                this.animations.add('standW', ['move_w_02'], 6, true);
                this.animations.add('standE', ['move_e_02'], 6, true);
                this.animations.add('walkS', ['move_s_01', 'move_s_02', 'move_s_03'], 12, false);
                this.animations.add('walkN', ['move_n_01', 'move_n_02', 'move_n_03'], 12, false);
                this.animations.add('walkW', ['move_w_01', 'move_w_02', 'move_w_03'], 12, false);
                this.animations.add('walkE', ['move_e_01', 'move_e_02', 'move_e_03'], 12, false);
                this.animations.add('attackS', ['move_s_01', 'move_s_02', 'move_s_03'], 12, false);
                this.animations.add('attackN', ['move_n_01', 'move_n_02', 'move_n_03'], 12, false);
                this.animations.add('attackW', ['move_w_01', 'move_w_02', 'move_w_03'], 12, false);
                this.animations.add('attackE', ['move_e_01', 'move_e_02', 'move_e_03'], 12, false);
                this.animations.add('castS', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
                this.animations.add('castN', ['move_n_01', 'move_n_02', 'move_n_03'], 10, false);
                this.animations.add('castW', ['move_w_01', 'move_w_02', 'move_w_03'], 10, false);
                this.animations.add('castE', ['move_e_01', 'move_e_02', 'move_e_03'], 10, false);
                this.animations.add('halfcastS', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
                this.animations.add('halfcastN', ['move_n_01', 'move_n_02', 'move_n_03'], 10, false);
                this.animations.add('halfcastW', ['move_w_01', 'move_w_02', 'move_w_03'], 10, false);
                this.animations.add('halfcastE', ['move_e_01', 'move_e_02', 'move_e_03'], 10, false);
                this.animations.add('dying', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
                this.events.onAnimationComplete.add(this.animationComplete, this);
            };
            MobSpriteSimpleBis.prototype.attack = function (target, callback) {
                var self = this;
                _super.prototype.attack.call(this, target, callback);
                var newX = self.position.x;
                var newY = self.position.y;
                if (this._ext == 'E') {
                    newX += 10;
                }
                else if (this._ext == 'W') {
                    newX -= 10;
                }
                else if (this._ext == 'N') {
                    newY -= 10;
                }
                else if (this._ext == 'S') {
                    newY += 10;
                }
                this.game.add.tween(this).to({
                    x: newX,
                    y: newY
                }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
            };
            return MobSpriteSimpleBis;
        }(TacticArena.Entity.Sprite));
        Entity.MobSpriteSimpleBis = MobSpriteSimpleBis;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Pawn = (function () {
            function Pawn(game, x, y, ext, type, id, bot, team, name, spriteClass) {
                if (name === void 0) { name = ""; }
                if (spriteClass === void 0) { spriteClass = Entity.Sprite; }
                this.game = game;
                this._id = id;
                this._name = name;
                this.type = type;
                this.projection = null;
                this._parent = null;
                var tint = null; //team != this.game.playerTeam ? this.game.teamColors[team-1] : null;
                //TODO séparer pawn et sprite pour avoir des pawns serializable (sans le game de phaser)
                this.spriteClass = spriteClass;
                if (type) {
                    this.sprite = new spriteClass(game, x, y, ext, type, this, 64, tint);
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
                this.skills = [];
            }
            Pawn.prototype.getReal = function () {
                return this._parent ? this._parent : this;
            };
            Pawn.prototype.getProjectionOrReal = function () {
                return this.projection ? this.projection : this;
            };
            Pawn.prototype.getPosition = function () {
                return new TacticArena.Position((this.sprite.position.x + this.sprite._size / 4) / this.game.tileSize, (this.sprite.position.y + this.sprite._size / 2) / this.game.tileSize);
            };
            Pawn.prototype.attack = function (target) {
                var _this = this;
                var that = this;
                return new Promise(function (resolve, reject) {
                    _this.sprite.attack(target, function () {
                        resolve(true);
                        that.sprite.stand();
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
                        _this.show();
                    }
                    _this.faceDirection(direction);
                    _this.sprite.cast(targets, function () {
                        that.sprite.stand();
                        resolve(true);
                    });
                });
            };
            Pawn.prototype.castTornado = function (targets, direction) {
                var _this = this;
                var that = this;
                return new Promise(function (resolve, reject) {
                    if (_this.projection) {
                        _this.projection.hide();
                        _this.show();
                    }
                    _this.faceDirection(direction);
                    _this.sprite.castTornado(targets, function () {
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
            Pawn.prototype.moveTo = function (x, y, path, animate, faceDirection) {
                var _this = this;
                if (path === void 0) { path = []; }
                if (animate === void 0) { animate = true; }
                if (faceDirection === void 0) { faceDirection = false; }
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
                        if (faceDirection) {
                            _this.sprite.faceTo(newX, newY);
                        }
                        if (_this.sprite.animations.currentAnim.name != 'walk' + _this.sprite._ext) {
                            _this.sprite.walk();
                        }
                        var t = _this.game.add.tween(_this.sprite).to({ x: newX, y: newY }, _this.sprite._speed, Phaser.Easing.Linear.None, true);
                        t.onComplete.add(function () {
                            if (path != undefined && path.length > 0) {
                                this.moveTo(0, 0, path, animate, faceDirection).then(function (res) {
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
                    var p2_2 = this.projection.getPosition();
                    if (p1.x == p2_2.x && p1.y == p2_2.y) {
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
            Pawn.prototype.setHp = function (hp, forceAnimation) {
                if ((this.isAlive() || forceAnimation) && hp <= 0) {
                    this.sprite.die();
                }
                this._hp = hp;
                this.game.signalManager.onHpChange.dispatch(this);
            };
            Pawn.prototype.getSprite = function () {
                return this.sprite;
            };
            Pawn.prototype.export = function () {
                return {
                    _id: this._id,
                    direction: this.getDirection(),
                    position: this.getPosition(),
                    hp: this.getHp(),
                    name: this._name,
                    type: this.type,
                    spriteClass: this.spriteClass
                };
            };
            Pawn.prototype.getSelectedSkill = function () {
                return this.skills.filter(function (skill) { return skill.selected; })[0];
            };
            return Pawn;
        }());
        Entity.Pawn = Pawn;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Position = (function () {
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        Position.prototype.get = function () {
            return {
                x: this.x,
                y: this.y
            };
        };
        Position.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Position.prototype.setX = function (x) {
            this.x = x;
        };
        Position.prototype.setY = function (y) {
            this.y = y;
        };
        Position.prototype.equals = function (position) {
            return this.x == position.x && this.y == position.y;
        };
        Position.prototype.faces = function (position, direction) {
            return (this.x == position.x && ((this.y == position.y + 1 && direction == 'N') || (this.y == position.y - 1 && direction == 'S')) ||
                this.y == position.y && ((this.x == position.x + 1 && direction == 'W') || (this.x == position.x - 1 && direction == 'E')));
        };
        Position.prototype.getDistanceFrom = function (position) {
            return Math.abs(this.x - position.x) + Math.abs(this.y - position.y);
        };
        return Position;
    }());
    TacticArena.Position = Position;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Step = (function () {
            function Step(stepUnits) {
                if (stepUnits === void 0) { stepUnits = []; }
                this.stepUnits = stepUnits;
            }
            return Step;
        }());
        Entity.Step = Step;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var StepUnit = (function () {
            function StepUnit(pawn, data, order) {
                this._id = null;
                this.pawn = pawn;
                this.data = data;
                this.order = order;
            }
            return StepUnit;
        }());
        Entity.StepUnit = StepUnit;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var StepUnitData = (function () {
            function StepUnitData(ap, hp) {
                if (ap === void 0) { ap = null; }
                if (hp === void 0) { hp = null; }
                this.moveHasBeenBlocked = false;
                this.positionBlocked = null;
                this.moved = null;
                this.ap = ap;
                this.hp = hp;
                this.dies = false;
                this.aWasFacingB = false;
                this.aWasNextToB = false;
                this.fleeRate = 50;
                this.entityAApCost = 1;
                this.entityBHpLost = 0;
                this.aIsActive = false;
                this.aIsAlive = true;
                this.keepDirection = false;
                this.keepPosition = false;
                this.equalPositions = false;
                this.differentTeams = false;
                this.alteredEntityB = false;
                this.positionBBeforeOrder = null;
            }
            return StepUnitData;
        }());
        Entity.StepUnitData = StepUnitData;
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Animation;
    (function (Animation) {
        var Attack = (function (_super) {
            __extends(Attack, _super);
            function Attack(pawn, order, position, state) {
                var _this = _super.call(this, pawn, order, position) || this;
                _this.targets = [];
                // TODO voué à disparaître
                _this.state = state;
                _this.order.targets.forEach(function (t) { _this.targets.push(_this.state.orderManager.getPawn(t)); });
                return _this;
            }
            Attack.prototype.get = function () {
                var animation = this.pawn.attack(this.targets[0]).then(function (res) {
                    return res;
                });
                return _super.prototype.handleBackward.call(this, animation);
            };
            return Attack;
        }(TacticArena.BaseAnimation));
        Animation.Attack = Attack;
    })(Animation = TacticArena.Animation || (TacticArena.Animation = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Animation;
    (function (Animation) {
        var Block = (function (_super) {
            __extends(Block, _super);
            function Block(pawn, order, position, targetPosition, animate) {
                var _this = _super.call(this, pawn, order, position) || this;
                _this.targetPosition = targetPosition;
                _this.animate = animate;
                return _this;
            }
            Block.prototype.get = function () {
                var _this = this;
                if (this.animate) {
                    return this.pawn.moveTo(this.targetPosition.x, this.targetPosition.y).then(function (res) {
                        _this.pawn.blocked();
                        _this.pawn.moveTo(_this.position.x, _this.position.y).then(function (res) {
                            return res;
                        });
                    });
                }
                else {
                    return new Animation.Stand(this.pawn, this.order, this.position).get();
                }
            };
            return Block;
        }(TacticArena.BaseAnimation));
        Animation.Block = Block;
    })(Animation = TacticArena.Animation || (TacticArena.Animation = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Animation;
    (function (Animation) {
        var CastFire = (function (_super) {
            __extends(CastFire, _super);
            function CastFire(pawn, order, position, state) {
                var _this = _super.call(this, pawn, order, position) || this;
                // TODO voué à disparaitre
                _this.state = state;
                _this.targets = [];
                order.targets.forEach(function (t) { _this.targets.push(_this.state.orderManager.getPawn(t)); });
                return _this;
            }
            CastFire.prototype.get = function () {
                var _this = this;
                var self = this;
                var animation = new Promise(function (resolve, reject) {
                    if (_this.pawn.projection) {
                        _this.pawn.projection.hide();
                        _this.pawn.show();
                    }
                    _this.pawn.faceDirection(_this.order.direction);
                    _this.pawn.sprite.cast(_this.targets, function () {
                        self.pawn.sprite.stand();
                        resolve(true);
                    });
                });
                return _super.prototype.handleBackward.call(this, animation);
            };
            return CastFire;
        }(TacticArena.BaseAnimation));
        Animation.CastFire = CastFire;
    })(Animation = TacticArena.Animation || (TacticArena.Animation = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Animation;
    (function (Animation) {
        var CastWind = (function (_super) {
            __extends(CastWind, _super);
            function CastWind(pawn, order, position, state) {
                var _this = _super.call(this, pawn, order, position) || this;
                // TODO voué à disparaitre
                _this.state = state;
                _this.targets = [];
                _this.order.targets.forEach(function (t) {
                    _this.targets.push({
                        entity: _this.state.orderManager.getPawn(t.entity),
                        moved: t.moved
                    });
                });
                return _this;
            }
            CastWind.prototype.get = function () {
                var _this = this;
                var self = this;
                var animation = new Promise(function (resolve, reject) {
                    if (_this.pawn.projection) {
                        _this.pawn.projection.hide();
                        _this.pawn.show();
                    }
                    _this.pawn.faceDirection(_this.order.direction);
                    _this.pawn.sprite.castTornado(_this.targets, function () {
                        self.pawn.sprite.stand();
                        resolve(true);
                    });
                });
                return _super.prototype.handleBackward.call(this, animation);
            };
            return CastWind;
        }(TacticArena.BaseAnimation));
        Animation.CastWind = CastWind;
    })(Animation = TacticArena.Animation || (TacticArena.Animation = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Animation;
    (function (Animation) {
        var Move = (function (_super) {
            __extends(Move, _super);
            function Move(pawn, order, position, animate, direction) {
                if (direction === void 0) { direction = null; }
                var _this = _super.call(this, pawn, order, position) || this;
                _this.animate = animate;
                _this.direction = direction;
                return _this;
            }
            Move.prototype.get = function () {
                var _this = this;
                return this.pawn.moveTo(this.position.x, this.position.y, null, this.animate).then(function (res) {
                    console.log(_this.direction);
                    if (_this.direction) {
                        return new Animation.Stand(_this.pawn, _this.order, _this.position).get();
                    }
                    else {
                        return res;
                    }
                });
            };
            return Move;
        }(TacticArena.BaseAnimation));
        Animation.Move = Move;
    })(Animation = TacticArena.Animation || (TacticArena.Animation = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Animation;
    (function (Animation) {
        var Stand = (function (_super) {
            __extends(Stand, _super);
            function Stand(pawn, order, position) {
                return _super.call(this, pawn, order, position) || this;
            }
            Stand.prototype.get = function () {
                var _this = this;
                var animation = new Promise(function (resolve, reject) {
                    _this.pawn.faceDirection(_this.order.direction);
                    setTimeout(function () {
                        resolve(true);
                    }, 250);
                });
                return _super.prototype.handleBackward.call(this, animation);
            };
            return Stand;
        }(TacticArena.BaseAnimation));
        Animation.Stand = Stand;
    })(Animation = TacticArena.Animation || (TacticArena.Animation = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Character;
        (function (Character) {
            var Ruairi = (function (_super) {
                __extends(Ruairi, _super);
                function Ruairi(game, x, y, ext, id, bot, team) {
                    var _this = _super.call(this, game, x, y, ext, 'redhead', id, bot, team, "Ruairi", Entity.Sprite) || this;
                    _this.skills = _this.skills.concat([
                        new TacticArena.Entity.Skill.Slash(_this.game, _this),
                        //new TacticArena.Entity.Skill.Wind(this.game, this),
                        new TacticArena.Entity.Skill.Fire(_this.game, _this),
                        new TacticArena.Entity.Skill.Walk(_this.game, _this),
                        new TacticArena.Entity.Skill.Wait(_this.game, _this)
                    ]);
                    return _this;
                }
                return Ruairi;
            }(TacticArena.Entity.Pawn));
            Character.Ruairi = Ruairi;
        })(Character = Entity.Character || (Entity.Character = {}));
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Order;
    (function (Order) {
        var Attack = (function (_super) {
            __extends(Attack, _super);
            function Attack(position, direction, targets) {
                return _super.call(this, 'attack', position, direction, targets) || this;
            }
            Attack.prototype.resolve = function (pawn, stepUnitData, previousStep, animate, backward, i, state) {
                return new TacticArena.Animation.Attack(pawn, this, pawn.getPosition(), state).get();
            };
            return Attack;
        }(TacticArena.BaseOrder));
        Order.Attack = Attack;
    })(Order = TacticArena.Order || (TacticArena.Order = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Order;
    (function (Order) {
        var Dead = (function (_super) {
            __extends(Dead, _super);
            function Dead(position, direction) {
                return _super.call(this, 'dead', position, direction) || this;
            }
            return Dead;
        }(TacticArena.BaseOrder));
        Order.Dead = Dead;
    })(Order = TacticArena.Order || (TacticArena.Order = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Order;
    (function (Order) {
        var Fire = (function (_super) {
            __extends(Fire, _super);
            function Fire(position, direction, targets) {
                if (targets === void 0) { targets = []; }
                return _super.call(this, 'cast', position, direction, targets) || this;
            }
            Fire.prototype.process = function (ordermanager, steps, stepIndex, aIndex, bIndex) {
                var result = this;
                var stepUnits = steps[stepIndex].stepUnits;
                var stepUnitA = stepUnits[aIndex];
                var stepUnitB = stepUnits[bIndex];
                stepUnitA.data.entityAApCost++;
                var path = ordermanager.game.stageManager.getLinearPath(stepUnitA.pawn, 4, stepUnitA.order.direction, stepUnitA.order.position);
                stepUnitA.order.targets = stepUnitA.order.targets || [];
                for (var k = 0; k < path.length; k++) {
                    var targetPosition = stepUnitB.data.moveHasBeenBlocked ? stepUnitA.data.positionBBeforeOrder : stepUnitB.order.position;
                    if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                        stepUnitA.order.targets.push(stepUnitB.pawn._id);
                        stepUnitA.data.entityBHpLost += 2;
                    }
                }
                return result;
            };
            Fire.prototype.resolve = function (pawn, stepUnitData, previousStep, animate, backward, i, state) {
                return new TacticArena.Animation.CastFire(pawn, this, pawn.getPosition(), state).get();
            };
            return Fire;
        }(TacticArena.BaseOrder));
        Order.Fire = Fire;
    })(Order = TacticArena.Order || (TacticArena.Order = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Order;
    (function (Order) {
        var ReflexOrder = (function (_super) {
            __extends(ReflexOrder, _super);
            function ReflexOrder(action, position, direction) {
                return _super.call(this, action, position, direction) || this;
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
            ReflexOrder.prototype.process = function (ordermanager, steps, stepIndex, aIndex, bIndex) {
                var result = this;
                var stepUnits = steps[stepIndex].stepUnits;
                var stepUnitA = stepUnits[aIndex];
                var stepUnitB = stepUnits[bIndex];
                if (stepUnitA.data.aWasNextToB && stepUnitA.data.aWasFacingB && stepUnitA.data.aIsActive && stepUnitA.data.differentTeams &&
                    stepUnitA.data.keepDirection && (stepUnitA.data.keepPosition || stepUnitA.data.equalPositions)) {
                    var entityBIsDodging = true;
                    if (TacticArena.OrderManager.resolutionEsquive(stepUnitA.data.fleeRate)) {
                        stepUnitA.data.entityBHpLost += 1;
                        entityBIsDodging = false;
                        if (stepUnitA.data.alteredEntityB) {
                            stepUnitB.data.moveHasBeenBlocked = (stepUnitB.order.action == 'move');
                        }
                    }
                    result = new Order.Attack(this.position, this.direction, [{
                            entityId: stepUnitB._id,
                            dodge: entityBIsDodging,
                            damages: stepUnitA.data.entityBHpLost
                        }]);
                }
                if (result === null) {
                    result = this;
                }
                return result;
            };
            return ReflexOrder;
        }(TacticArena.BaseOrder));
        Order.ReflexOrder = ReflexOrder;
    })(Order = TacticArena.Order || (TacticArena.Order = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="ReflexOrder.ts"/>
var TacticArena;
(function (TacticArena) {
    var Order;
    (function (Order) {
        var Move = (function (_super) {
            __extends(Move, _super);
            function Move(position, direction, target) {
                var _this = _super.call(this, 'move', position, direction) || this;
                _this.target = target;
                return _this;
            }
            Move.prototype.resolve = function (pawn, stepUnitData, previousStep, animate, backward, i, state) {
                var result = null;
                if (stepUnitData.moveHasBeenBlocked) {
                    result = new TacticArena.Animation.Block(pawn, this, pawn.getPosition(), stepUnitData.positionBlocked, animate).get();
                }
                else {
                    if (backward && pawn.getPosition().equals(this.position)) {
                        var direction = previousStep ? previousStep[i].order.direction : pawn.getDirection();
                        result = new TacticArena.Animation.Stand(pawn, this, pawn.getPosition()).get();
                    }
                    else {
                        result = new TacticArena.Animation.Move(pawn, this, this.position, animate, this.direction).get();
                    }
                }
                return result;
            };
            return Move;
        }(Order.ReflexOrder));
        Order.Move = Move;
    })(Order = TacticArena.Order || (TacticArena.Order = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="ReflexOrder.ts"/>
var TacticArena;
(function (TacticArena) {
    var Order;
    (function (Order) {
        var Slash = (function (_super) {
            __extends(Slash, _super);
            function Slash(position, direction) {
                return _super.call(this, 'slash', position, direction) || this;
            }
            Slash.prototype.process = function (ordermanager, steps, stepIndex, aIndex, bIndex) {
                var result = _super.prototype.process.call(this, ordermanager, steps, stepIndex, aIndex, bIndex);
                var stepUnits = steps[stepIndex].stepUnits;
                var stepUnitA = stepUnits[aIndex];
                var stepUnitB = stepUnits[bIndex];
                stepUnitA.data.fleeRate = 0;
                if (result instanceof Order.Attack) {
                    //entityBHpLost += 1;
                }
                return result;
            };
            return Slash;
        }(Order.ReflexOrder));
        Order.Slash = Slash;
    })(Order = TacticArena.Order || (TacticArena.Order = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="ReflexOrder.ts"/>
var TacticArena;
(function (TacticArena) {
    var Order;
    (function (Order) {
        var Stand = (function (_super) {
            __extends(Stand, _super);
            function Stand(position, direction, targets) {
                var _this = _super.call(this, 'stand', position, direction) || this;
                _this.targets = targets;
                return _this;
            }
            Stand.prototype.resolve = function (pawn, stepUnitData, previousStep, animate, backward, i, state) {
                return new TacticArena.Animation.Stand(pawn, this, pawn.getPosition()).get();
            };
            return Stand;
        }(Order.ReflexOrder));
        Order.Stand = Stand;
    })(Order = TacticArena.Order || (TacticArena.Order = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Order;
    (function (Order) {
        var Wind = (function (_super) {
            __extends(Wind, _super);
            function Wind(position, direction) {
                return _super.call(this, 'cast_wind', position, direction) || this;
            }
            Wind.prototype.process = function (ordermanager, steps, stepIndex, aIndex, bIndex) {
                var result = this;
                var stepUnits = steps[stepIndex].stepUnits;
                var stepUnitA = stepUnits[aIndex];
                var stepUnitB = stepUnits[bIndex];
                stepUnitA.data.entityAApCost++;
                var path = ordermanager.game.stageManager.getLinearPath(stepUnitA.pawn, 4, stepUnitA.order.direction, stepUnitA.order.position);
                stepUnitA.order.targets = stepUnitA.order.targets || [];
                for (var k = 0; k < path.length; k++) {
                    var targetPosition = stepUnitB.data.moveHasBeenBlocked ? stepUnitA.data.positionBBeforeOrder : stepUnitB.order.position;
                    if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                        var moved = new TacticArena.Position(stepUnitB.order.position.x, stepUnitB.order.position.y);
                        if (stepUnitB.data.moved) {
                            moved = stepUnitB.data.moved;
                        }
                        if (stepUnitA.order.direction == 'E') {
                            moved.setX(moved.x + 1);
                        }
                        else if (stepUnitA.order.direction == 'W') {
                            moved.setX(moved.x - 1);
                        }
                        else if (stepUnitA.order.direction == 'S') {
                            moved.setY(moved.y + 1);
                        }
                        else if (stepUnitA.order.direction == 'N') {
                            moved.setY(moved.y - 1);
                        }
                        if (!ordermanager.tileIsFree(stepUnits, moved) || ordermanager.game.stageManager.isObstacle(moved)) {
                            moved = null;
                        }
                        stepUnitB.data.moved = moved;
                        stepUnitA.order.targets.push({
                            entity: stepUnitB.pawn._id,
                            moved: { x: moved.x, y: moved.y, d: ordermanager.game.stageManager.getNbTilesBetween(stepUnitA.order.position, stepUnitB.order.position) }
                        });
                        stepUnitA.data.entityBHpLost += 1;
                        ordermanager.pacifyEntity(steps, stepIndex + 1, bIndex, stepUnitB.order, stepUnitB.pawn, stepUnitB.data);
                    }
                }
                return result;
            };
            Wind.prototype.resolve = function (pawn, stepUnitData, previousStep, animate, backward, i, state) {
                return new TacticArena.Animation.CastWind(pawn, this, pawn.getPosition(), state).get();
            };
            return Wind;
        }(TacticArena.BaseOrder));
        Order.Wind = Wind;
    })(Order = TacticArena.Order || (TacticArena.Order = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Skill;
        (function (Skill) {
            var Fire = (function (_super) {
                __extends(Fire, _super);
                function Fire(state, pawn) {
                    var _this = _super.call(this, state, pawn) || this;
                    _this.id = 'fire';
                    _this.name = 'Fire';
                    _this.description = 'Cost: 2 AP; Range 4; Hit: 100%';
                    _this.icon = _this.state.make.sprite(0, 0, 'icon-fire');
                    _this.minCost = 2;
                    return _this;
                }
                Fire.prototype.updateUI = function (position) {
                    var distance = this.state.stageManager.getNbTilesBetween(position, this.pawn.getProjectionOrReal().getPosition());
                    if (distance <= 4) {
                        var path = this.state.stageManager.getLinearPath(this.pawn.getProjectionOrReal(), 4);
                        this.state.stageManager.showPossibleLinearTrajectories(path);
                        var isInPath = false;
                        for (var i = 0; i < path.length; i++) {
                            if (path[i].x == position.x && path[i].y == position.y) {
                                isInPath = true;
                            }
                        }
                        this.state.stageManager.clearPath(this.state.pathTilesGroup);
                        if (isInPath) {
                            this.state.stageManager.showPath(path, this.state.pathTilesGroup, 0xfc000f);
                            this.state.uiManager.pawnsinfosUI.showApCost(this.pawn, 2);
                        }
                    }
                    else {
                        this.state.stageManager.clearHelp();
                    }
                };
                Fire.prototype.order = function (target) {
                    var position = this.pawn.getProjectionOrReal().getPosition();
                    var distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
                    if (distance <= 4) {
                        var path = this.state.stageManager.getLinearPath(this.pawn.getProjectionOrReal(), 4);
                        this.state.stageManager.showPossibleLinearTrajectories(path);
                        var isInPath = false;
                        var maxX = null;
                        var maxY = null;
                        for (var i = 0; i < path.length; i++) {
                            if (path[i].x == target.x && path[i].y == target.y) {
                                isInPath = true;
                            }
                            if (this.state.stageManager.getNbTilesBetween({ 'x': path[i].x, 'y': path[i].y }, position) == 4) {
                                maxX = path[i].x;
                                maxY = path[i].y;
                            }
                        }
                        if (isInPath) {
                            this.pawn.createProjection();
                            this.pawn.getProjectionOrReal().halfcast();
                            this.pawn.setAp(this.pawn.getAp() - 2);
                            this.state.uiManager.pawnsinfosUI.showApCost(this.pawn, 0);
                            this.state.orderManager.add(this.pawn, new TacticArena.Order.Fire(position, this.pawn.getProjectionOrReal().getDirection()));
                            this.state.stageManager.clearHelp();
                            this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                        }
                    }
                };
                return Fire;
            }(TacticArena.Entity.BaseSkill));
            Skill.Fire = Fire;
        })(Skill = Entity.Skill || (Entity.Skill = {}));
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Skill;
        (function (Skill) {
            var Slash = (function (_super) {
                __extends(Slash, _super);
                function Slash(state, pawn) {
                    var _this = _super.call(this, state, pawn) || this;
                    _this.id = 'slash';
                    _this.name = 'Slash';
                    _this.description = 'Cost: 1 AP; Range 1; Hit: 100%';
                    _this.icon = _this.state.make.sprite(0, 0, 'icon-slash');
                    _this.minCost = 1;
                    return _this;
                }
                Slash.prototype.updateUI = function (position) {
                    var distance = this.state.stageManager.getNbTilesBetween(position, this.pawn.getProjectionOrReal().getPosition());
                    if (distance <= 2) {
                        var path = this.state.stageManager.getFrontTile(this.pawn.getProjectionOrReal());
                        this.state.stageManager.showPossibleLinearTrajectories(path);
                        var isInPath = false;
                        for (var i = 0; i < path.length; i++) {
                            if (path[i].x == position.x && path[i].y == position.y) {
                                isInPath = true;
                            }
                        }
                        this.state.stageManager.clearPath(this.state.pathTilesGroup);
                        if (isInPath) {
                            this.state.stageManager.showPath(path, this.state.pathTilesGroup, 0xfc000f);
                            this.state.uiManager.pawnsinfosUI.showApCost(this.pawn, 1);
                        }
                    }
                    else {
                        this.state.stageManager.clearHelp();
                    }
                };
                Slash.prototype.order = function (target) {
                    var position = this.pawn.getProjectionOrReal().getPosition();
                    var distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
                    if (distance <= 1) {
                        var path = this.state.stageManager.getFrontTile(this.pawn.getProjectionOrReal());
                        this.state.stageManager.showPossibleLinearTrajectories(path);
                        var isInPath = false;
                        for (var i = 0; i < path.length; i++) {
                            if (path[i].x == target.x && path[i].y == target.y) {
                                isInPath = true;
                            }
                        }
                        if (isInPath) {
                            this.pawn.createProjection();
                            this.pawn.getProjectionOrReal().getSprite().stand();
                            this.pawn.getProjectionOrReal().getSprite().attack();
                            this.pawn.setAp(this.pawn.getAp() - 1);
                            this.state.uiManager.this.pawnsinfosUI.showApCost(this.pawn, 0);
                            this.state.orderManager.add(this.pawn, new TacticArena.Order.Slash(position, this.pawn.getProjectionOrReal().getDirection()));
                            this.state.stageManager.clearHelp();
                            this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                        }
                    }
                };
                return Slash;
            }(TacticArena.Entity.BaseSkill));
            Skill.Slash = Slash;
        })(Skill = Entity.Skill || (Entity.Skill = {}));
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Skill;
        (function (Skill) {
            var Wait = (function (_super) {
                __extends(Wait, _super);
                function Wait(state, pawn) {
                    var _this = _super.call(this, state, pawn) || this;
                    _this.id = 'wait';
                    _this.name = 'Wait';
                    _this.description = 'Cost: 1 AP / tile; Hit: 50%';
                    _this.icon = _this.state.make.sprite(0, 0, 'icon-wait');
                    _this.minCost = 1;
                    return _this;
                }
                Wait.prototype.order = function () {
                    var position = this.pawn.getProjectionOrReal().getPosition();
                    this.state.orderManager.add('stand', this.pawn, position.x, position.y, this.pawn.getProjectionOrReal().getDirection());
                    this.pawn.setAp(this.pawn.getAp() - 1);
                    this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                };
                return Wait;
            }(TacticArena.Entity.BaseSkill));
            Skill.Wait = Wait;
        })(Skill = Entity.Skill || (Entity.Skill = {}));
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Skill;
        (function (Skill) {
            var Walk = (function (_super) {
                __extends(Walk, _super);
                function Walk(state, pawn) {
                    var _this = _super.call(this, state, pawn) || this;
                    _this.id = 'walk';
                    _this.name = 'Walk';
                    _this.description = 'Cost: 1 AP / tile; Hit: 50%';
                    _this.icon = _this.state.make.sprite(0, 0, 'icon-walk');
                    _this.minCost = 1;
                    // TODO remove
                    _this.selected = true;
                    return _this;
                }
                Walk.prototype.updateUI = function (position) {
                    var _this = this;
                    this.state.stageManager.canMove(this.pawn.getProjectionOrReal(), position.x, position.y, this.pawn.getAp()).then(function (path) {
                        _this.state.stageManager.clearHelp();
                        _this.state.stageManager.showPath(path, _this.state.pathTilesGroup);
                        _this.state.stageManager.showPossibleMove(_this.pawn.getProjectionOrReal().getPosition(), _this.pawn.getReal().getAp());
                        _this.state.uiManager.pawnsinfosUI.showApCost(_this.pawn, path.length);
                    }, function (res) {
                        _this.state.stageManager.clearHelp();
                    });
                };
                Walk.prototype.order = function (target) {
                    var _this = this;
                    console.log(this.pawn);
                    var distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
                    this.state.stageManager.canMove(this.pawn.getProjectionOrReal(), target.x, target.y, this.pawn.getAp()).then(function (path) {
                        _this.state.process = true;
                        _this.pawn.createProjection();
                        var resultPath = JSON.parse(JSON.stringify(path));
                        _this.pawn.projection.moveTo(0, 0, path).then(function (res) {
                            _this.pawn.setAp(_this.pawn.getAp() - distance);
                            for (var i = 0; i < resultPath.length; i++) {
                                var order = new TacticArena.Order.Move(new TacticArena.Position(resultPath[i].x, resultPath[i].y), _this.pawn.getProjectionOrReal().getDirection());
                                _this.state.orderManager.add(_this.pawn, order);
                            }
                            _this.state.process = false;
                            _this.state.signalManager.onActionPlayed.dispatch(_this.pawn);
                        });
                    }, function (res) {
                    });
                };
                return Walk;
            }(TacticArena.Entity.BaseSkill));
            Skill.Walk = Walk;
        })(Skill = Entity.Skill || (Entity.Skill = {}));
    })(Entity = TacticArena.Entity || (TacticArena.Entity = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Entity;
    (function (Entity) {
        var Skill;
        (function (Skill) {
            var Wind = (function (_super) {
                __extends(Wind, _super);
                function Wind(state, pawn) {
                    var _this = _super.call(this, state, pawn) || this;
                    _this.id = 'wind';
                    _this.name = 'Wind';
                    _this.description = 'Cost: 2 AP; Range 4; Push 1 tile; Hit: 100%';
                    _this.icon = _this.state.make.sprite(0, 0, 'icon-wind');
                    _this.minCost = 2;
                    return _this;
                }
                Wind.prototype.updateUI = function (position) {
                    var distance = this.state.stageManager.getNbTilesBetween(position, this.pawn.getProjectionOrReal().getPosition());
                    if (distance <= 4) {
                        var path = this.state.stageManager.getLinearPath(this.pawn.getProjectionOrReal(), 4);
                        this.state.stageManager.showPossibleLinearTrajectories(path);
                        var isInPath = false;
                        for (var i = 0; i < path.length; i++) {
                            if (path[i].x == position.x && path[i].y == position.y) {
                                isInPath = true;
                            }
                        }
                        this.state.stageManager.clearPath(this.state.pathTilesGroup);
                        if (isInPath) {
                            this.state.stageManager.showPath(path, this.state.pathTilesGroup, 0xfc000f);
                            this.state.uiManager.pawnsinfosUI.showApCost(this.pawn, 2);
                        }
                    }
                    else {
                        this.state.stageManager.clearHelp();
                    }
                };
                Wind.prototype.order = function (target) {
                    var position = this.pawn.getProjectionOrReal().getPosition();
                    var distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
                    if (distance <= 4) {
                        var path = this.state.stageManager.getLinearPath(this.pawn.getProjectionOrReal(), 4);
                        this.state.stageManager.showPossibleLinearTrajectories(path);
                        var isInPath = false;
                        var maxX = null;
                        var maxY = null;
                        for (var i = 0; i < path.length; i++) {
                            if (path[i].x == target.x && path[i].y == target.y) {
                                isInPath = true;
                            }
                            if (this.state.stageManager.getNbTilesBetween({ 'x': path[i].x, 'y': path[i].y }, { 'x': position.x, 'y': position.y }) == 4) {
                                maxX = path[i].x;
                                maxY = path[i].y;
                            }
                        }
                        if (isInPath) {
                            this.pawn.createProjection();
                            this.pawn.getProjectionOrReal().halfcast();
                            this.pawn.setAp(this.pawn.getAp() - 2);
                            this.state.uiManager.pawnsinfosUI.showApCost(this.pawn, 0);
                            this.state.orderManager.add(this.pawn, new TacticArena.Order.Wind(position, this.pawn.getProjectionOrReal().getDirection()));
                            this.state.stageManager.clearHelp();
                            this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                        }
                    }
                };
                return Wind;
            }(TacticArena.Entity.BaseSkill));
            Skill.Wind = Wind;
        })(Skill = Entity.Skill || (Entity.Skill = {}));
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
            BaseState.prototype.init = function () {
                //this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
                //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                //this.game.scale.setScreenSize( true );
                //this.scale.scaleMode = Phaser.ScaleManager.;
                //this.scale.pageAlignVertically = true;
                //this.scale.pageAlignHorizontally = true;
                //this.scale.setShowAll();
                //this.scale.refresh();
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
            BaseState.prototype.getScaleRatio = function () {
                //console.log(this.game.width / 320, this.game.height / 800, 1, this.game.height);
                //return Math.max(this.game.height / 800, 1);
                return Math.max(this.game.width / 384, 1);
            };
            return BaseState;
        }(Phaser.State));
        State.BaseState = BaseState;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="BaseState.ts"/>
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var BasePlayable = (function (_super) {
            __extends(BasePlayable, _super);
            function BasePlayable() {
                return _super.call(this) || this;
            }
            BasePlayable.prototype.init = function (data) {
                _super.prototype.init.call(this);
                this.game.stage.backgroundColor = 0x000000;
                this.process = true;
                this.modalVisible = false;
                this.tileSize = 32;
                this.isPaused = false;
                this.worldGroup = this.add.group();
                this.mapGroup = this.add.group();
                this.worldGroup.add(this.mapGroup);
                this.pathTilesGroup = this.add.group();
                this.worldGroup.add(this.pathTilesGroup);
                this.pathOrdersTilesGroup = this.add.group();
                this.worldGroup.add(this.pathOrdersTilesGroup);
                this.uiSpritesGroup = this.add.group();
                this.worldGroup.add(this.uiSpritesGroup);
                this.pawnsSpritesGroup = this.add.group();
                this.worldGroup.add(this.pawnsSpritesGroup);
                this.uiGroup = this.add.group();
                this.worldGroup.add(this.uiGroup);
                this.worldGroup.scale.set(this.getScaleRatio());
                //console.log(this.getScaleRatio());
                this.pawns = [];
                this.generator = new TacticArena.Utils.Generator();
                this.initMap();
            };
            BasePlayable.prototype.create = function () {
                this.addDecorations();
                this.pathfinder = null;
                this.pathfinder = new EasyStar.js();
                this.pathfinder.setAcceptableTiles([-1]);
                this.pathfinder.disableDiagonals();
                //this.pathfinder.enableDiagonals();
                //this.pathfinder.disableSync();
                this.pathfinder.setGrid(this.stageManager.grid);
            };
            BasePlayable.prototype.update = function () {
                this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
                this.uiSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
                this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            };
            BasePlayable.prototype.initMap = function () {
                this.stageManager = new TacticArena.StageManager(this);
                this.stageManager.init(this.mapName);
            };
            BasePlayable.prototype.addDecorations = function () {
                this.stageManager.addDecorations();
            };
            BasePlayable.prototype.shutdown = function () {
                console.log('switch');
                if (this.pointer) {
                    this.pointer.destroy();
                }
                this.pointer = null;
                //delete this.pathfinder;
                //delete this.pawns;
                //delete this.pathTilesGroup;
                //delete this.pathOrdersTilesGroup;
                //delete this.pawnsSpritesGroup;
                //delete this.uiSpritesGroup;
                //delete this.tileSize;
                //delete this.stageManager;
                //delete this.process;
                //delete this.isPaused;
                //delete this.players;
                //delete this.generator;
                //delete this.mapName;
            };
            return BasePlayable;
        }(TacticArena.State.BaseState));
        State.BasePlayable = BasePlayable;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
/// <reference path="BasePlayable.ts"/>
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var BaseBattle = (function (_super) {
            __extends(BaseBattle, _super);
            function BaseBattle() {
                return _super.call(this) || this;
            }
            BaseBattle.prototype.init = function (data, chat, server) {
                _super.prototype.init.call(this);
                this.selecting = false;
                this.hideProjections = false;
                this.teamColors = ['0x8ad886', '0xd68686', '0x87bfdb', '0xcdd385'];
                this.teams = {};
                //this.serializer = new TS.Serializer(TacticArena);
                this.signalManager = new TacticArena.SignalManager(this);
                this.signalManager.init();
                this.pointer = new TacticArena.UI.Pointer(this);
            };
            BaseBattle.prototype.create = function () {
                _super.prototype.create.call(this);
                var self = this;
                this.logManager = new TacticArena.LogManager(this);
                this.orderManager = new TacticArena.OrderManager(this);
                this.resolveManager = new TacticArena.ResolveManager(this);
                this.turnManager = new TacticArena.TurnManager(this);
                this.uiManager = new TacticArena.UI.UIManager(this);
                if (this.chatUI) {
                    this.chatUI.menu = this.uiManager;
                }
                var playerPawns = this.pawns.filter(function (pawn) { return pawn.team == self.playerTeam; });
                this.uiManager.initOrderPhase(playerPawns[0], true);
            };
            BaseBattle.prototype.isGameReadyPromise = function () {
                var self = this;
                return new Promise(function (resolve, reject) {
                    (function isGameReady() {
                        if (!self.isPaused)
                            return resolve();
                        setTimeout(isGameReady, 300);
                    })();
                });
            };
            BaseBattle.prototype.isOver = function () {
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
            BaseBattle.prototype.getUniqueId = function () {
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
            BaseBattle.prototype.getFirstAlive = function () {
                for (var i = 0; i < this.pawns.length; i++) {
                    var p = this.pawns[i];
                    if (p.team == this.playerTeam && p.isAlive()) {
                        return p;
                    }
                }
                return null;
            };
            BaseBattle.prototype.battleOver = function () {
                console.log('battle is over');
            };
            return BaseBattle;
        }(TacticArena.State.BasePlayable));
        State.BaseBattle = BaseBattle;
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
                //this.game.scale.fullScreenTarget = this.parentElement;
                //this.scale.maxHeight = window.innerHeight;
                //this.scale.maxWidth = Math.floor( this.scale.maxHeight / 1.333 );
                //var aspectRatio = this.game.width / this.game.height;
                //console.log(aspectRatio);
                //var scaleRatio = this.game.width / 512;
                //console.log(scaleRatio);
                //if(aspectRatio < 1) {
                //    scaleRatio = this.game.height / 640;
                //}
                //console.log(this.game.height, this.game.width, this.game.height / 640, this.game.width / 608);
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                //this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                //var scale = 1 / Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
                //console.log(scale);
                //console.log(scaleRatio);
                //scaleRatio = 1.01;
                //this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                //scale = 1.3;
                //this.scale.setUserScale(scale, scale);
                //this.game.renderer.renderSession.roundPixels = true;
                Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
                //this.game.scale.setResizeCallback(function (scale, parentBounds) {
                //    var _this = scale;
                //    // A value of 1 means no scaling 0.5 means half size, 2 double the size and so on.
                //     var scale = 1 * Math.min(window.innerWidth / _this.game.width, window.innerHeight / _this.game.height);
                //    // Resize parent div in order to vertically center the canvas correctly.
                //    // element.style.minHeight = window.innerHeight.toString() + "px";
                //    // Resize the canvas keeping the original aspect ratio.
                //    // _this.game.scale.setUserScale(scale, scale, 0, 0);
                //     //if (logging == true) {
                //     //    var w = Math.floor(_this.game.width * scale),
                //     //        h = Math.floor(_this.game.height * scale);
                //     //}
                //    //console.info("The game has just been resized to: " + Math.floor(_this.game.width * scale) + " x " + Math.floor(_this.game.height * scale));
                //}, this);
                this.scale.refresh();
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                this.stage.backgroundColor = '#000000';
                //this.game.scaleRatio = scaleRatio > 1 ? scaleRatio : 1;
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
                this.menu = $('#game-menu .ui');
                this.menu.html('<div><h2>Entrez un login :</h2></div>' +
                    '<div><input type="text" class="login-input" value="' + this.generator.generate() + '"/></div>' +
                    '<div class="button submit-login"><a>Confirmer</a></div>');
                this.menu.find('.submit-login').bind('click', function (e) {
                    self.login = $('#game-menu .ui .login-input').val();
                    self.initChat(self.login);
                });
                this.menu.find('.login-input').on('keyup', function (e) {
                    console.log(e);
                    if (e.keyCode == 13) {
                        self.initChat($('#game-menu .ui .login-input').val());
                    }
                });
            };
            Lobby.prototype.initChat = function (login) {
                this.menu.html('');
                var self = this;
                this.serverManager = new TacticArena.ServerManager(this, login, function (data, server) {
                    if (server === void 0) { server = false; }
                    console.log(data);
                    var msg = server ? '<span class="notification">' + data.content + '</span>' : data.name + ': ' + data.content;
                    self.chatUI.write(msg);
                }, function (data) {
                    self.chatUI.updatePlayersList(data);
                }, function (message, token) {
                    self.dialogUI.show('Duel !', message, 'Accepter', 'Décliner', function () {
                        self.serverManager.request('ACCEPT_DUEL', token);
                        self.factionSelectionUI.init('online');
                        $(this).dialog("close");
                    }, function () {
                        self.serverManager.request('DECLINE_DUEL', token);
                        $(this).dialog("close");
                    });
                }, function (data) {
                    self.factionSelectionUI.init('online');
                }, function (data) {
                    self.game.state.start('mainmultiplayeronline', true, false, data, self.chatUI, self.serverManager);
                });
                this.chatUI = new TacticArena.UI.Chat(this, this.serverManager);
                this.dialogUI = new TacticArena.UI.Dialog(this);
                this.factionSelectionUI = new TacticArena.UI.FactionSelection(this, this.menu);
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
        var MainAdventure = (function (_super) {
            __extends(MainAdventure, _super);
            function MainAdventure() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MainAdventure.prototype.init = function (data) {
                console.log(data);
                this.mapName = 'area02';
                _super.prototype.init.call(this);
                this.game.stage.backgroundColor = 0x67AEE4;
                this.pointer = new TacticArena.UI.PointerExploration(this);
                var position = (data && data.mainPawn.position) ? data.mainPawn.position : { x: 25, y: 15 };
                var direction = (data && data.mainPawn.direction) ? data.mainPawn.direction : 'N';
                var name = (data && data.mainPawn.name) ? data.mainPawn.name : 'Red';
                var type = (data && data.mainPawn.type) ? data.mainPawn.type : 'redhead';
                var spriteClass = (data && data.mainPawn.spriteClass) ? data.mainPawn.spriteClass : TacticArena.Entity.Sprite;
                this.pawns.push(new TacticArena.Entity.Pawn(this, position.x, position.y, direction, type, 1, false, 1, name, spriteClass)); //
                //this.pawns.push(new Entity.Pawn(this, 25, 6, 'E', 'rabbit', 1, false, 1, 'Amandine', Entity.MobSpriteSimpleBis)); //
                //let enemyPosition = [{x:7,y:15},{x:12,y:23},{x:14,y:11},{x:24,y:11}][Math.floor(Math.random() * 4)];
                var enemyPosition = { x: 24, y: 11 };
                this.pawns.push(new TacticArena.Entity.Pawn(this, enemyPosition.x, enemyPosition.y, 'E', 'bee', 1, false, 1, 'Amandine', TacticArena.Entity.MobSpriteSimple)); //
                this.stageManager.markPawns();
                this.dialogUI = new TacticArena.UI.Dialog(this);
            };
            MainAdventure.prototype.create = function () {
                _super.prototype.create.call(this);
                var self = this;
                //this.world.setBounds(0, 0, 2000, 2000);
                //this.game.camera.follow(this.pawns[0].getSprite(), Phaser.Camera.STYLE_TOPDOWN_TIGHT, 0.1, 0.1);
                this.process = false;
                //$(window).on('keyup', function (e) {
                //    if(e.keyCode == 37) {
                //        self.game.camera.x += 10;
                //        //self.pawns[0].getSprite().attack();
                //    } else if(e.keyCode == 38) {
                //        self.game.camera.x -= 10;
                //        //self.pawns[0].getSprite().cast();
                //    } else if(e.keyCode == 39) {
                //        //self.pawns[0].getSprite().die();
                //    }
                //});
                //let message = this.game.add.text(Math.abs(this.game.world.position.x) + this.game.camera.width/2, Math.abs(this.game.world.position.y) + this.game.camera.height/2, 'ok', { font: '20px Arial', fill: "#ffffff" });
                //message.fixedToCamera = true;
                this.dialogUI.showModal("modal1");
            };
            MainAdventure.prototype.update = function () {
                _super.prototype.update.call(this);
                this.game.camera.focusOnXY(this.pawns[0].getSprite().x + 16, this.pawns[0].getSprite().y + 16);
            };
            return MainAdventure;
        }(TacticArena.State.BasePlayable));
        State.MainAdventure = MainAdventure;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var AiManager = TacticArena.AiManager;
        var StageManager = TacticArena.StageManager;
        var MainAdventureBattle = (function (_super) {
            __extends(MainAdventureBattle, _super);
            function MainAdventureBattle() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MainAdventureBattle.prototype.init = function (data) {
                var _this = this;
                console.log(data);
                this.data = data;
                _super.prototype.init.call(this);
                this.game.stage.backgroundColor = 0x67AEE4;
                this.playMode = 'offline';
                this.data.players.forEach(function (p, k) {
                    var isBot = true;
                    if (p.player) {
                        _this.playerTeam = k;
                        isBot = false;
                    }
                    else {
                        _this.aiManager = new AiManager(_this, k);
                    }
                    _this.pawns.push(new TacticArena.Entity.Pawn(_this, p.position.x, p.position.y, p.direction, p.type, _this.getUniqueId(), isBot, k, p.name, p.spriteClass));
                });
            };
            MainAdventureBattle.prototype.create = function () {
                _super.prototype.create.call(this);
                //this.game.camera.focusOnXY(this.pawns[0].getSprite().x + 16, this.pawns[0].getSprite().y + 16);
                this.game.camera.focusOnXY(this.data.center.x * this.tileSize + 16, this.data.center.y * this.tileSize + 16);
            };
            MainAdventureBattle.prototype.initMap = function () {
                console.log(this.data);
                this.stageManager = new StageManager(this);
                this.stageManager.initFromArray(this.data.stage, this.data.gridWidth, this.data.gridHeight);
            };
            MainAdventureBattle.prototype.addDecorations = function () {
                this.stageManager.addDecorationsFromData(this.data);
                this.stageManager.addBlackLayer(this.data);
            };
            MainAdventureBattle.prototype.battleOver = function () {
                _super.prototype.battleOver.call(this);
                //this.game.state.start("mainadventure", true, false, {
                //    mainPawn: this.pawns[0].export(),
                //});
            };
            return MainAdventureBattle;
        }(TacticArena.State.BaseBattle));
        State.MainAdventureBattle = MainAdventureBattle;
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
            MainMultiplayerOnline.prototype.init = function (data, chatUI, serverManager) {
                var _this = this;
                _super.prototype.init.call(this);
                var self = this;
                this.playMode = 'online';
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
                _super.prototype.create.call(this);
            };
            return MainMultiplayerOnline;
        }(TacticArena.State.BaseBattle));
        State.MainMultiplayerOnline = MainMultiplayerOnline;
    })(State = TacticArena.State || (TacticArena.State = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var State;
    (function (State) {
        var AiManager = TacticArena.AiManager;
        var MainSoloOffline = (function (_super) {
            __extends(MainSoloOffline, _super);
            function MainSoloOffline() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MainSoloOffline.prototype.init = function (data, chatUI) {
                var _this = this;
                _super.prototype.init.call(this);
                console.log(data);
                this.playMode = 'offline';
                this.chatUI = chatUI;
                this.players = data.players;
                var startPositions = [[{ x: 4, y: 9, d: 'E' }, { x: 3, y: 8, d: 'E' }], [{ x: 7, y: 9, d: 'W' }, { x: 8, y: 8, d: 'W' }]];
                this.players.forEach(function (p, k) {
                    var isBot = true;
                    if (p.player) {
                        _this.playerTeam = k;
                        isBot = false;
                    }
                    else {
                        _this.aiManager = new AiManager(_this, k);
                    }
                    if (p.faction == 'human') {
                        var pawn = new TacticArena.Entity.Character.Ruairi(_this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, _this.getUniqueId(), isBot, k);
                        _this.pawns.push(pawn);
                        //this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'amanda', this.getUniqueId(), isBot, k, this.generator.generate(), Entity.Sprite));
                    }
                    else {
                        _this.pawns.push(new TacticArena.Entity.Pawn(_this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'skeleton', _this.getUniqueId(), isBot, k, _this.generator.generate(), TacticArena.Entity.Sprite));
                        //this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'skeleton', this.getUniqueId(), isBot, k, this.generator.generate(), Entity.Sprite));
                    }
                });
            };
            MainSoloOffline.prototype.create = function () {
                _super.prototype.create.call(this);
            };
            return MainSoloOffline;
        }(TacticArena.State.BaseBattle));
        State.MainSoloOffline = MainSoloOffline;
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
                    '<div class="button options"><a>Options</a></div>' +
                    '<div class="button"><br/><br/></div>' +
                    '<div class="button">' +
                    '<a class="fa fa-envelope" href="mailto:matthieu.desprez@gmail.com" title="Contact me"></a>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;<a class="fa fa-github" href="https://github.com/Edistra" target="_blank"></a>' +
                    '</div>');
                $('.singleplayer').click(function () {
                    that.game.state.start('mainadventure');
                    //that.game.state.start('mainsolooffline', true, false, {
                    //    players: [
                    //        {name: 'Player', faction: 'human', player: true},
                    //        {name: 'BOT 01', faction: 'evil', player: false}
                    //    ]
                    //}, null);
                });
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
                var self = this;
                this.game.add.text(0, 0, "f", { font: '1px Press Start 2P', fill: "#333333" });
                this.game.add.text(0, 0, "f", { font: '1px Iceland', fill: "#333333" });
                _super.prototype.createMenu.call(this);
                this.status = this.add.text(640 / 2, this.game.world.centerY / 2 + 200, 'Loading...', { fill: 'white' });
                this.status.anchor.setTo(0.5);
                this.preloadBar = this.add.image(640 / 2, this.game.world.centerY / 2 + 150, "loading");
                this.preloadBar.anchor.setTo(0.5);
                this.load.setPreloadSprite(this.preloadBar);
                this.load.tilemap('mapmobile', 'assets/json/mapmobile.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('area02', 'assets/json/area02.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles-collection', 'assets/images/maptiles.png');
                this.load.image('path-tile', 'assets/images/path_tile.png');
                this.load.image('modal-bg', 'assets/images/modal-bg.png');
                this.load.image('modal-close', 'assets/images/modal-close.png');
                this.load.image('menu-icon', 'assets/images/menu_icon.png');
                this.load.image('icon-wait', 'assets/images/ui/icons/wait.png');
                this.load.image('button-bg', 'assets/images/ui/button.png');
                this.load.image('button-confirm', 'assets/images/ui/button-confirm.png');
                this.load.image('button-cancel', 'assets/images/ui/button-cancel.png');
                this.load.image('border', 'assets/images/ui/border.png');
                this.load.image('vertical-border', 'assets/images/ui/vertical-border.png');
                var icons = ['arrow-east', 'arrow-north', 'arrow-south', 'arrow-west', 'cancel', 'compass', 'fire', 'next', 'pause', 'play', 'previous', 'slash', 'submit', 'wait', 'walk', 'wind'];
                icons.forEach(function (icon) {
                    self.load.image('icon-' + icon, 'assets/images/icons/icon-' + icon + '.png');
                });
                this.load.image('avatar-blondy', 'assets/images/blondy_avatar.png');
                this.load.image('avatar-redhead', 'assets/images/redhead_avatar.png');
                this.load.image('avatar-evil', 'assets/images/evil_avatar.png');
                this.load.image('avatar-skeleton', 'assets/images/skeleton_avatar.png');
                this.load.atlasJSONArray('player', 'assets/images/character.png', 'assets/images/character.json');
                this.load.atlasJSONArray('orc', 'assets/images/orc.png', 'assets/images/orc.json');
                this.load.atlasJSONArray('redhead', 'assets/images/redhead.png', 'assets/images/redhead.json');
                this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
                this.load.atlasJSONArray('blondy', 'assets/images/blondy.png', 'assets/images/blondy.json');
                this.load.atlasJSONArray('amanda', 'assets/images/amanda.png', 'assets/images/amanda.json');
                this.load.atlasJSONArray('evil', 'assets/images/evil.png', 'assets/images/evil.json');
                this.load.atlasJSONArray('snake', 'assets/images/snake.png', 'assets/images/snake.json');
                this.load.atlasJSONArray('poring', 'assets/images/poring.png', 'assets/images/poring.json');
                this.load.atlasJSONArray('roguefemale', 'assets/images/roguefemale.png', 'assets/images/roguefemale.json');
                this.load.atlasJSONArray('bee', 'assets/images/bee.png', 'assets/images/bee.json');
                this.load.atlasJSONArray('rabbit', 'assets/images/rabbit.png', 'assets/images/rabbit.json');
                this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
                this.load.atlasJSONArray('wind', 'assets/images/wind.png', 'assets/images/wind.json');
                this.load.atlasJSONArray('circle', 'assets/images/circle.png', 'assets/images/circle.json');
                this.load.image('cursor_attack', 'assets/images/cursor_attack.png');
                this.load.image('cursor_pointer', 'assets/images/cursor_pointer.png');
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
                //that.game.state.start("menu");
                //that.game.state.start("mainadventure");
                that.game.state.start('mainsolooffline', true, false, {
                    players: [
                        { name: 'BOT 01', faction: 'evil', player: false },
                        { name: 'Matt', faction: 'human', player: true }
                    ]
                }, null);
                //that.game.state.start("lobby");
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
                this.worldGroup = this.add.group();
                this.mapGroup = this.add.group();
                this.worldGroup.add(this.mapGroup);
                this.pathTilesGroup = this.add.group();
                this.worldGroup.add(this.pathTilesGroup);
                this.pathOrdersTilesGroup = this.add.group();
                this.worldGroup.add(this.pathOrdersTilesGroup);
                this.uiSpritesGroup = this.add.group();
                this.worldGroup.add(this.uiSpritesGroup);
                this.pawnsSpritesGroup = this.add.group();
                this.worldGroup.add(this.pawnsSpritesGroup);
                this.uiGroup = this.add.group();
                this.worldGroup.add(this.uiGroup);
                this.stageManager = new TacticArena.StageManager(this);
                this.stageManager.init('map');
                this.pawns = [];
                this.pathTilesGroup = this.add.group();
                this.pawnsSpritesGroup = this.add.group();
                this.stageManager.addDecorations();
                this.pathfinder = new EasyStar.js();
                this.pathfinder.setAcceptableTiles([-1]);
                this.pathfinder.disableDiagonals();
                this.pathfinder.disableSync();
                this.pathfinder.setGrid(this.stageManager.grid);
                this.signalManager = new TacticArena.SignalManager(this);
                this.logManager = new TacticArena.LogManager(this);
                this.orderManager = new TacticArena.OrderManager(this);
                this.resolveManager = new TacticArena.ResolveManager(this);
                this.turnManager = new TacticArena.TurnManager(this);
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
        var ActionMenu = (function () {
            function ActionMenu(game, pawn) {
                var self = this;
                this.isOver = false;
                this.game = game;
                this.mainGroup = this.game.add.group();
                var bmd = this.game.add.bitmapData(this.game.world.width, 96);
                bmd.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                bmd.ctx.beginPath();
                bmd.ctx.rect(0, 0, this.game.world.width, 96);
                bmd.ctx.fill();
                bmd.update();
                var bgSprite = this.game.make.sprite(0, 0, bmd);
                bgSprite.anchor.set(0);
                bgSprite.inputEnabled = true;
                bgSprite.events.onInputOver.add(this.over, this);
                bgSprite.events.onInputOut.add(this.out, this);
                var border = this.game.make.sprite(0, 0, 'border');
                border.anchor.set(0);
                var verticalBorder = this.game.make.sprite(100, 4, 'vertical-border');
                verticalBorder.anchor.set(0);
                var avatar = this.game.make.sprite(0, 0, 'avatar-' + pawn.type);
                avatar.anchor.set(0);
                this.mainGroup.add(bgSprite);
                this.mainGroup.add(border);
                this.mainGroup.add(verticalBorder);
                this.mainGroup.add(avatar);
                this.mainGroup.x = 0;
                this.mainGroup.y = window.innerHeight / this.game.getScaleRatio() - 96;
                var text = this.game.add.text(0, 5, pawn._name, {
                    font: '20px Iceland',
                    fill: '#ffffff',
                    boundsAlignH: 'right',
                    boundsAlignV: 'top',
                }, this.mainGroup);
                text.setTextBounds(0, 8, 90, 20);
                var barWidth = this.game.world.width / 2 - 64;
                this.mainGroup.add(new UI.Bar(this.game, {
                    x: 110,
                    y: 15,
                    width: barWidth,
                    height: 15,
                    text: true,
                    name: 'hpbar',
                    unit: 'HP',
                    max: pawn._hpMax,
                    value: pawn.getHp(),
                    textColor: '#ffffff',
                    bg: { color: '#808080' },
                    bar: { color: '#8b0000' },
                    textStyle: '16px Iceland'
                }));
                this.mainGroup.add(new UI.Bar(this.game, {
                    x: 120 + barWidth,
                    y: 15,
                    width: barWidth,
                    height: 15,
                    text: true,
                    name: 'apbar',
                    unit: 'AP',
                    max: pawn._apMax,
                    value: pawn.getAp(),
                    textColor: '#ffffff',
                    bg: { color: '#267ac9' },
                    bar: { color: '#1E90FF' },
                    textStyle: '16px Iceland'
                }));
                this.skillsGroup = this.game.add.group();
                var offsetX = 47;
                pawn.skills.forEach(function (skill, index) {
                    console.log(skill);
                    var buttonX = index > 0 ? index * 83 : 0;
                    var buttonY = 0;
                    if (index > 0) {
                        buttonX += index * 10;
                    }
                    if (index >= 2) {
                        buttonY = 30;
                        buttonX -= 2 * 10 + 2 * 83;
                    }
                    var button = self.game.make.sprite(offsetX + buttonX, buttonY, 'button-bg');
                    button.anchor.set(0);
                    button.scale.setTo(1.5, 1.5);
                    self.skillsGroup.add(button);
                    var text = self.game.add.text(buttonX, buttonY, skill.name, {
                        font: '10px Press Start 2P',
                        fill: '#000000',
                        boundsAlignH: 'center',
                        boundsAlignV: 'top',
                    }, self.skillsGroup);
                    text.setTextBounds(offsetX, 8, 83, 20);
                });
                this.skillsGroup.x = 110;
                this.skillsGroup.y = 35;
                var buttonConfirm = self.game.make.sprite(self.game.world.width - 37 - self.skillsGroup.position.x, 5, 'button-confirm');
                buttonConfirm.anchor.set(0);
                self.skillsGroup.add(buttonConfirm);
                var buttonCancel = self.game.make.sprite(-5, 5, 'button-cancel');
                buttonCancel.anchor.set(0);
                self.skillsGroup.add(buttonCancel);
                this.mainGroup.add(this.skillsGroup);
                this.game.uiGroup.add(this.mainGroup);
            }
            ActionMenu.prototype.over = function () {
                console.log('over');
                this.isOver = true;
            };
            ActionMenu.prototype.out = function () {
                console.log('out');
                this.isOver = false;
            };
            ActionMenu.prototype.initDirection = function (direction) {
                this.savedDirection = direction;
                this.selectDirection(direction);
            };
            ActionMenu.prototype.selectDirection = function (direction) {
                //deselect direction icons
                //select right direction icon
            };
            ActionMenu.prototype.clean = function () {
                this.mainGroup.destroy();
            };
            return ActionMenu;
        }());
        UI.ActionMenu = ActionMenu;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var UI;
    (function (UI) {
        var Bar = (function (_super) {
            __extends(Bar, _super);
            function Bar(game, providedConfig) {
                var _this = _super.call(this, game) || this;
                _this.game = game;
                _this.setupConfiguration(providedConfig);
                _this.setPosition(_this.config.x, _this.config.y);
                _this.setValue(_this.config.value);
                _this.drawBackground();
                _this.drawBar();
                if (_this.config.text) {
                    _this.drawText();
                }
                console.log(_this.config);
                return _this;
                //this.setFixedToCamera(this.config.isFixedToCamera);
            }
            Bar.prototype.setValue = function (value) {
                this.value = value;
            };
            Bar.prototype.updateValue = function (value) {
                this.setValue(value);
                this.updateText();
            };
            Bar.prototype.setupConfiguration = function (providedConfig) {
                this.config = this.mergeWithDefaultConfiguration(providedConfig);
            };
            Bar.prototype.mergeWithDefaultConfiguration = function (newConfig) {
                var defaultConfig = {
                    width: 250,
                    height: 40,
                    x: 0,
                    y: 0,
                    bg: {
                        color: '#651828'
                    },
                    bar: {
                        color: '#FEFF03'
                    },
                    animationDuration: 200,
                    isFixedToCamera: false,
                    text: false,
                    max: 0,
                    unit: '',
                    textStyle: '12px Iceland',
                    value: 0
                };
                return this.mergeObjects(defaultConfig, newConfig);
            };
            Bar.prototype.mergeObjects = function (targetObj, newObj) {
                for (var p in newObj) {
                    try {
                        targetObj[p] = newObj[p].constructor == Object ? this.mergeObjects(targetObj[p], newObj[p]) : newObj[p];
                    }
                    catch (e) {
                        targetObj[p] = newObj[p];
                    }
                }
                return targetObj;
            };
            Bar.prototype.drawBackground = function () {
                var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
                bmd.ctx.fillStyle = this.config.bg.color;
                bmd.ctx.beginPath();
                bmd.ctx.rect(0, 0, this.config.width, this.config.height);
                bmd.ctx.fill();
                bmd.update();
                this.bgSprite = this.game.make.sprite(0, 0, bmd);
                this.bgSprite.anchor.set(0);
                this.add(this.bgSprite);
            };
            Bar.prototype.drawBar = function () {
                var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
                bmd.ctx.fillStyle = this.config.bar.color;
                bmd.ctx.beginPath();
                bmd.ctx.rect(0, 0, this.config.width, this.config.height);
                bmd.ctx.fill();
                bmd.update();
                this.barSprite = this.game.make.sprite(0, 0, bmd);
                this.barSprite.anchor.set(0);
                this.add(this.barSprite);
            };
            Bar.prototype.drawText = function () {
                this.text = this.game.add.text(0, 0, '', {
                    font: this.config.textStyle,
                    fill: '#ffffff',
                    boundsAlignH: 'center',
                    boundsAlignV: 'top',
                }, this);
                this.text.setTextBounds(0, 0, this.width, this.height);
                this.updateText();
                //this.add(this.text);
            };
            Bar.prototype.updateText = function () {
                this.text.text = this.value + ' / ' + this.config.max + ' ' + this.config.unit;
            };
            Bar.prototype.setPosition = function (x, y) {
                this.x = x;
                this.y = y;
                //if (this.bgSprite !== undefined && this.barSprite !== undefined) {
                //    this.bgSprite.position.x = x;
                //    this.bgSprite.position.y = y;
                //
                //    this.barSprite.position.x = x - this.config.width / 2;
                //    this.barSprite.position.y = y;
                //}
            };
            Bar.prototype.setPercent = function (newValue) {
                if (newValue < 0)
                    newValue = 0;
                if (newValue > 100)
                    newValue = 100;
                var newWidth = (newValue * this.config.width) / 100;
                this.setWidth(newWidth);
            };
            Bar.prototype.setBarColor = function (newColor) {
                var bmd = this.barSprite.key;
                bmd.update();
                var currentRGBColor = bmd.getPixelRGB(0, 0);
                var newRGBColor = this.hexToRgb(newColor);
                bmd.replaceRGB(currentRGBColor.r, currentRGBColor.g, currentRGBColor.b, 255, newRGBColor.r, newRGBColor.g, newRGBColor.b, 255);
            };
            Bar.prototype.setWidth = function (newWidth) {
                this.game.add.tween(this.barSprite).to({ width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
            };
            Bar.prototype.setFixedToCamera = function (fixedToCamera) {
                this.bgSprite.fixedToCamera = fixedToCamera;
                this.barSprite.fixedToCamera = fixedToCamera;
            };
            Bar.prototype.kill = function () {
                this.bgSprite.kill();
                this.barSprite.kill();
            };
            Bar.prototype.hexToRgb = function (hex) {
                // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            };
            return Bar;
        }(Phaser.Group));
        UI.Bar = Bar;
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
                this.element.draggable({ containment: "body" }).resizable();
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
                playersList += '<li class="channel-player bot">BOT 01</li>';
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
                                if (opt.$trigger.hasClass('bot')) {
                                    self.menu.factionSelectionUI.init('solo');
                                }
                                else {
                                    var token = opt.$trigger.attr("id");
                                    self.serverManager.request('ASK_DUEL', token);
                                    self.write('<span class="notification">La demande a été envoyée à ' + opt.$trigger.html() + '</span>');
                                }
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
            function Dialog(state) {
                var self = this;
                this.state = state;
                this.game = state.game;
                //$('body').append('<div id="dialog-confirm" class="ui-dialog" title=""><p></p></div>');
                //this.element = $('#dialog-confirm');
                this.game.modals = {};
                this.createModal({
                    type: "modal1",
                    includeBackground: true,
                    //modalCloseOnInput: true,
                    fixedToCamera: true,
                    itemsArr: [
                        //    {
                        //    type: "graphics",
                        //    graphicColor: "0xffffff",
                        //    graphicWidth: 300,
                        //    graphicHeight: 300,
                        //    graphicRadius: 40
                        //},
                        {
                            type: "image",
                            content: "modal-bg",
                            offsetY: -20,
                            contentScale: 1
                        },
                        {
                            type: "image",
                            content: "modal-close",
                            offsetY: -150,
                            offsetX: 210,
                            contentScale: 1,
                            callback: function () {
                                self.hideModal("modal1");
                            }
                        },
                        {
                            type: "text",
                            content: "The white {behind} me\n{is} a {[Phaser.Graphic]}",
                            fontFamily: "Press Start 2P",
                            fontSize: 12,
                            color: "0xffffff",
                            offsetY: -50
                        },
                    ]
                });
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
            Dialog.prototype.createModal = function (options) {
                var self = this;
                var type = options.type || ''; // must be unique
                var includeBackground = options.includeBackground; // maybe not optional
                var backgroundColor = options.backgroundColor || "0x000000";
                var backgroundOpacity = options.backgroundOpacity === undefined ? 0.7 : options.backgroundOpacity;
                var modalCloseOnInput = options.modalCloseOnInput || false;
                var modalBackgroundCallback = options.modalBackgroundCallback || false;
                var vCenter = options.vCenter || true;
                var hCenter = options.hCenter || true;
                var itemsArr = options.itemsArr || [];
                var fixedToCamera = options.fixedToCamera || false;
                var modal;
                var modalGroup = this.game.add.group();
                if (fixedToCamera === true) {
                    modalGroup.fixedToCamera = true;
                    modalGroup.cameraOffset.x = 0;
                    modalGroup.cameraOffset.y = 0;
                }
                if (includeBackground === true) {
                    modal = this.game.add.graphics(this.game.width, this.game.height);
                    modal.beginFill(backgroundColor, backgroundOpacity);
                    modal.x = 0;
                    modal.y = 0;
                    modal.drawRect(0, 0, this.game.width, this.game.height);
                    if (modalCloseOnInput === true) {
                        var innerModal = this.game.add.sprite(0, 0);
                        innerModal.inputEnabled = true;
                        innerModal.width = this.game.width;
                        innerModal.height = this.game.height;
                        innerModal.type = type;
                        innerModal.input.priorityID = 0;
                        innerModal.events.onInputDown.add(function (e, pointer) {
                            this.hideModal(e.type);
                        }, self, 2);
                        modalGroup.add(innerModal);
                    }
                    else {
                        modalBackgroundCallback = true;
                    }
                }
                if (modalBackgroundCallback) {
                    var _innerModal = this.game.add.sprite(0, 0);
                    _innerModal.inputEnabled = true;
                    _innerModal.width = this.game.width;
                    _innerModal.height = this.game.height;
                    _innerModal.type = type;
                    _innerModal.input.priorityID = 0;
                    modalGroup.add(_innerModal);
                }
                if (includeBackground) {
                    modalGroup.add(modal);
                }
                var modalLabel;
                for (var i = 0; i < itemsArr.length; i += 1) {
                    var item = itemsArr[i];
                    var itemType = item.type || 'text';
                    var itemColor = item.color || 0x000000;
                    var itemFontfamily = item.fontFamily || 'Arial';
                    var itemFontSize = item.fontSize || 32;
                    var itemStroke = item.stroke || '0x000000';
                    var itemStrokeThickness = item.strokeThickness || 0;
                    var itemAlign = item.align || 'center';
                    var offsetX = item.offsetX || 0;
                    var offsetY = item.offsetY || 0;
                    var contentScale = item.contentScale || 1;
                    var content = item.content || "";
                    var centerX = this.game.width / 2;
                    var centerY = this.game.height / 2;
                    var callback = item.callback || false;
                    var textAlign = item.textAlign || "left";
                    var atlasParent = item.atlasParent || "";
                    var buttonHover = item.buttonHover || content;
                    var buttonActive = item.buttonActive || content;
                    var graphicColor = item.graphicColor || 0xffffff;
                    var graphicOpacity = item.graphicOpacity || 1;
                    var graphicW = item.graphicWidth || 200;
                    var graphicH = item.graphicHeight || 200;
                    var graphicRadius = item.graphicRadius || 0;
                    var lockPosition = item.lockPosition || false;
                    var itemAnchor = item.anchor || { x: 0, y: 0 };
                    var itemAngle = item.angle || 0;
                    var itemX = item.x || 0;
                    var itemY = item.y || 0;
                    var imageFrame = item.frame || null;
                    var tileSpriteWidth = item.tileSpriteWidth || this.game.width;
                    var tileSpriteHeight = item.tileSpriteHeight || this.game.height;
                    modalLabel = null;
                    if (itemType === "text" || itemType === "bitmapText") {
                        if (itemType === "text") {
                            var re = new RegExp(/[\{\}]/, 'g');
                            var arrOfBold = [];
                            var newLineOffset = 0;
                            if (content.match(re) !== null) {
                                for (var k = 0; k < content.length; k++) {
                                    var boldStartPos = content[k].indexOf('{');
                                    var boldEndPos = content[k].indexOf('}');
                                    var lengthOfString = content[k].match(/(\r\n|\n|\r)/);
                                    if (lengthOfString !== null) {
                                        newLineOffset += 1;
                                    }
                                    if (boldStartPos != -1 || boldEndPos != -1) {
                                        arrOfBold.push(k - newLineOffset);
                                    }
                                }
                                content = content.replace(re, "");
                            }
                            modalLabel = this.game.add.text(0, 0, content, {
                                font: itemFontSize + 'px ' + itemFontfamily,
                                fill: "#" + String(itemColor).replace("0x", ""),
                                stroke: "#" + String(itemStroke).replace("0x", ""),
                                strokeThickness: itemStrokeThickness,
                                align: itemAlign
                            });
                            modalLabel.contentType = 'text';
                            modalLabel.update();
                            var indexMissing = 0;
                            for (var j = 0; j < arrOfBold.length; j += 2) {
                                modalLabel.addFontWeight("bold", arrOfBold[j] - indexMissing);
                                modalLabel.addFontWeight("normal", arrOfBold[j + 1] - indexMissing);
                                indexMissing += 2;
                            }
                            modalLabel.x = ((this.game.width / 2) - (modalLabel.width / 2)) + offsetX;
                            modalLabel.y = ((this.game.height / 2) - (modalLabel.height / 2)) + offsetY;
                        }
                        else {
                            modalLabel = this.game.add.bitmapText(0, 0, itemFontfamily, String(content), itemFontSize);
                            modalLabel.contentType = 'bitmapText';
                            modalLabel.align = textAlign;
                            modalLabel.updateText();
                            modalLabel.x = (centerX - (modalLabel.width / 2)) + offsetX;
                            modalLabel.y = (centerY - (modalLabel.height / 2)) + offsetY;
                        }
                    }
                    else if (itemType === "image") {
                        modalLabel = this.game.add.image(0, 0, content);
                        modalLabel.scale.setTo(contentScale, contentScale);
                        modalLabel.contentType = 'image';
                        modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                        modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
                    }
                    else if (itemType === "tileSprite") {
                        modalLabel = this.game.add.tileSprite(itemX, itemY, tileSpriteWidth, tileSpriteHeight, content, imageFrame);
                        modalLabel.scale.setTo(contentScale, contentScale);
                        modalLabel.anchor.setTo(itemAnchor.x, itemAnchor.y);
                        modalLabel.angle = itemAngle;
                        modalLabel.contentType = 'tileSprite';
                    }
                    else if (itemType === "sprite") {
                        modalLabel = this.game.add.sprite(0, 0, atlasParent, content);
                        modalLabel.scale.setTo(contentScale, contentScale);
                        modalLabel.contentType = 'sprite';
                        modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                        modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
                    }
                    else if (itemType === "button") {
                        modalLabel = this.game.add.button(0, 0, atlasParent, callback, this, buttonHover, content, buttonActive, content);
                        modalLabel.scale.setTo(contentScale, contentScale);
                        modalLabel.contentType = 'button';
                        modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                        modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
                    }
                    else if (itemType === "graphics") {
                        modalLabel = this.game.add.graphics(graphicW, graphicH);
                        modalLabel.beginFill(graphicColor, graphicOpacity);
                        if (graphicRadius <= 0) {
                            modalLabel.drawRect(0, 0, graphicW, graphicH);
                        }
                        else {
                            modalLabel.drawRoundedRect(0, 0, graphicW, graphicH, graphicRadius);
                        }
                        modalLabel.endFill();
                        modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
                        modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
                    }
                    modalLabel["_offsetX"] = 0;
                    modalLabel["_offsetY"] = 0;
                    modalLabel.lockPosition = lockPosition;
                    modalLabel._offsetX = offsetX;
                    modalLabel._offsetY = offsetY;
                    if (callback !== false && itemType !== "button") {
                        modalLabel.inputEnabled = true;
                        modalLabel.pixelPerfectClick = true;
                        modalLabel.priorityID = 10;
                        modalLabel.events.onInputDown.add(callback, modalLabel);
                    }
                    if (itemType !== "bitmapText" && itemType !== "graphics") {
                        modalLabel.bringToTop();
                        modalGroup.add(modalLabel);
                        modalLabel.bringToTop();
                        modalGroup.bringToTop(modalLabel);
                    }
                    else {
                        modalGroup.add(modalLabel);
                        modalGroup.bringToTop(modalLabel);
                    }
                }
                modalGroup.visible = false;
                this.game.modals[type] = modalGroup;
            };
            Dialog.prototype.updateModalValue = function (value, type, index, id) {
                var item;
                if (index !== undefined && index !== null) {
                    item = this.game.modals[type].getChildAt(index);
                }
                else if (id !== undefined && id !== null) {
                }
                if (item.contentType === "text") {
                    item.text = value;
                    item.update();
                    if (item.lockPosition === true) {
                    }
                    else {
                        item.x = ((this.game.width / 2) - (item.width / 2)) + item._offsetX;
                        item.y = ((this.game.height / 2) - (item.height / 2)) + item._offsetY;
                    }
                }
                else if (item.contentType === "bitmapText") {
                    item.text = value;
                    item.updateText();
                    if (item.lockPosition === true) {
                    }
                    else {
                        item.x = ((this.game.width / 2) - (item.width / 2)) + item._offsetX;
                        item.y = ((this.game.height / 2) - (item.height / 2)) + item._offsetY;
                    }
                }
                else if (item.contentType === "image") {
                    item.loadTexture(value);
                }
            };
            Dialog.prototype.getModalItem = function (type, index) {
                return this.game.modals[type].getChildAt(index);
            };
            Dialog.prototype.showModal = function (type) {
                this.game.world.bringToTop(this.game.modals[type]);
                this.game.modals[type].visible = true;
                this.state.process = true;
                // you can add animation here
            };
            Dialog.prototype.hideModal = function (type) {
                this.game.modals[type].visible = false;
                this.state.process = false;
                // you can add animation here
            };
            Dialog.prototype.destroyModal = function (type) {
                this.game.modals[type].destroy();
                delete this.game.modals[type];
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
        var FactionSelection = (function () {
            function FactionSelection(menu, menuElement) {
                this.menu = menu;
                this.menuElement = menuElement;
            }
            FactionSelection.prototype.init = function (mode) {
                var self = this;
                this.menuElement.html('<div><h2>Choisissez votre faction :</h2></div>' +
                    '<div class="faction-selector">' +
                    '   <span class="control left fa fa-chevron-left"></span>' +
                    '   <span class="control right fa fa-chevron-right"></span>' +
                    '   <div class="faction human"><span class="name">Human</span></div>' +
                    '   <div class="faction undead"><span class="name">Undead</span></div>' +
                    '</div>' +
                    '<div class="button submit-faction"><a>Confirmer</a></div>');
                this.menuElement.find('.control').on('click', function () {
                    self.menuElement.find('.faction.human').toggle();
                    self.menuElement.find('.faction.undead').toggle();
                });
                this.menuElement.find('.submit-faction').on('click', function () {
                    self.selected_faction = self.menuElement.find('.faction.human').is(':visible') ? 'human' : 'undead';
                    $(this).hide();
                    self.menuElement.find('.control').hide();
                    if (mode == 'online') {
                        self.menuElement.find('h2').html('En attente de votre adversaire');
                        self.menu.serverManager.request('FACTION_CHOSEN', self.selected_faction);
                    }
                    else {
                        self.menu.game.state.start('mainsolooffline', true, false, {
                            players: [
                                { name: 'BOT 01', faction: 'evil', player: false },
                                { name: self.menu.login, faction: self.selected_faction, player: true }
                            ]
                        }, self.menu.chatUI);
                    }
                });
            };
            return FactionSelection;
        }());
        UI.FactionSelection = FactionSelection;
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
                var icon = this.menu.game.make.image(this.menu.game.world.width - 33, 5, 'menu-icon');
                this.menu.game.uiGroup.add(icon);
                //this.menu.element.append('<div class="ui-ingame-menu"><a class="menu-icon"></a></div>');
                //this.element = this.menu.element.find('.ui-ingame-menu');
                //this.element.find('.menu-icon').on('click', function () {
                //    self.showOverlay();
                //    self.menu.element.append(
                //        '<div class="ui-popin">' +
                //            '<a class="close">x</a>' +
                //            '<a class="button quit">Quit</a>' +
                //        '</div>'
                //    );
                //    self.menu.element.find('.close').on('click', function() {
                //        self.menu.element.find('.ui-overlay').remove();
                //        self.menu.element.find('.ui-popin').remove();
                //    });
                //    self.menu.element.find('.button.quit').on('click', function() {
                //        self.menu.game.state.start('menu');
                //    });
                //});
            }
            //showOverlay() {
            //    this.menu.element.append('<div class="ui-overlay"></div>');
            //}
            IngameMenu.prototype.gameOver = function (msg) {
                //let self = this;
                //this.showOverlay();
                //this.menu.element.append(
                //    '<div class="ui-popin">' +
                //    '<a class="button">' + msg + '</a>' +
                //    '<a class="button">-</a>' +
                //    '<a class="button quit">Quit</a>' +
                //    '</div>'
                //);
                //this.menu.element.find('.button.quit').on('click', function() {
                //    self.menu.game.state.start('menu');
                //});
            };
            IngameMenu.prototype.show = function (msg) {
                //let self = this;
                //this.showOverlay();
                //this.menu.element.append(
                //    '<div class="ui-popin">' +
                //    '<a class="button">' + msg + '</a>' +
                //    '</div>'
                //);
                //this.menu.element.find('.button.quit').on('click', function() {
                //    self.menu.game.state.start('menu');
                //});
            };
            IngameMenu.prototype.close = function () {
                //this.menu.element.find('.ui-overlay').remove();
                //this.menu.element.find('.ui-popin').remove();
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
                this.threeKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.THREE);
                this.threeKey.onDown.add(this.threeKeyPress, this, 0, this.menu);
                this.fourKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.FOUR);
                this.fourKey.onDown.add(this.fourKeyPress, this, 0, this.menu);
                this.fiveKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.FIVE);
                this.fiveKey.onDown.add(this.fiveKeyPress, this, 0, this.menu);
                this.wKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.W);
                this.wKey.onDown.add(this.wKeyPress, this, 0, this.menu);
            };
            KeyManager.prototype.leftKeyPressed = function (self, uiManager) {
                if (uiManager.process)
                    return false;
                if (uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                    uiManager.timeUI.goBackward();
                }
                else if (!uiManager.game.process) {
                    TacticArena.Action.ChangeDirection.process(uiManager.game, 'W');
                }
            };
            KeyManager.prototype.rightKeyPressed = function (self, uiManager) {
                if (uiManager.process)
                    return false;
                if (uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                    uiManager.timeUI.goForward();
                }
                else if (!uiManager.game.process) {
                    TacticArena.Action.ChangeDirection.process(uiManager.game, 'E');
                }
            };
            KeyManager.prototype.upKeyPressed = function (self, uiManager) {
                if (uiManager.process)
                    return false;
                if (!uiManager.game.process) {
                    TacticArena.Action.ChangeDirection.process(uiManager.game, 'N');
                }
            };
            KeyManager.prototype.downKeyPressed = function (self, uiManager) {
                if (uiManager.process)
                    return false;
                if (!uiManager.game.process) {
                    TacticArena.Action.ChangeDirection.process(uiManager.game, 'S');
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
                    TacticArena.Action.ConfirmOrder.process(uiManager.game);
                }
            };
            KeyManager.prototype.backKeyPressed = function (self, uiManager) {
                TacticArena.Action.Cancel.process(uiManager.game);
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
                    $('.pawn:nth-child(1)').trigger('click');
                }
                else {
                    uiManager.actionUI.wait();
                }
            };
            KeyManager.prototype.twoKeyPress = function (self, uiManager) {
                if (self.altKey) {
                    $('.pawn:nth-child(2)').trigger('click');
                }
                else {
                    uiManager.actionUI.select('walk');
                }
            };
            KeyManager.prototype.threeKeyPress = function (self, uiManager) {
                if (self.altKey) {
                    $('.pawn:nth-child(3)').trigger('click');
                }
                else {
                    uiManager.actionUI.select('slash');
                }
            };
            KeyManager.prototype.fourKeyPress = function (self, uiManager) {
                if (self.altKey) {
                    $('.pawn:nth-child(4)').trigger('click');
                }
                else {
                    uiManager.actionUI.select('fire');
                }
            };
            KeyManager.prototype.fiveKeyPress = function (self, uiManager) {
                if (self.altKey) {
                    $('.pawn:nth-child(5)').trigger('click');
                }
                else {
                    uiManager.actionUI.select('wind');
                }
            };
            KeyManager.prototype.wKeyPress = function (self, uiManager) {
                if (self.altKey) {
                    uiManager.game.battleOver();
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
                //var self = this;
                //this.menu = menu;
                //this.menu.element.append('<div class="ui-notifications ui-steps-notifications"></div>');
                //this.element = this.menu.element.find('.ui-steps-notifications');
                //this.directionMapping = {
                //    'W': "l'Ouest",
                //    'E': "l'Est",
                //    'N': "le Nord",
                //    'S': "le Sud"
                //}
            }
            Notifications.prototype.clean = function () {
                //this.remove(this.element.find('div[class*="item-"]'));
            };
            Notifications.prototype.remove = function (elements) {
                //if (elements.length > 0) {
                //    let self = this;
                //    $(elements[elements.length - 1]).animate({opacity: 0, marginRight: -200}, 150, function () {
                //        $(this).remove();
                //        self.remove(elements.slice(0, -1));
                //    });
                //}
            };
            Notifications.prototype.update = function (index) {
                //this.remove(this.element.find('div[class*="item-"]:gt(' + index + ')'));
                //if ($('.item-' + index).length > 0) {
                //    return;
                //}
                //let steps = [];
                //for (let i = index; i > this.element.children().length - 1; i--) {
                //    steps.push($('<div class="item-' + index + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(i) + '</div>'));
                //}
                //this.add(steps);
            };
            Notifications.prototype.add = function (elements) {
                //if (elements.length > 0) {
                //    let self = this;
                //    $(elements[elements.length - 1]).appendTo(this.element)
                //        .animate({opacity: 1, marginRight: 0}, 150, function () {
                //            self.add(elements.slice(0, -1));
                //        });
                //}
            };
            Notifications.prototype.getMessage = function (index) {
                //    let result = [];
                //    let step = this.menu.game.logManager.get(this.menu.game.turnManager.currentTurnIndex, index);
                //    for(let i = 0; i < step.length; i++) {
                //        let e = step[i].entity;
                //        let o = step[i].order;
                //        let s = step[i].stepUnitData;
                //        let logColor = '#ffffff';
                //        //let logColor = '#78dd77';
                //        // logColor = '#f45d62';
                //
                //        let msg = '<b>' + e._name + '</b>';
                //        if(s.moveHasBeenBlocked) {
                //            msg += ' essaie de se déplacer en ' + s.positionBlocked.x + ', '+ s.positionBlocked.y + ', ' + ' mais se retrouve bloqué en ' + o.x + ', ' + o.y;
                //        } else if(o.action == 'move') {
                //            msg += ' se déplace en ' + o.x + ', ' + o.y;
                //        } else if (o.action == 'cast') {
                //            msg += ' lance une boule de feu vers ' + this.directionMapping[o.direction];
                //        } else if (o.action == 'stand') {
                //            msg += ' reste en position ' + o.x + ', ' + o.y + ' et surveille vers ' + this.directionMapping[o.direction];
                //        }
                //        result.push('<span style="color:' + logColor + ';">' + msg + '</span>');
                //    }
                //    return result.join('<br/><br/>');
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
                //this.menu.element.append('<div class="ui-notifications ui-orders-notifications"></div>');
                //this.element = this.menu.element.find('.ui-orders-notifications');
                this.directionMapping = {
                    'W': "l'Ouest",
                    'E': "l'Est",
                    'N': "le Nord",
                    'S': "le Sud"
                };
            }
            OrdersNotifications.prototype.clean = function () {
                //this.remove(this.element.find('div[class*="item-"]'));
                //this.element.html('');
                //this.menu.game.stageManager.clearPath(this.menu.game.pathOrdersTilesGroup);
            };
            OrdersNotifications.prototype.remove = function (elements) {
                //if (elements.length > 0) {
                //    let self = this;
                //    $(elements[elements.length - 1]).animate({opacity: 0, marginRight: -200}, 150, function () {
                //        $(this).remove();
                //        self.remove(elements.slice(0, -1));
                //    });
                //}
            };
            OrdersNotifications.prototype.update = function (orders) {
                //if(orders.length > 0) {
                //    for(var i = 0; i < orders.length; i++) {
                //        if(this.element.find('.item-' + i).length == 0) {
                //            this.add($('<div class="item-' + i + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(orders[i]) + '</div>'));
                //        }
                //    }
                //} else {
                //    this.clean();
                //}
            };
            OrdersNotifications.prototype.add = function (elements) {
                //if (elements.length > 0) {
                //    let self = this;
                //    $(elements[elements.length - 1]).appendTo(this.element)
                //        .animate({opacity: 1, marginRight: 0}, 150, function () {
                //            self.add(elements.slice(0, -1));
                //        });
                //}
            };
            OrdersNotifications.prototype.getMessage = function (order) {
                var activePawn = this.menu.game.turnManager.getActivePawn();
                if (!this.menu.game.stageManager.equalPositions(activePawn.getPosition(), order)) {
                    this.menu.game.stageManager.showPath([order], this.menu.game.pathOrdersTilesGroup, 0xffffff);
                }
                //let msg = '<b>' + activePawn._name + '</b>';
                //if (order.action == 'move') {
                //    msg += ' se déplacera en ' + order.x + ', ' + order.y + ', orienté vers le ' + this.directionMapping[order.direction];
                //} else if (order.action == 'cast') {
                //    msg += ' lancera une boule de feu vers ' + this.directionMapping[order.direction];
                //} else if (order.action == 'stand') {
                //    msg += ' restera en position ' + order.x + ', ' + order.y + ' et fera preuve de vigilence vers ' + this.directionMapping[order.direction];
                //}
                //return '<span style="color:#ffffff;">' + msg + '</span>';
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
                this.pawnsInfos = {};
                var html = '<div class="ui-pawns-infos">';
                // sort for displaying player pawns on top
                var pawns = this.menu.game.pawns.sort(function (p) {
                    return p.team != self.menu.game.playerTeam;
                });
                for (var i = 0; i < pawns.length; i++) {
                    var pawn = pawns[i];
                    //let img = self.menu.game.add.image(i * 64, 0, 'avatar-' + pawn.type);
                    //img.width = 64;
                    //img.height = 64;
                    //
                    //let hpBar = new Bar(this.menu.game, {
                    //    x: i * 64,
                    //    y: 64,
                    //    width: 64,
                    //    height: 10,
                    //    text: true,
                    //    name: 'hpbar',
                    //    unit: 'HP',
                    //    max: pawn._hpMax,
                    //    textColor: '#ffffff',
                    //    bg: {
                    //        color: '#808080'
                    //    },
                    //    bar: {
                    //        color: '#8b0000'
                    //    }
                    //});
                    //
                    //let apBar = new Bar(this.menu.game, {
                    //    x: i * 64,
                    //    y: 74,
                    //    width: 64,
                    //    height: 10,
                    //    text: true,
                    //    name: 'apbar',
                    //    unit: 'AP',
                    //    max: pawn._apMax,
                    //    textColor: '#ffffff',
                    //    bg: {
                    //        color: '#267ac9'
                    //    },
                    //    bar: {
                    //        color: '#1E90FF'
                    //    }
                    //});
                    //bar.setPercent(80);
                    //this.pawnsInfos[pawn._id] = {
                    //    hpBar: hpBar,
                    //    apBar: apBar
                    //};
                    var classColor = pawn.team == self.menu.game.playerTeam ? 0 : 1;
                    //html += '<div pawn-index="' + i + '" class="pawn pawn0' + pawn._id + ' ' + pawn.type + ' team-' + classColor + '">' +
                    //    '<div class="avatar"><div class="picture shiny"></div></div>' +
                    //    '<div class="name">' + pawn._name + '</div>' +
                    //    '<div class="infos">' +
                    //    '<div class="hp">' +
                    //    '<div class="bar">' +
                    //    '<div class="content current"></div>' +
                    //    '<div class="text"><span class="value"></span> / ' + pawn._hpMax + ' HP</div>' +
                    //    '</div>' +
                    //    '</div>' +
                    //    '<div class="ap">' +
                    //    '<div class="bar">' +
                    //    '<div class="content remaining"></div>' +
                    //    '<div class="content current"></div>' +
                    //    '<div class="text"><span class="value"></span> / ' + pawn._apMax + ' AP</div>' +
                    //    '</div>' +
                    //    '</div>' +
                    //    '</div>' +
                    //    '</div>';
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
                    var pawn = this.menu.game.pawns[i];
                    //TODO maintain
                    //this.element.find('.pawn0' + entity._id).toggleClass('dead', !entity.isAlive());
                    //this.element.find('.pawn0' + entity._id + ' .infos .hp .value').html(entity.getHp());
                    //this.element.find('.pawn0' + entity._id + ' .infos .hp .bar .current').css('width', ((entity.getHp() / entity._hpMax) * 100) + '%');
                    //this.element.find('.pawn0' + entity._id + ' .infos .ap .value').html(entity.getAp());
                    //this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .current').css('width', ((entity.getAp() / entity._apMax) * 100) + '%');
                    //this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .remaining').css('width', '0%');
                    //this.pawnsInfos[pawn._id].hpBar.setPercent(((pawn.getHp() / pawn._hpMax) * 100));
                    //this.pawnsInfos[pawn._id].hpBar.updateValue(pawn.getHp());
                    //this.pawnsInfos[pawn._id].apBar.setPercent(((pawn.getAp() / pawn._apMax) * 100));
                    //this.pawnsInfos[pawn._id].apBar.updateValue(pawn.getAp());
                }
            };
            PawnsInfos.prototype.showApCost = function (pawn, apCost) {
                //let percentRemaining = apCost > 0 ? ((pawn.getAp() / pawn._apMax) * 100) : 0;
                var currentPercent = (((pawn.getAp() - apCost) / pawn._apMax) * 100);
                var remainingAp = pawn.getAp() - apCost;
                //this.element.find('.pawn0' + pawn._id + ' .infos .ap .bar .current').css('width', currentPercent + '%');
                //this.element.find('.pawn0' + pawn._id + ' .infos .ap .bar .remaining').css('width', percentRemaining + '%');
                //this.element.find('.pawn0' + pawn._id + ' .infos .ap .value').html(remainingAp);
                //this.pawnsInfos[pawn._id].apBar.setPercent(currentPercent);
                //this.pawnsInfos[pawn._id].apBar.updateValue(remainingAp);
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
                this.marker = this.game.make.graphics(-1 * this.game.tileSize, -1 * this.game.tileSize);
                this.marker.lineStyle(2, 0xffffff, 1);
                this.marker.drawRect(0, 0, this.game.tileSize, this.game.tileSize);
                this.game.worldGroup.add(this.marker);
                this.game.input.addMoveCallback(this.update, this);
                this.game.input.mousePointer.leftButton.onDown.add(this.onGridLeftClick, this);
                this.game.input.mousePointer.rightButton.onDown.add(this.onGridRightClick, this);
                this.game.input.mouse.capture = true;
                $('canvas').bind('contextmenu', function (e) { return false; });
            }
            Pointer.prototype.getPosition = function () {
                return {
                    x: this.game.stageManager.collisionLayer.getTileX(this.game.input.activePointer.worldX),
                    y: this.game.stageManager.collisionLayer.getTileY(this.game.input.activePointer.worldY)
                };
            };
            Pointer.prototype.getTilePosition = function () {
                return {
                    x: this.game.stageManager.collisionLayer.getTileX(this.game.input.activePointer.worldX / this.game.worldGroup.scale.x),
                    y: this.game.stageManager.collisionLayer.getTileY(this.game.input.activePointer.worldY / this.game.worldGroup.scale.y)
                };
            };
            Pointer.prototype.getTilePositionFromMarkerPosition = function () {
                return {
                    x: this.marker.x / this.game.tileSize,
                    y: this.marker.y / this.game.tileSize
                };
            };
            Pointer.prototype.updateMarker = function () {
                this.show();
                var p = this.getPosition();
                this.marker.x = Math.round(p.x * this.game.tileSize / this.game.worldGroup.scale.x / 32) * 32;
                this.marker.y = Math.round(p.y * this.game.tileSize / this.game.worldGroup.scale.y / 32) * 32;
            };
            Pointer.prototype.update = function () {
                if (!this.game.process && !this.game.uiManager.isOver()) {
                    this.updateMarker();
                    var selectedSkill = this.game.turnManager.getActivePawn().getSelectedSkill();
                    if (selectedSkill && selectedSkill.canOrder()) {
                        selectedSkill.updateUI(this.getTilePositionFromMarkerPosition());
                    }
                }
                else {
                    this.hide();
                }
            };
            Pointer.prototype.onGridLeftClick = function () {
                if (!this.game.process && !this.game.uiManager.isOver()) {
                    var activePawn = this.game.turnManager.getActivePawn();
                    var selectedSkill = activePawn.getSelectedSkill();
                    var target = this.getTilePositionFromMarkerPosition();
                    console.log(selectedSkill);
                    if (selectedSkill) {
                        if (selectedSkill.canOrder()) {
                            selectedSkill.order(target);
                        }
                    }
                    else {
                        //TODO SELECT CHARACTER
                        console.log(target);
                        //this.game.pawns.forEach( (p, k) => {
                        //    if (self.game.stageManager.equalPositions(p.getPosition(), {x: targetX, y: targetY})) {
                        //        //let actionMenu = new UI.ActionMenu(self.game, p.type);
                        //    }
                        //});
                    }
                }
            };
            Pointer.prototype.onGridRightClick = function () {
            };
            Pointer.prototype.hide = function () {
                this.marker.visible = false;
            };
            Pointer.prototype.show = function () {
                this.marker.x = -this.game.tileSize;
                this.marker.y = -this.game.tileSize;
                this.marker.visible = true;
            };
            Pointer.prototype.destroy = function () {
                console.log('pointer destroy');
                this.marker.destroy();
                this.game.input.deleteMoveCallback(this.update, this);
                this.game.input.mousePointer.leftButton.onDown.removeAll();
                this.game.input.mousePointer.rightButton.onDown.removeAll();
                this.game.input.mouse.capture = false;
                $('canvas').off('contextmenu');
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
        var PointerExploration = (function (_super) {
            __extends(PointerExploration, _super);
            function PointerExploration(game) {
                return _super.call(this, game) || this;
            }
            PointerExploration.prototype.update = function () {
                if (!this.game.process) {
                    var activePawn = this.game.pawns[0];
                    var p = this.getPosition();
                    this.marker.x = p.x * this.game.tileSize;
                    this.marker.y = p.y * this.game.tileSize;
                    if (this.game.stageManager.grid[p.y][p.x] == 0 && !this.game.stageManager.equalPositions(p, activePawn.getPosition())) {
                        this.marker.lineStyle(2, 0xcd2f36, 1);
                    }
                    else {
                        this.marker.lineStyle(2, 0xffffff, 1);
                    }
                    this.marker.drawRect(0, 0, this.game.tileSize, this.game.tileSize);
                }
            };
            PointerExploration.prototype.onGridLeftClick = function () {
                if (!this.game.process) {
                    var self_1 = this;
                    var activePawn = this.game.pawns[0];
                    var p = this.getPosition();
                    var targetX = this.marker.x / this.game.tileSize;
                    var targetY = this.marker.y / this.game.tileSize;
                    self_1.game.process = true;
                    console.log(p);
                    if (this.game.stageManager.grid[p.y][p.x] != 0) {
                        this.game.stageManager.canMove(activePawn, targetX, targetY).then(function (path) {
                            console.log(path);
                            activePawn.moveTo(0, 0, path, true, true).then(function (res) {
                                self_1.game.stageManager.markPawns();
                                self_1.game.process = false;
                            }, function (res) {
                                self_1.game.process = false;
                            });
                        }, function (res) {
                            console.log(res);
                            self_1.game.process = false;
                        });
                    }
                    else if (!this.game.stageManager.equalPositions(p, activePawn.getPosition())) {
                        console.log('attack');
                        var enemy = self_1.game.pawns[1];
                        self_1.game.process = false;
                        var gridWidth = 10;
                        var gridHeight = 16;
                        var startPosition = { x: p.x - Math.floor(gridWidth / 2), y: p.y - Math.floor(gridHeight / 2) };
                        var layers = self_1.game.stageManager.getLayers();
                        //self.game.stageManager.fillBlack().then(function() {
                        self_1.game.state.clearCurrentState();
                        self_1.game.state.start('mainadventurebattle', true, false, {
                            players: [
                                { name: 'Beez', faction: 'animals', player: false, type: enemy.type, spriteClass: enemy.spriteClass, position: enemy.getPosition(), direction: enemy.getDirection() },
                                { name: activePawn._name, faction: 'human', player: true, type: activePawn.type, spriteClass: activePawn.spriteClass, position: activePawn.getPosition(), direction: activePawn.getDirection() }
                            ],
                            stage: layers,
                            center: p,
                            gridWidth: gridWidth,
                            gridHeight: gridHeight,
                            startPosition: startPosition
                        });
                        //});
                    }
                    else {
                        self_1.game.process = false;
                    }
                }
            };
            return PointerExploration;
        }(TacticArena.UI.Pointer));
        UI.PointerExploration = PointerExploration;
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
                //this.menu.element.append('<ul class="ui-menu ui-time-menu"><li class="pause"></li><li class="play"></li></ul>');
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
                        var self_2 = _this;
                        $(elements[0]).find('.line').animate({ width: '91px' }, 200, function () {
                            $(elements[0]).find('.square').animate({ opacity: 1 }, 100, function () {
                                self_2.display(elements.slice(1)).then(function () {
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
        var TopMenu = (function () {
            function TopMenu(game) {
                this.game = game;
                this.mainGroup = this.game.add.group();
                var topUIBackground = this.game.make.graphics();
                topUIBackground.beginFill(0x333333, 0.6);
                topUIBackground.drawRect(0, 0, this.game.world.width, 48);
                topUIBackground.endFill();
                topUIBackground.inputEnabled = true;
                topUIBackground.events.onInputOver.add(this.over, this);
                topUIBackground.events.onInputOut.add(this.out, this);
                this.mainGroup.add(topUIBackground);
                this.game.uiGroup.add(this.mainGroup);
            }
            TopMenu.prototype.over = function () {
                console.log('over');
                this.isOver = true;
            };
            TopMenu.prototype.out = function () {
                console.log('out');
                this.isOver = false;
            };
            return TopMenu;
        }());
        UI.TopMenu = TopMenu;
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
                //this.menu.element.append('<div class="ui-turn-indicator"></div>');
                //this.element = this.menu.element.find('.ui-turn-indicator');
                this.text = this.menu.game.add.text(0, 0, '', {
                    font: '35px Iceland',
                    fill: '#AB9352',
                    boundsAlignH: 'center',
                    stroke: '#FFFFFF',
                    strokeThickness: 3
                }, this.menu.game.uiGroup);
                this.text.setTextBounds(0, 0, this.menu.game.world.width, 32);
            }
            TurnIndicator.prototype.write = function (turn) {
                //this.element.html('Tour ' + ("0" + Number(turn)).slice(-2));
                this.text.text = 'Tour ' + ('0' + Number(turn)).slice(-2);
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
                this.actionMenu = null;
                this.topMenu = new UI.TopMenu(this.game);
                this.timeUI = new UI.Time(this);
                this.timelineUI = new UI.TimeLine(this);
                this.pawnsinfosUI = new UI.PawnsInfos(this);
                this.keyManager = new UI.KeyManager(this);
                this.ordersnotificationsUI = new UI.OrdersNotifications(this);
                this.transitionUI = new UI.Transition(this);
                this.turnIndicatorUI = new UI.TurnIndicator(this);
                this.ingamemenuUI = new UI.IngameMenu(this);
                this.process = false;
            }
            UIManager.prototype.initOrderPhase = function (pawn, first) {
                var _this = this;
                if (first) {
                    this.game.orderManager.orders = [];
                }
                this.game.turnManager.init(pawn, first).then(function (data) {
                    if (first) {
                        _this.turnIndicatorUI.write(_this.game.turnManager.currentTurnIndex + 1);
                        _this.transitionUI.show('Phase de commandement').then(function (res) {
                            return true;
                        });
                    }
                    _this.game.signalManager.turnInitialized.dispatch(pawn);
                });
            };
            UIManager.prototype.initResolvePhase = function (steps) {
                var _this = this;
                this.ingamemenuUI.close();
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
            UIManager.prototype.isOver = function () {
                return (this.actionMenu && this.actionMenu.isOver) || this.topMenu.isOver;
            };
            return UIManager;
        }());
        UI.UIManager = UIManager;
    })(UI = TacticArena.UI || (TacticArena.UI = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var BaseAction = (function () {
        function BaseAction(name) {
            this.name = name;
        }
        BaseAction.process = function (state) {
        };
        return BaseAction;
    }());
    TacticArena.BaseAction = BaseAction;
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Action;
    (function (Action) {
        var Cancel = (function (_super) {
            __extends(Cancel, _super);
            function Cancel() {
                return _super.call(this, 'cancel') || this;
            }
            Cancel.process = function (state) {
                if (!state.process) {
                    var activePawn = state.turnManager.getActivePawn();
                    activePawn.show();
                    activePawn.destroyProjection();
                    activePawn.setAp(3);
                    activePawn.getProjectionOrReal().faceDirection(state.uiManager.actionMenu.savedDirection);
                    state.uiManager.actionMenu.initDirection(state.uiManager.actionMenu.savedDirection);
                    state.orderManager.removeEntityOrder(activePawn);
                    state.signalManager.onActionPlayed.dispatch(activePawn);
                }
            };
            return Cancel;
        }(TacticArena.BaseAction));
        Action.Cancel = Cancel;
    })(Action = TacticArena.Action || (TacticArena.Action = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Action;
    (function (Action) {
        var ChangeDirection = (function (_super) {
            __extends(ChangeDirection, _super);
            function ChangeDirection() {
                return _super.call(this, 'change direction') || this;
            }
            ChangeDirection.process = function (state, direction) {
                var matching = { 'N': 'north', 'E': 'east', 'S': 'south', 'W': 'west' };
                var activePawn = state.turnManager.getActivePawn();
                if (!state.process && activePawn.getAp() > 0) {
                    activePawn.createProjection();
                    activePawn.getProjectionOrReal().faceDirection(direction);
                    //let position = activePawn.getProjectionOrReal().getPosition();
                    //this.menu.game.orderManager.add('stand', activePawn, position.x, position.y, direction);
                    //activePawn.setAp(activePawn.getAp() - 1);
                    //this.menu.game.signalManager.onActionPlayed.dispatch(activePawn);
                    //this.select(matching[direction]);
                }
            };
            return ChangeDirection;
        }(TacticArena.BaseAction));
        Action.ChangeDirection = ChangeDirection;
    })(Action = TacticArena.Action || (TacticArena.Action = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Action;
    (function (Action) {
        var ConfirmOrder = (function (_super) {
            __extends(ConfirmOrder, _super);
            function ConfirmOrder() {
                return _super.call(this, 'confirm order') || this;
            }
            ConfirmOrder.process = function (state) {
                if (!state.process) {
                    state.process = true;
                    state.selecting = false;
                    state.stageManager.clearPossibleMove();
                    state.stageManager.clearPath(state.pathTilesGroup);
                    var activePawn_1 = state.turnManager.getActivePawn();
                    state.turnManager.endTurn().then(function (nextPawn) {
                        state.signalManager.onTurnEnded.dispatch(activePawn_1);
                        if (state.playMode == 'online' && state.turnManager.getRemainingPawns(state.playerTeam).length == 0) {
                            // s'il reste plus de pawn à jouer du playerteam
                            // alors on signale au serveur qu'on a fini la phase de commandement
                            // en lui envoyant les ordres
                            state.serverManager.request('VALID_ORDER_PHASE', {
                                turn: state.turnManager.currentTurnIndex,
                                orders: state.orderManager.getPlayerOrders(state.playerTeam)
                            });
                            state.uiManager.ingamemenuUI.show('Waiting for opponent move');
                        }
                        else {
                            if (state.turnManager.getRemainingPawns().length == 0) {
                                var steps = state.orderManager.getSteps();
                                state.uiManager.initResolvePhase(steps);
                            }
                            else {
                                state.uiManager.initOrderPhase(nextPawn, false);
                            }
                        }
                    });
                }
            };
            return ConfirmOrder;
        }(TacticArena.BaseAction));
        Action.ConfirmOrder = ConfirmOrder;
    })(Action = TacticArena.Action || (TacticArena.Action = {}));
})(TacticArena || (TacticArena = {}));
var TacticArena;
(function (TacticArena) {
    var Action;
    (function (Action) {
        var ConfirmResolve = (function (_super) {
            __extends(ConfirmResolve, _super);
            function ConfirmResolve() {
                return _super.call(this, 'confirm resolve') || this;
            }
            ConfirmResolve.process = function (state) {
                for (var i = 0; i < state.pawns.length; i++) {
                    state.pawns[i].destroyProjection();
                }
                state.resolveManager.active = false;
                //setTimeout(function() {
                //state.uiManager.notificationsUI.clean();
                //}, 500);
                state.uiManager.timelineUI.clean();
                state.uiManager.timeUI.updatePauseFromSelected();
                if (state.isOver()) {
                    var msg = state.teams[state.playerTeam] ? 'You win' : 'You lose';
                    state.uiManager.ingamemenuUI.gameOver(msg);
                    state.battleOver();
                }
                else {
                    state.uiManager.initOrderPhase(state.getFirstAlive(), true);
                }
            };
            return ConfirmResolve;
        }(TacticArena.BaseAction));
        Action.ConfirmResolve = ConfirmResolve;
    })(Action = TacticArena.Action || (TacticArena.Action = {}));
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