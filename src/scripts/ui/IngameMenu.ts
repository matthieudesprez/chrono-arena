module TacticArena.UI {
    export class IngameMenu {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;

            this.menu.game.add.image(this.menu.game.world.width - 33, 5, 'menu-icon');
            //this.menu.element.append('<div class="ui-ingame-menu"><a class="menu-icon"></a></div>');
            //this.element = this.menu.element.find('.ui-ingame-menu');

            //this.element.find('.menu-icon').on('click', function () {
            //    self.showOverlay();
            //    self.menu.element.append(
            //        '<div class="ui-popin">' +
            //            '<a class="close">x</a>' +
            //            '<a class="button quit">Quit</a>' +
            //        '</div>'
            //    );
            //    self.menu.element.find('.close').on('click', function() {
            //        self.menu.element.find('.ui-overlay').remove();
            //        self.menu.element.find('.ui-popin').remove();
            //    });
            //    self.menu.element.find('.button.quit').on('click', function() {
            //        self.menu.game.state.start('menu');
            //    });
            //});
        }

        //showOverlay() {
        //    this.menu.element.append('<div class="ui-overlay"></div>');
        //}

        gameOver(msg) {
            //let self = this;
            //this.showOverlay();
            //this.menu.element.append(
            //    '<div class="ui-popin">' +
            //    '<a class="button">' + msg + '</a>' +
            //    '<a class="button">-</a>' +
            //    '<a class="button quit">Quit</a>' +
            //    '</div>'
            //);
            //this.menu.element.find('.button.quit').on('click', function() {
            //    self.menu.game.state.start('menu');
            //});
        }

        show(msg) {
            //let self = this;
            //this.showOverlay();
            //this.menu.element.append(
            //    '<div class="ui-popin">' +
            //    '<a class="button">' + msg + '</a>' +
            //    '</div>'
            //);
            //this.menu.element.find('.button.quit').on('click', function() {
            //    self.menu.game.state.start('menu');
            //});
        }

        close() {
            //this.menu.element.find('.ui-overlay').remove();
            //this.menu.element.find('.ui-popin').remove();
        }
    }
}
