module TacticArena.UI {
    export class Action {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.element = this.menu.element.querySelector('.ui-menu');

            this.getButton('.submit').addEventListener('click', function() {
                self.menu.endTurn();
            });
            this.getButton('.cancel').addEventListener('click', function() {
                self.menu.cancelAction();
            });
            this.getButton('.walk').addEventListener('click', function() {
                self.deselectAll();
                self.getButton('.walk').classList.add('selected');
            });
            this.getButton('.wait').addEventListener('click', function() {
                self.deselectAll();
                self.getButton('.wait').classList.add('selected');
            });

            this.init();
        }

        init() {
            this.getButton('.walk').click();
        }

        getButton(query) {
            return this.element.querySelector(query);
        }

        deselectAll() {
            var buttons = this.element.querySelectorAll('li');
            for(var i=0; i < buttons.length; i++) {
                buttons[i].classList.remove('selected');
            }
        }
    }
}
