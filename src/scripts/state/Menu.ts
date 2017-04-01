module TacticArena.State {
    export class Menu extends Phaser.State {
        private preloadBar:Phaser.Image;
        private status;
        private logo;

        create() {
            var that = this;
            this.logo = this.add.image(640 / 2, 150, "logo");
            this.logo.anchor.setTo(0.5);

            $('#game-menu').remove();
            $('#game-container').append('<div id="game-menu">' +
                '<div class="button singleplayer"><a>Single Player</a></div>' +
                '<div class="button multiplayerlocal"><a>Multi Player Local</a></div>' +
                '<div class="button multiplayeronline"><a>Single Player Online</a></div>' +
                '<div class="button options"><a>Options</a></div>' +
                '</div>');

            $('.singleplayer').click(function () {
                that.singlePlayer();
            });
            $('.multiplayerlocal').click(function () {
                that.multiPlayerLocal();
            });
            $('.multiplayeronline').click(function () {
                that.multiplayerOnline();
            });
            $('.options').click(function () {
                that.options();
            });
        }

        singlePlayer() {
            this.game.state.start('main');
        }

        multiPlayerLocal() {
            this.game.state.start('main');

        }

        multiplayerOnline() {
            this.game.state.start('main');

        }

        options() {
            this.game.state.start('options');

        }
    }
}
