/// <reference path="./definitions/phaser.comments.d.ts"/>
/// <reference path="./definitions/jasmine.d.ts"/>
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jqueryui.d.ts" />
/// <reference path="./definitions/easystarjs.d.ts"/>

module TacticArena.Specs {
    export class TestGame extends Phaser.Game {
        constructor(headless: boolean = false) {
            super({
                width: 640,
                height: 640,
                renderer: headless ? Phaser.HEADLESS : Phaser.AUTO,
                parent: 'game-container'
            });

            this.state.add('test', State.Test);

            this.state.onCreateCallback = function() {
                console.log('ok');
            };
            this.state.start('test');
        }
    }
}
