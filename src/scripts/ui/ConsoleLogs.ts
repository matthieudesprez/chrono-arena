module TacticArena.UI {
    export class ConsoleLogs {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="ui-logs"></div>');
            this.element = this.menu.element.find('.ui-logs');
        }

        write(msg) {
            this.element.append(msg + '<br/>');
            this.element.scrollTop(this.element[0].scrollHeight - this.element.height());
        }

    }
}
