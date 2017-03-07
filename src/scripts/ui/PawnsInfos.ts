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
                '<div class="orders"></div> ' +
                '<div class="infos">' +
                '<div class="hp">' +
                    '<div class="bar">' +
                        '<div class="content"></div>' +
                        '<div class="text"><span class="value"></span> / ' + this.menu.game.pawns[i]._hpMax + ' HP</div>' +
                    '</div>' +
                '</div>' +
                '<div class="ap">' +
                    '<div class="bar">' +
                        '<div class="content"></div>' +
                        '<div class="text"><span class="value"></span> / ' + this.menu.game.pawns[i]._apMax + ' AP</div>' +
                    '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            }
            html += '</div>';
            this.menu.element.append(html);
            this.element = this.menu.element.find('.ui-pawns-infos');
        }

        select(id) {
            this.deselectAll();
            this.element.find('.pawn0' + id).addClass('active');
        }

        deselectAll() {
            this.element.find('.pawn').removeClass('active');
        }

        updateInfos() {
            for(var i=0; i < this.menu.game.pawns.length; i++) {
                var entity = this.menu.game.pawns[i];
                this.element.find('.pawn0' + entity._id + ' .infos .hp .value').html(entity.getHp());
                this.element.find('.pawn0' + entity._id + ' .infos .hp .bar .content').css('width', ((entity.getHp() / entity._hpMax) * 100) + '%');
                this.element.find('.pawn0' + entity._id + ' .infos .ap .value').html(entity.getAp());
                this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .content').css('width', ((entity.getAp() / entity._apMax) * 100) + '%');
            }
        }

        updateOrders(pawn, orders) {
            let orders_list = '';
            for(var i=0; i < orders.length; i++) {
                if(orders[i].entity._id == pawn._id) {
                    for(var j = 0; j < orders[i].list.length; j++) {
                        let o = orders[i].list[j];
                        orders_list += '<div class="order"><span class="' + o.action + '"></span><span class="coordinates">' + o.x + ',' + o.y + '</span></div>';
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
