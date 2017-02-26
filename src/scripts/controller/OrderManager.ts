module TacticArena.Controller {
    export class OrderManager {
        orders;
        game;
        processing;

        constructor(game) {
            this.orders = [];
            this.game = game;
            this.processing = false;
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

        add(action, entity, x, y) {
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
                        'y': y
                    };
                    //if(action.indexOf('stand_') >= 0) {
                    //    this.removeEntityOrder(entity, order);
                    //}
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

        createPromiseMoveOrder(entity, x, y) {
            return entity.moveTo(x, y).then((res) => {
                return res;
            });
        }

        createPromiseBlockOrder(entity, x, y) {
            let initialPosition = entity.getPosition();
            return entity.moveTo(x, y).then((res) => {
                entity.blocked();
                entity.moveTo(initialPosition.x, initialPosition.y).then((res) => {
                    return res;
                });
            });
        }

        createPromiseStandOrder(entity, direction) {
            return new Promise((resolve, reject) => {
                entity.faceDirection(direction);
                setTimeout(function() {
                    resolve(true);
                }, 250);
            });
        }

        getDefaultOrder(entity) {
            return  {
                'action': 'stand_' + entity.getProjectionOrReal().getDirection(),
                'x': entity.getPosition().x,
                'y': entity.getPosition().y
            };
        }

        formatOrders() {
            for(var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i];
                if(!this.hasOrder(p._id)) {
                    let position = p.getPosition();
                    this.game.orderManager.add('stand_' + p.getDirection(), p, position.x, position.y);
                }
            }
        }

        resolutionEsquive(fleeRate, entityA, entityB) {
            if(Math.floor(Math.random() * 100) > fleeRate) {
                console.log('esquive failed', entityB._id);
                entityB.isHurt = true;
                entityB.isDodging = false;
            } else {
                console.log('esquive success', entityB._id);
                entityB.isHurt = false;
                entityB.isDodging = true;
            }
        }

        getOrderDirection(step) {
            let direction =  step.order.action.split(/[_ ]+/).pop();
            return ['N','S','E','W'].indexOf(direction) > -1 ? direction : step.entity.getDirection();
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

        isGameReadyPromise() {
            var self = this;
            return new Promise((resolve, reject) => {
                (function isGameReady(){
                    console.log('isPaused');
                    if (!self.game.isPaused) return resolve();
                    setTimeout(isGameReady, 300);
                })();
            });
        }

        isProcessingPromise() {
            var self = this;
            return new Promise((resolve, reject) => {
                (function isProcessing(){
                    console.log('isProcessing');
                    if (self.processing) return resolve();
                    setTimeout(isProcessing, 30);
                })();
            });
        }

        resolveAll() {
            return new Promise((resolve, reject) => {
                this.formatOrders();
                var steps = new Array(this.getMaxOrderListLength());
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
                this.isGameReadyPromise().then((result) => {
                    this.processOrders(steps).then((res) => {
                        for (var i = 0; i < this.orders.length; i++) {
                            this.orders[i].entity.destroyProjection();
                        }
                        this.orders = [];
                        resolve(true);
                    });
                });
            });
        }

        processOrders(steps) {
            this.game.selecting = false;
            this.processing = true;
            console.info('processorders');
            return new Promise((resolve, reject) => {
                if (steps && steps.length > 0) {
                    var step = steps[0];
                    steps.shift();
                    // Reset
                    for(var i = 0; i < step.length; i++) {
                        var entityA = step[i].entity;
                        entityA.isDodging = false;
                        entityA.isAttacking = false;
                        entityA.isHurt = false;
                        entityA.attackTarget = false;
                        entityA.isBlocked = false;
                        entityA.moveHasBeenBlocked = false;

                        if(entityA.projection) {
                            // Si entity et sa projection se chevauchent durant la résolution
                            if(JSON.stringify(entityA.getPosition()) == JSON.stringify(entityA.getProjectionOrReal().getPosition())) {
                                entityA.projection.hide();
                            } else {
                                entityA.projection.show(0.7);
                            }
                        }
                    }
                    // check actions before step resolution
                    // foreach entities in step
                    for(var i = 0; i < step.length; i++) {
                        var entityA = step[i].entity;
                        // foreach entities except A
                        for(var j = 0; j < step.length; j++) {
                            var entityB = step[j].entity;
                            if (entityA._id == entityB._id) continue; // Pas d'interaction avec soi-même
                            // Dans le cas où une entité à moins d'actions à jouer que les autres
                            // On lui en assigne un par défaut pour qu'elle ne soit pas inactive
                            if(step[i].order == null) { step[i].order = this.getDefaultOrder(entityA); }
                            if(step[j].order == null) { step[j].order = this.getDefaultOrder(entityB); }
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
                                for(var k = 0; k < path.length; k++) {
                                    if(path[k].x == positionB.x && path[k].y == positionB.y) {
                                        targets.push(entityB);
                                    }
                                }
                                orderA.targets = targets;
                            } else if (this.game.stageManager.getNbTilesBetween(positionA, positionB) == 1 && aIsFacingB) {
                                // Possible cases :
                                // [  ][A v][  ]
                                // [A>][ B ][<A]
                                // [  ][ A^][  ]
                                let keepDirection = (directionA == actionA.replace('stand_', '').replace('cast_', ''));
                                // Si A reste dans sa direction (aIsFacingB), et ne va pas pas se détourner de B
                                console.info(keepDirection, entityA._id);
                                if (keepDirection || this.movesTo(orderA, entityB)) {
                                    entityA.isAttacking = true;
                                    entityA.attackTarget = entityB;
                                    this.resolutionEsquive(fleeRate, entityA, entityB);

                                    step[i].order.action = 'attack_' + entityA.getDirection();
                                    step[i].order.target = entityA.attackTarget;

                                    // Si A projetait de se déplacer vers B, son move a été interrompu
                                    // Ses prochaines actions seront remplacées par celle par défaut
                                    entityA.moveHasBeenBlocked = this.movesTo(orderA, entityB);
                                }
                            }

                            if(orderA.x == orderB.x && orderA.y == orderB.y) {
                                // Si A veut aller sur la même case que B (qu'il y soit déjà où qu'il veuille y aller)
                                entityA.isBlocked = (step[i].order.action == 'move');
                                entityA.moveHasBeenBlocked = entityA.isBlocked;
                            }
                        }
                    }

                    console.log(step);
                    var promisesOrders = [];
                    var logInfos = [];
                    for (var i = 0; i < step.length; i++) {
                        var logColor = '#78dd77';
                        var o = step[i].order;
                        var e = step[i].entity;
                        var p = null;

                        if(e.isHurt && !e.isAttacking) {
                            logColor = '#f45d62';
                            o.action = o.action.replace('move', 'stand_' + e.getDirection());
                            e.moveHasBeenBlocked = true;
                        }
                        if(e.isBlocked) {
                            p = this.createPromiseBlockOrder(e, o.x, o.y);
                        } else if (o.action == 'move') {
                            p = this.createPromiseMoveOrder(e, o.x, o.y);
                        } else if (o.action.indexOf('attack_') >= 0) {
                            p = e.attack(o.target);
                        } else if (o.action.indexOf('cast_') >= 0) {
                            p = e.cast(o.targets);
                        } else if (o.action.indexOf('stand_') >= 0) {
                            p = this.createPromiseStandOrder(e, o.action.replace('stand_', ''));
                        }

                        if(e.moveHasBeenBlocked) {
                            steps = this.pacifyEntity(steps, e);
                        }

                        promisesOrders.push(p);
                        logInfos.push('<span style="color:' + logColor + ';">entity ' + e._id + ' : ' + o.action + ' ' + o.x + ',' + o.y + '</span>');
                    }
                    this.game.uiManager.logsUI.write(logInfos.join(' | '));

                    Promise.all(promisesOrders).then((res) => {
                        this.processing = false;
                        if (steps && steps.length > 0) {
                            this.isGameReadyPromise().then((result) => {
                                this.processOrders(steps).then((res) => {
                                    resolve(res);
                                }); // recursive
                            });
                        } else {
                            resolve(true);
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        }
    }
}
