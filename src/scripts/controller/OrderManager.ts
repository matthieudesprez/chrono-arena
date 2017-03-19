module TacticArena.Controller {
    export class OrderManager {
        orders;
        game;

        constructor(game) {
            this.orders = [];
            this.game = game;
        }

        removeEntityOrder(pawn) {
            let id = pawn._id;
            var result = [];
            for(var i = 0; i < this.orders.length; i++) {
                if(this.orders[i].entity._id != id) {
                    result.push(this.orders[i]);
                }
            }
            this.orders = result;
            this.game.onOrderChange.dispatch(pawn);
        }

        hasOrder(id) {
            console.info(this.orders);
            for(var i = 0; i < this.orders.length; i++) {
                console.info(this.orders[i].entity);
                if(this.orders[i].entity._id == id) { return true; }
            }
            return false;
        }

        add(action, entity, x, y, direction = null) {
            if(!this.hasOrder(entity._id)) {
                this.orders.push({
                    'entity': entity,
                    'list': []
                });
            }
            for(var i = 0; i < this.orders.length; i++) {
                if(this.orders[i].entity._id == entity._id) {
                    var order = {
                        action: action,
                        x: x,
                        y: y,
                        direction: direction
                    };
                    this.orders[i].list.push(order);
                }
            }
            this.game.onOrderChange.dispatch(entity);
        }

        getMaxOrderListLength() {
            var max = 0;
            for(var i = 0; i < this.orders.length; i++) {
                if(this.orders[i].list.length > max) { max = this.orders[i].list.length; }
            }
            return max;
        }

        getDefaultOrder(position, direction) {
            return  {
                'action': 'stand',
                'x': position.x,
                'y': position.y,
                'direction': direction
            };
        }

        formatOrders() {
            for(var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i];
                if(!this.hasOrder(p._id)) {
                    let position = p.getPosition();
                    this.game.orderManager.add('stand', p, position.x, position.y, p.getDirection());
                }
            }
        }

        getInitialStep() {
            var step = [];
            for(var i = 0; i < this.game.pawns.length; i++) {
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
            //return false;
            return (Math.floor(Math.random() * 100) > fleeRate);
        }

        movesTo(p1, p2) {
            return (p1.x == p2.x && p1.y == p2.y);
        }

        blockEntity(steps, startI, j, order, entity) {
            console.info(startI, j, steps.length);
            console.log(steps);
            for(var i = startI; i < steps.length; i++) {
                console.log(steps[i][j]);
                if(steps[i][j].order) {
                    if (i > startI && steps[i][j].order.action == 'move') {
                        steps[i][j].order = order;
                    }
                    steps[i][j].order.x = order.x;
                    steps[i][j].order.y = order.y;
                }
            }
            entity.destroyProjection();
            return steps;
        }

        getSteps() {
            console.log(this.orders);
            this.formatOrders();
            let steps = new Array(this.getMaxOrderListLength());
            for (var j = 0; j < steps.length; j++) {
                steps[j] = [];
                for(var i = 0; i < this.orders.length; i++) {
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
                isDodging: false,
                isAttacking: false,
                isHurt: false,
                moveHasBeenBlocked: false,
                isBurned: false,
                positionBlocked: {}
            };
        }

        processOrders(steps) {
            console.log(steps);
            for(var l = 1; l < steps.length; l++) {
                var step = steps[l];
                for (var i = 0; i < step.length; i++) {
                    step[i].entityState = this.getDefaultEntityState();
                }

                // check actions before for each entitie in step
                for (var i = 0; i < step.length; i++) {
                    var entityA = step[i].entity;
                    var entityAState = step[i].entityState;
                    let previousStep = steps[l - 1];
                    // foreach entities except A
                    for (var j = 0; j < step.length; j++) {
                        var entityB = step[j].entity;
                        if (entityA._id == entityB._id) continue; // Pas d'interaction avec soi-même
                        var entityBState = step[j].entityState;
                        // Dans le cas où une entité à moins d'actions à jouer que les autres
                        // On lui en assigne un par défaut pour qu'elle ne soit pas inactive
                        // FIXME FAIRE GAFFE => INACTIF SI PLUS DE AP
                        // INACTIF = stand mais pas le droit d'attaquer
                        if (step[i].order == null) { step[i].order = this.getDefaultOrder(previousStep[i].order, previousStep[i].order.direction); }
                        if (step[j].order == null) { step[j].order = this.getDefaultOrder(previousStep[j].order, previousStep[j].order.direction); }
                        let orderA = step[i].order;
                        let orderB = step[j].order;
                        let actionA = orderA.action;
                        let actionB = orderB.action;
                        let positionA = {x: orderA.x, y: orderA.y};
                        let positionB = {x: orderB.x, y: orderB.y};

                        let directionABeforeOrder =  previousStep[i].order.direction;
                        let positionABeforeOrder = {x: previousStep[i].order.x, y: previousStep[i].order.y};
                        let positionBBeforeOrder = {x: previousStep[j].order.x, y: previousStep[j].order.y};

                        let aIsFacingB = this.game.stageManager.isFacing(positionABeforeOrder, orderA.direction, positionBBeforeOrder);
                        let fleeRate = 100;
                        let apCost = 1;
                        let hpLost = 0;

                        console.log(entityA._id, this.game.stageManager.getNbTilesBetween(positionABeforeOrder, positionBBeforeOrder), aIsFacingB);
                        if (actionA == 'cast') {
                            apCost++;
                            let path = this.game.stageManager.getLinearPath(entityA, 4, orderA.direction, {x: orderA.x, y: orderA.y});
                            let targets = [];
                            for (var k = 0; k < path.length; k++) {
                                if (path[k].x == positionB.x && path[k].y == positionB.y) {
                                    targets.push({entity: entityB, state: entityBState});
                                    entityBState.isBurned = true;
                                }
                            }
                            orderA.targets = targets;
                        } else if (this.game.stageManager.getNbTilesBetween(positionABeforeOrder, positionBBeforeOrder) == 1 && aIsFacingB) {
                            // Possible cases :
                            // [  ][A v][  ]
                            // [A>][ B ][<A]
                            // [  ][ A^][  ]
                            // FIXME ne doit pas attaque si on sort du cac
                            let keepDirection = (directionABeforeOrder == orderA.direction);
                            // Si A reste dans sa direction (aIsFacingB), et ne va pas pas se détourner de B
                            // Ou si A va vers B (en lui faisant face)
                            console.log('oui', entityA._id, keepDirection, this.movesTo(orderA, orderB));
                            if (keepDirection || this.movesTo(orderA, orderB)) {
                                entityAState.isAttacking = true;
                                if(this.resolutionEsquive(fleeRate)) {
                                    entityBState.isHurt = true;
                                    entityBState.moveHasBeenBlocked = true;
                                    entityBState.isDodging = false;
                                } else {
                                    entityBState.isHurt = false;
                                    entityBState.isDodging = true;
                                }

                                step[i].order.action = 'attack';
                                step[i].order.direction = entityA.getDirection();
                                step[i].order.target = {
                                    entity: entityB,
                                    state: entityBState
                                };

                                // Si A projetait de se déplacer vers B, son move a été interrompu
                                // Ses prochaines actions seront remplacées par celle par défaut
                                entityAState.moveHasBeenBlocked = this.movesTo(orderA, orderB);
                            }
                        }

                        if (orderA.x == orderB.x && orderA.y == orderB.y) {
                            // Si A veut aller sur la même case que B (qu'il y soit déjà où qu'il veuille y aller)
                            entityAState.moveHasBeenBlocked = (actionA == 'move');
                            entityBState.moveHasBeenBlocked = (actionB == 'move');
                        }

                        step[i].entityState['ap'] = previousStep[i].entityState['ap'] - apCost;

                        if(entityBState.isHurt) { hpLost = 1; }
                        if(entityBState.isBurned) { hpLost = 2; }
                        step[j].entityState['hp'] = previousStep[j].entityState['hp'] - hpLost;

                        if(entityBState.moveHasBeenBlocked) {
                            this.blockEntity(steps, l, j, this.getDefaultOrder(previousStep[j].order, previousStep[j].order.direction), entityB);
                            entityBState.positionBlocked = {x: orderB.x, y: orderB.y};
                        }
                        if(entityAState.moveHasBeenBlocked) {
                            this.blockEntity(steps, l, i, this.getDefaultOrder(previousStep[i].order, previousStep[i].order.direction), entityA);
                            entityAState.positionBlocked = {x: orderA.x, y: orderA.y};
                        }
                    }
                }
            }
            console.log(steps);
            return steps;
        }
    }
}
