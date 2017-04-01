module TacticArena.State {
    export class Options extends Phaser.State {
        private logo;

        create() {
            var that = this;
            this.logo = this.add.image(640 / 2, 150, "logo");
            this.logo.anchor.setTo(0.5);

            $('#game-menu').remove();
            $('#game-container').append('<div id="game-menu">' +
                '<div class="button back"><a>Back</a></div>' +
                '</div>');

            $('.back').click(function () {
                that.game.state.start('menu');
            });

        }
    }
}
