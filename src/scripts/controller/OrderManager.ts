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

        add(action, entity, x, y, direction = null, triggerDispatch = true) {
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
            if(triggerDispatch) {
                this.game.signalManager.onOrderChange.dispatch(entity);
            }
        }

        getOrders(entity_id) {
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id == entity_id) {
                    return this.orders[i].list;
                }
            }
            return [];
        }

        getPlayerOrders(teamId) {
            let result = [];
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity.team == teamId) {
                    result.push({
                        entityId: this.orders[i].entity._id,
                        list: this.orders[i].list
                    });
                }
            }
            return result;
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

        static getDefaultOrder(position, direction) {
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
                    this.add('stand', p, position.x, position.y, p.getDirection(), false);
                }
            }
        }

        getInitialStep() {
            var step = [];
            for (var i = 0; i < this.orders.length; i++) {
                let state = OrderManager.getDefaultEntityState();
                let pawn = this.orders[i].entity;
                let hp = pawn.getHp();
                state['ap'] = hp > 0 ? pawn._apMax : 0;
                state['hp'] = hp;
                step.push({
                    entity: pawn,
                    entityState: state,
                    order: OrderManager.getDefaultOrder(pawn.getPosition(), pawn.getDirection())
                });
            }
            return step;
        }

        static resolutionEsquive(fleeRate) {
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

        static getDefaultEntityState() {
            return {
                moveHasBeenBlocked: false,
                positionBlocked: {}
            };
        }

        getPawn(id) {
            let result = null;
            this.game.pawns.forEach( p => {
                if(p._id == id) {
                    result = p;
                }
            });
            return result;
        }

        processOrders(steps) {
            for (var l = 1; l < steps.length; l++) {
                var step = steps[l];
                let previousStep = steps[l - 1];
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
                        if (entityA._id == entityB._id) continue; // Pas d'interaction avec soi-même
                        var entityBState = step[j].entityState;
                        let orderA = step[i].order;
                        let orderB = step[j].order;
                        let positionB = {x: orderB.x, y: orderB.y};
                        let positionABeforeOrder = {x: previousStep[i].order.x, y: previousStep[i].order.y};
                        let positionBBeforeOrder = {x: previousStep[j].order.x, y: previousStep[j].order.y};
                        let aWasFacingB = this.game.stageManager.isFacing(positionABeforeOrder, previousStep[i].order.direction, positionBBeforeOrder);
                        let aWasNextToB = this.game.stageManager.getNbTilesBetween(positionABeforeOrder, positionBBeforeOrder) == 1;
                        let fleeRate = 50;
                        let entityAApCost = 1;
                        let entityBHpLost = 0;
                        let aIsActive = previousStep[i].entityState['ap'] > 0; // INACTIF = stand mais pas le droit d'attaquer
                        let keepDirection = (previousStep[i].order.direction == orderA.direction);
                        let keepPosition = (orderA.x == positionABeforeOrder.x && orderA.y == positionABeforeOrder.y);
                        let equalPositions = this.game.stageManager.equalPositions(orderA, orderB);
                        let differentTeams = entityA.team != entityB.team;

                        if (equalPositions) {
                            // Si A veut aller sur la même case que B (qu'il y soit déjà où qu'il veuille y aller)
                            if (this.alteredPawns.indexOf(entityA._id) < 0) entityAState.moveHasBeenBlocked = (orderA.action == 'move');
                            if (this.alteredPawns.indexOf(entityB._id) < 0) entityBState.moveHasBeenBlocked = (orderB.action == 'move');
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
                        if (
                            ['stand', 'move'].indexOf(orderA.action) >= 0 && aWasNextToB && aWasFacingB && aIsActive &&
                            differentTeams && keepDirection && (keepPosition || equalPositions)) {
                            let entityBIsDodging = true;
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

                        if (orderA.action == 'cast') {
                            entityAApCost++;
                            let path = this.game.stageManager.getLinearPath(entityA, 4, orderA.direction, orderA);
                            orderA.targets = orderA.targets || [];
                            for (var k = 0; k < path.length; k++) {
                                let targetPosition = entityBState.moveHasBeenBlocked ? positionBBeforeOrder : positionB;
                                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                                    orderA.targets.push(entityB._id);
                                    entityBHpLost += 2;
                                }
                            }
                        }

                        entityBState.hp = typeof entityBState.hp !== 'undefined' ? entityBState.hp : previousStep[j].entityState['hp'];
                        entityBState.hp -= entityBHpLost;
                        entityAState.ap = aIsActive ? previousStep[i].entityState['ap'] - entityAApCost : 0;

                        if(entityBState.hp <= 0) { entityBState.moveHasBeenBlocked = true; }

                        if (entityAState.moveHasBeenBlocked && this.alteredPawns.indexOf(entityA._id) < 0) {
                            this.blockEntity(steps, l, i, OrderManager.getDefaultOrder(previousStep[i].order, previousStep[i].order.direction), entityA);
                        }
                        if (entityBState.moveHasBeenBlocked && this.alteredPawns.indexOf(entityB._id) < 0) {
                            this.blockEntity(steps, l, j, OrderManager.getDefaultOrder(previousStep[j].order, previousStep[j].order.direction), entityB);
                        }
                    }
                }
            }
            return steps;
        }
    }
}
