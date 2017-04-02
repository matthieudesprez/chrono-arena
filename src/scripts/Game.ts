/// <reference path="./definitions/phaser.comments.d.ts"/>
/// <reference path="./definitions/jasmine.d.ts"/>
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jqueryui.d.ts" />
/// <reference path="./definitions/easystarjs.d.ts"/>

module TacticArena {
    export class Game extends Phaser.Game {
        constructor(headless:boolean = false) {
            super({
                width: 640,
                height: 640,
                renderer: headless ? Phaser.HEADLESS : Phaser.AUTO,
                parent: 'game-container'
            });

            this.state.add('boot', State.Boot);
            this.state.add('preload', State.Preload);
            this.state.add('menu', State.Menu);
            this.state.add('options', State.Options);
            this.state.add('main', State.Main);

            this.state.start('boot');
        }
    }
}
