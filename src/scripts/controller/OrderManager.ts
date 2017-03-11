module TacticArena.Controller {
    export class OrderManager {
        orders;
        game;

        constructor(game) {
            this.orders = [];
            this.game = game;
        }

        removeEntityOrder(pawn, order?) {
            let id = pawn._id;
            var result = [];
            for(var i = 0; i < this.orders.length; i++) {
                if(this.orders[i].entity._id != id) {
                    if(order && this.orders[i].list.length > 0) {
                        var list = [];
                        for(var j = 0; j < this.orders[i].list.length; j++) {
                            var o = this.orders[i].list[j];
                            // exemple si order == stand_W on remove un éventuel stand_* aux mêmes coordonnées
                            if(o.action.indexOf(order.action.substring(0, order.action.length - 1)) < 0
                            || o.x != order.x
                            || o.y != order.y ) {
                                list.push(o);
                            }
                        }
                        this.orders[i].list = list;
                    }
                    result.push(this.orders[i]);
                }
            }
            this.orders = result;
            this.game.onOrderChange.dispatch(pawn);
        }

        hasOrder(id) {
            for(var i = 0; i < this.orders.length; i++) {
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
                        'action': action,
                        'x': x,
                        'y': y,
                        'direction': direction
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

        getDefaultOrder(entity, forceReal = false) {
            var d = forceReal ? entity.getDirection() : entity.getProjectionOrReal().getDirection()
            return  {
                'action': 'stand_' + d,
                'x': entity.getPosition().x,
                'y': entity.getPosition().y,
                'direction': d
            };
        }

        formatOrders() {
            for(var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i];
                if(!this.hasOrder(p._id)) {
                    let position = p.getPosition();
                    this.game.orderManager.add('stand_' + p.getDirection(), p, position.x, position.y, p.getDirection());
                }
            }
        }

        getInitialStep() {
            var step = [];
            for(var i = 0; i < this.game.pawns.length; i++) {
                step.push({
                    entity: this.game.pawns[i],
                    order: this.getDefaultOrder(this.game.pawns[i], true)
                });
            }
            return step;
        }

        resolutionEsquive(fleeRate, entityBState) {
            return (Math.floor(Math.random() * 100) > fleeRate);
        }

        getOrderDirection(entityStep) {
            let direction =  entityStep.order.action.split(/[_ ]+/).pop();
            return ['N','S','E','W'].indexOf(direction) > -1 ? direction : entityStep.entity.getDirection();
        }

        movesTo(order, entity) {
            let p = entity.getPosition();
            return (order.x == p.x && order.y == p.y);
        }

        pacifyEntity(steps, entity) {
            for(var i = 0; i < steps.length; i++) {
                for(var j = 0; j < steps.length; j++) {
                    if(steps[i][j].entity._id == entity._id) {
                        steps[i][j].order = this.getDefaultOrder(entity);
                    }
                }
            }
            entity.destroyProjection();
            return steps;
        }

        getSteps() {
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

        processOrders(steps) {
            for(var l = 1; l < steps.length; l++) {
                var step = steps[l];
                for (var i = 0; i < step.length; i++) {
                    step[i].entityState = {
                        isDodging: false,
                        isAttacking: false,
                        isHurt: false,
                        attackTarget: false,
                        isBlocked: false,
                        moveHasBeenBlocked: false
                    };
                }

                // check actions before for each entitie in step
                for (var i = 0; i < step.length; i++) {
                    var entityA = step[i].entity;
                    var entityAState = step[i].entity.entityState;
                    // foreach entities except A
                    for (var j = 0; j < step.length; j++) {
                        var entityB = step[j].entity;
                        if (entityA._id == entityB._id) continue; // Pas d'interaction avec soi-même
                        var entityBState = step[j].entityState;
                        // Dans le cas où une entité à moins d'actions à jouer que les autres
                        // On lui en assigne un par défaut pour qu'elle ne soit pas inactive
                        // TODO FAIRE GAFFE => INACTIF SI PLUS DE AP
                        if (step[i].order == null) { step[i].order = this.getDefaultOrder(entityA); }
                        if (step[j].order == null) { step[j].order = this.getDefaultOrder(entityB); }
                        let orderA = step[i].order;
                        let orderB = step[j].order;
                        let aIsFacingB = entityA.isFacing(entityB.getPosition());
                        let actionA = orderA.action;
                        let positionA = entityA.getPosition();
                        let positionB = entityB.getPosition();
                        let directionA = entityA.getDirection();
                        let fleeRate = 0;

                        if (actionA.indexOf('cast_') >= 0) {
                            let path = this.game.stageManager.getLinearPath(entityA, 4);
                            let targets = [];
                            for (var k = 0; k < path.length; k++) {
                                if (path[k].x == positionB.x && path[k].y == positionB.y) {
                                    targets.push(entityB);
                                }
                            }
                            orderA.targets = targets;
                        } else if (this.game.stageManager.getNbTilesBetween(positionA, positionB) == 1 && aIsFacingB) {
                            // Possible cases :
                            // [  ][A v][  ]
                            // [A>][ B ][<A]
                            // [  ][ A^][  ]
                            // TODO Utiliser getOrderDirection ?
                            let keepDirection = (directionA == actionA.replace('stand_', '').replace('cast_', ''));
                            // Si A reste dans sa direction (aIsFacingB), et ne va pas pas se détourner de B
                            // Ou si A va vers B (en lui faisant face)
                            if (keepDirection || this.movesTo(orderA, entityB)) {
                                entityAState.isAttacking = true;
                                entityAState.attackTarget = entityB;
                                if(this.resolutionEsquive(fleeRate, entityBState)) {
                                    entityBState.isHurt = true;
                                    entityBState.isDodging = false;
                                } else {
                                    entityBState.isHurt = false;
                                    entityBState.isDodging = true;
                                }

                                step[i].order.action = 'attack_' + entityA.getDirection();
                                step[i].order.target = entityA.attackTarget;

                                // Si A projetait de se déplacer vers B, son move a été interrompu
                                // Ses prochaines actions seront remplacées par celle par défaut
                                entityAState.moveHasBeenBlocked = this.movesTo(orderA, entityB);
                            }
                        }

                        if (orderA.x == orderB.x && orderA.y == orderB.y) {
                            // Si A veut aller sur la même case que B (qu'il y soit déjà où qu'il veuille y aller)
                            entityAState.isBlocked = (step[i].order.action == 'move');
                            entityAState.moveHasBeenBlocked = entityA.isBlocked;
                        }
                    }
                }
            }
            return steps;
        }
    }
}
