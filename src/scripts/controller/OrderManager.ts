module TacticArena.Controller {
    export class OrderManager {
        orders;

        constructor() {
            this.orders = [];     
        }

        removeEntityOrder(id, order?) {
            var result = [];
            for(var i = 0; i < this.orders.length; i++) {
                if(this.orders[i].entity._id != id) {
                    if(order && this.orders[i].list.length > 0) {
                        var list = [];
                        for(var j = 0; j < this.orders[i].list.length; j++) {
                            var o = this.orders[i].list[j];
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
            console.log(entity._id, this.orders);
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

        createPromiseOrderFactory(entity, x, y) {
            return this.createPromiseOrder(entity, x, y);
        }

        createPromiseOrder(entity, x, y) {
            return entity.ghost.moveTo(x, y).then((res) => {
                return res;
            });
        }

        resolveAll() {
            console.log(this.orders);
            return new Promise((resolve, reject) => {
                var steps = new Array(this.getMaxOrderListLength());
                for (var j = 0; j < steps.length; j++) {
                    steps[j] = [];
                    for(var i = 0; i < this.orders.length; i++) {
                        steps[j].push({
                            'entity': this.orders[i].entity,
                            'order': this.orders[i].list[j]
                        });
                    }
                }
                console.log(steps);

                this.processOrders(steps).then((res) => {
                    console.log('finito');

                    for(var i = 0; i < this.orders.length; i++) {
                        this.orders[i].entity.destroyGhost();
                        this.orders[i].entity.show();
                    }
                    this.orders = [];
                    resolve(true);
                });
            });
        }

        processOrders(steps) {
            return new Promise((resolve, reject) => {
                if (steps && steps.length > 0) {
                    console.log(steps);
                    var step = steps[0];
                    steps.shift();
                    var promisesOrders = [];
                    for (var i = 0; i < step.length; i++) {
                        var o = step[i].order;
                        var entity = step[i].entity;
                        var p = null;
                        if (o && o.action == 'move') {
                            console.log(o.x, o.y);
                            promisesOrders.push(this.createPromiseOrderFactory(entity, o.x, o.y));
                        }
                        else {
                            promisesOrders.push(new Promise((resolve, reject) => {
                                entity.show();
                                resolve(true);
                            }));
                        }
                    }
                    Promise.all(promisesOrders).then((res) => {
                        if (steps && steps.length > 0) {
                            this.processOrders(steps).then((res) => {
                                resolve(res);
                            }); // recursive
                        } else {
                            console.log('finished');
                            resolve(true);
                        }
                    });
                }
            });
        }
    }
}
