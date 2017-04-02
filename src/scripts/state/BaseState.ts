module TacticArena.State {
    export class BaseState extends Phaser.State {

        constructor() {
            super();
        }

        init() {
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
    }
}
