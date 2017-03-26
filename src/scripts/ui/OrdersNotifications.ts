module TacticArena.UI {
    export class OrdersNotifications {
        menu;
        element;
        directionMapping;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="ui-notifications ui-orders-notifications"></div>');
            this.element = this.menu.element.find('.ui-orders-notifications');
            this.directionMapping = {
                'W': "l'Ouest",
                'E': "l'Est",
                'N': "le Nord",
                'S': "le Sud"
            }
        }

        clean() {
            this.remove(this.element.find('div[class*="item-"]'));
            this.menu.game.stageManager.clearPath(this.menu.game.pathOrdersTilesGroup);
        }

        remove(elements) {
            if (elements.length > 0) {
                let self = this;
                $(elements[elements.length - 1]).animate({opacity: 0, marginRight: -200}, 150, function () {
                    $(this).remove();
                    self.remove(elements.slice(0, -1));
                });
            }
        }

        update(index) {
            console.log(index);
            if(index >= 0) {
                this.add($('<div class="item-' + index + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(index) + '</div>'));
            } else {
                this.clean();
            }
        }

        add(elements) {
            if (elements.length > 0) {
                let self = this;
                $(elements[elements.length - 1]).appendTo(this.element)
                    .animate({opacity: 1, marginRight: 0}, 150, function () {
                        self.add(elements.slice(0, -1));
                    });
            }
        }

        getMessage(index) {
            let activePawn = this.menu.game.turnManager.getActivePawn();
            let order = this.menu.game.orderManager.getOrders(activePawn._id)[index];
            console.log(order);
            this.menu.game.stageManager.showPath([order], this.menu.game.pathOrdersTilesGroup, 0xffffff);
            let o = order;
            let msg = '<b>' + activePawn._name + '</b>';
            if (order.action == 'move') {
                msg += ' se déplacera en ' + o.x + ', ' + o.y;
            } else if (o.action == 'cast') {
                msg += ' lancera une boule de feu vers ' + this.directionMapping[o.direction];
            } else if (o.action == 'stand') {
                msg += ' restera en position ' + o.x + ', ' + o.y + ' et surveillera vers ' + this.directionMapping[o.direction];
            }
            console.log(msg);
            return '<span style="color:#ffffff;">' + msg + '</span>';
        }

        hilightPath(position) {

        }
    }
}
