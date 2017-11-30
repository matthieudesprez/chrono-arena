module TacticArena.State {
    export class BaseState extends Phaser.State {
        worldGroup: Phaser.Group;
        centerX;
        centerY;
        width;
        height;

        constructor() {
            super();
        }

        init() {
            this.worldGroup = this.add.group();
            this.width = this.game.world.width; // / this.getScaleRatio();
            this.height = this.game.world.height; // / this.getScaleRatio();
            this.centerX = this.width / 2;
            this.centerY = this.height / 2;
            this.game.stage.backgroundColor = 0x333333;
            super.init();
            this.game.world.resize((this.game as Game).initialWidth, (this.game as Game).initialHeight);

        }

        createMenu() {

        }

        getScaleRatio() {
            return Math.max(this.game.width / 384, 1);
        }
    }
}
