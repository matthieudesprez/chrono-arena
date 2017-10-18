module TacticArena.UI {
    export class TurnIndicator {
        menu;
        mainGroup;
        text;

        constructor(menu) {
            this.menu = menu;

            this.mainGroup = this.menu.game.add.group();
            this.mainGroup.x = this.menu.game.world.width;
            this.mainGroup.y = 100;

            let background = this.menu.game.make.sprite(5, 0, 'background-bar');
            background.anchor.set(1, 0);

            this.text = this.menu.game.add.text(0, -1, '', {
                font: '19px Iceland',
                fill: '#FFFFFF',
                boundsAlignH: 'center',
                strokeThickness: 3,
                stroke: '#000000',
            });

            this.mainGroup.add(background);
            this.mainGroup.add(this.text);
            this.text.setTextBounds(background.position.x - this.mainGroup.width, background.position.y, this.mainGroup.width, 32);
            this.menu.game.uiGroup.add(this.mainGroup);
        }

        write(turn) {
            this.text.text = 'Turn n° ' + ('0' + Number(turn)).slice(-2);
        }

    }
}
