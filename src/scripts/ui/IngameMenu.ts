module TacticArena.UI {
    export class IngameMenu {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;

            let icon = this.menu.game.make.image(this.menu.game.world.width - 43, 8, 'icon-menu4');
            icon.scale.set(0.2);
            this.menu.game.uiGroup.add(icon);

            var filter = this.menu.game.add.filter('Pixelate');
            icon.filters = [filter];
            filter.sizeX = 2;
            filter.sizeY = 2;


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
