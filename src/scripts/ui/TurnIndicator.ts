module TacticArena.UI {
    export class TurnIndicator {
        menu;
        mainGroup;
        text;

        constructor(menu) {
            this.menu = menu;

            this.mainGroup = this.menu.game.add.group();
            this.mainGroup.x = 0;
            this.mainGroup.y = 80;

            let background = this.menu.game.make.sprite(-10, 0, 'background-bar');
            background.anchor.set(0);

            this.text = this.menu.game.add.text(0, -1, '', {
                font: '19px Iceland',
                fill: '#FFFFFF',
                boundsAlignH: 'center',
                strokeThickness: 3,
                stroke: '#000000',
            });

            this.mainGroup.add(background);
            this.mainGroup.add(this.text);
            this.text.setTextBounds(0, 0, this.mainGroup.width, 32);
            this.menu.game.uiGroup.add(this.mainGroup);
        }

        write(turn) {
            this.text.text = 'Tour ' + ('0' + Number(turn)).slice(-2);
        }

    }
}
