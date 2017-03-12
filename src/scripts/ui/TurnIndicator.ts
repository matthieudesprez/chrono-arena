module TacticArena.UI {
    export class TurnIndicator {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="ui-turn-indicator"></div>');
            this.element = this.menu.element.find('.ui-turn-indicator');
        }

        write(turn) {
            this.element.html('Tour ' + ("0" + Number(turn)).slice(-2));
        }

    }
}
