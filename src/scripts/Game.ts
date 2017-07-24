/// <reference path="./definitions/phaser.comments.d.ts"/>
/// <reference path="./definitions/jasmine.d.ts"/>
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jqueryui.d.ts" />
/// <reference path="./definitions/jquery.contextMenu.d.ts" />
/// <reference path="./definitions/easystarjs.d.ts"/>

module TacticArena {
    export class Game extends Phaser.Game {
        constructor(headless:boolean = false) {
            console.log(window.screen.availHeight * window.devicePixelRatio);
            //Math.round((window.screen.availHeight * window.devicePixelRatio / 1.667) / 32) * 32
            super({
                width: Math.round((window.screen.availHeight * window.devicePixelRatio / 1.667) / 32) * 32, //(window.innerHeight * window.devicePixelRatio) / 1.333, //320, //window.innerWidth * window.devicePixelRatio * 0.8,
                height: window.screen.availHeight * window.devicePixelRatio, //window.innerHeight * window.devicePixelRatio, //608, //512, //window.innerHeight * window.devicePixelRatio * 0.8,
                renderer: headless ? Phaser.HEADLESS : Phaser.AUTO,
                parent: 'game-container'
            });

            this.state.add('boot', State.Boot);
            this.state.add('preload', State.Preload);
            this.state.add('menu', State.Menu);
            this.state.add('lobby', State.Lobby);
            this.state.add('options', State.Options);
            this.state.add('mainadventure', State.MainAdventure);
            this.state.add('mainadventurebattle', State.MainAdventureBattle);
            this.state.add('mainsolooffline', State.MainSoloOffline);
            this.state.add('mainmultiplayeronline', State.MainMultiplayerOnline);

            this.state.start('boot');
        }
    }
}
