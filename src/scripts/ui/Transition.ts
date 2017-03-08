module TacticArena.UI {
    export class Transition {
        menu;
        element;
        elementText;


        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="ui-transition"><div class="glowing"></div></div>');
            this.element = this.menu.element.find('.ui-transition');
            this.elementText = this.element.find('.glowing');
        }

        clean() {
           this.element.html('');
        }

        show(message) {
            var self = this;
            self.element.show();
            this.elementText.html('');
            this.elementText.css('right', '-800px');
            this.elementText.html('Tour ' + this.menu.game.turnManager.currentTurnIndex + '<br/>-<br/>' + message);
            this.elementText.animate({right: '0px'}, 800, 'easeOutBack', function() {
                let el = $(this);
                //setTimeout( function() {
                //    el.animate({right: '800px'}, 800, 'easeInBack', function() {
                //        self.element.hide();
                //    });
                //}, 1000);
            });
        }
    }
}
