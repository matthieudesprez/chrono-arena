module TacticArena.UI {
    export class OrdersNotifications {
        menu;
        element;
        directionMapping;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            //this.menu.element.append('<div class="ui-notifications ui-orders-notifications"></div>');
            //this.element = this.menu.element.find('.ui-orders-notifications');
            this.directionMapping = {
                'W': "l'Ouest",
                'E': "l'Est",
                'N': "le Nord",
                'S': "le Sud"
            }
        }

        clean() {
            //this.remove(this.element.find('div[class*="item-"]'));
            //this.element.html('');
            this.menu.game.stageManager.clearPath(this.menu.game.pathOrdersTilesGroup);
        }

        remove(elements) {
            //if (elements.length > 0) {
            //    let self = this;
            //    $(elements[elements.length - 1]).animate({opacity: 0, marginRight: -200}, 150, function () {
            //        $(this).remove();
            //        self.remove(elements.slice(0, -1));
            //    });
            //}
        }

        update(orders) {
            if(orders.length > 0) {
                orders.forEach((order) => {
                    //if(this.element.find('.item-' + i).length == 0) {
                    //    this.add($('<div class="item-' + i + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(orders[i]) + '</div>'));
                    //}

                    let activePawn = this.menu.game.turnManager.getActivePawn();
                    if(!this.menu.game.stageManager.equalPositions(this.menu.game.spritesManager.getReal(activePawn).getPosition(), order.position)) {
                        this.menu.game.stageManager.showPath([order.position], this.menu.game.pathOrdersTilesGroup, 0xffffff);
                    }
                });
            } else {
                this.clean();
            }
        }

        add(elements) {
            //if (elements.length > 0) {
            //    let self = this;
            //    $(elements[elements.length - 1]).appendTo(this.element)
            //        .animate({opacity: 1, marginRight: 0}, 150, function () {
            //            self.add(elements.slice(0, -1));
            //        });
            //}
        }

        getMessage(order) {
            let activePawn = this.menu.game.turnManager.getActivePawn();
            //let msg = '<b>' + activePawn._name + '</b>';
            //if (order.action == 'move') {
            //    msg += ' se déplacera en ' + order.x + ', ' + order.y + ', orienté vers le ' + this.directionMapping[order.direction];
            //} else if (order.action == 'cast') {
            //    msg += ' lancera une boule de feu vers ' + this.directionMapping[order.direction];
            //} else if (order.action == 'stand') {
            //    msg += ' restera en position ' + order.x + ', ' + order.y + ' et fera preuve de vigilence vers ' + this.directionMapping[order.direction];
            //}
            //return '<span style="color:#ffffff;">' + msg + '</span>';
        }
    }
}
