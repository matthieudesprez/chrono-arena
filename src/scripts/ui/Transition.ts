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


            this.element.on('click', function () {
                console.log('clic');
                $(self.element).fadeOut();
            });
        }

        hide() {
            var self = this;
            $(self.elementText).animate({right: '800px'}, 800, 'easeInBack', function() {
                $(self.element).hide();
            });
        }

        clean() {
           this.element.html('');
        }

        show(message) {
            var self = this;
            self.element.show();
            this.elementText.html('');
            this.elementText.css('right', '-800px');
            this.elementText.html(message);
            this.elementText.animate({right: '0px'}, 800, 'easeOutBack', function() {
                setTimeout( function() {
                    self.hide();
                }, 1000);
            });
        }
    }
}
