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

            //this.game.scale.setResizeCallback(function (scale, parentBounds) {
            //    var _this = scale;
            //    // A value of 1 means no scaling 0.5 means half size, 2 double the size and so on.
            //     var scale = 1 * Math.min(window.innerWidth / _this.game.width, window.innerHeight / _this.game.height);
            //    // Resize parent div in order to vertically center the canvas correctly.
            //    // element.style.minHeight = window.innerHeight.toString() + "px";
            //    // Resize the canvas keeping the original aspect ratio.
            //    // _this.game.scale.setUserScale(scale, scale, 0, 0);
            //     //if (logging == true) {
            //     //    var w = Math.floor(_this.game.width * scale),
            //     //        h = Math.floor(_this.game.height * scale);
            //     //}
            //    //console.info("The game has just been resized to: " + Math.floor(_this.game.width * scale) + " x " + Math.floor(_this.game.height * scale));
            //}, this);

            //this.scale.refresh();

            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.stage.backgroundColor = '#000000';

            this.game.state.start('preload');
        }
    }
}
