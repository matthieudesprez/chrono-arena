module TacticArena.State {
    export class Boot extends TacticArena.State.BaseState {
        preload() {
            this.load.image('loading', 'assets/images/loading.png');
        }

        create() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            this.game.state.start('preload');
        }
    }
}
