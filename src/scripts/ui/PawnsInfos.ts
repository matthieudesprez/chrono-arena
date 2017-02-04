module TacticArena.UI {
    export class PawnsInfos {
        menu;
        element;

        constructor(menu) {
            this.menu = menu;//
            var html = '<div class="ui-pawns-infos">';
            for(var i = 0; i < this.menu.game.pawns.length; i++) {
                html += '<div class="pawn pawn0' + this.menu.game.pawns[i]._id + '">' +
                '<div class="avatar"></div>' +
                '<div class="infos">' +
                '<span class="hp"><span class="value"></span> HP</span>' +
                '<span class="ap"><span class="value"></span> AP</span>' +
                '</div>' +
                '<div class="orders"></div> ' +
                '</div>';
            }
            html += '</div>';
            this.menu.element.append(html);
            this.element = this.menu.element.find('.ui-pawns-infos');
        }

        select(id) {
            this.element.find('.pawn').removeClass('active');
            this.element.find('.pawn0' + id).addClass('active');
        }

        updateInfos() {
            for(var i=0; i < this.menu.game.pawns.length; i++) {
                var entity = this.menu.game.pawns[i];
                this.element.find('.pawn0' + entity._id + ' .infos .hp .value').html(entity.getHp());
                this.element.find('.pawn0' + entity._id + ' .infos .ap .value').html(entity.getAp());
            }
        }

        updateOrders(pawn, orders) {
            let orders_list = '';
            for(var i=0; i < orders.length; i++) {
                if(orders[i].entity._id == pawn._id) {
                    for(var j = 0; j < orders[i].list.length; j++) {
                        let o = orders[i].list[j];
                        orders_list += '<div>' + o.action + ' : ' + o.x + ',' + o.y + '</div>';
                    }
                }
            }
            this.element.find('.pawn0' + pawn._id + ' .orders').html(orders_list);
        }

        cleanOrders() {
            this.element.find('.orders').html('');
        }
    }
}
