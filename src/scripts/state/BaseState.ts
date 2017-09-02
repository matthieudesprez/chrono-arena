module TacticArena.State {
    export class BaseState extends Phaser.State {

        constructor() {
            super();
        }

        init() {
            this.game.stage.backgroundColor = 0x333333;
            $('[class*="ui-"]').remove();
            $('#game-menu').remove();
            super.init();
        }

        createMenu() {
            $('#game-container').append('' +
                '<div id="game-menu">' +
                '<div class="logo"></div>' +
                ' <div class="ui"></div>' +
                '</div>'
            );
        }

        getScaleRatio() {
            //console.log(this.game.width / 320, this.game.height / 800, 1, this.game.height);
            //return Math.max(this.game.height / 800, 1);
            return Math.max(this.game.width / 384, 1);
        }
    }
}
