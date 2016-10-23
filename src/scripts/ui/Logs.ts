module TacticArena.UI {
    export class Logs {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.element = this.menu.element.querySelector('.ui-logs');
        }

        write(msg) {
            this.element.innerHTML += msg + '<br/>';
            this.element.scrollTop = this.element.scrollHeight;
        }

    }
}
