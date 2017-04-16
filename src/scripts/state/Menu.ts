module TacticArena.State {
    export class Menu extends TacticArena.State.BaseState {

        create() {
            var that = this;
            super.createMenu();
            $('#game-menu .ui').html(
                '<div class="button singleplayer"><a>Single Player</a></div>' +
                //'<div class="button multiplayerlocal"><a>Multi Player Local</a></div>' +
                '<div class="button multiplayeronline"><a>Multi Player Online</a></div>' +
                '<div class="button options"><a>Options</a></div>'
            );

            $('.singleplayer').click(function () { that.game.state.start('main'); });
            $('.multiplayerlocal').click(function () { that.game.state.start('main'); });
            $('.multiplayeronline').click(function () { that.game.state.start('lobby'); });
            $('.options').click(function () { that.game.state.start('options'); });
        }
    }
}
