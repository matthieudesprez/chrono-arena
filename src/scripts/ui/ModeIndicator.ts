module TacticArena.UI {
    export class ModeIndicator {
        menu;
        text;

        constructor(menu) {
            var self = this;
            this.menu = menu;

            this.text = this.menu.game.add.text(10, 5, '', {
                font: '30px Iceland',
                fill: '#FFFFFF',
                boundsAlignH: 'left',
            }, this.menu.game.uiGroup);
            this.text.setTextBounds(0, 0, this.menu.game.world.width, 46);
        }

        write(mode) {
            this.text.text = mode;
        }

    }
}
