module TacticArena.State {
    export class Options extends TacticArena.State.BaseState {

        create() {
            var that = this;
            super.createMenu();
            $('#game-menu .ui').html(
                '<div class="button back"><a>Back</a></div>'
            );

            $('.back').click(function () {
                that.game.state.start('menu');
            });
        }
    }
}
