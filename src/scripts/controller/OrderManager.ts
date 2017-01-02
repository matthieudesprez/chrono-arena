module TacticArena.Controller {
    export class OrderManager {
        orders;
        game;

        constructor(game) {
            this.orders = [];
            this.game = game;
        }

        removeEntityOrder(id, order?) {
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
                    if(action.indexOf('stand_') >= 0) {
                        this.removeEntityOrder(entity, order);
                    }
                    this.orders[i].list.push(order);
                }
            }
        }

        getMaxOrderListLength() {
            var max = 0;
            for(var i = 0; i < this.orders.length; i++) {
                if(this.orders[i].list.length > max) { max = this.orders[i].list.length; }
            }
            return max;
        }

        createPromiseOrder(entity, x, y) {
            return entity.ghost.moveTo(x, y).then((res) => {
                return res;
            });
        }

        resolveAll() {
            return new Promise((resolve, reject) => {
                var steps = new Array(this.getMaxOrderListLength());
                for (var j = 0; j < steps.length; j++) {
                    steps[j] = [];
                    for(var i = 0; i < this.orders.length; i++) {
                        var entity = this.orders[i].entity;
                        steps[j].push({
                            'entity': entity,
                            'order': this.orders[i].list[j] ? this.orders[i].list[j] : {
                                'action': 'stand_' + entity.getDirection(),
                                'x': entity.getPosition().x,
                                'y': entity.getPosition().y
                            }
                        });
                    }
                }
                if(steps.length > 1) {
                    steps.shift(); // skip the first stand order
                }
                this.processOrders(steps).then((res) => {
                    console.log('finito');
                    for(var i = 0; i < this.orders.length; i++) {
                        this.orders[i].entity.destroyGhost();
                    }
                    this.orders = [];
                    resolve(true);
                });
            });
        }

        resolutionEsquive(fleeRate, entityA, entityB, target) {
            // entityA attaque entityB
            console.log(entityA, entityB);
            if(Math.floor(Math.random() * 100) > fleeRate) {
                console.log('esquive failed');
                entityB.isHurt = true;
                entityA.isAttacking = true;
                entityA.attackTarget = target;
                // resolution des degats
            } else {
                console.log('esquive success');
            }
        }

        processOrders(steps) {
            return new Promise((resolve, reject) => {
                if (steps && steps.length > 0) {
                    var step = steps[0];
                    steps.shift();

                    // check actions before step resolution
                    for(var i = 0; i < step.length; i++) {
                        // todo améliorer ça car c'est jamais clair si on cible le ghost ou l'entité
                        var entityA = step[i].entity.ghost ? step[i].entity.ghost : step[i].entity;
                        for(var j = i + 1; j < step.length; j++) {
                            var entityB = step[j].entity.ghost ? step[j].entity.ghost : step[j].entity;
                            console.log(this.game.stageManager.getNbTilesBetween(entityA.getPosition(), entityB.getPosition()), entityA, entityB);
                            if(this.game.stageManager.getNbTilesBetween(entityA.getPosition(), entityB.getPosition()) == 1
                            && (entityB.isFacing(entityA.getPosition()) || entityA.isFacing(entityB.getPosition()))) {
                                var fleeRate = 0;
                                if (step[i].order.action == 'move' && step[j].order.action == 'move') {
                                    console.log('desengagement', entityA); // désengagement mutuel
                                } else {
                                    if (step[i].order.action.indexOf('stand_') >= 0 && entityA.isFacing(entityB.getPosition())) {
                                        console.log('accrochage from player');
                                        this.resolutionEsquive(fleeRate, entityA, entityB, step[j].entity);
                                    }
                                    if (step[j].order.action.indexOf('stand_') >= 0 && entityB.isFacing(entityA.getPosition())) {
                                        console.log('accrochage from ennemy');
                                        this.resolutionEsquive(fleeRate, entityB, entityA, step[i].entity);
                                    }
                                }
                            }
                        }

                        if(entityA.isAttacking) {
                            console.log(step[i].entity._id, 'attacking', j);
                            step[i].order.action = 'attack_' + entityA.getDirection();
                            console.log(entityA.attackTarget);
                            step[i].order.target = entityA.attackTarget;
                        } else if(entityA.isHurt) {
                            // cancel de la prochaine action
                            step[i].order = {
                                'action': 'stand_' + entityA.getDirection(),
                                'x': entityA.getPosition().x,
                                'y': entityA.getPosition().y
                            };
                            step[i].entity.stunned = true;
                        }
                    }

                    var promisesOrders = [];
                    for (var i = 0; i < step.length; i++) {
                        var o = step[i].order;
                        var entity = step[i].entity;
                        var e = entity.ghost ? entity.ghost : entity;
                        var p = null;
                        console.log(entity, o);
                        if (o.action == 'move') {
                            p = this.createPromiseOrder(entity, o.x, o.y);
                        } else if (o.action.indexOf('stand_') >= 0 || entity.hasAttacked) {
                            p = new Promise((resolve, reject) => {
                                var direction = o.action.replace('stand_', '').replace('attack_', '');
                                e.faceDirection(direction);
                                if(entity.stunned) {
                                    console.log('reset');
                                    entity.resetToGhostPosition();
                                }
                                resolve(true);
                            });
                        } else if (o.action.indexOf('attack_') >= 0) {
                            p = entity.attack(o.target);
                        }
                        promisesOrders.push(p);
                    }

                    Promise.all(promisesOrders).then((res) => {
                        if (steps && steps.length > 0) {
                            this.processOrders(steps).then((res) => {
                                resolve(res);
                            }); // recursive
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        }
    }
}
