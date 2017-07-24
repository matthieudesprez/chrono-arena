module TacticArena.State {
    export class Boot extends TacticArena.State.BaseState {
        preload() {
            this.load.image('loading', 'assets/images/loading.png');
        }

        create() {
            //this.game.scale.fullScreenTarget = this.parentElement;
            //this.scale.maxHeight = window.innerHeight;
            //this.scale.maxWidth = Math.floor( this.scale.maxHeight / 1.333 );
            //var aspectRatio = this.game.width / this.game.height;
            //console.log(aspectRatio);
            //var scaleRatio = this.game.width / 640;
            //if(aspectRatio < 1) {
            //    scaleRatio = this.game.height / 640;
            //}
            //console.log(this.game.height, this.game.width, this.game.height / 640, this.game.width / 608);
            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            //var scale = 1 / Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
            //console.log(scale);
            //console.log(scaleRatio);
            //scaleRatio = 1.01;
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            //scale = 1.3;
            //this.scale.setUserScale(scale, scale);
            //this.game.renderer.renderSession.roundPixels = true;
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

            this.game.scale.setResizeCallback(function (scale, parentBounds) {
                var _this = scale;
                // A value of 1 means no scaling 0.5 means half size, 2 double the size and so on.
                 var scale = 1 * Math.min(window.innerWidth / _this.game.width, window.innerHeight / _this.game.height);
                // Resize parent div in order to vertically center the canvas correctly.
                // element.style.minHeight = window.innerHeight.toString() + "px";
                // Resize the canvas keeping the original aspect ratio.
                 _this.game.scale.setUserScale(scale, scale, 0, 0);
                 //if (logging == true) {
                 //    var w = Math.floor(_this.game.width * scale),
                 //        h = Math.floor(_this.game.height * scale);
                 //}
                //console.info("The game has just been resized to: " + Math.floor(_this.game.width * scale) + " x " + Math.floor(_this.game.height * scale));
            }, this);

            this.scale.refresh();

            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.stage.backgroundColor = '#000000';

            this.game.state.start('preload');
        }
    }
}
