module TacticArena.Controller {
    export class OrderManager {
        orders;

        constructor() {
            this.orders = [];     
        }

        removeEntityOrder(id) {
            var result = []
            for(var i = 0; i < this.orders.length; i++) {
                if(this.orders[i].entity._id != id) {
                    result.push(this.orders[i]);
                }
            }
            return result;
        }

        hasOrder(id) {
            for(var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id == id) {
                    return true;
                }
            }
            return false;
        }

        add(action, entity, x, y) {
            this.orders = this.removeEntityOrder(entity._id);
            this.orders.push({
            	'action': action,
            	'entity': entity,
            	'x': x,
            	'y': y
            })
        }

        createPromiseOrder(entity, x, y) {
            return new Promise((resolve, reject) => {
                console.log(entity._id)
                entity.ghost.preMoveTo(x, y).then((res) => {
                    entity.destroyGhost();
                    entity.show();
                    resolve(true);
                });
            });
        }

        resolveAll() {
            console.log(this.orders);
            return new Promise((resolve, reject) => {
                var promisesOrders = [];
            	for(var i = 0; i < this.orders.length; i++) {
            		var o = this.orders[i];
                    var p = null;
                    var id = o.entity._id;
            		if (o.action == 'move') {
                        p = this.createPromiseOrder(o.entity, o.x, o.y);
            		}
                     else if (o.action == 'stand') {
                        p = new Promise((resolve, reject) => {
                            o.entity.show();
                            resolve(true);
                        });
                    }
                    promisesOrders.push(p);
            	}

                Promise.all(promisesOrders).then((res) => {
                    this.orders = [];
                    resolve(true);
                });
            });
        }
    }
}
