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
                //steps.shift(); // skip the first stand order
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

        processOrders(steps) {
            return new Promise((resolve, reject) => {
                if (steps && steps.length > 0) {
                    var step = steps[0];
                    steps.shift();

                    // check actions before
                    for(var i = 0; i < step.length; i++) {
                        for(var j = i + 1; j < step.length; j++) {
                            var currentEntity = step[i].entity.ghost ? step[i].entity.ghost : step[i].entity;
                            var otherEntity = step[j].entity.ghost ? step[j].entity.ghost : step[j].entity;
                            if(this.game.stageManager.getNbTilesBetween(currentEntity.getPosition(), otherEntity.getPosition()) == 1) {
                                var fleeProbability = 100;
                                if (step[i].order.action == 'move') {
                                    if (step[j].order.action == 'move') {
                                        console.log('desengagement'); // désengagement mutuel
                                    } else if (step[j].order.action.indexOf('stand_') >= 0 && otherEntity.isFacing(currentEntity.getPosition())) {
                                        console.log('accrochage from ennemy');
                                        fleeProbability = 0;//100 - 20 + 5;

                                    } else if (step[j].order.action.indexOf('attack_') >= 0 && otherEntity.isFacing(currentEntity.getPosition())) {
                                        console.log('accrochage+1 from ennemy');
                                        fleeProbability = 0;//100 - 50 + 5;
                                    }
                                    console.log(Math.floor(Math.random() * 100), fleeProbability);
                                    if(Math.floor(Math.random() * 100) > fleeProbability) {
                                        console.log('esquive failed');
                                        // resolution des degats
                                        step[j].order.action = 'attack_' + otherEntity.getDirection();
                                        step[j].order.target = step[i].entity;
                                        // cancel de la prochaine action
                                        step[i].order = {
                                            'action': 'stand_' + currentEntity.getDirection(),
                                            'x': currentEntity.getPosition().x,
                                            'y': currentEntity.getPosition().y
                                        };
                                        step[i].entity.stunned = true;
                                    } else {
                                        console.log('esquive success');
                                    }
                                } else if (currentEntity.isFacing(otherEntity.getPosition())) {
                                    console.log('accrochage from current');
                                }
                            }
                        }
                    }
                    console.log('check');

                    var promisesOrders = [];
                    for (var i = 0; i < step.length; i++) {
                        var o = step[i].order;
                        var entity = step[i].entity;
                        var p = null;
                        console.log(entity, o);
                        if (o.action == 'move') {
                            p = this.createPromiseOrder(entity, o.x, o.y);
                        } else if (o.action.indexOf('stand_') >= 0) {
                            p = new Promise((resolve, reject) => {
                                var e = entity.ghost ? entity.ghost : entity;
                                e.faceDirection(o.action.replace('stand_', ''));
                                if(entity.stunned) {
                                    console.log('reset');
                                    entity.resetToGhostPosition();
                                }
                                resolve(true);
                            });
                        } else if (o.action.indexOf('attack_') >= 0) {
                            p = new Promise((resolve, reject) => {
                                entity.attack(o.target);
                                resolve(true);
                            });
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
