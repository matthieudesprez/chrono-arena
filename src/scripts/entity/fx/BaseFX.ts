module TacticArena.FX {
    export class BaseFX extends Phaser.Sprite {
        state;
        target: Position;
        speed;

        constructor(state, type) {
            super(state.game, 0, 0, type);
            this.state = state;
            this.speed = 1000;
            this.setAnimations();
        }

        setAnimations() {
            //this.animations.add('default', [], 10, false);
        }

        init(position: Position, direction) {

        }

        playDefault() {
            return new Promise((resolve, reject) => {
                let self = this;
                this.animations.play('default');
                let t = this.state.add.tween(this).to({
                    x: this.target.x,
                    y: this.target.y
                }, this.speed, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () {
                    self.kill();
                    resolve(true);
                }, self);
            });
        }
    }
}