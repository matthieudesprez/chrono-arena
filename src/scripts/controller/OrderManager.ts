module TypescriptPhaser.Controller {
    export class OrderManager {
        players;
        orders;

        constructor(game) {
            this.players = game.players;  
            this.orders = [];     
        }

        add(action, entity, x, y) {
            this.orders.push({
            	'action': action,
            	'entity': entity,
            	'x': x,
            	'y': y
            })
        }

        resolveAll() {
            return new Promise((resolve, reject) => {
            	for(var i = 0; i < this.orders.length; i++) {
            		var o = this.orders[i];
            		if(o.action == 'move') {
            			console.log('yeah');
            			o.entity.ghost.preMoveTo(o.x, o.y).then((res) => {
	                        console.log('ook');
	                        //delete o.entity.ghost;
	                    });
            		}
            	}
            	this.orders = [];
	        	resolve(true);
        	});
        }
    }
}
