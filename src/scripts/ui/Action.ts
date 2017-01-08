module TacticArena.UI {
    export class Action {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<ul class="ui-menu"><li class="cancel"></li><li class="walk"></li><li class="wait"></li><li class="submit"></li></ul>');
            this.element = this.menu.element.find('.ui-menu');
            this.element.find('.submit').on('click', function () {
                self.menu.endTurn();
            });
            this.element.find('.cancel').on('click', function () {
                self.menu.cancelAction();
            });
            this.element.find('.walk').on('click', function () {
                self.deselectAll();
                self.element.find('.walk').addClass('selected');
            });
            this.element.find('.wait').on('click', function () {
                self.deselectAll();
                self.element.find('.wait').addClass('selected');
            });

            this.element.find('.walk').trigger('click');
        }

        deselectAll() {
            this.element.find('li').removeClass('selected');
        }
    }
}
