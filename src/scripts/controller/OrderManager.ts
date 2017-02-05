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

        resolveAll() {
            return new Promise((resolve, reject) => {
                this.formatOrders();
                var steps = new Array(this.getMaxOrderListLength());
                for (var j = 0; j < steps.length; j++) {
                    steps[j] = [];
                    for(var i = 0; i < this.orders.length; i++) {
                        var entity = this.orders[i].entity;
                        steps[j].push({
                            'entity': entity,
                            'order': this.orders[i].list[j] ? this.orders[i].list[j] : this.getDefaultOrder(entity)
                        });
                    }
                }
                this.processOrders(steps).then((res) => {
                    for(var i = 0; i < this.orders.length; i++) {
                        this.orders[i].entity.destroyProjection();
                    }
                    this.orders = [];
                    resolve(true);
                });
            });
        }

        resolutionEsquive(fleeRate, entityA, entityB) {
            if(Math.floor(Math.random() * 100) > fleeRate) {
                console.log('esquive failed', entityB._id);
                entityA.isAttacking = true;
                entityA.attackTarget = entityB;
                entityB.isHurt = true;
                entityB.isDodging = false;
            } else {
                console.log('esquive success', entityB._id);
                entityA.isAttacking = true;
                entityA.attackTarget = null;
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

        processOrders(steps) {
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
                    }
                    // check actions before step resolution
                    // foreach entities in step
                    for(var i = 0; i < step.length; i++) {
                        var entityA = step[i].entity;
                        // foreach entities except A
                        for(var j = i + 1; j < step.length; j++) {
                            var entityB = step[j].entity;
                            if(this.game.stageManager.getNbTilesBetween(entityA.getPosition(), entityB.getPosition()) == 1
                            && (entityB.isFacing(entityA.getPosition()) || entityA.isFacing(entityB.getPosition()))) {
                                let fleeRate = 50;
                                let orderA = step[i].order;
                                let orderB = step[j].order;
                                let actionA = orderA.action;
                                let actionB = orderB.action;
                                if (actionA == 'move' && actionB == 'move' && !this.movesTo(orderA, entityB) && !this.movesTo(orderB, entityA)) {
                                    console.log('desengagement', entityA); // désengagement mutuel
                                } else {
                                    if ((actionA.indexOf('stand_') >= 0 || this.movesTo(orderA, entityB)) && entityA.isFacing(entityB.getPosition())) {
                                        console.log('accrochage from player');
                                        this.resolutionEsquive(fleeRate, entityA, entityB);
                                    }
                                    if ((actionB.indexOf('stand_') >= 0 || this.movesTo(orderB, entityA)) && entityB.isFacing(entityA.getPosition())) {
                                        console.log('accrochage from ennemy');
                                        this.resolutionEsquive(fleeRate, entityB, entityA);
                                    }
                                }
                            }
                        }

                        if(entityA.isAttacking) {
                            step[i].order.action = 'attack_' + entityA.getDirection();
                            step[i].order.target = entityA.attackTarget;
                        } else if(entityA.isHurt) { // cancel des prochaines actions
                            step[i].order = {
                                'action': 'hurt_' + this.getOrderDirection(step[i]),
                                'x': entityA.getPosition().x,
                                'y': entityA.getPosition().y
                            };
                        }
                    }

                    var promisesOrders = [];
                    var logInfos = [];
                    for (var i = 0; i < step.length; i++) {
                        var color = '#78dd77';
                        var o = step[i].order;
                        var e = step[i].entity;
                        var p = null;
                        if (o.action.indexOf('hurt_') >= 0) {
                            var color = '#f45d62';
                            o.action = o.action.replace('hurt_', 'stand_');
                        }
                        if(e.isDodging) {
                            e.dodge();
                        }
                        if (o.action == 'move') {
                            p = this.createPromiseMoveOrder(e, o.x, o.y);
                        } else if (o.action.indexOf('attack_') >= 0) {
                            p = e.attack(o.target);
                            if(o.target) {
                                steps = [];
                            }
                        } else if (o.action.indexOf('stand_') >= 0 || e.hasAttacked) {
                            p = new Promise((resolve, reject) => {
                                var direction = o.action.replace('stand_', '').replace('attack_', '');
                                e.faceDirection(direction);
                                resolve(true);
                            });
                        }
                        promisesOrders.push(p);
                        logInfos.push('<span style="color:' + color + ';">entity ' + e._id + ' : ' + o.action + ' ' + o.x + ',' + o.y + '</span>');
                    }
                    this.game.uiManager.logsUI.write(logInfos.join(' | '));

                    Promise.all(promisesOrders).then((res) => {
                        if (steps && steps.length > 0) {
                            this.processOrders(steps).then((res) => {
                                resolve(res);
                            }); // recursive
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
