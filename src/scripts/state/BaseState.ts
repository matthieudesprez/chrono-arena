module TacticArena.State {
    export class BaseState extends Phaser.State {

        constructor() {
            super();
        }

        init() {
            this.game.stage.backgroundColor = 0x000000;
            super.init();
            this.game.world.resize(this.game.initialWidth, this.game.initialHeight);
        }

        createMenu() {

        }

        getScaleRatio() {
            //console.log(this.game.width / 320, this.game.height / 800, 1, this.game.height);
            //return Math.max(this.game.height / 800, 1);
            return Math.max(this.game.width / 384, 1);
        }
    }
}
