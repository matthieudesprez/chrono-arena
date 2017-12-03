module TacticArena.State {
    export class Boot extends TacticArena.State.BaseState {

        preload() {
            this.load.image('loading', 'assets/images/loading.png');
            this.load.image('logo3', 'assets/images/ui/logo3.png');
            this.load.image('bg', 'assets/images/ui/bg4.jpg');
        }

        create() {
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.maxHeight = window.innerHeight;
            this.game.scale.maxWidth = this.game.scale.maxHeight / (640 / 380);
            this.game.renderer.renderSession.roundPixels = false;
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.stage.backgroundColor = '#000000';

            this.game.state.start('preload');
        }
    }
}
