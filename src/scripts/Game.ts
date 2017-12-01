/// <reference path="./definitions/phaser.comments.d.ts"/>
/// <reference path="./definitions/jasmine.d.ts"/>
/// <reference path="./definitions/easystarjs.d.ts"/>

module TacticArena {
    export class Game extends Phaser.Game {
        initialWidth;
        initialHeight;
        player;
        debugMode;
        tileSize;

        constructor(headless:boolean = false) {
            super({
                width: 384,
                height: 640,
                renderer: headless ? Phaser.HEADLESS : Phaser.AUTO,
                parent: 'game-container',
                antialias: false
            });

            this.initialWidth = 384;
            this.initialHeight = 640;

            this.player = new Player.BasePlayer('Jean Neige');
            this.debugMode = false;
            this.tileSize = 32;

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
