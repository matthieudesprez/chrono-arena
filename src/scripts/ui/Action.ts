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
                        '<li class="cancel"></li>' +
                        '<li class="walk" min-cost="1">1' +
                            ' <span class="tooltip">Move<br/>Cost: 1 AP / case</span>' +
                        '</li>' +
                        '<li class="fire" min-cost="2">2' +
                            '<span class="tooltip">Fireball<br/>Cost: 2 AP<br/>Range: 4</span>' +
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
