module TacticArena.UI {
    export class TopMenu {
        game;
        mainGroup;
        isOver;

        constructor(game) {
            this.game = game;
            this.mainGroup = this.game.add.group();
            var topUIBackground = this.game.make.graphics();
            topUIBackground.beginFill(0x333333, 0.6);
            topUIBackground.drawRect(0, 0, this.game.world.width, 48);
            topUIBackground.endFill();

            topUIBackground.inputEnabled = true;
            topUIBackground.events.onInputOver.add(this.over, this);
            topUIBackground.events.onInputOut.add(this.out, this);

            this.mainGroup.add(topUIBackground);
            this.game.uiGroup.add(this.mainGroup);

        }

        over() {
            console.log('over');
            this.isOver = true;
        }

        out() {
            console.log('out');
            this.isOver = false;
        }
    }
}
