module TacticArena.UI {
    export class Action {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('' +
                '<div class="ui-menu-container">' +
                    '<ul class="ui-menu">' +
                        '<li class="cancel">←</li>' +
                        '<li class="wait" min-cost="1">1' +
                            '<span class="tooltip">Wait<br/>Cost: 1 AP<br/>Hit: 50%</span>' +
                        '</li>' +
                        '<li class="walk" min-cost="1">2' +
                            ' <span class="tooltip">Move<br/>Cost: 1 AP / case<br/>Hit: 50%</span>' +
                        '</li>' +
                        '<li class="slash" min-cost="1">3' +
                            '<span class="tooltip">Slash<br/>Cost: 1 AP<br/>Range: 1<br/>Hit: 100%</span>' +
                        '</li>' +
                        '<li class="fire" min-cost="2">4' +
                            '<span class="tooltip">Fireball<br/>Cost: 2 AP<br/>Range: 4<br/>Hit: 100%</span>' +
                        '</li>' +
                        '<li class="wind" min-cost="2">5' +
                            '<span class="tooltip">Wind<br/>Cost: 2 AP<br/>Range: 4<br/>Hit: 100%</span>' +
                        '</li>' +
                        '<li class="submit">Confirm</li>' +
                    '</ul>' +
                '</div>'
            );
            this.element = this.menu.element.find('.ui-menu');
            this.element.find('.submit').on('click', function () {
                self.menu.endOrderPhase();
            });
            this.element.find('.cancel').on('click', function () {
                self.menu.cancelAction();
            });
            this.element.find('.walk').on('click', function () {
                self.select('walk');
            });
            this.element.find('.fire').on('click', function () {
                self.select('fire');
            });
            this.element.find('.slash').on('click', function () {
                self.select('slash');
            });
            this.element.find('.wait').on('click', function () {
                self.wait();
            });
            this.element.find('.wind').on('click', function () {
                self.select('wind');
            });

            this.element.find('.walk').trigger('click');
        }

        deselectAll() {
            this.element.find('li').removeClass('selected');
        }

        select(name) {
            if(this.element.find('.' + name).hasClass('disabled')) return;
            this.deselectAll();
            this.element.find('.' + name).addClass('selected');
            this.menu.game.pointer.update();
        }

        canOrderMove() {
            return this.element.find('.walk').hasClass('selected');
        }

        canOrderFire() {
            return this.element.find('.fire').hasClass('selected');
        }

        canOrderWind() {
            return this.element.find('.wind').hasClass('selected');
        }

        canOrderSlash() {
            return this.element.find('.slash').hasClass('selected');
        }

        wait() {
            let activePawn = this.menu.game.turnManager.getActivePawn();
            let position = activePawn.getProjectionOrReal().getPosition();
            this.menu.game.orderManager.add('stand', activePawn, position.x, position.y, activePawn.getProjectionOrReal().getDirection());
            activePawn.setAp(activePawn.getAp() - 1);
            this.menu.game.signalManager.onActionPlayed.dispatch(activePawn);
        }

        clean() {
            $('.ui-menu-container').fadeOut();
        }

        show() {
            $('.ui-menu-container').fadeIn();
        }

        update(cost) {
            this.element.find('li').removeClass('disabled');
            this.element.find('li').each(function(e) {
                if(parseInt($(this).attr('min-cost')) > 0 && parseInt($(this).attr('min-cost')) > cost) {
                    $(this).addClass('disabled');
                }
            });
        }
    }
}
