module TacticArena.Controller {
    export class OrderManager {
        orders;
        game;
        alteredPawns;

        constructor(game) {
            this.orders = [];
            this.game = game;
            this.alteredPawns = [];
        }

        removeEntityOrder(pawn) {
            let id = pawn._id;
            var result = [];
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id != id) {
                    result.push(this.orders[i]);
                }
            }
            this.orders = result;
            this.game.signalManager.onOrderChange.dispatch(pawn);
        }

        hasOrder(id) {
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id == id) {
                    return true;
                }
            }
            return false;
        }

        add(action, entity, x, y, direction = null) {
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
            this.game.signalManager.onOrderChange.dispatch(entity);
        }

        getMaxOrderListLength() {
            var max = 0;
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].list.length > max) {
                    max = this.orders[i].list.length;
                }
            }
            return max;
        }

        getDefaultOrder(position, direction) {
            return {
                'action': 'stand',
                'x': position.x,
                'y': position.y,
                'direction': direction
            };
        }

        formatOrders() {
            for (var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i];
                if (!this.hasOrder(p._id)) {
                    let position = p.getPosition();
                    this.game.orderManager.add('stand', p, position.x, position.y, p.getDirection());
                }
            }
        }

        getInitialStep() {
            var step = [];
            for (var i = 0; i < this.game.pawns.length; i++) {
                let state = this.getDefaultEntityState();
                let pawn = this.game.pawns[i];
                state['ap'] = pawn._apMax;
                state['hp'] = pawn.getHp();
                step.push({
                    entity: pawn,
                    entityState: state,
                    order: this.getDefaultOrder(pawn.getPosition(), pawn.getDirection())
                });
            }
            return step;
        }

        resolutionEsquive(fleeRate) {
            return (Math.floor(Math.random() * 100) > fleeRate);
        }

        blockEntity(steps, startI, j, order, entity) {
            steps[startI][j].entityState.positionBlocked = {x: steps[startI][j].order.x, y: steps[startI][j].order.y};
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
        }

        getSteps() {
            this.alteredPawns = [];
            this.formatOrders();
            let steps = new Array(this.getMaxOrderListLength());
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
        }

        getDefaultEntityState() {
            return {
                moveHasBeenBlocked: false,
                positionBlocked: {}
            };
        }

        processOrders(steps) {
            for (var l = 1; l < steps.length; l++) {
                var step = steps[l];
                let previousStep = steps[l - 1];
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
                        if (entityA._id == entityB._id) continue; // Pas d'interaction avec soi-même
                        var entityBState = step[j].entityState;
                        let orderA = step[i].order;
                        let orderB = step[j].order;
                        let actionA = orderA.action;
                        let actionB = orderB.action;
                        let positionB = {x: orderB.x, y: orderB.y};

                        let directionABeforeOrder = previousStep[i].order.direction;
                        let positionABeforeOrder = {x: previousStep[i].order.x, y: previousStep[i].order.y};
                        let positionBBeforeOrder = {x: previousStep[j].order.x, y: previousStep[j].order.y};

                        let aIsFacingB = this.game.stageManager.isFacing(positionABeforeOrder, orderA.direction, positionBBeforeOrder);
                        let aWasNextToB = this.game.stageManager.getNbTilesBetween(positionABeforeOrder, positionBBeforeOrder) == 1;
                        let fleeRate = 100;
                        let entityAApCost = 1;
                        let entityBHpLost = 0;

                        let aIsActive = previousStep[i].entityState['ap'] > 0; // INACTIF = stand mais pas le droit d'attaquer

                        if (['stand', 'move'].indexOf(actionA) >= 0 && aWasNextToB && aIsFacingB && aIsActive) {
                            // Possible cases :
                            // [  ][A v][  ]
                            // [A>][ B ][<A]
                            // [  ][ A^][  ]
                            let keepDirection = (directionABeforeOrder == orderA.direction);
                            let keepPosition = (orderA.x == positionABeforeOrder.x && orderA.y == positionABeforeOrder.y);
                            // Si A reste dans sa direction (aIsFacingB), et ne va pas pas se détourner de B
                            // ET si A reste adjacent à B OU si A va vers B (en lui faisant face)
                            if (keepDirection && (keepPosition || this.game.stageManager.equalPositions(orderA, orderB))) {
                                let entityBIsDodge = true;
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
                            if (this.alteredPawns.indexOf(entityA._id) < 0) entityAState.moveHasBeenBlocked = (actionA == 'move');
                            if (this.alteredPawns.indexOf(entityB._id) < 0) entityBState.moveHasBeenBlocked = (actionB == 'move');
                        }

                        if (entityBState.moveHasBeenBlocked && this.alteredPawns.indexOf(entityB._id) < 0) {
                            this.blockEntity(steps, l, j, this.getDefaultOrder(previousStep[j].order, previousStep[j].order.direction), entityB);
                        }
                        if (entityAState.moveHasBeenBlocked && this.alteredPawns.indexOf(entityA._id) < 0) {
                            this.blockEntity(steps, l, i, this.getDefaultOrder(previousStep[i].order, previousStep[i].order.direction), entityA);
                        }

                        if (actionA == 'cast') {
                            entityAApCost++;
                            let path = this.game.stageManager.getLinearPath(entityA, 4, orderA.direction, orderA);
                            let targets = [];
                            for (var k = 0; k < path.length; k++) {
                                let targetPosition = entityBState.moveHasBeenBlocked ? positionBBeforeOrder : positionB;
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
        }
    }
}
