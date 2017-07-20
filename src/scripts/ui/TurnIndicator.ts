module TacticArena.UI {
    export class TurnIndicator {
        menu;
        element;
        text;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            //this.menu.element.append('<div class="ui-turn-indicator"></div>');
            //this.element = this.menu.element.find('.ui-turn-indicator');

            this.text = this.menu.game.add.text(0, 0, '', {
                font: '35px Iceland',
                fill: '#AB9352',
                boundsAlignH: 'center',
                stroke: '#FFFFFF',
                strokeThickness: 3
            });
            this.text.setTextBounds(0, 0, this.menu.game.world.width, 32);
        }

        write(turn) {
            //this.element.html('Tour ' + ("0" + Number(turn)).slice(-2));
            this.text.text = 'Tour ' + ('0' + Number(turn)).slice(-2);
        }

    }
}
