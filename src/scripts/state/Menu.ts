module TacticArena.State {
    export class Menu extends TacticArena.State.BaseState {

        create() {
            var that = this;
            super.createMenu();
            $('#game-menu .ui').html(
                '<div class="button singleplayer"><a>Single Player</a></div>' +
                //'<div class="button multiplayerlocal"><a>Multi Player Local</a></div>' +
                '<div class="button multiplayeronline"><a>Multi Player Online</a></div>' +
                '<div class="button options"><a>Options</a></div>' +
                '<div class="button"><br/><br/></div>' +
                '<div class="button">' +
                '<a class="fa fa-envelope" href="mailto:matthieu.desprez@gmail.com" title="Contact me"></a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;<a class="fa fa-github" href="https://github.com/Edistra" target="_blank"></a>' +
                '</div>'
            );

            $('.singleplayer').click(function () {
                that.game.state.start('mainadventure');
                //that.game.state.start('mainsolooffline', true, false, {
                //    players: [
                //        {name: 'Player', faction: 'human', player: true},
                //        {name: 'BOT 01', faction: 'evil', player: false}
                //    ]
                //}, null);
            });
            $('.multiplayerlocal').click(function () { that.game.state.start('main'); });
            $('.multiplayeronline').click(function () { that.game.state.start('lobby'); });
            $('.options').click(function () { that.game.state.start('options'); });
        }
    }
}
